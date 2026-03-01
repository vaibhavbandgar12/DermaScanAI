"use client"

import { useState, useEffect } from "react"
import { Menu, X, LogOut, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "glass shadow-lg shadow-primary/5"
        : "bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo + Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        >
          {/* Skin / Shield icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Derma<span className="text-primary">Scan</span>{" "}
            <span className="font-light text-muted-foreground">AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {[
            { label: "Upload", href: "/#upload" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "About", href: "/#about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-3 border-l border-border pl-6">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted px-3 py-1.5 rounded-full">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span className="hidden lg:inline-block max-w-[120px] truncate">{user.email}</span>
                </div>
                <Link
                  href="/history"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary px-2"
                >
                  History
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="glass border-t border-border px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {[
              { label: "Upload", href: "/#upload" },
              { label: "How It Works", href: "/#how-it-works" },
              { label: "About", href: "/#about" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px w-full bg-border my-2" />

            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <UserIcon className="w-4 h-4 text-primary" />
                  {user.email}
                </div>
                <Link
                  href="/history"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  History
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
