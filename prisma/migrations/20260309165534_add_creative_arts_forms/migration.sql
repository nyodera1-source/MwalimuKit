-- CreateTable
CREATE TABLE "creative_arts_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "form_type" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "learning_area_id" TEXT NOT NULL,
    "strand_id" TEXT,
    "art_discipline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "form_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creative_arts_forms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "creative_arts_forms" ADD CONSTRAINT "creative_arts_forms_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative_arts_forms" ADD CONSTRAINT "creative_arts_forms_learning_area_id_fkey" FOREIGN KEY ("learning_area_id") REFERENCES "learning_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative_arts_forms" ADD CONSTRAINT "creative_arts_forms_strand_id_fkey" FOREIGN KEY ("strand_id") REFERENCES "strands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
