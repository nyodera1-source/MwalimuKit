-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "assessment_type" TEXT,
ADD COLUMN     "competency_ids" TEXT[],
ADD COLUMN     "slo_ids" TEXT[],
ADD COLUMN     "strand_ids" TEXT[],
ADD COLUMN     "sub_strand_ids" TEXT[];

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "order_num" INTEGER NOT NULL,
    "section" TEXT,
    "text" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "image_url" TEXT,
    "has_image" BOOLEAN NOT NULL DEFAULT false,
    "answer" TEXT,
    "cognitive_level" TEXT,
    "slo_id" TEXT,
    "sub_questions" JSONB,
    "source" TEXT DEFAULT 'ai',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
