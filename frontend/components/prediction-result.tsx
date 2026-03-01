"use client"

import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  HelpCircle,
  Activity,
} from "lucide-react"

interface PredictionResponse {
  condition: string
  confidence: number
  dos?: string[]
  dont?: string[]
  urgent?: boolean
  message?: string
  disclaimer: string
  heatmap_url?: string
}

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)

  let riskLevel = "Low Confidence: Inconclusive"
  let color = "bg-muted-foreground"
  let textColor = "text-muted-foreground"

  if (pct >= 85) {
    riskLevel = "High Confidence: Strong Model Agreement"
    color = "bg-success"
    textColor = "text-success"
  } else if (pct >= 60) {
    riskLevel = "Moderate Confidence: Needs Professional Review"
    color = "bg-warning"
    textColor = "text-warning"
  } else {
    riskLevel = "Low Confidence: Model Uncertain"
    color = "bg-destructive"
    textColor = "text-destructive"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">AI Confidence Score</span>
        <span className={`font-bold ${textColor}`}>{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
        {riskLevel}
      </p>
    </div>
  )
}

const conditionInfo: Record<
  string,
  { color: string; bgColor: string; borderColor: string; icon: typeof Activity; description: string }
> = {
  Eczema: {
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    icon: Activity,
    description:
      "A common inflammatory skin condition that causes dry, itchy, and inflamed patches.",
  },
  Melanocytic_Nevi: {
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    icon: Activity,
    description:
      "Commonly known as moles. Usually benign growths that should be monitored for changes.",
  },
  Melanoma: {
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    icon: ShieldAlert,
    description:
      "A serious form of skin cancer. Immediate consultation with a dermatologist is strongly recommended.",
  },
  Uncertain: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    icon: HelpCircle,
    description: "",
  },
}

export function PredictionResult({ result }: { result: PredictionResponse }) {
  const info = conditionInfo[result.condition] || conditionInfo.Uncertain

  // 🛑 Startup-Grade AI Refusal Mode (Low Confidence)
  if (result.condition === "Uncertain") {
    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-destructive/30 bg-card shadow-md">
          {/* Header Banner */}
          <div className="border-b border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-destructive">
                  Analysis Inconclusive
                </h3>
                <p className="mt-1 text-sm text-destructive/80">
                  Our AI system was unable to confidently analyze the uploaded image.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Confidence Explanation Box */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-muted-foreground mb-1">Model Confidence</span>
                  <span className="font-semibold text-foreground">{Math.round(result.confidence * 100)}%</span>
                </div>
                <div>
                  <span className="block text-muted-foreground mb-1">Required Threshold</span>
                  <span className="font-semibold text-foreground">60%</span>
                </div>
                <div className="col-span-2 border-t border-border/50 pt-3">
                  <span className="block text-muted-foreground mb-1">System Status</span>
                  <span className="font-medium text-warning flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" /> Below Reliable Medical Threshold
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Possible Reasons */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  Possible Reasons
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Image may be unclear, blurry, or low contrast
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Lighting conditions may affect accuracy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Skin region not clearly visible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Condition not present in current training data
                  </li>
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Recommended Next Steps
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    Retake the image in natural, even lighting
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    Ensure the affected area is in focus
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    Avoid camera filters or extreme digital zoom
                  </li>
                  <li className="flex items-start gap-2 font-medium text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    If symptoms persist, consult a dermatologist
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Icon = info.icon

  return (
    <div className="space-y-6">
      {/* Urgent banner */}
      {result.urgent && (
        <div className="animate-pulse-ring flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <ShieldAlert className="h-6 w-6 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-bold text-destructive">
              Urgent: Potential Melanoma Detected
            </p>
            <p className="text-xs text-destructive/80">
              Please consult a dermatologist immediately. Do not delay.
            </p>
          </div>
        </div>
      )}

      {/* Main result card */}
      <div
        className={`overflow-hidden rounded-2xl border ${info.borderColor} bg-card shadow-md`}
      >
        <div className={`${info.bgColor} p-6`}>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${info.bgColor} ${info.color}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Detected Condition
              </p>
              <h3 className={`text-2xl font-bold ${info.color}`}>
                {result.condition.replace(/_/g, " ")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {info.description}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ConfidenceMeter confidence={result.confidence} />
        </div>
      </div>

      {/* AI Explainability (Grad-CAM) */}
      {result.heatmap_url && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <div className="border-b border-border bg-muted/30 p-4">
            <h4 className="flex items-center gap-2 text-base font-bold text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              AI Explainability (Grad-CAM)
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              This heatmap visualizes which areas of the image the AI model focused on to make its prediction. Red areas indicate highest importance.
            </p>
          </div>
          <div className="flex justify-center bg-black/5 p-4">
            <img
              src={result.heatmap_url}
              alt="AI Analysis Heatmap"
              className="max-h-80 rounded-lg object-contain shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Do's and Don'ts */}
      {result.dos && result.dos.length > 0 && result.dont && result.dont.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Do's */}
          <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h4 className="text-base font-bold text-success">{"Do's"}</h4>
            </div>
            <ul className="space-y-3">
              {result.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success/70" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <h4 className="text-base font-bold text-destructive">{"Don'ts"}</h4>
            </div>
            <ul className="space-y-3">
              {result.dont.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
