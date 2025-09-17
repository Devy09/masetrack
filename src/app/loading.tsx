"use client"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Outer ring */}
          <div className="h-20 w-20 rounded-full border-2 border-muted animate-spin [animation-duration:3s]"></div>
          {/* Middle ring */}
          <div className="absolute top-2 left-2 h-16 w-16 rounded-full border-2 border-primary/60 animate-spin [animation-duration:2s] [animation-direction:reverse]"></div>
          {/* Inner ring */}
          <div className="absolute top-4 left-4 h-12 w-12 rounded-full border-2 border-primary animate-spin [animation-duration:1s]"></div>
          {/* Center pulse */}
          <div className="absolute top-7 left-7 h-6 w-6 rounded-full bg-primary animate-pulse"></div>

          {/* Orbiting dots */}
          <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:4s]">
            <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/80"></div>
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/60"></div>
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/40"></div>
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/20"></div>
          </div>
        </div>

        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 animate-pulse"></div>
          <div className="h-full bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite] -mt-1"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-lg font-medium">
            <span className="animate-[fadeIn_0.5s_ease-in-out]">L</span>
            <span className="animate-[fadeIn_0.5s_ease-in-out_0.1s_both]">o</span>
            <span className="animate-[fadeIn_0.5s_ease-in-out_0.2s_both]">a</span>
            <span className="animate-[fadeIn_0.5s_ease-in-out_0.3s_both]">d</span>
            <span className="animate-[fadeIn_0.5s_ease-in-out_0.4s_both]">i</span>
            <span className="animate-[fadeIn_0.5s_ease-in-out_0.5s_both]">n</span>
            <span className="animate-[fadeIn_0.5s_ease-in-out_0.6s_both]">g</span>
            <div className="flex gap-1 ml-1">
              <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Please wait while we prepare your experience</p>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-1 w-1 bg-primary/30 rounded-full animate-ping [animation-delay:0s]"></div>
          <div className="absolute top-1/3 right-1/4 h-1 w-1 bg-primary/20 rounded-full animate-ping [animation-delay:1s]"></div>
          <div className="absolute bottom-1/3 left-1/3 h-1 w-1 bg-primary/25 rounded-full animate-ping [animation-delay:2s]"></div>
          <div className="absolute bottom-1/4 right-1/3 h-1 w-1 bg-primary/15 rounded-full animate-ping [animation-delay:3s]"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
