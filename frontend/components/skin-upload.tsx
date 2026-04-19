"use client"

import { useState, useCallback, useRef } from "react"
import {
  Upload,
  ImageIcon,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  X,
  RotateCcw,
} from "lucide-react"
import { PredictionResult } from "@/components/prediction-result"
import { NearbyDoctors } from "@/components/nearby-doctors"
import { useAuth } from "@/components/auth-provider"

// API URL — defaults to localhost for development
const API_URL = "https://vaibhavban-derma-scan-ai.hf.space"

interface PredictionResponse {
  condition: string
  confidence: number
  dos?: string[]
  dont?: string[]
  urgent?: boolean
  nearby_dermatologists?: {
    name: string
    speciality: string
    address: string
    is_derm: boolean
  }[]
  message?: string
  disclaimer: string
}

export function SkinUpload() {
  const { logout } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [showDoctors, setShowDoctors] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, etc.)")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB")
      return
    }
    setError(null)
    setResult(null)
    setShowDoctors(false)
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [handleFile]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setShowDoctors(false)
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Get user location for doctor search - NON BLOCKING (3s timeout)
      const positionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 3000,
          maximumAge: 60000,
        })
      })

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))

      const position = await Promise.race([positionPromise, timeoutPromise]).catch(() => null) as GeolocationPosition | null

      const lat = position?.coords?.latitude ?? 28.6139 // Delhi fallback
      const lng = position?.coords?.longitude ?? 77.209

      const formData = new FormData()
      formData.append("file", file)
      formData.append("latitude", String(lat))
      formData.append("longitude", String(lng))

      const token = localStorage.getItem("token")
      const headers: HeadersInit = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          throw new Error("Your session has expired. Please log in again to save your scans.")
        }
        const detail = await response.json().catch(() => null)
        throw new Error(
          detail?.detail || `Server error (${response.status})`
        )
      }

      const data: PredictionResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze image. Make sure the backend server is running."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="upload" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Upload &amp; Analyze
          </h2>
          <p className="text-muted-foreground">
            Take a clear photo of the affected skin area and upload it below.
            Our AI model will analyze it and provide guidance.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          {/* Upload area */}
          {!preview ? (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
              }}
              aria-label="Upload skin image"
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 md:p-16 ${isDragging
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50 hover:shadow-md"
                }`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110">
                <Upload className="h-7 w-7" />
              </div>
              <p className="mb-2 text-lg font-semibold text-foreground">
                Drag &amp; drop your image here
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                or click to browse files
              </p>
              <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">
                JPG, PNG up to 10 MB
              </span>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
            </div>
          ) : (
            /* Preview + actions */
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="relative">
                <img
                  src={preview}
                  alt="Uploaded skin image preview"
                  className="h-72 w-full object-contain bg-muted md:h-96"
                />
                {/* Reset button */}
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 rounded-full bg-card/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-border p-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-48">
                      {file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file && (file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Change
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Analysis Failed
                </p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Analyzing your image with AI...
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="mt-8 space-y-6">
              <PredictionResult result={result} />

              {/* Find nearby doctors button */}
              {result.nearby_dermatologists &&
                result.nearby_dermatologists.length > 0 && (
                  <button
                    onClick={() => setShowDoctors(!showDoctors)}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-base font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5"
                  >
                    <MapPin className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    {showDoctors
                      ? "Hide Nearby Dermatologists"
                      : "Find Nearby Dermatologists"}
                  </button>
                )}

              {showDoctors && result.nearby_dermatologists && (
                <NearbyDoctors doctors={result.nearby_dermatologists} />
              )}

              {/* Disclaimer */}
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  {result.disclaimer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
