import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * CBC-aligned lab experiments for Grades 7-10
 * 8 experiments per grade = 32 total
 * Strand names match the actual CBC curriculum seed data
 */

const experiments = [
  // ═══════════════════════════════════════════════════
  // GRADE 7 — Integrated Science
  // Strands: Scientific Investigation, Matter, Living Things, Force and Energy
  // ═══════════════════════════════════════════════════

  // --- Scientific Investigation ---
  {
    name: "The Scientific Method - Seed Germination",
    subject: "Biology",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Scientific Investigation",
    aim: "To apply the scientific method by investigating factors that affect seed germination.",
    materials: [
      "Bean seeds (12)",
      "Cotton wool",
      "3 petri dishes or saucers",
      "Water",
      "Labels",
      "Dark cupboard",
      "Ruler"
    ],
    procedure: [
      "1. Label three dishes: A (water + light), B (water + dark), C (no water + light)",
      "2. Place damp cotton wool in dishes A and B, dry cotton wool in dish C",
      "3. Place 4 seeds on the cotton wool in each dish",
      "4. Place dish B in a dark cupboard, keep A and C on the windowsill",
      "5. Keep cotton wool in A and B moist daily for 7 days",
      "6. Record observations daily: number of seeds germinated, root length, shoot length"
    ],
    safetyNotes: [
      "Wash hands after handling seeds and cotton wool",
      "Do not eat the seeds",
      "Keep work area tidy"
    ],
    expectedResults: "Dish A (water + light): Seeds germinate well, showing roots and green shoots within 3-5 days. Dish B (water + dark): Seeds germinate but shoots are pale yellow/white (etiolated) because chlorophyll production requires light. The shoots may be longer as the plant stretches toward light. Dish C (no water): Seeds do not germinate because water is essential to activate enzymes that begin growth. This experiment demonstrates the scientific method: forming a hypothesis (seeds need water to germinate), designing a fair test (changing one variable at a time), collecting data, and drawing conclusions. It also shows that water is essential for germination while light is needed for healthy green growth but not for germination itself.",
    relatedConcepts: [
      "Scientific method",
      "Variables",
      "Fair testing",
      "Germination"
    ]
  },

  // --- Matter (2 experiments) ---
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

  // --- Living Things (3 experiments) ---
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
    name: "Observing Plant and Animal Cells Under a Microscope",
    subject: "Biology",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Living Things",
    aim: "To observe and compare the structures of plant and animal cells using a light microscope.",
    materials: [
      "Light microscope",
      "Glass slides and cover slips",
      "Onion bulb",
      "Iodine solution",
      "Methylene blue stain",
      "Dropper",
      "Forceps",
      "Blunt knife",
      "Clean cotton bud (for cheek cells)"
    ],
    procedure: [
      "1. Peel a thin transparent layer from the inner surface of an onion scale",
      "2. Place the onion peel flat on a glass slide and add a drop of iodine",
      "3. Cover with a cover slip and observe under low then high power",
      "4. Draw and label the plant cell",
      "5. Gently scrape the inside of your cheek with a clean cotton bud",
      "6. Smear the cells on a new slide, add methylene blue stain, cover and observe",
      "7. Draw and label the animal cell and compare both cells"
    ],
    safetyNotes: [
      "Handle microscope slides carefully - they are fragile",
      "Use the cotton bud gently when scraping cheek cells",
      "Do not share cotton buds between students",
      "Dispose of used slides and cotton buds properly"
    ],
    expectedResults: "Onion (plant) cells appear as regular, rectangular brick-like shapes arranged in rows. Under iodine stain, the cell wall (outer boundary), cell membrane, nucleus (dark-stained circle), and cytoplasm become visible. The large central vacuole appears as a clear area. Cheek (animal) cells appear as irregular, rounded shapes scattered individually. Under methylene blue, the cell membrane, nucleus, and cytoplasm are visible. Animal cells lack a cell wall and large central vacuole. Key differences: Plant cells have a rigid cell wall, large central vacuole, and regular shape. Animal cells have only a cell membrane, small or no vacuoles, and irregular shape. Both cell types have a nucleus, cytoplasm, and cell membrane. This demonstrates that all living things are made of cells (Cell Theory).",
    relatedConcepts: [
      "Cell structure",
      "Plant vs animal cells",
      "Microscopy",
      "Cell Theory"
    ]
  },

  // --- Force and Energy (2 experiments) ---
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
    name: "Energy Conversion - Simple Electric Motor",
    subject: "Physics",
    grade: "Grade 7",
    learningArea: "Integrated Science",
    strand: "Force and Energy",
    aim: "To demonstrate conversion of electrical energy to kinetic (mechanical) energy using a simple motor.",
    materials: [
      "Insulated copper wire (1 metre)",
      "1.5V battery (D cell)",
      "Small bar magnet",
      "Paper clips",
      "Tape",
      "Compass (optional)"
    ],
    procedure: [
      "1. Wind the copper wire around a circular object to create a coil of about 10 loops",
      "2. Leave two straight ends of wire extending from the coil",
      "3. Scrape the insulation off one end completely and half of the other end",
      "4. Create supports using paper clips bent into loops attached to the battery terminals",
      "5. Balance the coil on the paper clip supports so it can spin freely",
      "6. Place the magnet underneath the coil and observe the rotation"
    ],
    safetyNotes: [
      "Be careful when scraping wire insulation - use a blunt object",
      "Do not short-circuit the battery",
      "The wire may get warm - handle with care",
      "Disconnect battery when not in use to prevent overheating"
    ],
    expectedResults: "When the coil is properly balanced and the magnet is placed underneath, the coil begins to spin. This happens because electric current flowing through the wire creates a magnetic field around the coil. This electromagnetic field interacts with the permanent magnet's field, creating a force that pushes the coil. The half-scraped insulation acts as a commutator, ensuring the coil continues spinning in one direction by breaking and restoring the circuit each half-turn. This demonstrates the conversion of electrical energy (from the battery) into kinetic energy (rotation of the coil). The same principle is used in electric motors found in fans, washing machines, electric cars, and many household appliances. If the coil does not spin, check that the wire ends make good contact and the coil is balanced.",
    relatedConcepts: [
      "Energy conversion",
      "Electrical energy",
      "Kinetic energy",
      "Electromagnets"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 8 — Integrated Science
  // Strands: Biology (Reproduction, Ecology), Chemistry (Chemical Reactions, Acids Bases Salts), Physics (Electricity Magnetism, Waves)
  // ═══════════════════════════════════════════════════

  // --- Biology strand ---
  {
    name: "Testing for Starch in Foods",
    subject: "Biology",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Biology",
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
    strand: "Biology",
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
    name: "Flower Dissection and Pollination",
    subject: "Biology",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Biology",
    aim: "To identify the reproductive parts of a flower and understand their roles in pollination.",
    materials: [
      "Fresh flowers (hibiscus or any large, complete flower)",
      "Razor blade or scalpel",
      "Magnifying glass",
      "White paper",
      "Forceps",
      "Tape",
      "Labels"
    ],
    procedure: [
      "1. Observe the whole flower and sketch it from the side",
      "2. Carefully remove and count the sepals (green outer parts) and tape them to paper",
      "3. Remove and count the petals, tape them beside the sepals",
      "4. Identify the stamens (male parts) - count them, note the anther and filament",
      "5. Identify the pistil/carpel (female part) - note the stigma, style, and ovary",
      "6. Carefully cut the ovary in half lengthwise and observe the ovules inside",
      "7. Label all parts on your diagram"
    ],
    safetyNotes: [
      "Handle the razor blade or scalpel with extreme care",
      "Cut away from your body",
      "Do not touch your eyes after handling pollen",
      "Dispose of blades safely"
    ],
    expectedResults: "A complete flower (like hibiscus) contains four whorls of parts arranged from outside to inside: Sepals (calyx) are green leaf-like structures that protect the bud. Petals (corolla) are colorful to attract pollinators (bees, butterflies, birds). Stamens are the male reproductive organs, each consisting of a filament (stalk) topped by an anther that produces pollen grains containing male gametes. The pistil/carpel is the female reproductive organ with a sticky stigma (catches pollen), a style (tube connecting stigma to ovary), and an ovary (contains ovules which develop into seeds after fertilisation). Pollination occurs when pollen is transferred from the anther to the stigma, either by wind, insects, or other animals. Self-pollination occurs within the same flower; cross-pollination occurs between different flowers of the same species and promotes genetic diversity.",
    relatedConcepts: [
      "Reproduction in plants",
      "Pollination",
      "Flower structure",
      "Sexual reproduction"
    ]
  },

  // --- Chemistry strand ---
  {
    name: "Preparing a Salt Solution",
    subject: "Chemistry",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Chemistry",
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
    name: "Acids and Bases in the Kitchen",
    subject: "Chemistry",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Chemistry",
    aim: "To identify acids and bases using homemade red cabbage indicator.",
    materials: [
      "Red cabbage (quarter head)",
      "Boiling water",
      "Strainer",
      "6 clear cups or test tubes",
      "Household substances: lemon juice, vinegar, baking soda solution, soap water, milk, soda water",
      "Labels"
    ],
    procedure: [
      "1. Chop the red cabbage finely and place in a bowl",
      "2. Pour boiling water over the cabbage and let it soak for 15 minutes",
      "3. Strain the liquid - this purple liquid is your indicator",
      "4. Pour equal amounts of indicator into 6 cups",
      "5. Add a different household substance to each cup",
      "6. Observe and record the color changes"
    ],
    safetyNotes: [
      "Teacher should handle boiling water",
      "Do not drink any of the mixtures",
      "Wash hands after handling chemicals",
      "Label all cups clearly"
    ],
    expectedResults: "Red cabbage indicator contains anthocyanin pigments that change color depending on pH. In acidic solutions (pH below 7): the indicator turns pink/red. Lemon juice and vinegar turn the indicator bright pink (strong acids containing citric acid and acetic acid respectively). Soda water turns it light pink (contains carbonic acid). In neutral solutions (pH 7): the indicator remains purple. Milk stays roughly purple (nearly neutral, slightly acidic). In basic/alkaline solutions (pH above 7): the indicator turns blue, green, or yellow. Baking soda solution turns it blue-green (mildly alkaline). Soap water turns it green or yellow (moderately alkaline). This shows that acids and bases are common in everyday life. The pH scale ranges from 0 (strong acid) through 7 (neutral) to 14 (strong base). Acids taste sour and bases feel slippery. When acids and bases combine, they neutralize each other.",
    relatedConcepts: [
      "Acids and bases",
      "Indicators",
      "pH scale",
      "Neutralization"
    ]
  },

  // --- Physics strand ---
  {
    name: "Reflection of Light in Plane Mirrors",
    subject: "Physics",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Physics",
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
      "3. Shine ray at mirror at 30 degrees to normal",
      "4. Mark incident and reflected ray paths",
      "5. Measure angles of incidence and reflection",
      "6. Repeat for angles: 45 degrees, 60 degrees"
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
  {
    name: "Making a Simple Electromagnet",
    subject: "Physics",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    strand: "Physics",
    aim: "To construct a simple electromagnet and investigate factors affecting its strength.",
    materials: [
      "Iron nail (large, 10cm)",
      "Insulated copper wire (2 metres)",
      "1.5V battery (D cell) or battery pack",
      "Paper clips (20+)",
      "Switch (optional)",
      "Compass"
    ],
    procedure: [
      "1. Wind 20 turns of insulated wire around the iron nail, leaving both ends free",
      "2. Connect the wire ends to the battery",
      "3. Bring the nail near paper clips and count how many it picks up",
      "4. Disconnect the battery and observe what happens",
      "5. Increase to 40 turns and repeat the test",
      "6. Try with 2 batteries in series and compare results"
    ],
    safetyNotes: [
      "Do not leave the circuit connected for more than 30 seconds - the wire gets hot",
      "Handle the nail carefully when magnetised",
      "Do not short-circuit the batteries",
      "Disconnect immediately if the wire feels hot"
    ],
    expectedResults: "With 20 turns, the electromagnet picks up approximately 3-5 paper clips. With 40 turns, it picks up approximately 7-10 paper clips, showing that more turns of wire create a stronger magnetic field. With 2 batteries (higher current), the electromagnet picks up even more paper clips (10-15), showing that higher current increases magnetic strength. When the battery is disconnected, the paper clips fall off because the magnetic field disappears - this is the key advantage of electromagnets over permanent magnets: they can be switched on and off. The iron nail becomes a temporary magnet because the electric current flowing through the coil creates a magnetic field that aligns the magnetic domains in the iron. Electromagnets are used in electric bells, scrap metal cranes, MRI machines, electric motors, and speakers.",
    relatedConcepts: [
      "Electromagnetism",
      "Magnetic fields",
      "Electric current",
      "Temporary magnets"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 9 — Integrated Science
  // Strands: Biology (Genetics, Ecology), Chemistry (Organic Chemistry, Rates of Reaction), Physics (Waves, Electricity and Magnetism), Earth and Space
  // ═══════════════════════════════════════════════════

  // --- Biology strand ---
  {
    name: "Osmosis in Plant Cells",
    subject: "Biology",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Biology",
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
    name: "Extracting DNA from Bananas",
    subject: "Biology",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Biology",
    aim: "To extract visible DNA from a banana using household materials.",
    materials: [
      "Ripe banana (half)",
      "Zip-lock bag",
      "Liquid dish soap (1 tablespoon)",
      "Table salt (quarter teaspoon)",
      "Warm water (100ml)",
      "Coffee filter or cheesecloth",
      "Clear glass or test tube",
      "Ice-cold rubbing alcohol (isopropanol)",
      "Wooden stick or toothpick"
    ],
    procedure: [
      "1. Place banana in the zip-lock bag and mash thoroughly for 2 minutes",
      "2. Add warm water, salt, and dish soap to the bag, mix gently for 1 minute",
      "3. Filter the mixture through coffee filter into a clear glass (collect about 2cm of liquid)",
      "4. Tilt the glass and slowly pour ice-cold alcohol down the side to form a layer on top",
      "5. Wait 2-3 minutes without disturbing",
      "6. Observe the white, stringy substance forming between the two layers",
      "7. Use a wooden stick to spool out the DNA"
    ],
    safetyNotes: [
      "Do not drink the alcohol or the mixture",
      "Handle alcohol away from flames - it is flammable",
      "Wash hands thoroughly after the experiment",
      "Teacher should handle the alcohol for younger students"
    ],
    expectedResults: "White, stringy, cloud-like strands become visible at the boundary between the banana mixture and the alcohol layer. These strands are clumps of banana DNA. The dish soap breaks open the cell membranes and nuclear membranes (which are made of lipids/fats) by dissolving them, releasing the cell contents including DNA. The salt causes the DNA strands to clump together by neutralizing the negative charges on the DNA backbone, making the strands stick to each other. The cold alcohol causes the DNA to precipitate (come out of solution) because DNA is not soluble in alcohol. Individual DNA molecules are too small to see, but millions of DNA strands clumped together become visible as the white stringy material. Every living cell contains DNA, which carries the genetic instructions for building and maintaining the organism. Bananas are ideal for this experiment because they are soft, easy to mash, and have large amounts of DNA (bananas are polyploid - they have multiple copies of each chromosome).",
    relatedConcepts: [
      "DNA structure",
      "Genetics",
      "Cell structure",
      "Hereditary material"
    ]
  },

  // --- Chemistry strand ---
  {
    name: "Acids and Bases - pH Testing",
    subject: "Chemistry",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Chemistry",
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
    name: "Rates of Reaction - Effervescent Tablets",
    subject: "Chemistry",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Chemistry",
    aim: "To investigate how temperature affects the rate of a chemical reaction.",
    materials: [
      "Effervescent tablets (e.g., vitamin C tablets) x 3",
      "3 beakers (250ml)",
      "Cold water (from fridge)",
      "Room temperature water",
      "Hot water (about 60 degrees C)",
      "Thermometer",
      "Stopwatch",
      "Measuring cylinder"
    ],
    procedure: [
      "1. Measure 200ml of cold water into beaker A and record the temperature",
      "2. Measure 200ml of room temperature water into beaker B and record the temperature",
      "3. Measure 200ml of hot water into beaker C and record the temperature",
      "4. Drop one tablet into beaker A, start the stopwatch",
      "5. Record the time until the tablet completely dissolves (no more fizzing)",
      "6. Repeat for beakers B and C with fresh tablets"
    ],
    safetyNotes: [
      "Handle hot water carefully to avoid burns",
      "Do not drink the solutions",
      "Use a thermometer carefully - do not shake it",
      "Clean up any spills immediately"
    ],
    expectedResults: "The tablet dissolves fastest in hot water (approximately 30-60 seconds), moderately fast in room temperature water (approximately 90-120 seconds), and slowest in cold water (approximately 180-300 seconds). This demonstrates that increasing temperature increases the rate of reaction. The scientific explanation is the collision theory: at higher temperatures, water molecules have more kinetic energy, they move faster and collide with the tablet more frequently and with greater force. More collisions with sufficient energy (exceeding the activation energy) means more successful reactions per second. As a rule of thumb, for every 10 degrees C increase in temperature, the reaction rate roughly doubles. The fizzing is caused by carbon dioxide gas being produced when the acid in the tablet reacts with the carbonate: acid + carbonate -> salt + water + CO2. This principle applies to cooking (food cooks faster at higher temperatures), food preservation (refrigeration slows spoilage reactions), and industrial chemistry.",
    relatedConcepts: [
      "Rates of reaction",
      "Collision theory",
      "Temperature and reactions",
      "Activation energy"
    ]
  },

  // --- Physics strand ---
  {
    name: "Simple Pendulum - Period Investigation",
    subject: "Physics",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Physics",
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
      "2. Displace bob by 10 degrees and release",
      "3. Time 10 complete oscillations",
      "4. Calculate period (T = total time / 10)",
      "5. Repeat with lengths: 80cm, 60cm, 40cm, 20cm",
      "6. Record results in table"
    ],
    safetyNotes: [
      "Ensure clamp is tight to prevent falling",
      "Clear the swing area before starting",
      "Use small displacement angle (less than 15 degrees)",
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
    strand: "Physics",
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

  // --- Earth and Space strand ---
  {
    name: "Soil Analysis - Water Retention",
    subject: "Biology",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Earth and Space",
    aim: "To compare the water retention capacity of different soil types found in Kenya.",
    materials: [
      "3 plastic funnels",
      "3 beakers (250ml)",
      "Cotton wool or muslin cloth",
      "Sandy soil (50g)",
      "Clay soil (50g)",
      "Loam soil (50g)",
      "Measuring cylinder",
      "Water (300ml)",
      "Stopwatch",
      "Retort stand"
    ],
    procedure: [
      "1. Place cotton wool at the bottom of each funnel to prevent soil falling through",
      "2. Add 50g of each soil type to separate funnels",
      "3. Place each funnel over a beaker on the retort stand",
      "4. Pour 100ml of water into each funnel simultaneously",
      "5. Start the stopwatch and record when water first drips through",
      "6. After 15 minutes, measure the volume of water collected in each beaker",
      "7. Calculate the volume of water retained by each soil type"
    ],
    safetyNotes: [
      "Wash hands after handling soil samples",
      "Handle glassware carefully",
      "Keep work area clean and dry",
      "Dispose of soil properly after the experiment"
    ],
    expectedResults: "Sandy soil: Water drips through quickly (within 30-60 seconds) and most water is collected in the beaker (70-90ml out of 100ml). Sandy soil has large particles with big air spaces between them, so water drains freely. Water retained: only 10-30ml. Clay soil: Water takes much longer to drip through (3-5 minutes before first drop) and very little water is collected (10-30ml). Clay has tiny particles that pack closely together, trapping water in the small spaces. Water retained: 70-90ml. Loam soil: Water drips through at a moderate rate (1-2 minutes) and a moderate volume is collected (40-60ml). Loam is a mixture of sand, silt, and clay with organic matter (humus), providing a balance of drainage and retention. Water retained: 40-60ml. Loam is the best soil for farming because it retains enough water for plant roots while allowing excess water to drain, preventing waterlogging. In Kenya, different regions have different soil types: the highland areas often have fertile loam soils (red volcanic soils), while arid regions like Turkana have sandy soils with poor water retention, affecting agriculture and food security.",
    relatedConcepts: [
      "Soil types",
      "Water retention",
      "Agriculture",
      "Earth science"
    ]
  },
  {
    name: "Measuring Density of Regular and Irregular Objects",
    subject: "Physics",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Physics",
    aim: "To determine the density of regular and irregular solid objects using displacement method.",
    materials: [
      "Measuring cylinder (100ml)",
      "Electronic balance",
      "Water",
      "Regular objects: wooden block, metal cube",
      "Irregular objects: stone, key, marble",
      "Ruler",
      "Calculator",
      "String"
    ],
    procedure: [
      "1. Measure and record the mass of each object using the electronic balance",
      "2. For regular objects: measure length, width, and height with a ruler, then calculate volume (V = l x w x h)",
      "3. For irregular objects: fill measuring cylinder with water to a known level (e.g., 50ml)",
      "4. Carefully lower the irregular object into the water using a string",
      "5. Record the new water level. Volume of object = new level - original level",
      "6. Calculate density for each object: Density = Mass / Volume",
      "7. Predict whether each object will float or sink in water based on density"
    ],
    safetyNotes: [
      "Handle glassware carefully",
      "Lower objects gently into water to avoid splashing",
      "Dry objects before measuring mass",
      "Ensure measuring cylinder is on a flat surface when reading"
    ],
    expectedResults: "The wooden block has a density less than 1 g/cm3 (typically 0.5-0.8 g/cm3), confirming why wood floats in water. The metal cube has a density much greater than 1 g/cm3 (iron approximately 7.9 g/cm3, aluminium approximately 2.7 g/cm3), explaining why metals sink. The stone has a density of approximately 2.5-3.0 g/cm3. The key (made of brass or steel) has a density of approximately 7-8 g/cm3. Objects with density greater than 1 g/cm3 (the density of water) sink; those with density less than 1 g/cm3 float. The displacement method works because the volume of water displaced equals the volume of the submerged object, based on Archimedes' principle. Sources of error include trapped air bubbles on the object's surface, parallax error when reading the cylinder, and water droplets remaining on the object when measuring mass. Density is an important property in engineering (selecting materials for bridges and aircraft), geology (understanding rock layers), and everyday life (cooking oils float on water because oil is less dense).",
    relatedConcepts: [
      "Density",
      "Displacement method",
      "Archimedes' principle",
      "Mass and volume"
    ]
  },
  {
    name: "Chromatography - Separating Ink Pigments",
    subject: "Chemistry",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Chemistry",
    aim: "To separate the pigments in ink using paper chromatography.",
    materials: [
      "Chromatography paper or filter paper strips",
      "Water-soluble felt tip pens (black, green, brown)",
      "Beaker (250ml)",
      "Water",
      "Pencil",
      "Ruler",
      "Paper clips",
      "Wooden rod or pencil to suspend paper"
    ],
    procedure: [
      "1. Cut chromatography paper into strips (2cm wide x 15cm long)",
      "2. Draw a pencil line 2cm from the bottom of each strip (the origin line)",
      "3. Place a dot of each different colored ink on separate strips on the origin line",
      "4. Pour water into the beaker to a depth of about 1cm",
      "5. Suspend each strip in the beaker so the bottom just touches the water (ink dot above water level)",
      "6. Wait 20-30 minutes as water rises up the paper (capillary action)",
      "7. Remove when water front is near the top, mark the solvent front, and let dry"
    ],
    safetyNotes: [
      "Handle ink carefully to avoid staining clothes",
      "Do not disturb the beaker while chromatography is running",
      "Use pencil (not pen) for the origin line so it does not dissolve",
      "Work on newspaper to protect surfaces"
    ],
    expectedResults: "Black ink separates into multiple pigments - typically blue, red, and yellow bands visible on the paper, proving that black ink is a mixture of several different dyes. Green ink separates into blue and yellow pigments. Brown ink typically separates into red, yellow, and sometimes blue components. The separation occurs because different pigments have different solubilities in water and different attractions to the paper fibers. Pigments that are more soluble in water and less attracted to the paper travel further up the strip. Each pigment can be identified by its Rf (Retention factor) value: Rf = distance traveled by pigment / distance traveled by solvent front. The Rf value is constant for a given substance under the same conditions, making it useful for identification. Paper chromatography is used in forensic science (analyzing ink on forged documents), food science (checking food dye composition), and biochemistry (separating amino acids and proteins). This technique demonstrates that many substances we think of as 'pure' are actually mixtures.",
    relatedConcepts: [
      "Chromatography",
      "Mixtures and separation",
      "Solubility",
      "Rf values"
    ]
  },
  {
    name: "Electrolysis of Water",
    subject: "Chemistry",
    grade: "Grade 9",
    learningArea: "Integrated Science",
    strand: "Chemistry",
    aim: "To decompose water into hydrogen and oxygen gases using electrolysis.",
    materials: [
      "9V battery",
      "2 graphite electrodes (pencil leads)",
      "Beaker (250ml)",
      "Dilute sulfuric acid (or sodium sulfate solution as electrolyte)",
      "2 test tubes",
      "Connecting wires with crocodile clips",
      "Wooden splint",
      "Matches"
    ],
    procedure: [
      "1. Fill the beaker with water and add a few drops of dilute sulfuric acid (to make water conduct)",
      "2. Connect each graphite electrode to a terminal of the 9V battery using wires",
      "3. Submerge both electrodes in the water, keeping them apart",
      "4. Observe the bubbles forming at each electrode",
      "5. Collect gas from each electrode by inverting water-filled test tubes over them",
      "6. Test the gas at the negative electrode (cathode) with a burning splint",
      "7. Test the gas at the positive electrode (anode) with a glowing splint"
    ],
    safetyNotes: [
      "Dilute sulfuric acid is corrosive - teacher should handle it",
      "Wear safety goggles",
      "Hydrogen gas is flammable - keep flames away until testing",
      "Do not touch the electrodes while the circuit is connected",
      "Perform in a well-ventilated area"
    ],
    expectedResults: "Bubbles form at both electrodes, but approximately twice as many bubbles appear at the cathode (negative electrode) compared to the anode (positive electrode). At the cathode: Hydrogen gas is collected. When tested with a burning splint, it burns with a squeaky 'pop' sound, confirming it is hydrogen. At the anode: Oxygen gas is collected. When a glowing splint is placed in the gas, it relights, confirming it is oxygen. The 2:1 ratio of hydrogen to oxygen confirms the chemical formula of water: H2O. The balanced equation is: 2H2O(l) -> 2H2(g) + O2(g). This is a decomposition reaction that requires electrical energy input. The sulfuric acid acts as an electrolyte - it does not get used up but makes the water conduct electricity by providing mobile ions. Electrolysis is used industrially to produce hydrogen fuel, extract reactive metals like aluminium from their ores, and electroplate metals. This experiment also demonstrates that chemical compounds can be broken down into simpler substances using energy.",
    relatedConcepts: [
      "Electrolysis",
      "Decomposition reactions",
      "Chemical formulae",
      "Electrodes and electrolytes"
    ]
  },

  // ═══════════════════════════════════════════════════
  // GRADE 10 — Separate Sciences
  // Biology: Cell Biology, Plant Anatomy, Animal Anatomy
  // Chemistry: Matter Classification, Chemical Bonding/Reactions
  // Physics: Measurements/Forces, Energy/Heat, Waves/Optics
  // ═══════════════════════════════════════════════════

  // --- Chemistry ---
  {
    name: "Displacement Reaction - Metals",
    subject: "Chemistry",
    grade: "Grade 10",
    learningArea: "Chemistry",
    strand: "Chemical Bonding and Reactions",
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
    name: "Titration - Acid-Base Neutralization",
    subject: "Chemistry",
    grade: "Grade 10",
    learningArea: "Chemistry",
    strand: "Chemical Bonding and Reactions",
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
    name: "Flame Tests - Identifying Metal Ions",
    subject: "Chemistry",
    grade: "Grade 10",
    learningArea: "Chemistry",
    strand: "Matter and Its Classification",
    aim: "To identify different metal ions by the characteristic colours they produce in a flame.",
    materials: [
      "Nichrome wire loop (or wooden splints soaked in solutions)",
      "Bunsen burner",
      "Hydrochloric acid (dilute, for cleaning wire)",
      "Watch glasses",
      "Metal salt solutions: sodium chloride, potassium chloride, calcium chloride, copper sulfate, lithium chloride"
    ],
    procedure: [
      "1. Clean the nichrome wire by dipping in dilute HCl then heating in the flame until no color is produced",
      "2. Dip the clean wire into the first metal salt solution",
      "3. Hold the wire in the blue cone of the Bunsen flame",
      "4. Observe and record the flame color",
      "5. Clean the wire thoroughly between each test",
      "6. Repeat for each metal salt"
    ],
    safetyNotes: [
      "Tie back long hair and secure loose clothing near flames",
      "Use tongs to hold the wire - it gets very hot",
      "Hydrochloric acid is corrosive - handle with care",
      "Do not lean over the flame"
    ],
    expectedResults: "Each metal ion produces a distinctive flame color: Sodium (Na+) produces a strong, persistent yellow/orange flame - this is the most common and can mask other colors. Potassium (K+) produces a lilac/pale purple flame - best seen through blue cobalt glass to filter out any sodium contamination. Calcium (Ca2+) produces a brick-red/orange-red flame. Copper (Cu2+) produces a vivid blue-green flame. Lithium (Li+) produces a bright crimson/red flame. These colors occur because when heated, electrons in the metal atoms absorb energy and jump to higher energy levels (excited state). When they fall back to their ground state, they release the energy as light of a specific wavelength (color). Each element has unique energy levels, so each produces a unique color. This is the basis of emission spectroscopy, used to identify elements in unknown samples, in fireworks manufacturing (copper for blue, sodium for yellow, strontium for red), and in astronomy to determine the composition of distant stars.",
    relatedConcepts: [
      "Atomic structure",
      "Electron energy levels",
      "Emission spectra",
      "Metal ions"
    ]
  },

  // --- Physics ---
  {
    name: "Electrical Circuits - Series and Parallel",
    subject: "Physics",
    grade: "Grade 10",
    learningArea: "Physics",
    strand: "Measurements and Forces",
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
    name: "Specific Heat Capacity - Comparing Water and Oil",
    subject: "Physics",
    grade: "Grade 10",
    learningArea: "Physics",
    strand: "Energy and Heat",
    aim: "To compare the specific heat capacities of water and cooking oil by heating equal masses.",
    materials: [
      "2 beakers (250ml)",
      "Water (100ml)",
      "Cooking oil (100ml)",
      "2 thermometers",
      "Bunsen burner or hot plate",
      "Stopwatch",
      "Electronic balance",
      "Stirring rods"
    ],
    procedure: [
      "1. Measure 100g of water into one beaker and 100g of cooking oil into another",
      "2. Record the initial temperature of both liquids",
      "3. Heat both beakers simultaneously on identical heat sources",
      "4. Stir gently and record the temperature every minute for 10 minutes",
      "5. Plot temperature against time for both liquids on the same graph",
      "6. Compare the rate of temperature increase"
    ],
    safetyNotes: [
      "Hot oil can cause severe burns - handle with extreme care",
      "Do not heat oil above 100 degrees C (it may smoke or catch fire)",
      "Keep a damp cloth nearby in case of oil spills on hot surfaces",
      "Never add water to hot oil"
    ],
    expectedResults: "The cooking oil heats up approximately twice as fast as water. After 10 minutes, the oil may reach 60-70 degrees C while water reaches only 35-45 degrees C (depending on heat source). This demonstrates that water has a much higher specific heat capacity (4,200 J/kg/degrees C) compared to oil (approximately 2,000 J/kg/degrees C). Specific heat capacity is the amount of energy needed to raise the temperature of 1 kg of a substance by 1 degree C. Water requires more energy per degree because hydrogen bonds between water molecules absorb significant energy before the temperature rises. This property makes water an excellent coolant (used in car radiators and power plants) and explains why coastal areas have milder climates than inland areas - the ocean absorbs and releases heat slowly, moderating temperature changes. The energy equation is: Q = mc(change in T), where Q is heat energy (Joules), m is mass (kg), c is specific heat capacity, and change in T is the temperature change.",
    relatedConcepts: [
      "Specific heat capacity",
      "Heat energy",
      "Temperature",
      "Thermal properties"
    ]
  },

  // --- Biology ---
  {
    name: "Diffusion in Liquids and Gases",
    subject: "Biology",
    grade: "Grade 10",
    learningArea: "Biology",
    strand: "Cell Biology and Biodiversity",
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
  },
  {
    name: "Refraction of Light Through a Glass Block",
    subject: "Physics",
    grade: "Grade 10",
    learningArea: "Physics",
    strand: "Waves and Optics",
    aim: "To investigate how light refracts when passing through a rectangular glass block.",
    materials: [
      "Rectangular glass block",
      "Ray box or torch with single slit",
      "White paper (A4)",
      "Protractor",
      "Pencil",
      "Ruler",
      "Pins (4)"
    ],
    procedure: [
      "1. Place the glass block in the centre of the paper and trace its outline",
      "2. Draw a normal line perpendicular to one face of the block",
      "3. Direct a ray of light at the glass block at an angle of incidence of 30 degrees",
      "4. Mark the incident ray, the ray inside the glass, and the emergent ray using pins",
      "5. Remove the glass block and draw all the rays",
      "6. Measure the angle of refraction inside the glass",
      "7. Repeat for angles of 40, 50, and 60 degrees"
    ],
    safetyNotes: [
      "Handle the glass block carefully to avoid dropping",
      "Do not shine light into anyone's eyes",
      "Pins are sharp - handle with care",
      "Work in a darkened room for better visibility"
    ],
    expectedResults: "When light enters the glass block (denser medium), it bends toward the normal - the angle of refraction is always less than the angle of incidence. For example, at 30 degrees incidence, refraction is approximately 19 degrees; at 60 degrees incidence, refraction is approximately 35 degrees. When light exits the glass block (into less dense air), it bends away from the normal. The emergent ray is parallel to the incident ray but displaced sideways (lateral displacement). This confirms Snell's Law: n1 sin(i) = n2 sin(r), where n is the refractive index. The refractive index of glass is approximately 1.5. Plotting sin(i) against sin(r) gives a straight line whose gradient equals the refractive index. Refraction occurs because light travels slower in glass than in air. This principle explains how lenses work in spectacles, cameras, microscopes, and telescopes. It also explains why objects appear bent when partially submerged in water.",
    relatedConcepts: [
      "Refraction",
      "Snell's Law",
      "Refractive index",
      "Waves and optics"
    ]
  },
  {
    name: "Enzyme Activity - Effect of Temperature on Amylase",
    subject: "Biology",
    grade: "Grade 10",
    learningArea: "Biology",
    strand: "Cell Biology and Biodiversity",
    aim: "To investigate how temperature affects the rate of enzyme activity using amylase and starch.",
    materials: [
      "Amylase solution (1%)",
      "Starch solution (1%)",
      "Iodine solution",
      "Spotting tile (white)",
      "Test tubes (5)",
      "Water baths at 20, 37, 60, and 80 degrees C",
      "Ice bath (0 degrees C)",
      "Stopwatch",
      "Droppers",
      "Thermometer"
    ],
    procedure: [
      "1. Place drops of iodine solution in rows on the spotting tile",
      "2. Place 5ml of starch solution and 1ml of amylase in separate test tubes",
      "3. Place both tubes in the 20 degrees C water bath for 2 minutes to equilibrate",
      "4. Mix the amylase into the starch solution and start the stopwatch",
      "5. Every 30 seconds, remove a drop and add to iodine on the tile",
      "6. Record the time when iodine no longer turns blue-black (starch fully digested)",
      "7. Repeat at 0, 37, 60, and 80 degrees C"
    ],
    safetyNotes: [
      "Handle hot water baths with care",
      "Iodine stains skin and clothes",
      "Wear safety goggles",
      "Do not mouth-pipette any solutions"
    ],
    expectedResults: "At 0 degrees C (ice bath): Very slow or no reaction. The iodine still turns blue-black after 10+ minutes because the enzyme is too cold to function efficiently - molecules have insufficient kinetic energy for frequent enzyme-substrate collisions. At 20 degrees C: Moderate reaction speed, starch digested in approximately 6-8 minutes. At 37 degrees C (body temperature): Fastest reaction - starch fully digested in approximately 2-4 minutes. This is the optimum temperature for amylase because it is a human enzyme adapted to work at body temperature. At 60 degrees C: Slower than 37 degrees C, starch digested in approximately 8-12 minutes or not at all. The enzyme is beginning to denature (lose its 3D shape). At 80 degrees C: No reaction occurs. The iodine continues to turn blue-black because the enzyme is completely denatured - the active site has changed shape permanently and can no longer bind to starch. The results produce a bell-shaped curve when rate is plotted against temperature, with a clear peak at approximately 37 degrees C. This demonstrates the lock-and-key model of enzyme action and explains why fever (high body temperature) is dangerous - it can denature essential enzymes.",
    relatedConcepts: [
      "Enzymes",
      "Denaturation",
      "Optimum temperature",
      "Lock and key model"
    ]
  },
  {
    name: "Preparation of Carbon Dioxide Gas",
    subject: "Chemistry",
    grade: "Grade 10",
    learningArea: "Chemistry",
    strand: "Chemical Bonding and Reactions",
    aim: "To prepare, collect, and test the properties of carbon dioxide gas.",
    materials: [
      "Marble chips (calcium carbonate)",
      "Dilute hydrochloric acid",
      "Conical flask with delivery tube",
      "Gas jar",
      "Bee-hive shelf and trough",
      "Lime water (calcium hydroxide solution)",
      "Burning splint",
      "Universal indicator solution"
    ],
    procedure: [
      "1. Place marble chips in the conical flask",
      "2. Add dilute hydrochloric acid and quickly fit the delivery tube",
      "3. Collect the gas by downward delivery (CO2 is denser than air) or over water",
      "4. Test: Insert a burning splint into the gas jar",
      "5. Test: Pour the gas into a jar containing a burning candle",
      "6. Test: Bubble the gas through lime water",
      "7. Test: Add a few drops of universal indicator to water, then bubble CO2 through it"
    ],
    safetyNotes: [
      "Hydrochloric acid is corrosive - wear goggles and gloves",
      "Do not inhale the gas directly",
      "Work in a well-ventilated area",
      "Handle glassware carefully"
    ],
    expectedResults: "The reaction produces vigorous fizzing as CO2 gas is released. Equation: CaCO3(s) + 2HCl(aq) -> CaCl2(aq) + H2O(l) + CO2(g). Test results: (1) Burning splint: The flame goes out immediately, proving CO2 does not support combustion. (2) Candle test: When CO2 is poured over a burning candle, the flame is extinguished because CO2 is denser than air and displaces the oxygen. This is why CO2 fire extinguishers work. (3) Lime water: Turns milky/cloudy white when CO2 is bubbled through it, due to formation of insoluble calcium carbonate: Ca(OH)2 + CO2 -> CaCO3 + H2O. This is the standard test for CO2. (4) Universal indicator: The green indicator turns yellow/orange, showing that CO2 dissolved in water forms carbonic acid (H2CO3), making the solution acidic (pH approximately 4-5). This explains ocean acidification - as atmospheric CO2 increases from burning fossil fuels, more dissolves in seawater, lowering pH and threatening marine organisms with calcium carbonate shells (corals, shellfish).",
    relatedConcepts: [
      "Gas preparation",
      "Properties of CO2",
      "Acid-carbonate reactions",
      "Climate change"
    ]
  },
  {
    name: "Testing Leaves for Starch - Photosynthesis",
    subject: "Biology",
    grade: "Grade 10",
    learningArea: "Biology",
    strand: "Anatomy and Physiology of Plants",
    aim: "To demonstrate that light is necessary for photosynthesis by testing a variegated leaf for starch.",
    materials: [
      "Variegated plant (e.g., Coleus or variegated geranium) exposed to sunlight for 2 days",
      "Beaker",
      "Boiling water",
      "Ethanol (methylated spirit)",
      "Water bath (or large beaker with hot water)",
      "Iodine solution",
      "White tile",
      "Forceps"
    ],
    procedure: [
      "1. Pick a variegated leaf and draw its pattern showing green and white/yellow areas",
      "2. Boil the leaf in water for 2 minutes to kill cells and stop reactions",
      "3. Place the leaf in warm ethanol (in a water bath, NOT direct heat) until it turns white",
      "4. Rinse the decolorized leaf in warm water to soften it",
      "5. Spread the leaf on a white tile and add iodine solution to cover it",
      "6. After 2 minutes, rinse gently and observe the color pattern"
    ],
    safetyNotes: [
      "Ethanol is highly flammable - NEVER heat directly over a flame",
      "Always use a water bath to heat ethanol",
      "Wear safety goggles",
      "Handle boiling water with care using forceps"
    ],
    expectedResults: "After iodine treatment, the areas of the leaf that were green (containing chlorophyll) turn blue-black, indicating the presence of starch. The areas that were white or yellow (lacking chlorophyll) remain brown/yellow, indicating no starch. This proves that chlorophyll is essential for photosynthesis - only cells with chlorophyll can produce glucose (which is then stored as starch). The ethanol step removes the green chlorophyll pigment so that the iodine color change is clearly visible. Boiling kills the cells to prevent further chemical reactions. The equation for photosynthesis is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. Chlorophyll absorbs light energy and uses it to convert carbon dioxide and water into glucose and oxygen. This experiment can be extended to show that light is also necessary: if part of a leaf is covered with aluminium foil for 2 days, the covered part will not produce starch even though it has chlorophyll.",
    relatedConcepts: [
      "Photosynthesis",
      "Chlorophyll",
      "Starch test",
      "Plant nutrition"
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
