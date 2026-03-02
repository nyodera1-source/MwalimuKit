/**
 * Auto-tag Biology questions with their strand based on keyword matching.
 *
 * Biology strands (CBE Senior School):
 *   1. Cell Biology and Biodiversity
 *   2. Anatomy and Physiology of Animals
 *   3. Anatomy and Physiology of Plants
 *
 * Usage:
 *   npx tsx scripts/extract-questions/auto-tag-strands.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL not set in .env");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// ─── Strand keyword mappings ───

const STRAND_KEYWORDS: { strand: string; keywords: RegExp[] }[] = [
  {
    strand: "Cell Biology and Biodiversity",
    keywords: [
      /\bcell\b/i, /\bcells\b/i, /\bcellular\b/i,
      /\bmitosis\b/i, /\bmeiosis\b/i, /\bcell division\b/i,
      /\bosmosis\b/i, /\bdiffusion\b/i, /\bactive transport\b/i,
      /\bmembrane\b/i, /\bcytoplasm\b/i, /\bnucleus\b/i, /\borganelle/i,
      /\bmicroscop/i, /\bspecimen/i,
      /\bclassif/i, /\btaxonom/i, /\bbinomial/i,
      /\bkingdom\b/i, /\bphylum\b/i, /\bclass\b/i, /\border\b/i, /\bfamily\b/i, /\bgenus\b/i, /\bspecies\b/i,
      /\bbiodivers/i, /\becosystem/i, /\becolog/i, /\bhabitat/i,
      /\bfood chain/i, /\bfood web/i, /\btrophic/i, /\bpredator/i, /\bprey\b/i,
      /\bpopulation/i, /\bcommunity\b/i, /\bbiome/i, /\bsuccession/i,
      /\bpollut/i, /\bconservat/i, /\benvironment/i,
      /\bevolution/i, /\bnatural selection/i, /\badaptation/i, /\bmutation/i,
      /\bgenetic/i, /\bgene\b/i, /\bgenes\b/i, /\bDNA\b/i, /\bchromosome/i,
      /\bhered/i, /\bdominant/i, /\brecessive/i, /\bgenotype/i, /\bphenotype/i,
      /\bcross/i, /\bmonohybrid/i, /\bdihybrid/i, /\bvariation/i,
      /\bfungi\b/i, /\bfungus/i, /\bbacteria/i, /\bvirus/i, /\blichen/i,
      /\balgae\b/i, /\bprotozoa/i, /\bamoeba/i,
      /\binsect/i, /\barthropod/i, /\bmollus/i, /\bannelid/i,
      /\bvertebrat/i, /\binvertebrat/i,
      /\bmammal/i, /\breptil/i, /\bamphib/i, /\bfish\b/i, /\bbird\b/i,
    ],
  },
  {
    strand: "Anatomy and Physiology of Plants",
    keywords: [
      /\bphotosynthes/i, /\bchlorophyll/i, /\bchloroplast/i,
      /\bstomata\b/i, /\bstoma\b/i, /\bguard cell/i,
      /\btranspir/i, /\bxylem\b/i, /\bphloem\b/i, /\btranslocation/i,
      /\broot\b/i, /\broots\b/i, /\broot hair/i,
      /\bstem\b/i, /\bstems\b/i, /\bleaf\b/i, /\bleaves\b/i,
      /\bflower\b/i, /\bflowers\b/i, /\bpetal/i, /\bsepal/i, /\bstamen/i, /\bcarpel/i, /\bpistil/i,
      /\bpollinat/i, /\bseed\b/i, /\bseeds\b/i, /\bfruit\b/i, /\bgerminat/i,
      /\bplant\b/i, /\bplants\b/i,
      /\btropi/i, /\bphototropi/i, /\bgeotropi/i,
      /\bmonocot/i, /\bdicot/i,
      /\bvascular/i, /\bcambium/i, /\bmeristem/i,
    ],
  },
  {
    strand: "Anatomy and Physiology of Animals",
    keywords: [
      /\bdigest/i, /\bstomach\b/i, /\bintestine/i, /\besophag/i, /\boesophag/i,
      /\bmouth\b/i, /\bteet[hm]/i, /\bsaliva/i, /\bperistalsis/i,
      /\benzyme/i, /\bpepsin/i, /\btrypsin/i, /\blipase/i, /\bamylase/i,
      /\brespir/i, /\blung/i, /\balveol/i, /\bbronch/i, /\btrachea/i,
      /\binhale/i, /\bexhale/i, /\bbreathing/i, /\bgaseous exchange/i,
      /\bblood\b/i, /\bheart\b/i, /\bartery\b/i, /\barteries\b/i, /\bvein\b/i, /\bveins\b/i,
      /\bcapillar/i, /\bcirculat/i, /\bpulse/i, /\bhaemoglobin/i, /\bhemoglobin/i,
      /\bplasma\b/i, /\bplatelet/i, /\bwhite blood/i, /\bred blood/i, /\bleucocyte/i, /\berythrocyte/i,
      /\bkidney/i, /\bnephron/i, /\burine\b/i, /\bexcret/i, /\burea\b/i,
      /\bliver\b/i, /\bskin\b/i, /\bsweat\b/i,
      /\bnervous/i, /\bneuron/i, /\bbrain\b/i, /\bspinal/i, /\breflex/i,
      /\bsynapse/i, /\bimpulse/i, /\bstimul/i, /\breceptor/i,
      /\beye\b/i, /\bear\b/i, /\bsight\b/i, /\bhearing\b/i, /\bretina/i, /\bcochlea/i,
      /\bbone\b/i, /\bbones\b/i, /\bskelet/i, /\bjoint/i, /\bmuscle/i, /\btendon/i, /\bligament/i,
      /\breproduct/i, /\bfertili[sz]/i, /\bembryo\b/i, /\bfoetus/i, /\bfetus/i,
      /\bplacenta/i, /\bumbilical/i, /\bmenstrua/i, /\bovulat/i,
      /\bsperm\b/i, /\bovum\b/i, /\bova\b/i, /\btestes/i, /\bovary\b/i, /\bovaries\b/i,
      /\bhormone/i, /\bendocrine/i, /\binsulin/i, /\badrenalin/i, /\bthyroid/i,
      /\bimmun/i, /\bvaccin/i, /\bantibod/i, /\bantigen/i,
      /\bdiabet/i, /\bmalaria/i, /\bHIV\b/i, /\bAIDS\b/i,
      /\bhomeostas/i, /\bthermoregulat/i,
      /\banimal\b/i, /\banimals\b/i, /\bhuman\b/i,
    ],
  },
];

function detectStrand(text: string): string | null {
  const scores = STRAND_KEYWORDS.map(({ strand, keywords }) => {
    let score = 0;
    for (const kw of keywords) {
      if (kw.test(text)) score++;
    }
    return { strand, score };
  });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Need at least 1 keyword match
  if (scores[0].score === 0) return null;

  return scores[0].strand;
}

async function main() {
  // Get all Biology questions
  const bioPaper = await prisma.questionPaper.findFirst({
    where: { subject: { equals: "Biology", mode: "insensitive" } },
  });

  if (!bioPaper) {
    console.log("No Biology pool found");
    process.exit(0);
  }

  const questions = await prisma.question.findMany({
    where: { paperId: bioPaper.id },
    orderBy: { questionNumber: "asc" },
  });

  console.log(`Found ${questions.length} Biology questions to auto-tag\n`);

  const stats = { tagged: 0, skipped: 0, unchanged: 0 };
  const strandCounts: Record<string, number> = {};

  for (const q of questions) {
    // Combine question text + sub-questions text for better detection
    const subTexts = (q.subQuestions as { text: string }[] | null)?.map((s) => s.text).join(" ") || "";
    const fullText = `${q.text} ${subTexts}`;

    const strand = detectStrand(fullText);

    if (!strand) {
      stats.skipped++;
      continue;
    }

    if (q.topic === strand) {
      stats.unchanged++;
      strandCounts[strand] = (strandCounts[strand] || 0) + 1;
      continue;
    }

    await prisma.question.update({
      where: { id: q.id },
      data: { topic: strand },
    });

    stats.tagged++;
    strandCounts[strand] = (strandCounts[strand] || 0) + 1;
  }

  console.log("Results:");
  console.log(`  Tagged: ${stats.tagged}`);
  console.log(`  Already correct: ${stats.unchanged}`);
  console.log(`  No match (skipped): ${stats.skipped}`);
  console.log("\nStrand distribution:");
  for (const [strand, count] of Object.entries(strandCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${strand}: ${count}`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
