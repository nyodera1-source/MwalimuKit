import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Seed lab experiments for Biology, Chemistry, and Physics
 * These are experiment-specific templates that teachers can use
 */

const experiments = [
  // ===== BIOLOGY EXPERIMENTS =====
  {
    name: "Testing for Starch in Foods",
    subject: "Biology",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Nutrition and Diet",
    aim: "To test for the presence of starch in various food samples using iodine solution.",
    materials: [
      "Iodine solution",
      "Test tubes",
      "Test tube rack",
      "Dropper",
      "White tile or paper",
      "Food samples (bread, potato, rice, banana, meat)"
    ],
    procedure: [
      "1. Place a small sample of each food item on the white tile",
      "2. Add 2-3 drops of iodine solution to each food sample",
      "3. Observe and record any color changes",
      "4. Note which foods show blue-black coloration",
      "5. Record your observations in the table provided"
    ],
    safetyNotes: [
      "Handle iodine solution carefully - it stains skin and clothes",
      "Wear safety goggles",
      "Wash hands thoroughly after the experiment",
      "Do not taste any of the food samples after adding iodine"
    ],
    expectedResults: "Foods containing starch (bread, potato, rice) will turn blue-black when iodine is added. Foods without starch (meat) will turn brown/yellow.",
    relatedConcepts: [
      "Carbohydrates",
      "Chemical tests for nutrients",
      "Food composition",
      "Balanced diet"
    ]
  },
  {
    name: "Testing for Proteins in Foods",
    subject: "Biology",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Nutrition and Diet",
    aim: "To test for the presence of proteins in food samples using Biuret reagent.",
    materials: [
      "Biuret reagent (or copper sulfate solution + sodium hydroxide)",
      "Test tubes",
      "Test tube holder",
      "Dropper",
      "Water bath",
      "Food samples (egg white, milk, beans solution, bread)"
    ],
    procedure: [
      "1. Place 2ml of each food solution in separate test tubes",
      "2. Add 10 drops of sodium hydroxide solution to each tube",
      "3. Add 2 drops of copper sulfate solution",
      "4. Shake gently and observe color changes",
      "5. Record which samples turn purple/violet"
    ],
    safetyNotes: [
      "Sodium hydroxide is corrosive - handle with care",
      "Wear safety goggles and gloves",
      "Do not touch chemicals with bare hands",
      "Report any spills immediately"
    ],
    expectedResults: "Protein-containing foods (egg white, milk, beans) will turn purple/violet. Non-protein foods will remain blue.",
    relatedConcepts: [
      "Proteins",
      "Chemical tests",
      "Nutrients",
      "Body building foods"
    ]
  },
  {
    name: "Osmosis in Plant Cells",
    subject: "Biology",
    grade: "Grade 9",
    learningArea: "Biology",
    strand: "Cell Structure and Function",
    aim: "To demonstrate osmosis in plant cells using potato strips in different solutions.",
    materials: [
      "Fresh potato",
      "Knife",
      "3 beakers",
      "Distilled water",
      "Concentrated salt solution",
      "Ruler",
      "Marker pen"
    ],
    procedure: [
      "1. Cut three equal-sized potato strips (5cm x 1cm each)",
      "2. Measure and record initial length and firmness",
      "3. Place strips in: beaker A (distilled water), beaker B (dilute salt solution), beaker C (concentrated salt solution)",
      "4. Leave for 30 minutes",
      "5. Remove strips, measure length, and test firmness",
      "6. Record observations"
    ],
    safetyNotes: [
      "Handle knife carefully when cutting potato",
      "Keep work area clean and dry",
      "Dispose of potato strips properly after experiment"
    ],
    expectedResults: "Strip in distilled water becomes firm (turgid), strip in dilute solution shows little change, strip in concentrated solution becomes soft (flaccid).",
    relatedConcepts: [
      "Osmosis",
      "Turgidity and plasmolysis",
      "Cell membrane",
      "Water movement in cells"
    ]
  },

  // ===== CHEMISTRY EXPERIMENTS =====
  {
    name: "Acids and Bases - pH Testing",
    subject: "Chemistry",
    grade: "Grade 9",
    learningArea: "Chemistry",
    strand: "Acids, Bases and Indicators",
    aim: "To determine the pH of various household substances using pH indicators.",
    materials: [
      "pH paper or universal indicator",
      "Test tubes",
      "Test tube rack",
      "Dropper",
      "Various solutions (lemon juice, soap solution, vinegar, baking soda solution, milk, water)"
    ],
    procedure: [
      "1. Place 2ml of each solution in separate test tubes",
      "2. Add 2 drops of universal indicator OR dip pH paper into each solution",
      "3. Compare color with pH chart",
      "4. Record pH value for each substance",
      "5. Classify each as acid, base, or neutral"
    ],
    safetyNotes: [
      "Do not taste any of the solutions",
      "Wear safety goggles",
      "Wash hands after handling chemicals",
      "Clean up spills immediately"
    ],
    expectedResults: "Lemon juice and vinegar are acidic (pH < 7), soap and baking soda are basic (pH > 7), water is neutral (pH ≈ 7).",
    relatedConcepts: [
      "pH scale",
      "Acids and bases",
      "Indicators",
      "Neutralization"
    ]
  },
  {
    name: "Preparing a Salt Solution",
    subject: "Chemistry",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Solutions and Mixtures",
    aim: "To prepare a salt solution and understand the process of dissolving.",
    materials: [
      "Table salt (sodium chloride)",
      "Distilled water",
      "Beaker (250ml)",
      "Stirring rod",
      "Measuring cylinder",
      "Spatula",
      "Electronic balance"
    ],
    procedure: [
      "1. Measure 100ml of distilled water into the beaker",
      "2. Weigh 10g of table salt using the balance",
      "3. Add salt to water slowly while stirring",
      "4. Continue stirring until all salt dissolves",
      "5. Observe and record the time taken for complete dissolution"
    ],
    safetyNotes: [
      "Handle glassware carefully to avoid breakage",
      "Wipe up any spills immediately",
      "Ensure balance is on a stable surface"
    ],
    expectedResults: "Salt dissolves completely in water forming a clear, colorless solution. The solution tastes salty (do not taste in lab).",
    relatedConcepts: [
      "Solutions",
      "Solute and solvent",
      "Dissolving process",
      "Concentration"
    ]
  },
  {
    name: "Displacement Reaction - Metals",
    subject: "Chemistry",
    grade: "Grade 10",
    learningArea: "Chemistry",
    strand: "Chemical Reactions",
    aim: "To investigate the reactivity of metals by observing displacement reactions.",
    materials: [
      "Zinc powder",
      "Copper(II) sulfate solution",
      "Magnesium ribbon",
      "Iron filings",
      "Test tubes",
      "Beaker"
    ],
    procedure: [
      "1. Pour 5ml copper(II) sulfate solution into three test tubes",
      "2. Add zinc powder to tube 1, magnesium ribbon to tube 2, iron filings to tube 3",
      "3. Observe color changes in the solution",
      "4. Observe formation of deposits on metals",
      "5. Record rate of reaction (vigorous, moderate, slow)"
    ],
    safetyNotes: [
      "Copper sulfate is harmful if swallowed",
      "Wear safety goggles",
      "Do not touch chemicals with bare hands",
      "Dispose of waste properly"
    ],
    expectedResults: "Magnesium reacts vigorously, zinc moderately, iron slowly. Blue color fades as copper is displaced. Reactivity order: Mg > Zn > Fe.",
    relatedConcepts: [
      "Reactivity series",
      "Displacement reactions",
      "Oxidation and reduction",
      "Metal activity"
    ]
  },

  // ===== PHYSICS EXPERIMENTS =====
  {
    name: "Simple Pendulum - Period Investigation",
    subject: "Physics",
    grade: "Grade 9",
    learningArea: "Physics",
    strand: "Forces and Motion",
    aim: "To investigate how the length of a pendulum affects its period of oscillation.",
    materials: [
      "String (1 meter)",
      "Small metal bob or stone",
      "Retort stand and clamp",
      "Stopwatch",
      "Meter rule",
      "Protractor"
    ],
    procedure: [
      "1. Set up pendulum with 100cm string length",
      "2. Displace bob by 10° and release",
      "3. Time 10 complete oscillations",
      "4. Calculate period (T = total time / 10)",
      "5. Repeat with lengths: 80cm, 60cm, 40cm, 20cm",
      "6. Record results in table"
    ],
    safetyNotes: [
      "Ensure clamp is tight to prevent falling",
      "Clear the swing area before starting",
      "Use small displacement angle (< 15°)",
      "Secure the stand to prevent tipping"
    ],
    expectedResults: "Period increases with length. Longer pendulums swing slower. Relationship: T ∝ √L",
    relatedConcepts: [
      "Period and frequency",
      "Simple harmonic motion",
      "Oscillations",
      "Time measurement"
    ]
  },
  {
    name: "Reflection of Light in Plane Mirrors",
    subject: "Physics",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Light",
    aim: "To verify the laws of reflection using a plane mirror and ray box.",
    materials: [
      "Plane mirror",
      "Ray box or torch with single slit",
      "White paper",
      "Protractor",
      "Pencil",
      "Ruler"
    ],
    procedure: [
      "1. Place mirror upright on paper, draw its position",
      "2. Draw normal line perpendicular to mirror",
      "3. Shine ray at mirror at 30° to normal",
      "4. Mark incident and reflected ray paths",
      "5. Measure angles of incidence and reflection",
      "6. Repeat for angles: 45°, 60°"
    ],
    safetyNotes: [
      "Do not shine light directly into anyone's eyes",
      "Handle mirror carefully to avoid cuts",
      "Work in a darkened room for better visibility"
    ],
    expectedResults: "Angle of incidence equals angle of reflection for all trials. Incident ray, reflected ray, and normal lie in the same plane.",
    relatedConcepts: [
      "Laws of reflection",
      "Plane mirrors",
      "Light rays",
      "Angles of incidence and reflection"
    ]
  },
  {
    name: "Electrical Circuits - Series and Parallel",
    subject: "Physics",
    grade: "Grade 10",
    learningArea: "Physics",
    strand: "Electricity",
    aim: "To compare current and voltage in series and parallel circuits.",
    materials: [
      "3 identical bulbs (2.5V)",
      "2 cells (1.5V each)",
      "Cell holder",
      "Connecting wires",
      "Ammeter",
      "Voltmeter",
      "Switch"
    ],
    procedure: [
      "1. Connect 3 bulbs in series with cells and ammeter",
      "2. Close switch, measure current and voltage across each bulb",
      "3. Record brightness of bulbs",
      "4. Disconnect and connect bulbs in parallel",
      "5. Measure current and voltage again",
      "6. Compare results from both circuits"
    ],
    safetyNotes: [
      "Check connections before closing switch",
      "Do not short-circuit the cells",
      "Use correct ammeter range",
      "Disconnect circuit when not in use"
    ],
    expectedResults: "Series: Same current through all bulbs, voltage divides. Parallel: Same voltage across all bulbs, current divides. Parallel bulbs are brighter.",
    relatedConcepts: [
      "Series circuits",
      "Parallel circuits",
      "Current and voltage",
      "Ohm's law"
    ]
  },
  {
    name: "Hooke's Law - Springs Extension",
    subject: "Physics",
    grade: "Grade 9",
    learningArea: "Physics",
    strand: "Forces",
    aim: "To investigate the relationship between force applied and extension of a spring.",
    materials: [
      "Helical spring",
      "Retort stand and clamp",
      "Meter rule",
      "Mass hanger",
      "Slotted masses (50g, 100g, 200g)",
      "Pointer"
    ],
    procedure: [
      "1. Suspend spring from clamp, attach pointer",
      "2. Measure initial position with no load",
      "3. Add 50g mass, measure new position",
      "4. Calculate extension (new position - original)",
      "5. Repeat with 100g, 150g, 200g, 250g",
      "6. Plot graph of force vs extension"
    ],
    safetyNotes: [
      "Do not overload spring (max 500g)",
      "Ensure masses are securely attached",
      "Stand clear when adding masses",
      "Use eye protection"
    ],
    expectedResults: "Extension is proportional to force (within elastic limit). Graph shows straight line through origin. Spring constant k can be calculated from slope.",
    relatedConcepts: [
      "Hooke's Law",
      "Elastic limit",
      "Spring constant",
      "Force and extension"
    ]
  }
];

