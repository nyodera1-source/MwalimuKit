import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Pencil, Trash2, Copy, Users, FileUser } from "lucide-react";
import { deleteActivityForm, duplicateActivityForm } from "../../actions";

export default async function PreviewActivityFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const form = await prisma.activityForm.findUnique({
    where: { id },
    include: {
      experiment: {
        include: {
          grade: { select: { name: true } },
          learningArea: { select: { name: true } },
        },
      },
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!form || form.userId !== session.user.id) notFound();

  const exp = form.experiment;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/activity-forms">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold">
            {form.title || exp.name}
          </h1>
          <Badge variant={form.status === "completed" ? "default" : "secondary"}>
            {form.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/activity-forms/${id}`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await duplicateActivityForm(id);
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </form>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/activity-forms/${id}/export?type=student`} download>
              <Users className="h-4 w-4 mr-2" />
              Student Copy
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href={`/api/activity-forms/${id}/export?type=teacher`} download>
              <FileUser className="h-4 w-4 mr-2" />
              Teacher Copy
            </a>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteActivityForm(id);
            }}
          >
            <Button type="submit" variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {/* Preview Content */}
      <div className="space-y-4">
        {/* Header Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Experiment</span>
                <p className="font-medium">{exp.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Subject</span>
                <p className="font-medium">{exp.subject}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date</span>
                <p className="font-medium">
                  {new Date(form.activityDate).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Class/Group</span>
                <p className="font-medium">{form.classGroup || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Experiment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Aim</h4>
              <p className="text-sm">{exp.aim}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">Expected Results</h4>
              <p className="text-sm">{exp.expectedResults}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">Related Concepts</h4>
              <div className="flex flex-wrap gap-1">
                {exp.relatedConcepts.map((concept, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observations */}
        {form.observations && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{form.observations}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {form.results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{form.results}</p>
            </CardContent>
          </Card>
        )}

        {/* Teacher Notes */}
        {form.teacherNotes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teacher Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{form.teacherNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Download Reminder */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Ready to Print</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Download the Student Copy to distribute to learners, and the Teacher Copy
                  with AI-generated discussion answers for your reference.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/api/activity-forms/${id}/export?type=student`}>
                      <Users className="h-4 w-4 mr-2" />
                      Student Copy
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={`/api/activity-forms/${id}/export?type=teacher`}>
                      <FileUser className="h-4 w-4 mr-2" />
                      Teacher Copy
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
