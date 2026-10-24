import Link from "next/link";
import Image from "next/image";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  GraduationCap,
  Phone,
  Mail,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: "Lesson Plans",
      desc: "CBE-aligned lesson planning with guided curriculum selections",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Schemes of Work",
      desc: "Term-by-term planning shaped around your lessons and school breaks",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const steps = [
    {
      title: "Sign Up Free",
      desc: "Create your account in 30 seconds — no credit card needed",
      color: "bg-blue-500",
    },
    {
      title: "Choose Your Tool",
      desc: "Choose a scheme of work or lesson plan",
      color: "bg-blue-500",
    },
    {
      title: "Generate & Download",
      desc: "Get your CBE-aligned document ready to use in minutes",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wordmark size="md" className="h-11 w-[185px]" />
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
            <a href="tel:+254700000000" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <Phone className="h-3 w-3" />
              <span>+254 700 000 000</span>
            </a>
            <span className="text-gray-300">|</span>
            <a href="mailto:info@mwalimukit.com" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <Mail className="h-3 w-3" />
              <span>info@mwalimukit.com</span>
            </a>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-gray-300" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="rounded-full bg-blue-500 hover:bg-blue-600" asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — two-column split with image */}
      <section className="gradient-hero wave-divider relative px-4 pt-16 pb-28 lg:pt-20 lg:pb-36">
        <div className="max-w-6xl mx-auto flex items-center gap-10 lg:gap-16">
          {/* Left column — text */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              Made for Kenyan teachers
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Plan better. Teach better.
            </h2>
            <p className="mt-5 text-lg lg:text-xl text-blue-100 max-w-xl">
              Create practical schemes of work and lesson plans for Grades 1–12,
              tailored to your subject, grade, and school timetable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
                asChild
              >
                <Link href="/signup">Create a Free Plan</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          {/* Right column — MwalimuKit planning preview */}
          <div className="relative hidden flex-1 md:block">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-950/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_rgba(7,38,105,0.32)] ring-1 ring-white/25">
              <Image
                src="/brand/mwalimukit-mathematics-planning.png"
                alt="MwalimuKit scheme of work and lesson plan templates"
                width={600}
                height={400}
                className="aspect-[3/2] h-auto w-full object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#1688FA]/80 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[#1060c0]/25 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 lg:py-20 bg-orange-50">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Planning Tools for Teachers
            </h3>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Focused tools for preparing the two documents teachers use most.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100"
              >
                <div
                  className={`h-12 w-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900">{f.title}</h4>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Up and Running in 3 Steps
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-7 left-[20%] right-[20%] h-0.5 bg-gray-200" />
            {steps.map((s, i) => (
              <div key={s.title} className="text-center relative">
                <div
                  className={`h-14 w-14 rounded-full ${s.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg relative z-10`}
                >
                  <span className="text-lg font-bold">{i + 1}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {s.title}
                </h4>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto gradient-hero rounded-2xl p-10 lg:p-14 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold">
            Ready to simplify your teaching?
          </h3>
          <p className="mt-3 text-blue-100 max-w-md mx-auto">
            Join hundreds of Kenyan teachers already using MwalimuKit to save
            time and teach better.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
            asChild
          >
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-12 text-slate-300">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
            <div className="max-w-sm">
              <div className="inline-flex rounded-md bg-white px-3 py-2">
                <Wordmark size="sm" className="w-[120px]" />
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">
                Curriculum-aligned planning tools that help Kenyan teachers
                prepare, teach, and download better lessons with less effort.
              </p>
              <p className="mt-4 text-sm font-medium text-slate-200">
                Built for Kenyan CBE teachers &middot; Grades 1-12
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                Tools
              </h4>
              <nav className="mt-4 flex flex-col items-start gap-3 text-sm" aria-label="Tools">
                <Link href="/lesson-plans" className="transition-colors hover:text-white">
                  Lesson Plans
                </Link>
                <Link href="/schemes" className="transition-colors hover:text-white">
                  Schemes of Work
                </Link>
                <Link href="/signup" className="transition-colors hover:text-white">
                  Create a free account
                </Link>
                <Link href="/login" className="transition-colors hover:text-white">
                  Log in
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                What you get
              </h4>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                <li>Curriculum-based content</li>
                <li>Editable teacher-friendly plans</li>
                <li>Printable PDF downloads</li>
                <li>Practical Kenyan classroom context</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                Support
              </h4>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Need help with your account or a download? Our team is ready
                to help.
              </p>
              <div className="mt-4 flex flex-col items-start gap-3 text-sm">
                <a
                  href="mailto:info@mwalimukit.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  info@mwalimukit.com
                </a>
                <a
                  href="tel:+254700000000"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  +254 700 000 000
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} MwalimuKit. All rights reserved.</p>
            <p>Plan better. Teach better.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
