"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  CheckCircle,
  Shield,
  Clock,
  Users,
  ArrowRight,
  GraduationCap,
  BookOpen,
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
        <section className="w-full py-12 md:py-24 lg:py-32 relative bg-gradient-to-br from-primary/5 via-primary/10 to-background overflow-hidden">
          {/* Geometric Background */}
          <div
            className="bg-teal-400 absolute inset-0 bg-cover bg-center bg-no-repeat dark:opacity-6"
            style={{ backgroundImage: "url(/geometric-hero-bg.jpg)" }}
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
          <div className="absolute inset-0 from-background/20 via-transparent to-background/40 dark:from-background/40 dark:to-background/60" />

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
                <Button size="lg" className="px-8 shadow-lg text-teal-500 hover:bg-teal-500 hover:text-white">
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

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-teal-500">
                Powerful Features for Academic Excellence
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Everything you need to manage your academic document submissions
                efficiently and securely.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              <Card className="border-2 hover:border-teal-500 transition-colors dark:hover:border-primary/60 text-teal-500">
                <CardHeader>
                  <Upload className="h-12 w-12 mb-4" />
                  <CardTitle>Easy Document Upload</CardTitle>
                  <CardDescription>
                    Upload multiple document formats with drag-and-drop
                    functionality. Support for PDF, DOC, DOCX, and more.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-teal-500 transition-colors dark:hover:border-primary/60 text-teal-500">
                <CardHeader>
                  <Clock className="h-12 w-12 mb-4" />
                  <CardTitle>Real-time Tracking</CardTitle>
                  <CardDescription>
                    Monitor your submission status in real-time. Get instant
                    notifications on document reviews and approvals.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-teal-500 transition-colors dark:hover:border-primary/60 text-teal-500">
                <CardHeader>
                  <Shield className="h-12 w-12 mb-4" />
                  <CardTitle>Secure & Reliable</CardTitle>
                  <CardDescription>
                    Bank-level security ensures your academic documents are
                    protected with end-to-end encryption.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-teal-500 transition-colors dark:hover:border-primary/60 text-teal-500">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 mb-4" />
                  <CardTitle>Automated Validation</CardTitle>
                  <CardDescription>
                    Automatic document validation ensures all requirements are
                    met before submission.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-teal-500 transition-colors dark:hover:border-primary/60 text-teal-500">
                <CardHeader>
                  <Users className="h-12 w-12 mb-4" />
                  <CardTitle>Multi-user Support</CardTitle>
                  <CardDescription>
                    Collaborate with supervisors, administrators, and peers
                    throughout the submission process.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-teal-500 transition-colors dark:hover:border-primary/60 text-teal-500">
                <CardHeader>
                  <FileText className="h-12 w-12 mb-4" />
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>
                    Organize, version control, and manage all your academic
                    documents in one centralized location.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full bg-teal-500 py-12 md:py-24 lg:py-32 dark:bg-teal-500">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white">10,000+</div>
                <div className="text-muted-foreground">Documents Submitted</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white">500+</div>
                <div className="text-muted-foreground">Active Students</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white">99.9%</div>
                <div className="text-muted-foreground">Uptime Reliability</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Pioneering Academic Excellence
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  MASETrack is designed specifically for the MASE (Mujahideen/Mujahidat Assistance for Science Education) program, providing a
                  comprehensive solution for academic document management and
                  submission.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Academic Focus</h3>
                      <p className="text-sm text-muted-foreground">
                        Tailored specifically for engineering graduate programs
                        and academic requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        Institutional Grade Security
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Meets all university security standards and compliance
                        requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Collaborative Platform</h3>
                      <p className="text-sm text-muted-foreground">
                        Seamless integration with faculty, administrators, and
                        student workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-first">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-500 text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-lg">
                  Join hundreds of MASE students who are already using MASETrack
                  to streamline their academic document submissions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="px-8">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 dark:bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">MASETrack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The premier online academic document submission portal for MASE
                students.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Submit Documents
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Track Progress
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Document Library
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Contact Support
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  System Status
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Academic Integrity
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} MASETrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
