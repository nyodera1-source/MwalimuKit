import Link from "next/link";
import { BookOpen, FileText, ArrowRight } from "lucide-react";

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
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-6 lg:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Create your first scheme of work
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose your grade and subject, enter your timetable and breaks, and
          download a scheme you can print for the whole term.
        </p>

        <Link
          href="/schemes/new"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
        >
          <BookOpen className="h-4 w-4" />
          Create a Scheme of Work
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">Need a single lesson?</p>
            <p className="mt-0.5 text-sm text-slate-600">
              Build a lesson plan on its own, or later turn any lesson in your
              scheme into a full plan.
            </p>
            <Link
              href="/lesson-plans/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
            >
              Create a Lesson Plan
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {needsProfile && (
        <p className="text-sm text-slate-500">
          Setting your grade and subjects in{" "}
          <Link href="/profile" className="font-medium text-blue-600 hover:underline">
            your profile
          </Link>{" "}
          means we can fill these in for you next time.
        </p>
      )}
    </div>
  );
}
