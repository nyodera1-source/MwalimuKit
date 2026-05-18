CREATE TABLE "assignments" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "grade_id" TEXT NOT NULL,
  "learning_area_id" TEXT NOT NULL,
  "assignment_type" TEXT NOT NULL,
  "term" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "week_number" INTEGER,
  "title" TEXT,
  "total_marks" INTEGER,
  "time_minutes" INTEGER,
  "instructions" TEXT,
  "strand_ids" TEXT[],
  "sub_strand_ids" TEXT[],
  "slo_ids" TEXT[],
  "competency_ids" TEXT[],
  "questions" JSONB,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "assignments"
  ADD CONSTRAINT "assignments_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "assignments"
  ADD CONSTRAINT "assignments_grade_id_fkey"
  FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "assignments"
  ADD CONSTRAINT "assignments_learning_area_id_fkey"
  FOREIGN KEY ("learning_area_id") REFERENCES "learning_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
