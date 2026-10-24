import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateGradeAndLearningArea } from "@/lib/curriculum/validate";
import {
  InvalidJsonBodyError,
  RequestBodyTooLargeError,
  readJsonBody,
} from "@/lib/request";
import { schemeOfWorkSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type PreviewBody = {
  id?: string;
  title?: string;
  gradeId?: string;
  learningAreaId?: string;
  term?: string | number;
  year?: string | number;
  schemeData?: string;
  status?: string;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await readJsonBody<PreviewBody>(request, 2_200_000);
    const parsed = schemeOfWorkSchema.safeParse({
      title: body.title || "",
      gradeId: body.gradeId || "",
      learningAreaId: body.learningAreaId || "",
      term: body.term,
      year: body.year,
      schemeData: body.schemeData || "",
      status: body.status || "draft",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "The scheme details are incomplete." },
        { status: 400 },
      );
    }

    const curriculumCheck = await validateGradeAndLearningArea(
      parsed.data.gradeId,
      parsed.data.learningAreaId,
    );
    if (!curriculumCheck.ok) {
      return NextResponse.json({ error: curriculumCheck.message }, { status: 400 });
    }

    let schemeData: unknown;
    try {
      schemeData = JSON.parse(parsed.data.schemeData);
    } catch {
      return NextResponse.json({ error: "The generated scheme data is invalid. Please generate it again." }, { status: 400 });
    }

    if (!schemeData || typeof schemeData !== "object" || Array.isArray(schemeData)) {
      return NextResponse.json({ error: "The generated scheme data is incomplete. Please generate it again." }, { status: 400 });
    }

    let schemeId = body.id;
    if (schemeId) {
      const existing = await prisma.schemeOfWork.findUnique({
        where: { id: schemeId },
        select: { userId: true },
      });
      if (!existing || existing.userId !== session.user.id) {
        return NextResponse.json({ error: "Scheme not found." }, { status: 404 });
      }

      await prisma.schemeOfWork.update({
        where: { id: schemeId },
        data: {
          gradeId: parsed.data.gradeId,
          learningAreaId: parsed.data.learningAreaId,
          term: parsed.data.term,
          year: parsed.data.year,
          title: parsed.data.title,
          weeks: schemeData as object,
          status: parsed.data.status,
        },
      });
    } else {
      const scheme = await prisma.schemeOfWork.create({
        data: {
          userId: session.user.id,
          gradeId: parsed.data.gradeId,
          learningAreaId: parsed.data.learningAreaId,
          term: parsed.data.term,
          year: parsed.data.year,
          title: parsed.data.title,
          weeks: schemeData as object,
          status: parsed.data.status,
        },
        select: { id: true },
      });
      schemeId = scheme.id;
    }

    revalidatePath("/schemes");
    revalidatePath("/dashboard");
    revalidatePath(`/schemes/${schemeId}`);

    return NextResponse.json({
      ok: true,
      redirectUrl: `/schemes/${schemeId}/preview`,
    });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError || error instanceof InvalidJsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Scheme preview save failed", error);
    return NextResponse.json(
      { error: "We could not save this scheme. Please try again." },
      { status: 500 },
    );
  }
}
