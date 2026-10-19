import assert from "node:assert/strict";
import test from "node:test";
import { isTranscribedCurriculumArea } from "../lib/curriculum/transcribed-curriculum";
import { grade10AppliedAgricultureData } from "../prisma/seed/data/grade-10-applied-agriculture";
import { grade10AviationTechnologyData } from "../prisma/seed/data/grade-10-aviation-technology";
import { grade10BuildingConstructionData } from "../prisma/seed/data/grade-10-building-construction";
import { grade10ArabicData } from "../prisma/seed/data/grade-10-arabic";
import { grade10KiswahiliData } from "../prisma/seed/data/grade-10-kiswahili";
import { grade10GermanData } from "../prisma/seed/data/grade-10-german";
import { grade10MandarinChineseData } from "../prisma/seed/data/grade-10-mandarin-chinese";
import { grade10MetalTechnologyData } from "../prisma/seed/data/grade-10-metal-technology";
import { grade10MusicAndDanceData } from "../prisma/seed/data/grade-10-music-and-dance";
import { grade10TheatreAndFilmData } from "../prisma/seed/data/grade-10-theatre-and-film";
import { grade10FasihiYaKiswahiliData } from "../prisma/seed/data/grade-10-fasihi-ya-kiswahili";
import { grade10LiteratureInEnglishData } from "../prisma/seed/data/grade-10-literature-in-english";
import { grade10WoodTechnologyData } from "../prisma/seed/data/grade-10-wood-technology";
import { grade10BiologyData } from "../prisma/seed/data/grade-10-biology";
import { grade10BusinessStudiesData } from "../prisma/seed/data/grade-10-business-studies";
import { grade10ChemistryData } from "../prisma/seed/data/grade-10-chemistry";
import { grade10ComputerScienceData } from "../prisma/seed/data/grade-10-computer-science";
import { grade10InformationAndCommunicationTechnologyData } from "../prisma/seed/data/grade-10-information-and-communication-technology";
import { grade10EnglishData } from "../prisma/seed/data/grade-10-english";
import { grade10HistoryAndCitizenshipData } from "../prisma/seed/data/grade-10-history-and-citizenship";
import { grade10HomeScienceData } from "../prisma/seed/data/grade-10-home-science";
import { grade10IslamicReligiousEducationData } from "../prisma/seed/data/grade-10-islamic-religious-education";
import { grade10HinduReligiousEducationData } from "../prisma/seed/data/grade-10-hindu-religious-education";
import { grade10GeographyData } from "../prisma/seed/data/grade-10-geography";
import { grade10GeneralScienceData } from "../prisma/seed/data/grade-10-general-science";
import { grade10MathematicsData } from "../prisma/seed/data/grade-10-mathematics";
import { grade10PhysicsData } from "../prisma/seed/data/grade-10-physics";
import { grade10SportsAndRecreationData } from "../prisma/seed/data/grade-10-sports-and-recreation";
import { grade10Data } from "../prisma/seed/data/grade-10";

function summarize(area: (typeof grade10Data.learningAreas)[number]) {
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const outcomes = subStrands.flatMap((subStrand) => subStrand.slos);

  return {
    strands: area.strands.length,
    subStrands: subStrands.length,
    lessons: subStrands.reduce(
      (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
      0
    ),
    outcomes: outcomes.length,
    commas: outcomes.filter((outcome) => outcome.description.endsWith(",")).length,
    periods: outcomes.filter((outcome) => outcome.description.endsWith(".")).length,
    semicolons: outcomes.filter((outcome) => outcome.description.endsWith(";")).length,
    colons: outcomes.filter((outcome) => outcome.description.endsWith(":")).length,
    unpunctuated: outcomes
      .filter((outcome) => !/[,.;:]$/.test(outcome.description))
      .map((outcome) => outcome.description),
  };
}

test("Grade 10 Computer Science retains the reviewed curriculum totals", () => {
  assert.deepEqual(summarize(grade10ComputerScienceData.learningAreas[0]), {
    strands: 3,
    subStrands: 17,
    lessons: 180,
    outcomes: 78,
    commas: 54,
    periods: 16,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "Identify early computing devices and how they relate to evolution of electronic computers",
      "define basic data communications concepts",
      "define basic concepts used in data transmission",
      "identify different types of computer networks",
      "differentiate between physical and logical network topologies",
      "appreciate the importance of using algorithms in problem solving",
      "select program control structure for a given situation",
      "discuss the scope of variables and parameter passing between functions",
    ],
  });
});

test("Grade 10 Information and Communication Technology retains detailed-table totals", () => {
  assert.deepEqual(
    summarize(grade10InformationAndCommunicationTechnologyData.learningAreas[0]),
    {
      strands: 3,
      subStrands: 9,
      lessons: 60,
      outcomes: 44,
      commas: 17,
      periods: 10,
      semicolons: 0,
      colons: 0,
      unpunctuated: [
        "explain the importance of word processing in document production",
        "appreciate the emerging trends in presentation productivity tools",
        "explain the importance of desktop publishing tools in document publication",
        "explain the purpose of the internet in the society",
        "explore the common services offered through the internet for various needs and interests",
        "use search engine to gather relevant information",
        "use email application to communicate with peers",
        "appreciate the positive impacts of the internet on society",
        "identify online platforms used to support digital communication",
        "use digital online platforms to communicate",
        "use online forums to collaborate and share content",
        "appreciate the impact of Artificial Intelligence (AI) in digital communication platforms",
        "explore the importance of being a good digital citizen in an online environment",
        "identify appropriate netiquette behaviours in an online environment",
        "observe appropriate netiquette behaviours in an online environment",
        "observe healthy practices when using ICT technologies",
        "appreciate the importance of responsible use of technologies",
      ],
    }
  );
});

test("Grade 10 Sports and Recreation retains the reviewed curriculum totals", () => {
  assert.deepEqual(summarize(grade10SportsAndRecreationData.learningAreas[0]), {
    strands: 3,
    subStrands: 13,
    lessons: 180,
    outcomes: 51,
    commas: 37,
    periods: 13,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "classify the sports injuries commonly sustained by athletes",
    ],
  });
});

