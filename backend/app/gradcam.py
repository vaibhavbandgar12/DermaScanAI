import numpy as np
import tensorflow as tf
import cv2
import base64

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Generates a Grad-CAM heatmap using the model's last convolutional layer.
    """
    # Create a model that maps the input image to the activations
    # of the last conv layer as well as the output predictions
    grad_model = tf.keras.models.Model(
        model.inputs, [model.get_layer(last_conv_layer_name).output, model.output]
    )

    # Compute gradients of the top predicted class for our input image
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        # Multi-dim handling if model output is not rank 1
        class_channel = preds[:, pred_index]

    # Gradient of the output neuron with respect to the output feature map
    grads = tape.gradient(class_channel, last_conv_layer_output)

    # Pool the gradients over spatial dimensions
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Multiply each channel by "how important this channel is" 
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # ReLU to filter out negative values
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def generate_gradcam_overlay(img_array_original, heatmap, alpha=0.4):
    """
    Overlays the Grad-CAM heatmap onto the original image using OpenCV 
    and returns a Base64 string for immediate frontend rendering.
    """
    # Resize heatmap to match original image
    heatmap_resized = cv2.resize(heatmap, (img_array_original.shape[1], img_array_original.shape[0]))
    
    # Rescale to 0-255
    heatmap_resized = np.uint8(255 * heatmap_resized)
    
    # Apply colormap (JET)
    heatmap_color = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)

    # Note: cv2 uses BGR, but img_array_original from PIL is RGB. 
    # Convert heatmap to RGB before overlaying
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    # Superimpose
    overlayed = cv2.addWeighted(img_array_original, 1 - alpha, heatmap_color, alpha, 0)
    
    # Convert to Base64 for instant API transmission
    # Convert back to BGR for cv2.imencode
    overlayed_bgr = cv2.cvtColor(overlayed, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.jpg', overlayed_bgr)
    img_str = base64.b64encode(buffer).decode("utf-8")
    
    return f"data:image/jpeg;base64,{img_str}", overlayed_bgr
