"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Loader2, Image as ImageIcon, AlertTriangle, CheckCircle2, Calendar } from "lucide-react"

interface HistoryItem {
    id: number
    prediction: string
    confidence: number
    urgent: boolean
    image_path: string | null
    heatmap_path: string | null
    created_at: string
}

export default function HistoryPage() {
    const { user, token, isLoading, logout } = useAuth()
    const router = useRouter()
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const API_URL = "https://vaibhavban-derma-scan-ai.hf.space"

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    useEffect(() => {
        if (!token) return

        const fetchHistory = async () => {
            try {
                const response = await fetch(`${API_URL}/history`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.status === 401) {
                    // Token is expired or invalid
                    setError("Your session has expired. Redirecting to login...")
                    setTimeout(() => {
                        logout()
                    }, 2000)
                    return
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch scan history")
                }

                const data = await response.json()
                setHistory(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [token, API_URL])

    if (isLoading || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Your Scan History
                </h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                    Review your past AI skin assessments. Remember, these results are for informational guidance and do not replace professional medical advice.
                </p>
            </div>

            {error && (
                <div className="mb-8 rounded-xl bg-destructive/10 p-4 border border-destructive/20 text-destructive flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {!loading && history.length === 0 && !error ? (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center glass">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium text-foreground">No scans yet</h3>
                    <p className="mt-2 text-muted-foreground">
                        You haven't analyzed any skin images yet. Head over to the home page to start your first scan!
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
                    >
                        Start a Scan
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-muted flex items-center justify-center">
                                {item.image_path ? (
                                    <img
                                        src={`${API_URL}${item.image_path}`}
                                        alt={`Scan from ${new Date(item.created_at).toLocaleDateString()}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
                                        }}
                                    />
                                ) : (
                                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                                )}

                                <div className="absolute top-3 right-3 z-10">
                                    {item.urgent ? (
                                        <span className="inline-flex items-center rounded-full bg-red-600 shadow-sm px-2.5 py-1 text-xs font-bold text-white">
                                            Urgent
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-green-500 shadow-sm px-2.5 py-1 text-xs font-bold text-white">
                                            Normal
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg leading-tight text-foreground truncate" title={item.prediction.replace(/_/g, " ")}>
                                            {item.prediction.replace(/_/g, " ")}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.urgent ? 'bg-destructive' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min(100, item.confidence * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-muted-foreground w-12 text-right">
                                            {(item.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center text-xs text-muted-foreground pt-4 border-t border-border">
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