test("Grade 10 Mathematics retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10MathematicsData.learningAreas[0]), {
    strands: 3,
    subStrands: 14,
    lessons: 178,
    outcomes: 98,
    commas: 67,
    periods: 11,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "relate index notation to logarithm notation to base 10",
      "relate linear scale factor, area scale factor, and volume scale factor in enlargements",
      "determine the properties of reflection in different situations",
      "apply trigonometric ratios to angles of elevation and depression",
      "reflect on the use of trigonometry in real-life situations",
      "explain vector and scalar quantities with illustrations",
      "use vector notations in different ways",
      "represent vectors geometrically in different situations",
      "identify equivalent vectors in different situations",
      "add vectors in different situations",
      "multiply vectors by scalars",
      "determine column vectors in different situations",
      "determine position vectors in different situations",
      "work out magnitude of a vector in different situations",
      "determine the midpoint of a vector in different situations",
      "determine translation vector as a transformation",
      "appreciate the use of vectors in real life situations",
      "generate probability space of different events",
      "determine the probability of mutually exclusive and independent events",
      "determine the probability of independent events using tree diagrams",
    ],
  });
});

test("Grade 10 History and Citizenship retains the reviewed curriculum totals", () => {
  assert.deepEqual(summarize(grade10HistoryAndCitizenshipData.learningAreas[0]), {
    strands: 4,
    subStrands: 19,
    lessons: 180,
    outcomes: 87,
    commas: 50,
    periods: 16,
    semicolons: 12,
    colons: 0,
    unpunctuated: [
      "examine the development of selected early civilizations in Africa",
      "Desire to discourage global wars for sustainable peace",
      "classify the causes of the French revolutions",
      "exploit the opportunities provided by the 4Th Industrial revolution for promotion of growth and sustainability in the society",
      "appreciate the importance of technology in life",
      "analyse factors that promote equity and non-discrimination in the society",
      "identify historical injustice in the society that promote inequality and discrimination",
      "develop measures that promote equity and non-discrimination in the society",
      "desire to promote equity and non-discrimination in the society",
    ],
  });
});

test("Grade 10 Biology retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10BiologyData.learningAreas[0]), {
    strands: 3,
    subStrands: 10,
    lessons: 180,
    outcomes: 48,
    commas: 38,
    periods: 10,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Biology preserves detailed-table names and lesson allocations", () => {
  const area = grade10BiologyData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Biology");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "CELL BIOLOGY AND BIODIVERSITY",
      "ANATOMY AND PHYSIOLOGY OF PLANTS",
      "ANATOMY AND PHYSIOLOGY OF ANIMALS",
    ]
  );
  assert.equal(subStrands[1].name, "Specimen Collection and Preservation");
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [6, 14, 30, 28, 12, 18, 22, 12, 14, 24]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Biology p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Chemistry retains the supported detailed-table curriculum", () => {
  assert.deepEqual(summarize(grade10ChemistryData.learningAreas[0]), {
    strands: 2,
    subStrands: 7,
    lessons: 172,
    outcomes: 32,
    commas: 22,
    periods: 8,
    semicolons: 2,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Chemistry excludes the unsupported summary-only strand", () => {
  const area = grade10ChemistryData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Chemistry");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["INORGANIC CHEMISTRY", "PHYSICAL CHEMISTRY"]
  );
  assert.equal(area.strands.some((strand) => strand.name === "ORGANIC CHEMISTRY"), false);
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [6, 24, 28, 24, 32, 28, 30]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Chemistry p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Physics retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10PhysicsData.learningAreas[0]), {
    strands: 4,
    subStrands: 13,
    lessons: 177,
    outcomes: 74,
    commas: 45,
    periods: 14,
    semicolons: 0,
    colons: 1,
    unpunctuated: [
      "determine the center of gravity of regular and irregular objects",
      "verify the principle of moments in turning of objects",
      "describe torque and couple in turning objects",
      "identify the types and properties of radioactive emissions in nature",
      "demonstrate the detection of radioactive emissions in nature",
      "appreciate the applications and safety precautions of radioactivity in real life",
      "describe methods of charging a conductor",
      "illustrate charge distribution on conductors of various shapes",
      "explain the meaning of insulator, conductor, semiconductor, and superconductor",
      "explain the formation of n-type and p-type semiconductors from intrinsic semiconductors",
      "describe the applications of conductors, semiconductors, insulators and superconductors in day-to-day life",
      "appreciate the applications of conductors, semiconductors, insulators and superconductors in day-to-day life",
      "describe the mitigating factors against climate change in the environment",
      "outline the evolution of astrophysics and space exploration, in space physics",
    ],
  });
});

