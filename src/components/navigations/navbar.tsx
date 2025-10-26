"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GraduationCap, Moon, Sun, Menu, X } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/motion-primitives/animated-background"
import { useState, useEffect } from "react"

const NavBar = () => {
  const { setTheme } = useTheme()
  const TABS = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest("header")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-all duration-200 hover:scale-105">
          <GraduationCap className="h-8 w-8 text-teal-500 transition-colors duration-200" />
          <span className="text-xl font-bold text-teal-500 transition-colors duration-200 md:text-2xl hover:text-teal-600">
            MASETrack
          </span>
        </Link>

        {/* Navigation - Hidden on mobile, visible on tablet and desktop */}
        <nav className="hidden sm:flex items-center">
          <AnimatedBackground
            defaultValue={TABS[0].name}
            className="rounded-lg bg-teal-100 dark:bg-teal-800/50"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
            enableHover
          >
            {TABS.map((tab) => (
              <Link
                key={tab.name}
                data-id={tab.name}
                href={tab.href}
                className="px-3 py-2 text-sm font-medium text-teal-700 transition-colors duration-200 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-100 relative z-10 sm:px-3 md:px-4"
              >
                {tab.name}
              </Link>
            ))}
          </AnimatedBackground>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-teal-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-teal-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                <GraduationCap className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Auth Buttons - Show on tablet and desktop */}
          <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-900/20 text-xs sm:text-sm"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-teal-500 text-white hover:bg-teal-600 shadow-sm text-xs sm:text-sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Show only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-9 w-9 hover:bg-teal-50 dark:hover:bg-teal-900/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative h-6 w-6">
              <Menu
                className={`absolute h-6 w-6 text-teal-500 transition-all duration-200 ${
                  mobileMenuOpen ? "scale-0 rotate-90" : "scale-100 rotate-0"
                }`}
              />
              <X
                className={`absolute h-6 w-6 text-teal-500 transition-all duration-200 ${
                  mobileMenuOpen ? "scale-100 rotate-0" : "scale-0 -rotate-90"
                }`}
              />
            </div>
          </Button>
        </div>
      </div>

      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t bg-background/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-3">
            {/* Navigation Links */}
            <div className="space-y-1">
              {TABS.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="border-t pt-3 space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center border-teal-200 text-teal-600 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-900/20 bg-transparent"
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center bg-teal-500 text-white hover:bg-teal-600">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
