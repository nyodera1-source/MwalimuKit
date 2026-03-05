import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Seed lab experiments for Grades 7-10
 * Uses upsert on experiment name to prevent duplicates
 */

const experiments = [
  // ===== GRADE 7 — Integrated Science =====
  {
    name: "Separating Mixtures - Filtration",
    subject: "Chemistry",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Matter",
    aim: "To separate an insoluble solid from a liquid using filtration.",
    materials: [
      "Filter paper",
      "Funnel",
      "Retort stand and clamp",
      "Beaker (250ml)",
      "Stirring rod",
      "Sand",
      "Water",
      "Conical flask"
    ],
    procedure: [
      "1. Mix a spoonful of sand with 100ml of water in a beaker",
      "2. Fold the filter paper and place it in the funnel",
      "3. Set up the funnel on the retort stand over the conical flask",
      "4. Pour the sand-water mixture through the filter paper slowly",
      "5. Observe what remains on the filter paper (residue) and what passes through (filtrate)",
      "6. Record your observations"
    ],
    safetyNotes: [
      "Handle glassware carefully to avoid breakage",
      "Pour mixture slowly to avoid overflow",
      "Keep work area clean and dry"
    ],
    expectedResults: "Sand remains on the filter paper as the residue. Clear water passes through as the filtrate. This shows filtration separates insoluble solids from liquids.",
    relatedConcepts: [
      "Mixtures",
      "Separation techniques",
      "Filtration",
      "Residue and filtrate"
    ]
  },
  {
    name: "Classification of Living Things",
    subject: "Biology",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Living Things",
    aim: "To observe and classify common organisms using observable characteristics.",
    materials: [
      "Magnifying glass",
      "Collection jars",
      "White paper or tray",
      "Notebook and pencil",
      "Specimens: leaves, insects, flowers (collected from school compound)"
    ],
    procedure: [
      "1. Collect 5-8 different organisms or parts from the school compound",
      "2. Place each specimen on white paper for clear observation",
      "3. Use magnifying glass to observe key features (legs, wings, leaf shape, etc.)",
      "4. Record features of each specimen in a table",
      "5. Group the specimens based on common features",
      "6. Create a simple classification key for your specimens"
    ],
    safetyNotes: [
      "Do not touch unknown insects with bare hands",
      "Return live organisms to their habitat after observation",
      "Wash hands after handling specimens"
    ],
    expectedResults: "Organisms can be grouped by features: plants vs animals, number of legs, leaf shape, etc. Students learn that classification uses observable characteristics.",
    relatedConcepts: [
      "Classification",
      "Observable characteristics",
      "Living vs non-living",
      "Biodiversity"
    ]
  },
  {
    name: "Measuring Force with a Spring Balance",
    subject: "Physics",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Force and Energy",
    aim: "To measure the force (weight) of different objects using a spring balance.",
    materials: [
      "Spring balance (0-10N)",
      "Various objects (textbook, stone, water bottle, pencil case)",
      "String",
      "Table",
      "Recording sheet"
    ],
    procedure: [
      "1. Hold the spring balance vertically and note the zero reading",
      "2. Hang the first object from the hook of the spring balance",
      "3. Wait for the pointer to settle and read the force in Newtons",
      "4. Record the reading in the table",
      "5. Repeat for each object",
      "6. Arrange objects in order from lightest to heaviest"
    ],
    safetyNotes: [
      "Do not exceed the maximum reading of the spring balance",
      "Ensure objects are securely attached before lifting",
      "Hold spring balance steady when reading"
    ],
    expectedResults: "Different objects have different weights measured in Newtons. Heavier objects stretch the spring more. Weight is a force caused by gravity acting on mass.",
    relatedConcepts: [
      "Force",
      "Weight",
      "Newtons",
      "Gravity",
      "Measurement"
    ]
  },
  {
    name: "States of Matter - Heating and Cooling Water",
    subject: "Physics",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Matter",
    aim: "To observe changes of state when water is heated and cooled.",
    materials: [
      "Beaker (250ml)",
      "Ice cubes",
      "Bunsen burner or hot plate",
      "Thermometer",
      "Tripod stand and wire gauze",
      "Stopwatch",
      "Recording sheet"
    ],
    procedure: [
      "1. Place ice cubes in a beaker and record the temperature",
      "2. Heat the beaker gently on the hot plate",
      "3. Record the temperature every minute",
      "4. Note when ice starts melting and when water starts boiling",
      "5. Continue heating until water boils steadily",
      "6. Plot a temperature-time graph"
    ],
    safetyNotes: [
      "Handle hot apparatus with care - use tongs",
      "Do not touch the beaker while heating",
      "Keep face away from boiling water",
      "Turn off heat source when finished"
    ],
    expectedResults: "Ice melts at 0°C (remains constant during melting). Water boils at 100°C (remains constant during boiling). The graph shows plateaus at phase changes.",
    relatedConcepts: [
      "States of matter",
      "Melting and boiling",
      "Temperature",
      "Phase changes"
    ]
  },

  // ===== GRADE 8 — Integrated Science =====
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

  // ===== GRADE 9 — Separate Sciences =====
  {
    name: "Osmosis in Plant Cells",
    subject: "Biology",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Scientific Investigation",
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
  {
    name: "Acids and Bases - pH Testing",
    subject: "Chemistry",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Matter",
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
    name: "Simple Pendulum - Period Investigation",
    subject: "Physics",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Force and Energy",
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
    name: "Hooke's Law - Springs Extension",
    subject: "Physics",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Force and Energy",
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
  },

  // ===== GRADE 10 — Separate Sciences =====
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
    name: "Titration - Acid-Base Neutralization",
    subject: "Chemistry",
    grade: "Grade 10",
    learningArea: "Chemistry",
    strand: "Chemical Reactions",
    aim: "To determine the volume of acid needed to neutralize a known volume of base using titration.",
    materials: [
      "Burette",
      "Conical flask",
      "Pipette (25ml)",
      "Retort stand and clamp",
      "Dilute hydrochloric acid",
      "Sodium hydroxide solution",
      "Phenolphthalein indicator",
      "White tile"
    ],
    procedure: [
      "1. Rinse and fill the burette with dilute hydrochloric acid",
      "2. Pipette 25ml of sodium hydroxide solution into the conical flask",
      "3. Add 2 drops of phenolphthalein indicator (solution turns pink)",
      "4. Slowly add acid from the burette while swirling the flask",
      "5. Stop when the pink color just disappears (end point)",
      "6. Record the volume of acid used. Repeat for accuracy"
    ],
    safetyNotes: [
      "Hydrochloric acid and sodium hydroxide are corrosive",
      "Wear safety goggles and gloves",
      "Add acid slowly near the end point",
      "Rinse any spills with plenty of water"
    ],
    expectedResults: "The indicator changes from pink to colorless at the end point. Consistent titre values confirm accuracy. The reaction: NaOH + HCl → NaCl + H₂O.",
    relatedConcepts: [
      "Neutralization",
      "Titration",
      "Indicators",
      "Mole calculations"
    ]
  },
  {
    name: "Diffusion in Liquids and Gases",
    subject: "Biology",
    grade: "Grade 10",
    learningArea: "Biology",
    strand: "Cell Biology",
    aim: "To demonstrate diffusion in liquids and compare the rate of diffusion in different conditions.",
    materials: [
      "Potassium permanganate crystals",
      "2 beakers (250ml)",
      "Cold water",
      "Hot water",
      "Stopwatch",
      "White paper",
      "Dropper"
    ],
    procedure: [
      "1. Fill one beaker with cold water and another with hot water",
      "2. Place both beakers on white paper for clear observation",
      "3. Carefully drop one crystal of potassium permanganate into each beaker",
      "4. Start the stopwatch and observe the spreading of color",
      "5. Record observations every 2 minutes for 10 minutes",
      "6. Compare the rate of diffusion in both beakers"
    ],
    safetyNotes: [
      "Potassium permanganate stains skin and clothes",
      "Handle hot water carefully",
      "Do not stir the water after adding crystals",
      "Wash hands after the experiment"
    ],
    expectedResults: "Diffusion occurs in both beakers but is faster in hot water. Heat energy increases particle movement, speeding up diffusion. Color spreads evenly in all directions.",
    relatedConcepts: [
      "Diffusion",
      "Particle theory",
      "Temperature and kinetic energy",
      "Cell transport"
    ]
  }
];

async function main() {
  console.log("🔬 Seeding lab experiments...");

  // First, delete activity forms referencing experiments, then delete experiments
  const deletedForms = await prisma.activityForm.deleteMany({});
  console.log(`🗑️  Deleted ${deletedForms.count} existing activity forms`);
  const deleted = await prisma.labExperiment.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.count} existing experiments`);

  // Get grade and learning area IDs
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
        sloIds: []
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
