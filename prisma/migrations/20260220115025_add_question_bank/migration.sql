-- CreateTable
CREATE TABLE "question_papers" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade_level" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "term" INTEGER,
    "exam_type" TEXT NOT NULL,
    "school" TEXT,
    "source" TEXT,
    "paper_number" INTEGER,
    "total_marks" INTEGER,
    "time_minutes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "question_number" TEXT NOT NULL,
    "section" TEXT,
    "text" TEXT NOT NULL,
    "marks" INTEGER,
    "image_url" TEXT,
    "has_image" BOOLEAN NOT NULL DEFAULT false,
    "topic" TEXT,
    "sub_topic" TEXT,
    "answer" TEXT,
    "sub_questions" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "question_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