test("Grade 10 Physics preserves detailed-table data and the visual formula", () => {
  const area = grade10PhysicsData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const pressure = subStrands.find((subStrand) => subStrand.name === "Pressure");

  assert.equal(area.name, "Physics");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "MECHANICS AND THERMAL PHYSICS",
      "WAVES AND OPTICS",
      "ELECTRICITY AND MAGNETISM",
      "Environmental and Space Physics",
    ]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [6, 25, 10, 10, 15, 18, 24, 24, 10, 18, 6, 5, 6]
  );
  assert.equal(
    pressure?.slos.some(
      (outcome) =>
        outcome.description === "apply the equation P = ρgh to determine pressure in fluids,"
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Physics p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 English retains the reviewed detailed-table totals", () => {
  assert.deepEqual(summarize(grade10EnglishData.learningAreas[0]), {
    strands: 9,
    subStrands: 45,
    lessons: 180,
    outcomes: 177,
    commas: 132,
    periods: 45,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 English preserves themes and recurring skill strands", () => {
  const area = grade10EnglishData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const expectedSkills = [
    "Listening and Speaking",
    "Listening and Speaking",
    "Reading",
    "Grammar in Use",
    "Writing",
  ];

  assert.equal(area.name, "English");
  assert.equal(area.strands[0].name, "THEME 01: ETIQUETTE: SOCIAL");
  assert.equal(area.strands[8].name, "THEME 9: INCOME: TYPES AND SOURCES");
  assert.equal(
    area.strands.every(
      (strand) =>
        strand.subStrands.length === 5 &&
        strand.subStrands.reduce(
          (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
          0
        ) === 20 &&
        JSON.stringify(strand.subStrands.map((subStrand) => subStrand.skillStrand)) ===
          JSON.stringify(expectedSkills)
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 English p\.\d+, Strand \d+\.\d+, Sub-Strand \d+\.\d+(?:\.\d+)?$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description) &&
            !/adj ective|homop hones/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Applied Agriculture retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10AppliedAgricultureData.learningAreas[0]), {
    strands: 3,
    subStrands: 17,
    lessons: 195,
    outcomes: 73,
    commas: 56,
    periods: 17,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Applied Agriculture uses canonical unique identifiers", () => {
  const area = grade10AppliedAgricultureData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const animalProduction = area.strands[1].subStrands;

  assert.equal(area.name, "Applied Agriculture");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Crop Production",
      "Animal Production",
      "Agricultural Technologies and Entrepreneurship",
    ]
  );
  assert.deepEqual(
    animalProduction.map((subStrand) => subStrand.name),
    [
      "Breeds of Livestock",
      "Animal handling and safety",
      "General Animal Health",
      "Bee Keeping",
      "Animal Rearing Project",
    ]
  );
  assert.deepEqual(
    animalProduction.map((subStrand) => subStrand.sourceRef?.match(/Sub-Strand (\d+\.\d+)$/)?.[1]),
    ["2.1", "2.2", "2.3", "2.4", "2.5"]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [10, 12, 12, 10, 10, 14, 10, 10, 9, 12, 8, 15, 14, 20, 13, 6, 10]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Applied Agriculture p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Aviation Technology retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10AviationTechnologyData.learningAreas[0]), {
    strands: 4,
    subStrands: 11,
    lessons: 180,
    outcomes: 58,
    commas: 45,
    periods: 10,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "appreciate the role of aviation weather in flight operations",
      "appreciate the careers related to aviation communication in aviation industry",
      "demonstrate the motion of an aircraft about its axes",
    ],
  });
});

test("Grade 10 Aviation Technology preserves detailed names and provenance", () => {
  const area = grade10AviationTechnologyData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Aviation Technology");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Foundations of Aviation Technology",
      "Aircraft Basic Construction",
      "Flight Operations",
      "Airport Operations",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [45, 50, 45, 40]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.name),
    [
      "Introduction to Aviation Technology",
      "Safety in the Aviation Workplace",
      "Airport Safety",
      "Aircraft Components",
      "Aircraft Tools and Materials",
      "Aircraft Related Drawing: Isometric Drawing",
      "Aviation weather",
      "Aviation Communication",
      "Aerodynamics of flight",
      "The Airport",
      "Airport Business Services",
    ]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Aviation Technology p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}|proj ection/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Building Construction retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10BuildingConstructionData.learningAreas[0]), {
    strands: 4,
    subStrands: 12,
    lessons: 180,
    outcomes: 56,
    commas: 43,
    periods: 12,
    semicolons: 0,
    colons: 0,
    unpunctuated: ["illustrate the components of a solid ground floor"],
  });
});

test("Grade 10 Building Construction preserves detailed names and provenance", () => {
  const area = grade10BuildingConstructionData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Building Construction");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Foundation of Building Construction",
      "Related Drawing",
      "Building Construction Processes",
      "Building Services",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [18, 20, 92, 50]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.name),
    [
      "Introduction to Building Construction",
      "Site Preparation",
      "Isometric Drawing",
      "Computer Aided Drawing",
      "Concreting",
      "Foundations",
      "Timbering",
      "Foundation Walling",
      "Ground Floors",
      "Plumbing Tools and Equipment",
      "Plumbing Materials",
      "Pipework",
    ]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Building Construction p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}|proj ection/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Arabic retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10ArabicData.learningAreas[0]), {
    strands: 6,
    subStrands: 24,
    lessons: 179,
    outcomes: 78,
    commas: 54,
    periods: 23,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "acknowledge the importance of listening skills in communication",
    ],
  });
});

test("Grade 10 Arabic preserves themes with readable Arabic labels", () => {
  const area = grade10ArabicData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const expectedSkills = ["Listening and Speaking", "Reading", "Writing", "Grammar"];

  assert.equal(area.name, "Arabic");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "THEME 1: SOCIAL LIFE (الحياة الاجتماعية)",
      "THEME 2: MY ENVIRONMENT (بيئتي)",
      "THEME 3: TOURISM (السياحة)",
      "THEME 4: HEALTH (الصحة)",
      "THEME 5: SCHOOL AND THE WORLD OF WORK (المدرسة وعالم العمل)",
      "THEME 6: THE WORLD OF BUSINESS (عالم الأعمال)",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [30, 29, 30, 30, 30, 30]
  );
  assert.equal(
    area.strands.every(
      (strand) =>
        strand.subStrands.length === 4 &&
        JSON.stringify(strand.subStrands.map((subStrand) => subStrand.skillStrand)) ===
          JSON.stringify(expectedSkills)
    ),
    true
  );
  assert.equal(subStrands[4].name, "1.2 Oral Presentations");
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Arabic p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Kiswahili retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10KiswahiliData.learningAreas[0]), {
    strands: 10,
    subStrands: 40,
    lessons: 181,
    outcomes: 190,
    commas: 148,
    periods: 40,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "kutunga vitanzandimi vyenye maneno yaliyo na sauti/b/, /mb/,/bw/ na/mbw/",
      "kuandika barua ya kirafiki kwa kuzingatia vipengele vifaavyo",
    ],
  });
});