async function main() {
  console.log("🔬 Seeding lab experiments...");

  // First, get grade and learning area IDs
  const grades = await prisma.grade.findMany();
  const learningAreas = await prisma.learningArea.findMany({
    include: { grade: true, strands: true }
  });

  let seededCount = 0;

  for (const exp of experiments) {
    // Find matching grade
    const grade = grades.find(g => g.name === exp.grade);
    if (!grade) {
      console.log(`⚠️  Grade not found: ${exp.grade} - skipping experiment: ${exp.name}`);
      continue;
    }

    // Find matching learning area
    const learningArea = learningAreas.find(
      la => la.name === exp.learningArea && la.gradeId === grade.id
    );
    if (!learningArea) {
      console.log(`⚠️  Learning area not found: ${exp.learningArea} for ${exp.grade} - skipping: ${exp.name}`);
      continue;
    }

    // Find matching strand (optional)
    const strand = learningArea.strands.find(s => s.name === exp.strand);

    // Create experiment
    await prisma.labExperiment.create({
      data: {
        name: exp.name,
        subject: exp.subject,
        gradeId: grade.id,
        learningAreaId: learningArea.id,
        strandId: strand?.id,
        aim: exp.aim,
        materials: exp.materials,
        procedure: exp.procedure,
        safetyNotes: exp.safetyNotes,
        expectedResults: exp.expectedResults,
        relatedConcepts: exp.relatedConcepts,
        sloIds: [] // Will be linked later when SLO integration is added
      }
    });

    seededCount++;
    console.log(`✅ Seeded: ${exp.name} (${exp.subject} - ${exp.grade})`);
  }

  console.log(`\n🎉 Successfully seeded ${seededCount} lab experiments!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding experiments:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
