-- CreateTable
CREATE TABLE "curriculum_notes" (
    "id" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "learning_area_id" TEXT NOT NULL,
    "strand_id" TEXT NOT NULL,
    "sub_strand_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_notes_sub_strand_id_key" ON "curriculum_notes"("sub_strand_id");

-- AddForeignKey
ALTER TABLE "curriculum_notes" ADD CONSTRAINT "curriculum_notes_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_notes" ADD CONSTRAINT "curriculum_notes_learning_area_id_fkey" FOREIGN KEY ("learning_area_id") REFERENCES "learning_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_notes" ADD CONSTRAINT "curriculum_notes_strand_id_fkey" FOREIGN KEY ("strand_id") REFERENCES "strands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_notes" ADD CONSTRAINT "curriculum_notes_sub_strand_id_fkey" FOREIGN KEY ("sub_strand_id") REFERENCES "sub_strands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
