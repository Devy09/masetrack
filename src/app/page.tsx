"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Award,
} from "lucide-react";
import Link from "next/link";
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';
import NavBar from "@/components/navigations/navbar";

export default function LandingPage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <NavBar/>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full min-h-screen flex items-center relative bg-gradient-to-br from-primary/5 via-primary/10 to-background overflow-hidden">
          {/* Geometric Background */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat dark:opacity-6"
            style={{ 
              backgroundImage: "url(/masebg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundAttachment: "fixed"
            }}
          />

          {/* Enhanced geometric overlay patterns */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner squares */}
            <div className="absolute top-8 left-8 w-24 h-24 border border-primary/10 dark:border-primary/20 rotate-12 rounded-md"></div>
            <div className="absolute bottom-8 right-8 w-20 h-20 border border-primary/10 dark:border-primary/20 rotate-[30deg] rounded-md"></div>

            {/* Circle pattern */}
            <div className="absolute top-24 right-16 w-16 h-16 border-2 border-primary/15 dark:border-primary/25 rounded-full"></div>
            <div className="absolute bottom-24 left-20 w-24 h-24 border border-primary/10 dark:border-primary/20 rounded-full rotate-[15deg]"></div>

            {/* Dotted grid */}
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-15"
              style={{
                backgroundImage: `radial-gradient(rgba(59,130,246,0.1) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Diagonal lines */}
            <div
              className="absolute inset-0 opacity-5 dark:opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(135deg, rgba(59,130,246,0.05) 1px, transparent 1px),
                  linear-gradient(45deg, rgba(59,130,246,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/40 dark:from-background/40 dark:to-background/60" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <Badge
                variant="secondary"
                className="px-4 py-2 backdrop-blur-sm bg-teal-300 dark:bg-background/60"
              >
                <Award className="w-4 h-4 mr-2" />
                MASE Pioneer Portal
              </Badge>
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm">
                <TextShimmer
                    duration={1.2}
                    className='text-6xl font-bold [--base-color:var(--color-teal-900)] [--base-gradient-color:var(--color-teal-200)] dark:[--base-color:var(--color-teal-700)] dark:[--base-gradient-color:var(--color-teal-400)]'
                  >
                    MASETrack
                  </TextShimmer>
                </h1>
                <p className="text-xl md:text-2xl font-semibold text-teal-200 drop-shadow-sm">
                  MASE PIONEER ONLINE ACADEMIC DOCUMENT SUBMISSION PORTAL
                </p>
                <p className="mx-auto max-w-[700px] text-teal-200 md:text-lg drop-shadow-sm">
                  A Smart Certificate Submission and Profile Monitoring System
                  for Pioneers
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8 shadow-lg bg-black text-teal-500 hover:bg-teal-500 hover:text-white">
                  <Link href="/login">
                    Submit Documents
                  </Link>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 dark:bg-background/60 backdrop-blur-sm shadow-lg bg-teal-500 hover:bg-black hover:text-teal-500"
                >
                  Track Submissions
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
