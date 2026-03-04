-- CreateTable
CREATE TABLE "lab_experiments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "learning_area_id" TEXT NOT NULL,
    "strand_id" TEXT,
    "aim" TEXT NOT NULL,
    "materials" JSONB NOT NULL,
    "procedure" JSONB NOT NULL,
    "safety_notes" JSONB NOT NULL,
    "expected_results" TEXT NOT NULL,
    "related_concepts" JSONB NOT NULL,
    "slo_ids" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_forms" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "experiment_id" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "learning_area_id" TEXT NOT NULL,
    "title" TEXT,
    "activity_date" TIMESTAMP(3) NOT NULL,
    "class_group" TEXT,
    "observations" TEXT,
    "results" TEXT,
    "teacher_notes" TEXT,
    "teacher_copy" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_forms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lab_experiments" ADD CONSTRAINT "lab_experiments_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_experiments" ADD CONSTRAINT "lab_experiments_learning_area_id_fkey" FOREIGN KEY ("learning_area_id") REFERENCES "learning_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_forms" ADD CONSTRAINT "activity_forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_forms" ADD CONSTRAINT "activity_forms_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "lab_experiments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_forms" ADD CONSTRAINT "activity_forms_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_forms" ADD CONSTRAINT "activity_forms_learning_area_id_fkey" FOREIGN KEY ("learning_area_id") REFERENCES "learning_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
