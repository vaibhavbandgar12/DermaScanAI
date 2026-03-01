"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                throw new Error("Failed to process request. Please try again later.")
            }

            const data = await response.json()
            setMessage(data.message)
            setEmail("") // Clear the form
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-10 shadow-lg border border-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Enter your email address to receive a secure password reset link.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="rounded-md bg-green-500/10 p-4 border border-green-500/20 text-green-600 dark:text-green-400 text-sm text-center">
                            {message}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm">
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full appearance-none rounded-md border border-border px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-background"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || message !== ""}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