test("Grade 10 Kiswahili preserves themes and cleans extraction artifacts", () => {
  const area = grade10KiswahiliData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const expectedSkills = [
    "Kusikiliza na Kuzungumza",
    "Kusoma",
    "Kuandika",
    "Matumizi ya Lugha",
  ];

  assert.equal(area.name, "Kiswahili");
  assert.equal(area.strands[0].name, "1.0: MIKONDO YA FURSA ZA AJIRA");
  assert.equal(area.strands[9].name, "10.0: HUDUMA YA KWANZA");
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [20, 18, 16, 18, 19, 18, 16, 18, 17, 21]
  );
  assert.equal(
    area.strands.every(
      (strand) =>
        strand.subStrands.length === 4 &&
        JSON.stringify(strand.subStrands.map((subStrand) => subStrand.skillStrand)) ===
          JSON.stringify(expectedSkills)
    ),
    true
  );
  assert.equal(
    subStrands[7].slos[0].description,
    "kutambua viambishi vya upatanisho wa kisarufi wa ngeli ya A-WA, U-I, KI-VI na I-ZI katika sentensi,"
  );
  assert.equal(
    subStrands.some((subStrand) =>
      subStrand.slos.some((outcome) => outcome.description.includes("ifaavyovifaavyo"))
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Kiswahili p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description) &&
            !/usikilizaj i|kuj enga|usomaj i|mj adala|mij adala|shaj ara|uundaj i|ukuzaj i|akizinga-tia|nj ia|uwazaj i/.test(
              outcome.description
            )
        )
    ),
    true
  );
});

test("Grade 10 German retains the detailed-table curriculum totals", () => {
  assert.deepEqual(summarize(grade10GermanData.learningAreas[0]), {
    strands: 6,
    subStrands: 24,
    lessons: 180,
    outcomes: 75,
    commas: 40,
    periods: 17,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "retrieve main information from reading texts",
      "analyse information from a reading text",
      "read texts for enjoyment",
      "recognise the place of descriptive writing in communication",
      "distinguish varied features of functional writing",
      "develop schedules and time tables for information",
      "value functional writing for information",
      "derive rules of grammar structures from given communicative contexts",
      "apply the acquired language structures in communication",
      "acknowledge the purpose of Grammar in communication",
      "identify characteristics of functional writing in communication",
      "compose menus and recipes for information",
      "value the role of functional writing in communication",
      "appreciate the role of reading in communication",
      "apply appropriate language structures in communication",
      "analyse required information from a given reading text",
      "utilise comprehension skills in given reading texts",
      "appreciate reading texts on diverse shopping habits for comprehension",
    ],
  });
});

test("Grade 10 German preserves all six detailed-table themes", () => {
  const area = grade10GermanData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const expectedSkills = ["Listening and Speaking", "Reading", "Writing", "Grammar"];

  assert.equal(area.name, "German");
  assert.equal(area.strands[0].name, "THEME 1. SOCIAL LIFE: MY FAMILY");
  assert.equal(area.strands[5].name, "Theme 6. World Of Business: Shopping");
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [30, 30, 30, 30, 30, 30]
  );
  assert.equal(
    area.strands.every(
      (strand) =>
        strand.subStrands.length === 4 &&
        JSON.stringify(strand.subStrands.map((subStrand) => subStrand.skillStrand)) ===
          JSON.stringify(expectedSkills)
    ),
    true
  );
  assert.equal(subStrands[8].name.includes("Subjects"), true);
  assert.equal(subStrands[18].name.includes("airport"), true);
  assert.equal(subStrands[19].name.includes("Prepositions"), true);
  assert.equal(subStrands[19].name.includes("separable prefixes"), true);
  assert.equal(subStrands[19].name.includes("fahren"), true);
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 German p\.\d+, Strand \d+\.\d+, Sub-Strand \d+\.\d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        !/Subj ects|airp ort|Prep ositions|sep arable|p ref ixes|f ahren/.test(
          subStrand.name
        ) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Fasihi ya Kiswahili retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10FasihiYaKiswahiliData.learningAreas[0]), {
    strands: 10,
    subStrands: 30,
    lessons: 180,
    outcomes: 151,
    commas: 121,
    periods: 29,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "kuchangamkia matumizi ya misemo na nahau katika tungo za fasihi simulizi",
    ],
  });
});

test("Grade 10 Fasihi ya Kiswahili preserves the literary sequence", () => {
  const area = grade10FasihiYaKiswahiliData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const outcomes = subStrands.flatMap((subStrand) => subStrand.slos);
  const expectedSkills = ["Fasihi Simulizi", "Ushairi", "Bunilizi"];

  assert.equal(area.name, "Fasihi ya Kiswahili");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0", "9.0", "10.0"]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [15, 18, 18, 18, 26, 21, 18, 16, 17, 13]
  );
  assert.equal(subStrands[3].suggestedLessons, 4);
  assert.equal(
    area.strands.every(
      (strand) =>
        strand.subStrands.length === 3 &&
        JSON.stringify(strand.subStrands.map((subStrand) => subStrand.skillStrand)) ===
          JSON.stringify(expectedSkills)
    ),
    true
  );
  assert.equal(
    outcomes.filter(
      (outcome) => outcome.description === "kuchambua maudhui na dhamira katika mashairi,"
    ).length,
    2
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Fasihi ya Kiswahili p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description) &&
            !/j amii|maj igambo|lahaj a/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Literature in English retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10LiteratureInEnglishData.learningAreas[0]), {
    strands: 9,
    subStrands: 34,
    lessons: 171,
    outcomes: 128,
    commas: 91,
    periods: 36,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "analyse language and style in short stories for critical analysis",
    ],
  });
});

