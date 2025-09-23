import { Clock, Wrench, Sparkles, Heart, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-200 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-teal-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-40 h-40 bg-teal-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-teal-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 border-2 border-teal-200 shadow-2xl animate-pulse-glow">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-full animate-bounce-gentle">
                  <Wrench className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-300 to-teal-400 p-2 rounded-full animate-float">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div
                  className="absolute -bottom-2 -left-2 bg-gradient-to-r from-teal-400 to-teal-500 p-2 rounded-full animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent text-balance">
                We're Making Things Better!
              </h1>
              <p className="text-lg text-gray-600 text-balance leading-relaxed">
                Our team is working hard behind the scenes to bring you an even more amazing experience. We'll be back
                online shortly with some exciting improvements!
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-2xl border border-teal-200">
              <div className="flex items-center justify-center gap-3 text-teal-700">
                <div className="bg-teal-500 p-2 rounded-full animate-bounce-gentle">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-lg">Expected completion: December in Final Defense</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-600">Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full animate-pulse"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">80% Complete</div>
            </div>

            <div className="pt-6 border-t border-teal-200">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-2xl border border-teal-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-gray-700">Need Help?</span>
                </div>
                <p className="text-sm text-gray-600">
                  Our support team is standing by!{" "}
                  <a
                    href="mailto:support@example.com"
                    className="font-semibold text-teal-600 hover:text-teal-700 underline decoration-teal-300 hover:decoration-teal-500 transition-colors"
                  >
                    Get in Touch
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
