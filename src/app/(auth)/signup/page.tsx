import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import Image from "next/image"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Background Image */}
            <div className="fixed inset-0 -z-10">
              <Image
                src="/geometric-hero-bg.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />
            </div>
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold md:text-2xl">MASETrack</span>
            </Link>
            <h2 className="mb-6 text-4xl font-bold">Get Started with Us</h2>
            <p className="mb-12 text-lg">Complete these easy steps to register your account.</p>

            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                  <span className="text-lg">Sign up your account</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    2
                  </span>
                  <span className="text-lg">Wait for admin approval</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    3
                  </span>
                  <span className="text-lg">Set up your profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 bg-gradient-to-b from-teal-400 via-teal-600 to-black">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <h2 className="mb-2 text-3xl font-bold text-white">Sign Up Account</h2>
            <p className="mb-8 text-white font-semibold">Enter your personal data to create your account.</p>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    className="h-12 border-white text-white placeholder:text-white"
                    placeholder="Manny"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="h-12 border-white text-white placeholder:text-white"
                    placeholder="Pacquiao"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  className="h-12 border-white text-white placeholder:text-white"
                  placeholder="mannypacquiao@gmail.com"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <Input
                  className="h-12 border-white text-white placeholder:text-white"
                  placeholder="jinkylablab"
                  type="password"
                />
                <p className="text-xs text-white">Must be at least 8 characters.</p>
              </div>

              <Button className="h-12 w-full bg-teal-300 text-black hover:bg-gray-100">Sign Up</Button>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-teal-300 hover:underline font-bold">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