test("Grade 10 Literature in English preserves every numbered sequence", () => {
  const area = grade10LiteratureInEnglishData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Literature in English");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Sequence 1.0",
      "Sequence 2.0",
      "Sequence 3.0",
      "Sequence 4.0",
      "Sequence 5.0",
      "Sequence 6.0",
      "Sequence 7.0",
      "Sequence 8.0",
      "Sequence 9.0",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) => strand.subStrands.length),
    [4, 4, 4, 2, 4, 4, 4, 4, 4]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [17, 34, 20, 10, 18, 18, 18, 16, 20]
  );
  assert.equal(
    subStrands.filter((subStrand) => subStrand.name === "5.2 Appreciation of Poetry").length,
    1
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Literature in English p\.\d+, Strand \d+\.\d, Sub-Strand \d+\.\d(?:\.\d)?$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        ["Oral Literature", "Poetry", "Fiction and Non-Fiction"].includes(
          subStrand.skillStrand ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Mandarin Chinese retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10MandarinChineseData.learningAreas[0]), {
    strands: 6,
    subStrands: 24,
    lessons: 180,
    outcomes: 72,
    commas: 48,
    periods: 24,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Mandarin Chinese preserves themes and source quirks", () => {
  const area = grade10MandarinChineseData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const outcomes = subStrands.flatMap((subStrand) => subStrand.slos);
  const expectedSkills = ["Listening and Speaking", "Reading", "Writing", "Grammar"];

  assert.equal(area.name, "Mandarin Chinese");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "THEME 1: SOCIAL LIFE",
      "THEME 2: MY ENVIRONMENT",
      "THEME 3: TOURISM",
      "THEME 4: HEALTH",
      "THEME 5: SCHOOL AND WORLD OF WORK",
      "THEME 6: WORLD OF BUSINESS",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [30, 30, 30, 30, 30, 30]
  );
  assert.equal(
    area.strands.every(
      (strand) =>
        strand.subStrands.length === 4 &&
        JSON.stringify(strand.subStrands.map((subStrand) => subStrand.skillStrand)) ===
          JSON.stringify(expectedSkills)
    ),
    true
  );
  assert.equal(
    outcomes.some(
      (outcome) => outcome.description === "write a vivid description for variety subject,"
    ),
    true
  );
  assert.equal(
    outcomes.some(
      (outcome) =>
        outcome.description ===
        "speak fluently in various topical areas. to enhance communication,"
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Mandarin Chinese p\.\d+, Strand \d+\.\d, Sub-Strand \d+\.\d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}|subj ect/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}|subj ect/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Geography retains the supported detailed-table curriculum", () => {
  assert.deepEqual(summarize(grade10GeographyData.learningAreas[0]), {
    strands: 3,
    subStrands: 12,
    lessons: 174,
    outcomes: 62,
    commas: 50,
    periods: 12,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Geography excludes the summary-only Earth Movements unit", () => {
  const area = grade10GeographyData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const outcomes = subStrands.flatMap((subStrand) => subStrand.slos);

  assert.equal(area.name, "Geography");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["Practical Geography", "Natural Systems and Processes", "Human and Economic Activities"]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [46, 53, 75]
  );
  assert.equal(subStrands.some((subStrand) => /Earth Movements/i.test(subStrand.name)), false);
  assert.equal(subStrands[3].name, "Geographic Information Systems(GIS)");
  assert.equal(
    outcomes.some(
      (outcome) =>
        outcome.description === "appreciate the significance of Geography in day-to-today life."
    ),
    true
  );
  assert.equal(
    outcomes.some(
      (outcome) =>
        outcome.description === "describe features resulting from vulcanic activities in the world,"
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Geography p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Business Studies retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10BusinessStudiesData.learningAreas[0]), {
    strands: 4,
    subStrands: 15,
    lessons: 180,
    outcomes: 78,
    commas: 48,
    periods: 14,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "formulate SMART short term and long term goals for a business",
      "explain the importance of banking in an economy",
      "describe the trends in banking in Kenya",
      "analyse the types of economic resources in satisfaction of human needs and wants",
      "explore the formation, management, sources of finance, advantages, and disadvantages of a sole proprietorship business enterprise in Kenya",
      "examine the formation, management, sources of finance, advantages, and disadvantages of a partnership business enterprise in Kenya",
      "identify an opportunity and start a business in school",
      "explain factors of production required to produce goods and services",
      "examine the roles and responsibilities of a producer to consumer",
      "assess the concept of taxation in Kenya",
      "analyse the types of custom duties in Kenya",
      "evaluate the trends in taxation in Kenya",
      "identify ethical issues in taxation",
      "write an article on importance of taxation in Kenya to sensitize the community",
      "appreciate the role of public finance in Kenya",
      "examine the books of original entry used in book keeping",
    ],
  });
});

test("Grade 10 Business Studies preserves detailed names and published quirks", () => {
  const area = grade10BusinessStudiesData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const outcomes = subStrands.flatMap((subStrand) => subStrand.slos);

  assert.equal(area.name, "Business Studies");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "BUSINESS AND MONEY MANAGEMENT",
      "BUSINESS AND ITS ENVIRONMENT",
      "GOVERNMENT AND GLOBAL INFLUENCE IN BUSINESS",
      "FINANCIAL RECORDS IN BUSINESS",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [46, 65, 30, 39]
  );
  assert.equal(subStrands[12].name, "Business Transactions");
  assert.equal(subStrands[14].name, "Source Documents and Books of Original Entry");
  assert.equal(
    outcomes.some(
      (outcome) => outcome.description === "acknowledge the role of money in day- to- day life."
    ),
    true
  );
  assert.equal(
    outcomes.some(
      (outcome) => outcome.description === "analyse the types of custom duties in Kenya"
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Business Studies p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 General Science retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10GeneralScienceData.learningAreas[0]), {
    strands: 4,
    subStrands: 16,
    lessons: 180,
    outcomes: 87,
    commas: 66,
    periods: 16,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "explain the functions of the components of plant and animal cells",
      "appreciate the role of different parts of the digestive system",
      "differentiate between epigeal and hypogeal germination",
      "Explain the economic importance of microorganisms",
      "Appreciate the effect of microorganisms in day to day life",
    ],
  });
});

