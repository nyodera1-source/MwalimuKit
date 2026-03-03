import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  ClipboardList,
  StickyNote,
  GraduationCap,
  Phone,
  Mail,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: FileText,
      title: "Lesson Plans",
      desc: "CBE-aligned lesson planning with guided forms and AI assistance",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Schemes of Work",
      desc: "Term-by-term scheme generation following KICD guidelines",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: ClipboardList,
      title: "Exams & Questions",
      desc: "Question bank with 400+ questions and auto marking schemes",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: StickyNote,
      title: "Teaching Notes",
      desc: "AI-enhanced notes for every topic across all subjects",
      color: "bg-purple-100 text-purple-600",
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
      desc: "Pick from lesson plans, schemes, exams, or teaching notes",
      color: "bg-emerald-500",
    },
    {
      title: "Generate & Download",
      desc: "Get your CBE-aligned document ready to use in minutes",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Info Bar */}
      <div className="bg-blue-600 text-blue-100 text-xs py-2 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
          <a href="tel:+254700000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="h-3 w-3" />
            <span>+254 700 000 000</span>
          </a>
          <span className="text-blue-300">|</span>
          <a href="mailto:info@mwalimukit.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="h-3 w-3" />
            <span>info@mwalimukit.com</span>
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900"><em>MwalimuKit</em></h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full border-gray-300" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button className="rounded-full bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </header>

      {/* Hero — two-column split with image */}
      <section className="gradient-hero wave-divider relative px-4 pt-16 pb-28 lg:pt-20 lg:pb-36">
        <div className="max-w-6xl mx-auto flex items-center gap-10 lg:gap-16">
          {/* Left column — text */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              Built for Kenyan CBE Teachers
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Your Complete CBE
              <br />
              Teaching Toolkit
            </h2>
            <p className="mt-5 text-lg lg:text-xl text-blue-100 max-w-xl">
              Create lesson plans, schemes of work, exams, and teaching notes — all
              aligned to the KICD curriculum. Free to get started.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
                asChild
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg"
                asChild
              >
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
          {/* Right column — classroom image */}
          <div className="hidden md:block flex-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <Image
                src="/images/hero-classroom.jpg"
                alt="Kenyan classroom with students learning"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 lg:py-20 bg-orange-50">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Everything You Need to Teach
            </h3>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              All your teaching tools in one place, designed specifically for the
              Kenyan Competency-Based Education curriculum.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <footer className="bg-gray-900 text-gray-400 px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-white"><em>MwalimuKit</em></span>
          </div>
          <p className="text-sm">
            Built for Kenyan CBE Teachers &middot; Grades 1-12
          </p>
        </div>
      </footer>
    </div>
  );
}
