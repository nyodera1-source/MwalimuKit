-- CreateTable
CREATE TABLE "creative_arts_activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "learning_area_id" TEXT NOT NULL,
    "strand_id" TEXT,
    "aim" TEXT NOT NULL,
    "materials" JSONB NOT NULL,
    "instructions" JSONB NOT NULL,
    "background_info" TEXT NOT NULL,
    "expected_outcome" TEXT NOT NULL,
    "performance_criteria" JSONB NOT NULL,
    "art_medium" TEXT,
    "inspiration_notes" TEXT,
    "related_concepts" JSONB NOT NULL,
    "slo_ids" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creative_arts_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "creative_arts_activities" ADD CONSTRAINT "creative_arts_activities_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative_arts_activities" ADD CONSTRAINT "creative_arts_activities_learning_area_id_fkey" FOREIGN KEY ("learning_area_id") REFERENCES "learning_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative_arts_activities" ADD CONSTRAINT "creative_arts_activities_strand_id_fkey" FOREIGN KEY ("strand_id") REFERENCES "strands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