test("Grade 10 General Science excludes the misplaced summary-only waves row", () => {
  const area = grade10GeneralScienceData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "General Science");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "INTRODUCTION TO GENERAL SCIENCE",
      "LIVING THINGS AND ENVIRONMENT",
      "MATTER AND CHEMICAL REACTIONS",
      "GENERAL PHYSICS",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [4, 58, 58, 60]
  );
  assert.equal(
    area.strands[1].subStrands.some((subStrand) => subStrand.name === "Properties of Waves"),
    false
  );
  assert.equal(area.strands[1].subStrands[0].name, "The Cell");
  assert.equal(area.strands[2].subStrands[1].name, "Chemical Families");
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 General Science p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Home Science retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10HomeScienceData.learningAreas[0]), {
    strands: 3,
    subStrands: 16,
    lessons: 170,
    outcomes: 65,
    commas: 38,
    periods: 12,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "apply personal hygiene practices during puberty",
      "appreciate importance of personal hygiene during puberty",
      "appreciate living in a clean house",
      "analyse aspects of consumer awareness in consumer education",
      "classify sewing tools, equipment and materials",
      "select sewing tools, equipment and materials",
      "use, care for and store different sewing tools, equipment and materials",
      "appreciate the use and care of sewing tools, equipment and materials",
      "identify sources of textile fibres",
      "carry out identification of different textile fibres used for household articles",
      "analyse the characteristics of different textile fibres used for household articles",
      "examine the use of different textile fibres used in the home",
      "appreciate different textile fibres used at home",
      "evaluate qualities of a seam in clothing construction",
      "examine qualities of different methods of managing fullness in clothing construction",
    ],
  });
});

test("Grade 10 Home Science preserves detailed names and source quirks", () => {
  const area = grade10HomeScienceData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const outcomes = subStrands.flatMap((subStrand) => subStrand.slos);

  assert.equal(area.name, "Home Science");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["Foods and Nutrition", "Home Management", "Clothing and Textiles"]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [50, 53, 67]
  );
  assert.equal(subStrands[2].name, "Food Hygiene and safety");
  assert.equal(
    outcomes.some(
      (outcome) =>
        outcome.description === "classify detergents and agents and used in laundry work,"
    ),
    true
  );
  assert.equal(
    outcomes.some(
      (outcome) => outcome.description === "embrace importance of laundry work in day to- day- life."
    ),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Home Science p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Islamic Religious Education retains detailed-table totals", () => {
  assert.deepEqual(summarize(grade10IslamicReligiousEducationData.learningAreas[0]), {
    strands: 4,
    subStrands: 23,
    lessons: 182,
    outcomes: 99,
    commas: 67,
    periods: 25,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "analyse the circumstances that led to compilation of the Qur’an during the reign of caliph Abubakar(R.A.)",
      "examine the circumstances that led to standardisation of the Qur’an during the reign of caliph Uthman(R.A.)",
      "calculate the amount of zakat payable on various items using the nisab and rate",
      "propose possible solutions to minimise li’an, mubarat, faskh nikah for the stability of marriage",
      "propose solutions to alleviate the challenges faced by widows in the society",
      "describe the features of governance in Islam(shura, accountability, justice and participation)",
      "describe the etiquette of da’wa for peaceful, propagation of Islam",
    ],
  });
});

test("Grade 10 Islamic Religious Education uses canonical unique identifiers", () => {
  const area = grade10IslamicReligiousEducationData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  const quranSubStrands = area.strands[0].subStrands;
  const sourceRefs = subStrands.map((subStrand) => subStrand.sourceRef);

  assert.equal(area.name, "Islamic Religious Education");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "STUDY OF THE QURAN AND HADITH",
      "FIQH AND MUAMALAT (JURISPRUDENCE AND SOCIAL RELATIONS)",
      "AKHLAQ(MORAL TEACHINGS)",
      "ISLAMIC HISTORY AND CIVILISATION",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [52, 59, 33, 38]
  );
  assert.deepEqual(
    quranSubStrands.map((subStrand) => subStrand.sourceRef?.match(/Sub-Strand (\d+\.\d+)$/)?.[1]),
    ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"]
  );
  assert.equal(new Set(sourceRefs).size, sourceRefs.length);
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Islamic Religious Education p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}|f askh|kaf an|daf an|f ardh|al- nuzuul/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}|f askh|kaf an|daf an|f ardh|al- nuzuul/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Hindu Religious Education retains source-backed totals", () => {
  assert.deepEqual(summarize(grade10HinduReligiousEducationData.learningAreas[0]), {
    strands: 4,
    subStrands: 12,
    lessons: 210,
    outcomes: 46,
    commas: 5,
    periods: 12,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "solve emerging issues with the knowledge derived from the lives of Dashavatars",
      "describe the five selected Tirthankaras in Jainism",
      "elaborate the contributions of each of the five selected Tirthankars",
      "explain Buddhist understanding of Paramatma as Dhamma",
      "outline the Buddhas of the past and the coming Buddha to uplift their faith",
      "analyse the nine qualities of a Buddha to enhance their faith",
      "describe the journey undertaken to attain spiritual growth through Guru’s grace",
      "categorise the listed Gurus according to their social and religious contributions",
      "explain the origin of the Scriptures in the four faiths",
      "describe the development of the Scriptures in the four faiths for deeper understanding",
      "evaluate the challenges encountered during the development of Scriptures in the four faiths",
      "analyse the ethical teachings from the four faiths to foster harmonisation",
      "appraise the ethical teachings learned from the scriptures in real life situations",
      "advocate the beliefs and values of other faiths",
      "evaluate the lessons gained from studying these personalities for the benefit of society",
      "acknowledge the qualities of the listed personalities among their peers",
      "interpret the fundamental principles in the four faith for understanding",
      "identify the fundamental principles taught in the four faiths to promote well-being and happiness of individuals",
      "model appropriate activities on the fundamental principles to promote social integrity",
      "explain the fundamental concepts of the Law of Karma for deeper understanding",
      "identify types of vocal music for familiarisation",
      "differentiate types of vocal music in the four faiths",
      "interpret the different types of vocal music in the four faiths",
      "analyse the selected types of vocal music for different purposes",
      "identify the common musical instruments used in the four faiths",
      "play a musical instrument used during worship in any of the four faiths",
      "relate dances with the appropriate music and instrument",
      "categorise the selected dances from Indian and Kenyan communities for familiarisation",
      "take part in the Indian and Kenyan folk dances during cultural programmes",
    ],
  });
});

