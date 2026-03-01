"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { SkinUpload } from "@/components/skin-upload"
import { HowItWorks } from "@/components/how-it-works"
import { InfoSection } from "@/components/info-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SkinUpload />
        <HowItWorks />
        <InfoSection />
      </main>
      <Footer />
    </div>
  )
}
