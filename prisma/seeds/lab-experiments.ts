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
    expectedResults: "Sand remains on the filter paper as the residue while clear water passes through as the filtrate. The filter paper acts as a barrier that allows small water molecules to pass through its tiny pores but traps larger sand particles. The filtrate should be completely clear and colorless, confirming that all solid particles have been removed. If the filtrate appears cloudy, it means the filter paper was not properly fitted or had a tear. This demonstrates that filtration is effective for separating insoluble solids from liquids based on particle size. In everyday life, water purification plants use filtration as one step in cleaning drinking water. Tea strainers and coffee filters work on the same principle.",
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
    expectedResults: "Organisms can be grouped into broad categories based on observable features. Plants can be distinguished from animals by the presence of leaves, roots, and inability to move. Among animals, insects have six legs and three body parts (head, thorax, abdomen), while spiders have eight legs. Flowering plants can be grouped by flower color, petal number, and leaf shape (broad vs narrow, smooth vs serrated edges). Students should discover that the same set of organisms can be classified in different ways depending on which features are used. This mirrors how scientists use hierarchical classification systems (Kingdom, Phylum, Class, Order, Family, Genus, Species) to organize the diversity of life on Earth.",
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
    expectedResults: "Different objects produce different readings on the spring balance, measured in Newtons (N). A textbook may read approximately 3-5N, a stone 2-4N, and a full water bottle 5-10N depending on size. The spring stretches more for heavier objects because a greater gravitational force acts on them. Weight is not the same as mass: mass is the amount of matter in an object (measured in kilograms), while weight is the force of gravity pulling on that mass (measured in Newtons). On Earth, weight = mass x 9.8 N/kg. The spring balance works because the spring extends proportionally to the force applied (Hooke's Law). Students should note that the reading must be taken at eye level to avoid parallax error, and the pointer must be stationary before reading.",
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
    expectedResults: "The temperature-time graph reveals three distinct phases. Phase 1 (Solid to Liquid): Ice temperature rises from below 0 degrees C until it reaches 0 degrees C, where it plateaus. During this plateau, heat energy is used to break the bonds between ice molecules (latent heat of fusion) rather than raising temperature. Phase 2 (Liquid): Once all ice has melted, the water temperature rises steadily from 0 degrees C toward 100 degrees C. The rate of temperature increase depends on the power of the heat source. Phase 3 (Liquid to Gas): At 100 degrees C, the temperature plateaus again as heat energy is used to convert liquid water into steam (latent heat of vaporisation). The two plateaus on the graph are key evidence that phase changes require energy without temperature change. At sea level, water boils at 100 degrees C, but at higher altitudes (like in some Kenyan highlands), it boils at slightly lower temperatures due to reduced atmospheric pressure.",
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
    expectedResults: "Foods containing starch show a distinctive blue-black color change when iodine solution is added. Bread turns deep blue-black (high starch content from wheat flour). Potato turns blue-black (starch is the main storage carbohydrate in tubers). Rice turns blue-black (rich in starch). Banana shows a partial blue-black reaction depending on ripeness - unripe bananas contain more starch, while ripe bananas have converted much of their starch to sugars. Meat remains brown/yellow (contains proteins and fats, not starch). The blue-black color occurs because iodine molecules fit inside the coiled structure of starch (amylose), forming a starch-iodine complex. This test is specific to starch and will not detect other carbohydrates like sugars. In the human diet, starchy foods are important sources of energy and are classified as energy-giving foods.",
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
    expectedResults: "Protein-containing foods show a clear purple/violet color change with the Biuret reagent. Egg white produces the strongest purple color (albumin is a concentrated protein). Milk turns light violet (contains casein protein). Bean solution turns purple (legumes are rich in plant proteins). Bread shows only a faint violet tinge (contains small amounts of gluten protein). The Biuret test works because copper(II) ions in the reagent form a violet-colored complex with the peptide bonds (-CO-NH-) found in protein molecules. The intensity of the purple color indicates the relative concentration of protein in each sample. Foods without protein remain blue (the original color of the copper sulfate). Proteins are classified as body-building foods in nutrition because they provide amino acids needed for growth, repair of tissues, and production of enzymes and hormones.",
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
    expectedResults: "Salt dissolves completely in water forming a clear, colorless solution. During dissolving, the ionic bonds in sodium chloride crystals are broken by water molecules. Water molecules surround individual Na+ and Cl- ions in a process called hydration. The solution appears identical to pure water visually, but its properties have changed: it has a higher boiling point and lower freezing point than pure water. Stirring speeds up dissolution because it brings fresh solvent (water) into contact with undissolved solute (salt). Temperature also affects dissolving rate - warm water dissolves salt faster because water molecules move more energetically. The resulting solution has a concentration of approximately 10% (10g salt in 100ml water). If more salt is added beyond the saturation point (about 36g per 100ml at room temperature), it will no longer dissolve and will settle at the bottom as undissolved solute.",
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
    expectedResults: "For every angle tested, the angle of incidence equals the angle of reflection, confirming the First Law of Reflection. At 30 degrees incidence, the reflected ray is at 30 degrees. At 45 degrees, the reflected ray is at 45 degrees. At 60 degrees, the reflected ray is at 60 degrees. The incident ray, reflected ray, and the normal all lie in the same plane (the paper surface), confirming the Second Law of Reflection. Both angles are measured from the normal (the perpendicular line to the mirror surface), not from the mirror itself. The reflected ray always appears on the opposite side of the normal from the incident ray. These laws apply to all smooth, flat reflective surfaces. If the mirror surface were rough (diffuse reflection), each small section would still obey the laws, but the overall reflection would scatter in many directions. These principles are applied in periscopes, kaleidoscopes, and rear-view mirrors.",
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
    expectedResults: "Strip A (distilled water): The potato strip increases in length by 2-5mm and becomes noticeably firmer and more rigid (turgid). This occurs because the water concentration outside the cells is higher than inside, so water moves into the cells by osmosis through the selectively permeable cell membrane. The cells swell as their vacuoles fill with water, pressing the cytoplasm against the cell wall. Strip B (dilute salt solution): Little or no change in length or firmness. The water concentration is roughly equal on both sides of the cell membrane (isotonic solution), so there is no net movement of water. Strip C (concentrated salt solution): The strip decreases in length by 3-7mm and becomes soft and floppy (flaccid). Water moves out of the cells by osmosis because the external solution has a lower water concentration. The cells lose turgor, and the cell membrane pulls away from the cell wall (plasmolysis). This experiment demonstrates that osmosis is the movement of water from a region of higher water concentration to a region of lower water concentration across a selectively permeable membrane.",
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
    expectedResults: "Lemon juice: pH 2-3 (strongly acidic, turns indicator red/orange due to citric acid). Vinegar: pH 2-3 (strongly acidic, contains acetic acid). Milk: pH 6-7 (slightly acidic due to lactic acid). Water: pH 7 (neutral, indicator turns green). Baking soda solution: pH 8-9 (mildly basic/alkaline, turns indicator blue). Soap solution: pH 9-11 (moderately basic, turns indicator blue/purple, contains sodium hydroxide). The pH scale ranges from 0 (most acidic) to 14 (most basic), with 7 being neutral. Acids have a pH below 7 and produce hydrogen ions (H+) in solution. Bases have a pH above 7 and produce hydroxide ions (OH-) in solution. When an acid and a base are mixed in the right proportions, they neutralize each other to form salt and water (neutralization reaction). Universal indicator changes color across the full pH range, making it more informative than litmus paper which only distinguishes acid from base.",
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
    expectedResults: "The data clearly shows that longer pendulums have longer periods of oscillation. Sample results: At L=100cm, T is approximately 2.0s. At L=80cm, T is approximately 1.8s. At L=60cm, T is approximately 1.5s. At L=40cm, T is approximately 1.3s. At L=20cm, T is approximately 0.9s. When T-squared is plotted against L, the graph is a straight line through the origin, confirming the mathematical relationship T = 2pi x sqrt(L/g), where g is the acceleration due to gravity (approximately 9.8 m/s squared). This means the period is proportional to the square root of the length. Importantly, the period does NOT depend on the mass of the bob or the amplitude of swing (for small angles below 15 degrees). This principle was discovered by Galileo and was historically used in pendulum clocks. The experiment also demonstrates that by measuring T and L accurately, the value of g (gravitational acceleration) can be calculated.",
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
    expectedResults: "The extension of the spring increases proportionally with the applied force, confirming Hooke's Law (F = k x e, where F is force, k is the spring constant, and e is extension). Sample results: 50g (0.49N) gives approximately 1cm extension, 100g (0.98N) gives 2cm, 150g (1.47N) gives 3cm, and so on. The graph of force versus extension produces a straight line passing through the origin, proving the proportional relationship. The gradient (slope) of this line gives the spring constant k, which measures the stiffness of the spring (measured in N/m or N/cm). A steeper slope means a stiffer spring. If too much force is applied, the spring exceeds its elastic limit and enters plastic deformation where it does not return to its original length when unloaded. Beyond the elastic limit, the graph curves and Hooke's Law no longer applies. Springs are used in everyday devices such as weighing scales, vehicle suspension systems, and mattresses.",
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
    expectedResults: "Tube 1 (Zinc + CuSO4): The blue color of copper sulfate gradually fades over 5-10 minutes as zinc displaces copper from the solution. A reddish-brown deposit of copper metal forms on the zinc. The reaction is moderate in speed. Equation: Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s). Tube 2 (Magnesium + CuSO4): The reaction is vigorous with noticeable heat produced (exothermic). The blue color disappears rapidly and a thick layer of copper deposits on the magnesium. Bubbling may also occur. Equation: Mg(s) + CuSO4(aq) -> MgSO4(aq) + Cu(s). Tube 3 (Iron + CuSO4): The reaction is slow, taking 15-20 minutes for visible change. A thin coating of copper appears on the iron filings and the blue color lightens slightly to green (iron(II) sulfate is green). Equation: Fe(s) + CuSO4(aq) -> FeSO4(aq) + Cu(s). The reactivity order is confirmed as Mg > Zn > Fe > Cu. A more reactive metal displaces a less reactive metal from its salt solution. This is because more reactive metals lose electrons more easily (are better reducing agents).",
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
    expectedResults: "Series Circuit: The ammeter reads the same current at every point in the circuit (e.g., 0.2A), confirming that current is constant throughout a series circuit. The voltage across each bulb is approximately one-third of the total voltage (e.g., 1V each from a 3V supply), confirming that voltage divides in series. All three bulbs glow dimly because they share the available voltage. Total resistance = R1 + R2 + R3. If one bulb is removed, the circuit breaks and all bulbs go off. Parallel Circuit: The voltage across each bulb equals the full supply voltage (e.g., 3V each), confirming that voltage is the same across parallel branches. The current from the supply splits into three branches, with each branch carrying roughly equal current (e.g., 0.3A each, total 0.9A). Each bulb glows at full brightness because it receives the full voltage. Total resistance is less than any individual resistance (1/Rtotal = 1/R1 + 1/R2 + 1/R3). If one bulb is removed, the others continue to work. Parallel circuits are used in household wiring because each appliance receives full voltage and operates independently.",
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
    expectedResults: "When sodium hydroxide is placed in the flask with phenolphthalein indicator, the solution turns pink because the indicator is pink in basic/alkaline conditions. As hydrochloric acid is slowly added from the burette, the pink color temporarily disappears where the acid drops in, then returns as the flask is swirled. Near the end point, the pink color takes longer to return. At the exact end point, one drop of acid causes the pink color to disappear permanently, indicating that all the NaOH has been neutralized. The solution is now neutral (pH 7). Typical titre values should be within 0.1ml of each other across repeated trials (e.g., 24.5ml, 24.6ml, 24.4ml). The balanced equation is: NaOH(aq) + HCl(aq) -> NaCl(aq) + H2O(l). This is a 1:1 mole ratio reaction. Using the titre volume and known concentrations, students can calculate the unknown concentration of either the acid or base. Accuracy depends on reading the burette at the meniscus, adding acid drop-by-drop near the end point, and using a white tile to detect color change clearly.",
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
    expectedResults: "In both beakers, the purple color of potassium permanganate spreads outward from the crystal in all directions without stirring, demonstrating diffusion. Cold water beaker: The color spreads slowly and may take 8-10 minutes to reach the edges of the beaker. The spreading is gradual and the boundary between colored and clear water is visible for several minutes. Hot water beaker: The color spreads much faster, reaching the edges in 2-4 minutes. The entire beaker becomes uniformly colored more quickly. This difference occurs because particles in hot water have greater kinetic energy and move faster, causing more frequent collisions that spread the permanganate particles more rapidly. Diffusion is the net movement of particles from a region of higher concentration to a region of lower concentration. It occurs because of the random motion of particles (Brownian motion). In biological systems, diffusion is essential for gas exchange in the lungs (oxygen diffuses into blood, carbon dioxide diffuses out), absorption of nutrients in the intestine, and movement of substances in and out of cells. Temperature, concentration gradient, and surface area all affect the rate of diffusion.",
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
