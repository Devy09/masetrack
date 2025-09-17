import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { useState } from "react";
import { SignIn } from "@stackframe/stack";

const NavBar = () => {
  const { setTheme } = useTheme();
  const TABS = ["Features", "About", "Contact"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-teal-500" />
              <span className="text-xl font-bold text-teal-500 md:text-2xl">
                MASETrack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <AnimatedBackground
              defaultValue={TABS[0]}
              className="rounded-lg bg-teal-100 hover:text-white dark:bg-teal-800 hidden lg:block"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.3,
              }}
              enableHover
            >
              {TABS.map((tab, index) => (
                <a
                  key={index}
                  data-id={tab}
                  href={`#${tab.toLowerCase()}`}
                  className="px-3 py-2 text-sm font-medium text-teal-600 transition-colors duration-300 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-50"
                >
                  {tab}
                </a>
              ))}
            </AnimatedBackground>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-teal-500" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-teal-500" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:py-24 lg:py:32 lg:flex space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link
                  href="/login"
                  className="text-teal-500 hover:bg-teal-500 hover:text-white"
                >
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link
                  href="/login"
                  className="bg-teal-500 hover:text-teal-600 hover:border-teal-500"
                >
                  Get Started
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-teal-500" />
              ) : (
                <Menu className="h-6 w-6 text-teal-500" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {TABS.map((tab) => (
                <a
                  key={tab}
                  href={`#${tab.toLowerCase()}`}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tab}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-4 pb-3 dark:border-gray-700">
                <div className="space-y-2 px-2">
                  <Button asChild className="w-full justify-start">
                    <Link href="/login" className="w-full text-left">
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start bg-teal-500 hover:bg-teal-600"
                  >
                    <Link href="/login" className="w-full text-left">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
