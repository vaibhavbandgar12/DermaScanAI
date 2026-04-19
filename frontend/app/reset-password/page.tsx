"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

function ResetPasswordForm({ token }: { token: string | null }) {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const API_URL = "https://vaibhavban-derma-scan-ai.hf.space"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        if (!token) {
            setError("Invalid or missing password reset token.")
            setLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            setLoading(false)
            return
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, new_password: newPassword }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || "Failed to reset password. Token may be invalid or expired.")
            }

            const data = await response.json()
            setMessage(data.message)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login")
            }, 3000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!token && !error) {
        return (
            <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm text-center">
                No reset token found in URL. Please request a new link.
                <div className="mt-4">
                    <Link href="/forgot-password" className="font-medium text-destructive underline hover:text-destructive/80">
                        Request new link
                    </Link>
                </div>
            </div>
        )
    }

    if (message) {
        return (
            <div className="text-center space-y-4">
                <div className="rounded-md bg-green-500/10 p-6 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
                    <p className="font-semibold text-lg mb-2">Success!</p>
                    <p>{message}</p>
                    <p className="mt-4 text-xs opacity-80">Redirecting to login in 3 seconds...</p>
                </div>
                <Link href="/login" className="inline-block mt-4 font-medium text-primary hover:text-primary/80">
                    Click here if not redirected
                </Link>
            </div>
        )
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm text-center">
                    {error}
                </div>
            )}

            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-border px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-background"
                        placeholder="New Password (min 8 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                        className="relative block w-full appearance-none rounded-none rounded-b-md border border-border px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-background"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </div>
        </form>
    )
}

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-10 shadow-lg border border-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                        Create New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Please enter your new password below.
                    </p>
                </div>
                <ResetPasswordForm token={token} />
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
