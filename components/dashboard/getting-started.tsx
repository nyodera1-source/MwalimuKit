import Link from "next/link";
import { ArrowRight, BookOpen, FileText, UserRound } from "lucide-react";

/**
 * First-run state.
 *
 * Shown instead of the module tiles and recent-documents list when the
 * teacher has no documents yet. Counts, "last edited" and "no documents
 * yet" are analytics for returning users — showing a brand-new account
 * two big zeros pushes the primary action below the fold and tells them
 * nothing except that they have not started.
 */
export function GettingStarted({ needsProfile }: { needsProfile: boolean }) {
  return (
    <div className="space-y-4">
      <section
        className="relative isolate overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm sm:px-6"
        style={{ backgroundImage: "url('/brand/mwalimukit-mathematics-planning.png')" }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/40" />
        <div className="relative max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            Start with a teaching document
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Create your first classroom-ready plan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Build a full-term scheme of work or prepare one focused lesson.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex min-h-[180px] flex-col rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-950">Scheme of Work</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Map your grade, learning area, lessons, breaks, and assessment across the term.
              </p>
            </div>
          </div>
          <Link
            href="/schemes/new"
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <BookOpen className="h-4 w-4" />
            Create a Scheme of Work
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="flex min-h-[180px] flex-col rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-950">Lesson Plan</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Prepare one complete lesson with outcomes, activities, resources, and assessment.
              </p>
            </div>
          </div>
          <Link
            href="/lesson-plans/new"
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <FileText className="h-4 w-4" />
            Create a Lesson Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      {needsProfile && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <div className="flex min-w-0 items-center gap-2 text-slate-600">
            <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">Set your grade and subjects once to prefill future documents.</span>
          </div>
          <Link href="/profile" className="shrink-0 font-semibold text-blue-700 hover:underline">
            Complete profile
          </Link>
        </div>
      )}
    </div>
  );
}