test("Grade 10 Hindu Religious Education preserves canonical names and provenance", () => {
  const area = grade10HinduReligiousEducationData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Hindu Religious Education");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Manifestation of Paramatma (Supreme Being)",
      "Scriptures",
      "Principles of Dharma",
      "Cultural Practices",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [50, 45, 55, 60]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.name),
    [
      "Trimurti & Dash Avatars",
      "Jain Tirthankars",
      "Buddhist Views",
      "Guru’s Grace – Sikh faith",
      "Origin and Development",
      "Ethical and Moral Teachings",
      "Prominent Personalities",
      "Core Beliefs",
      "Introduction to the Law of Karma",
      "Music - Vocal Music",
      "Instrumental music",
      "Dances (Folk and Classical)",
    ]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Hindu Religious Education p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 History and Citizenship preserves reviewed names and provenance", () => {
  const area = grade10HistoryAndCitizenshipData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "History and Citizenship");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "THEMES IN KENYAN HISTORY AND CITIZENSHIP",
      "THEMES IN AFRICAN HISTORY AND CITIZENSHIP",
      "INTERNATIONAL THEMES IN HISTORY AND CITIZENSHIP",
      "CONTEMPORARY THEMES IN HISTORY AND CITIZENSHIP",
    ]
  );
  assert.equal(subStrands[7].name, "African Civilizations up to 19th century");
  assert.equal(subStrands[10].name, "Global wars on Africa");
  assert.equal(subStrands[18].name, "Equity and non-discrimination");
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 History and Citizenship p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Mathematics preserves detailed-table names and provenance", () => {
  const area = grade10MathematicsData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Mathematics");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["Numbers and Algebra", "Measurements and Geometry", "Statistics and Probability"]
  );
  assert.equal(subStrands[2].name, "Quadratic Expressions and Equations 1");
  assert.equal(subStrands[10].name, "Vectors I");
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Mathematics p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Sports and Recreation preserves reviewed names and provenance", () => {
  const area = grade10SportsAndRecreationData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Sports and Recreation");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["Health And Fitness", "Coaching", "Officiating in Athletics"]
  );
  assert.equal(subStrands[1].name, "Muscular Strength and Muscular Endurance");
  assert.equal(subStrands[7].name, "Improvisation of equipment and facilities");
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Sports and Recreation p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Computer Science preserves reviewed names and provenance", () => {
  const area = grade10ComputerScienceData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Computer Science");
  assert.equal(subStrands[0].name, "Evolution and Development of Computers");
  assert.equal(subStrands[1].name, "Computer Organisation and Architecture");
  assert.equal(subStrands[15].name, "Data Structures");
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Computer Science p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.slos.every((outcome) => outcome.cognitiveLevel === "apply")
    ),
    true
  );
});

test("Grade 10 Information and Communication Technology preserves names and provenance", () => {
  const area = grade10InformationAndCommunicationTechnologyData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Information and Communication Technology (ICT)");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["ICT and Society", "Productivity Tools", "Internet and Web Technologies"]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [14, 24, 22]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.name),
    [
      "Introduction to ICT",
      "Application Areas of ICT",
      "Operating Systems",
      "Word Processing",
      "Presentation",
      "Desktop Publishing",
      "The Internet",
      "Digital Communication",
      "Digital Citizenship",
    ]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Information and Communication Technology \(ICT\) p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}|Intelligence\(AI\)/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Metal Technology retains complete source-backed totals", () => {
  const summary = summarize(grade10MetalTechnologyData.learningAreas[0]);

  assert.deepEqual(
    { ...summary, unpunctuated: summary.unpunctuated.length },
    {
      strands: 4,
      subStrands: 11,
      lessons: 180,
      outcomes: 49,
      commas: 2,
      periods: 6,
      semicolons: 0,
      colons: 0,
      unpunctuated: 41,
    }
  );
});

test("Grade 10 Metal Technology restores missing units and provenance", () => {
  const area = grade10MetalTechnologyData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Metal Technology");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Fundamentals of Metal Technology",
      "Tools and Materials in Metal Technology",
      "Related drawing in metal technology",
      "Metal Joining and Finishing Processes",
    ]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [4, 8, 20, 20, 20, 18, 15, 20, 20, 15, 20]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.slos.length),
    [4, 6, 4, 4, 5, 4, 4, 6, 4, 4, 4]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.sourceRef?.match(/p\.(\d+),/)?.[1]),
    ["1", "3", "6", "8", "10", "12", "15", "17", "20", "22", "24"]
  );
  assert.equal(
    subStrands[1].slos.some((outcome) => outcome.description.includes("act (OSHA)")),
    true
  );
  assert.equal(
    subStrands[8].slos.some((outcome) => outcome.description.includes("day -to– day life")),
    true
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Metal Technology p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.slos.length > 0 &&
        subStrand.name === subStrand.name.trim() &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim()
        )
    ),
    true
  );
});

test("Grade 10 Wood Technology retains complete source-backed totals", () => {
  assert.deepEqual(summarize(grade10WoodTechnologyData.learningAreas[0]), {
    strands: 4,
    subStrands: 11,
    lessons: 180,
    outcomes: 43,
    commas: 24,
    periods: 11,
    semicolons: 0,
    colons: 0,
    unpunctuated: [
      "classify timber trees according to their physical features",
      "illustrate a cross section of a tree trunk",
      "construct a furniture item using hand tools",
      "appreciate the skills learned by completing a woodwork project",
      "identify different types of pictorial drawings used in wood technology",
      "draw shapes of items to be made in isometric projection",
      "draw orthographic views from isometric projections",
      "make freehand sketches of items for designs purposes",
    ],
  });
});

