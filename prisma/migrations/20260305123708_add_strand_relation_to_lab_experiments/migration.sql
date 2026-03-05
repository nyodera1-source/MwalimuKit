-- AddForeignKey
ALTER TABLE "lab_experiments" ADD CONSTRAINT "lab_experiments_strand_id_fkey" FOREIGN KEY ("strand_id") REFERENCES "strands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
