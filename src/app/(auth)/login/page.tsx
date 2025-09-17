import { GraduationCap } from "lucide-react"
import Image from "next/image"
import { LoginForm } from "@/components/blocks/login-form"

export default function LoginPage() {

  return (
    <div className="relative min-h-svh">
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
      
      {/* Content */}
      <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6 rounded-xl bg-gradient-to-b from-teal-700 to-teal-200 p-6">
            <a href="/" className="flex items-center gap-2 self-center font-medium">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-xl font-bold text-white">MASETrack</span>
            </a>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