test("Grade 10 Wood Technology restores every detailed-table outcome set", () => {
  const area = grade10WoodTechnologyData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Wood Technology");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    [
      "Foundations of Wood Technology",
      "Materials",
      "Wood Processes and Products",
      "Related Drawing",
    ]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [44, 38, 84, 14]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.slos.length),
    [3, 4, 5, 4, 3, 4, 4, 5, 4, 2, 5]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.name),
    [
      "Overview of Wood Technology",
      "Wood Workshop",
      "Hand Tools and equipment",
      "Growth of timber trees",
      "Timber conversion and seasoning",
      "Adhesives",
      "Preparation of Wood",
      "Wood working joints",
      "Surface preparation",
      "Project Activity – Furniture Item",
      "Drawing and sketching",
    ]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Wood Technology p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.slos.length > 0 &&
        subStrand.name === subStrand.name.trim() &&
        !/\s{2,}/.test(subStrand.name) &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim() &&
            !/\s{2,}|proj ection/.test(outcome.description)
        )
    ),
    true
  );
});

test("Grade 10 Music and Dance retains complete source-backed totals", () => {
  assert.deepEqual(summarize(grade10MusicAndDanceData.learningAreas[0]), {
    strands: 3,
    subStrands: 15,
    lessons: 169,
    outcomes: 67,
    commas: 53,
    periods: 14,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Music and Dance follows the detailed curriculum tables", () => {
  const area = grade10MusicAndDanceData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Music and Dance");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["Foundations of Music and Dance", "Performing", "Critical Appreciation"]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [79, 57, 33]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [11, 11, 11, 11, 11, 12, 12, 11, 11, 12, 12, 11, 11, 11, 11]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.slos.length),
    [5, 5, 7, 3, 3, 5, 6, 4, 4, 3, 5, 5, 6, 3, 3]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.sourceRef?.match(/p\.(\d+),/)?.[1]),
    ["1", "4", "6", "8", "11", "13", "15", "19", "21", "24", "26", "28", "33", "35", "37"]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Music and Dance p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.slos.length > 0 &&
        subStrand.name === subStrand.name.trim() &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim()
        )
    ),
    true
  );
});

test("Grade 10 Theatre and Film retains complete source-backed totals", () => {
  assert.deepEqual(summarize(grade10TheatreAndFilmData.learningAreas[0]), {
    strands: 3,
    subStrands: 7,
    lessons: 180,
    outcomes: 33,
    commas: 26,
    periods: 7,
    semicolons: 0,
    colons: 0,
    unpunctuated: [],
  });
});

test("Grade 10 Theatre and Film restores every detailed-table outcome set", () => {
  const area = grade10TheatreAndFilmData.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);

  assert.equal(area.name, "Theatre and Film");
  assert.deepEqual(
    area.strands.map((strand) => strand.name),
    ["Creating", "Production", "Theatre, Film and Society"]
  );
  assert.deepEqual(
    area.strands.map((strand) =>
      strand.subStrands.reduce(
        (total, subStrand) => total + (subStrand.suggestedLessons ?? 0),
        0
      )
    ),
    [40, 95, 45]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.suggestedLessons),
    [25, 15, 35, 35, 25, 20, 25]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.slos.length),
    [4, 5, 4, 6, 5, 5, 4]
  );
  assert.deepEqual(
    subStrands.map((subStrand) => subStrand.sourceRef?.match(/p\.(\d+),/)?.[1]),
    ["1", "4", "7", "9", "12", "16", "18"]
  );
  assert.equal(
    subStrands.every(
      (subStrand) =>
        /^KICD G10 Theatre and Film p\.\d+, Strand \d+\.0, Sub-Strand \d+\.\d+$/.test(
          subStrand.sourceRef ?? ""
        ) &&
        subStrand.verification === "unverified" &&
        subStrand.suggestedLessons !== undefined &&
        subStrand.suggestedLessons > 0 &&
        subStrand.slos.length > 0 &&
        subStrand.name === subStrand.name.trim() &&
        subStrand.slos.every(
          (outcome) =>
            outcome.cognitiveLevel === "apply" &&
            outcome.description === outcome.description.trim()
        )
    ),
    true
  );
});

test("Grade 10 catalogue exposes reviewed learning areas only", () => {
  assert.deepEqual(
    grade10Data.learningAreas.map((area) => area.name),
    [
      "Computer Science",
      "Information and Communication Technology (ICT)",
      "Sports and Recreation",
      "Mathematics",
      "History and Citizenship",
      "Home Science",
      "Islamic Religious Education",
      "Hindu Religious Education",
      "Geography",
      "General Science",
      "Biology",
      "Business Studies",
      "Chemistry",
      "Physics",
      "English",
      "Applied Agriculture",
      "Aviation Technology",
      "Building Construction",
      "Arabic",
      "Kiswahili",
      "German",
      "Mandarin Chinese",
      "Metal Technology",
      "Music and Dance",
      "Theatre and Film",
      "Fasihi ya Kiswahili",
      "Literature in English",
      "Wood Technology",
    ]
  );
  assert.equal(isTranscribedCurriculumArea(10, "Computer Science"), true);
  assert.equal(
    isTranscribedCurriculumArea(10, "Information and Communication Technology (ICT)"),
    true
  );
  assert.equal(isTranscribedCurriculumArea(10, "Sports and Recreation"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Mathematics"), true);
  assert.equal(isTranscribedCurriculumArea(10, "History and Citizenship"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Home Science"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Islamic Religious Education"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Hindu Religious Education"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Geography"), true);
  assert.equal(isTranscribedCurriculumArea(10, "General Science"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Biology"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Business Studies"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Chemistry"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Physics"), true);
  assert.equal(isTranscribedCurriculumArea(10, "English"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Applied Agriculture"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Aviation Technology"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Building Construction"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Arabic"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Kiswahili"), true);
  assert.equal(isTranscribedCurriculumArea(10, "German"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Mandarin Chinese"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Metal Technology"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Music and Dance"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Theatre and Film"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Fasihi ya Kiswahili"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Literature in English"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Wood Technology"), true);
  assert.equal(isTranscribedCurriculumArea(10, "Agriculture"), false);
});
