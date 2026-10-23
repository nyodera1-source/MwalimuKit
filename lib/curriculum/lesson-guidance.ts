export interface LessonGuidance {
  lessonFocus: string;
  lessonNumber: number;
  lessonCount: number;
  priorKnowledge: string;
  vocabulary: string;
  teacherPreparation: string;
  valuesAndPcis: string;
  safetyNotes: string;
  differentiation: string;
  homework: string;
  activities: {
    introduction: string;
    development: string;
    conclusion: string;
  };
  assessment: {
    strategy: string;
    description: string;
  };
}

interface LessonGuidanceInput {
  learningArea: string;
  strand: string;
  subStrand: string;
  duration: number;
  lessonCount: number;
  sloDescriptions: string[];
}

interface AreaProfile {
  preparation: string;
  values: string;
  safety: string;
  introduction: string;
  development: string;
  conclusion: string;
  assessmentStrategy: string;
  homework: string;
}

const DEFAULT_AREA_PROFILE: AreaProfile = {
  preparation: "Prepare locally available examples or resources and organise learners for pair or group work.",
  values: "Values: responsibility, respect and collaboration. Link the lesson to the learners' local context and relevant everyday applications.",
  safety: "Maintain normal classroom safety routines and ensure that learning materials are used responsibly.",
  introduction: "through short questions and a familiar local example",
  development: "using prepared examples, guided practice, pair or group work, and learner explanations",
  conclusion: "summarise the key idea and complete a short check for understanding",
  assessmentStrategy: "Observation",
  homework: "Find one example of the topic in the local environment and explain how it relates to today's lesson.",
};

const AREA_PROFILES: Record<string, Partial<AreaProfile>> = {
  Mathematics: {
    preparation: "Prepare worked examples, mathematical instruments or locally relevant problem situations. Plan a short individual check after guided practice.",
    introduction: "with a practical problem, number pattern or measurement example",
    development: "through worked examples, guided practice, pair problem-solving and explanation of methods",
    conclusion: "solve one exit problem and explain the method used",
    assessmentStrategy: "Written",
    homework: "Solve one related problem from the lesson and explain the steps used.",
  },
  English: {
    preparation: "Prepare a short text, speaking prompt or writing model. Mark the language features that connect to the selected outcomes.",
    introduction: "with a short text, question or familiar communication situation",
    development: "through shared reading or listening, guided language practice, pair communication and an individual response",
    conclusion: "share one language feature and complete a short speaking or writing check",
    assessmentStrategy: "Written",
    homework: "Collect or write one example that uses the language skill from today's lesson.",
  },
  Kiswahili: {
    preparation: "Prepare a short Kiswahili text, oral prompt or writing model and identify vocabulary that supports the selected outcomes.",
    introduction: "using a short Kiswahili text, communication question or everyday example",
    development: "through shared reading or listening, guided language practice, pair communication and an individual response",
    conclusion: "summarise the main idea and complete a short speaking or writing check",
    assessmentStrategy: "Written",
    homework: "Andika au kusanya mfano mmoja unaotumia stadi ya lugha iliyofundishwa leo.",
  },
  Biology: {
    preparation: "Prepare safe specimens, charts, models or photographs. Plan the observation questions learners will answer from the evidence.",
    introduction: "with a specimen, image or observation from the living world",
    development: "through observation or demonstration, recording evidence, group interpretation and comparison with the selected outcomes",
    conclusion: "state one evidence-based conclusion and complete an exit question",
    assessmentStrategy: "Observation",
    homework: "Observe one related example in the local environment and record what it shows about the lesson topic.",
  },
  Chemistry: {
    preparation: "Prepare safe apparatus, labelled substances or a demonstration. Check quantities, protective equipment and disposal arrangements before the lesson.",
    introduction: "with a safe demonstration or familiar change in matter",
    development: "through prediction, demonstration or practical investigation, recording observations and explaining them using the selected outcomes",
    conclusion: "state the observation, explanation and one safety precaution",
    assessmentStrategy: "Observation",
    homework: "Describe one related change in matter observed at home or in the community and explain it using today's concept.",
  },
  Physics: {
    preparation: "Prepare measuring instruments, a safe demonstration or locally available materials. Check the setup and expected observations before the lesson.",
    introduction: "with a familiar physical phenomenon, prediction or measurement",
    development: "through prediction, demonstration or investigation, measurement, recording results and explaining the pattern using the selected outcomes",
    conclusion: "state the pattern observed and answer one application question",
    assessmentStrategy: "Observation",
    homework: "Identify one everyday application of the lesson concept and explain how it works.",
  },
  Geography: {
    preparation: "Prepare maps, photographs, local data or field observations that connect to the selected outcomes. Decide how groups will record evidence.",
    introduction: "with a map, photograph, local feature or current environmental question",
    development: "through map or data interpretation, group analysis, local examples and a short evidence-based report",
    conclusion: "share one finding and explain its effect on people or the environment",
    assessmentStrategy: "Written",
    homework: "Record one local example related to the topic and explain its effect on people, places or the environment.",
  },
  "History and Citizenship": {
    preparation: "Prepare a short historical source, image, timeline or civic situation. Select questions that help learners distinguish evidence from opinion.",
    introduction: "with a historical source, image, timeline or civic situation",
    development: "through source interpretation, chronological or civic reasoning, group discussion and a short evidence-based response",
    conclusion: "state one lesson learned and connect it to responsible citizenship today",
    assessmentStrategy: "Written",
    homework: "Find one local example that connects the lesson topic to community life or responsible citizenship.",
  },
  "Business Studies": {
    preparation: "Prepare a realistic business case, sample document or local enterprise example. Plan a short decision or calculation for learners to complete.",
    introduction: "with a local business situation, document or decision",
    development: "through case analysis, document interpretation, pair decision-making and explanation of the selected business concept",
    conclusion: "justify one business decision and complete a short written check",
    assessmentStrategy: "Written",
    homework: "Observe a local business and record one example of the lesson concept in use.",
  },
  "Home Science": {
    preparation: "Prepare safe household materials, charts or a demonstration. Check hygiene, storage and equipment arrangements before the lesson.",
    introduction: "with a familiar home, health, nutrition or clothing situation",
    development: "through demonstration, guided practical work, group comparison and explanation of the selected outcomes",
    conclusion: "state one practical lesson and one safety or hygiene measure",
    assessmentStrategy: "Observation",
    homework: "Identify one way the lesson can improve health, safety or resource use at home.",
  },
  "Applied Agriculture": {
    preparation: "Prepare safe farm tools, soil, plant samples, photographs or a local farming case. Plan how learners will observe and record evidence.",
    introduction: "with a crop, soil, farm tool or local production problem",
    development: "through observation or demonstration, practical classification, group planning and application to local farming",
    conclusion: "state one recommended practice and explain its benefit",
    assessmentStrategy: "Observation",
    homework: "Observe one farming practice in the local community and explain how it relates to today's lesson.",
  },
  "Agriculture and Nutrition": {
    preparation: "Prepare safe farm or food samples, charts or photographs. Check hygiene and organise learners for observation or practical work.",
    introduction: "with a local food, crop, soil or household nutrition situation",
    development: "through observation, practical classification, group planning and application to food production or healthy living",
    conclusion: "state one recommended practice and explain its benefit",
    assessmentStrategy: "Observation",
    homework: "Identify one related practice at home or in the community and explain why it is important.",
  },
  "Computer Science": {
    preparation: "Prepare devices, an offline example or a short algorithm. Check access, pair learners where devices are limited, and review responsible technology use.",
    introduction: "with a familiar digital task, problem or algorithm",
    development: "through demonstration, guided practice, pair programming or problem-solving and explanation of the selected outcomes",
    conclusion: "explain the solution or process and complete a short digital-literacy check",
    assessmentStrategy: "Practical",
    homework: "Describe one way the lesson concept could solve a problem at school, home or in the community.",
  },
  "Information and Communication Technology (ICT)": {
    preparation: "Prepare devices, an offline example or a short digital task. Check access, pair learners where devices are limited, and review responsible technology use.",
    introduction: "with a familiar digital task, problem or communication tool",
    development: "through demonstration, guided practice, pair work and explanation of the selected digital skills",
    conclusion: "demonstrate or explain one completed task and complete a short digital-literacy check",
    assessmentStrategy: "Practical",
    homework: "Describe one responsible use of the ICT skill in school, at home or in the community.",
  },
  "Sports and Recreation": {
    preparation: "Prepare safe equipment, a suitable activity area and adaptations for different abilities. Plan a warm-up and hydration break.",
    introduction: "with a safe warm-up, demonstration or question about movement and recreation",
    development: "through demonstration, progressive practice, small-sided activities, peer feedback and reflection on performance",
    conclusion: "demonstrate one key skill and state one safety or teamwork lesson",
    assessmentStrategy: "Observation",
    homework: "Practise the selected skill safely and record one improvement noticed.",
  },
  "Music and Dance": {
    preparation: "Prepare an appropriate song, rhythm, instrument or movement sequence. Arrange space safely and plan participation roles for all learners.",
    introduction: "with a short listening, rhythm or movement prompt",
    development: "through demonstration, guided rehearsal, group performance and constructive peer feedback",
    conclusion: "perform or explain one element and reflect on collaboration and expression",
    assessmentStrategy: "Observation",
    homework: "Practise or record one rhythm, movement or musical idea connected to the lesson.",
  },
  "Theatre and Film": {
    preparation: "Prepare a short scene, image, script extract or storyboard prompt. Arrange safe performance space and assign inclusive roles.",
    introduction: "with a short scene, image or real-life situation for interpretation",
    development: "through role-play, scene development, rehearsal, presentation and peer feedback linked to the selected outcomes",
    conclusion: "identify one performance choice and explain its effect on the audience",
    assessmentStrategy: "Observation",
    homework: "Create a short response, scene idea or storyboard connected to the lesson focus.",
  },
  "Fine Arts": {
    preparation: "Prepare locally available art materials, a visual reference and a safe working space. Plan an example that demonstrates the selected technique.",
    introduction: "with an artwork, image or observation task",
    development: "through demonstration, guided making, individual or group production and feedback using the selected outcomes",
    conclusion: "display or describe one artistic decision and identify what could be improved",
    assessmentStrategy: "Practical",
    homework: "Collect or sketch one local example that shows the technique or idea from today's lesson.",
  },
  "Wood Technology": {
    preparation: "Prepare safe wood samples, photographs or secured tools. Organise the workshop area and check protective equipment before practical work.",
    safety: "Use safe samples or secured tools for demonstrations. Keep the work area organised and supervise any sharp tools or machinery closely.",
    introduction: "with a wood product, material sample, tool or local construction example",
    development: "through demonstration, material or tool observation, guided practical work and explanation of the selected technical outcomes",
    conclusion: "state one technical idea and one workshop safety rule",
    assessmentStrategy: "Observation",
    homework: "Identify one wooden product or process in the local community and explain how it relates to today's lesson.",
  },
  "Metal Technology": {
    preparation: "Prepare safe metal samples, drawings or secured tools. Organise the workshop area and check protective equipment before practical work.",
    safety: "Use safe samples or secured tools for demonstrations. Keep the work area organised and supervise any sharp tools, heat or machinery closely.",
    introduction: "with a metal product, material sample, tool or local fabrication example",
    development: "through demonstration, material or tool observation, guided practical work and explanation of the selected technical outcomes",
    conclusion: "state one technical idea and one workshop safety rule",
    assessmentStrategy: "Practical",
    homework: "Identify one metal product or process in the local community and explain how it relates to today's lesson.",
  },
  "Building Construction": {
    preparation: "Prepare drawings, material samples, measurements or photographs. Check the workspace and identify any hazards before practical work.",
    safety: "Use protective equipment where required, keep the work area organised and supervise tools, materials and any work at height.",
    introduction: "with a building feature, drawing, material or local construction problem",
    development: "through demonstration, drawing or measurement, guided practical work and explanation of the selected technical outcomes",
    conclusion: "state one construction principle and one safety rule",
    assessmentStrategy: "Practical",
    homework: "Observe one building feature in the local area and explain the construction idea it demonstrates.",
  },
  "Aviation Technology": {
    preparation: "Prepare diagrams, safe models or an aviation case. Check that examples are suitable for classroom use and emphasise responsible practice.",
    introduction: "with an aircraft feature, diagram or aviation problem",
    development: "through diagram interpretation, demonstration, group problem-solving and explanation of the selected technical outcomes",
    conclusion: "explain one aviation principle and one safety or responsibility requirement",
    assessmentStrategy: "Written",
    homework: "Find one local or national application of the aviation concept and explain its importance.",
  },
};

function getAreaProfile(learningArea: string): AreaProfile {
  const exact = AREA_PROFILES[learningArea];
  if (exact) return { ...DEFAULT_AREA_PROFILE, ...exact };

  const area = learningArea.toLowerCase();
  if (area.includes("religious") || area.includes("religion")) {
    return {
      ...DEFAULT_AREA_PROFILE,
      preparation: "Prepare a suitable sacred text, story, case or community situation. Select questions that support respectful discussion and reflection.",
      introduction: "with a short text, story, moral question or community situation",
      development: "through guided reading or narration, respectful discussion, interpretation and application to daily life",
      conclusion: "state one value or lesson and explain how it can guide action",
      assessmentStrategy: "Oral",
      homework: "Identify one way the lesson value or teaching can be applied in daily life.",
    };
  }
  if (area.includes("arabic") || area.includes("french") || area.includes("german") || area.includes("mandarin") || area.includes("literature") || area.includes("fasihi")) {
    return {
      ...DEFAULT_AREA_PROFILE,
      preparation: "Prepare a short text, oral prompt or writing model and identify vocabulary that supports the selected outcomes.",
      introduction: "with a short text, image, listening prompt or familiar communication situation",
      development: "through shared reading or listening, guided language practice, pair communication and an individual response",
      conclusion: "share one language or literary feature and complete a short response",
      assessmentStrategy: "Written",
      homework: "Collect, read or write one example related to the language or literary skill from today's lesson.",
    };
  }
  if (area.includes("science")) {
    return {
      ...DEFAULT_AREA_PROFILE,
      preparation: "Prepare safe specimens, apparatus, charts or photographs. Plan the observations and questions learners will use to explain evidence.",
      introduction: "with a safe demonstration, specimen, image or familiar scientific question",
      development: "through prediction, observation or demonstration, recording evidence, group interpretation and explanation of the selected outcomes",
      conclusion: "state one evidence-based conclusion and one safety precaution",
      assessmentStrategy: "Observation",
    };
  }
  if (area.includes("creative")) {
    return {
      ...DEFAULT_AREA_PROFILE,
      preparation: "Prepare suitable creative materials, a reference example and a safe working or performance space. Plan inclusive participation roles.",
      introduction: "with an artwork, sound, movement, image or performance prompt",
      development: "through demonstration, guided creation or rehearsal, presentation and constructive peer feedback",
      conclusion: "share one creative decision and reflect on improvement",
      assessmentStrategy: "Observation",
    };
  }
  if (area.includes("technology") || area.includes("pre-technical")) {
    return {
      ...DEFAULT_AREA_PROFILE,
      preparation: "Prepare safe material samples, drawings, measurements or secured tools. Organise the workspace and check protective equipment before practical work.",
      safety: "Use protective equipment where required, keep the work area organised and supervise tools, materials and machinery closely.",
      introduction: "with a product, material sample, drawing, tool or local technical problem",
      development: "through demonstration, observation, guided practical work and explanation of the selected technical outcomes",
      conclusion: "state one technical idea and one safety rule",
      assessmentStrategy: "Practical",
    };
  }
  return { ...DEFAULT_AREA_PROFILE };
}

function curriculumObjectives(sloDescriptions: string[]) {
  if (sloDescriptions.length === 0) {
    return "the selected curriculum outcomes";
  }

  return sloDescriptions.map((outcome) => `- ${outcome}`).join("\n");
}

export function getLessonGuidance(input: LessonGuidanceInput): LessonGuidance {
  const duration = Math.max(30, input.duration || 40);
  const introduction = duration <= 40 ? 5 : 10;
  const conclusion = duration <= 40 ? 5 : 10;
  const development = duration - introduction - conclusion;
  const objectives = curriculumObjectives(input.sloDescriptions);
  const lessonCount = Math.max(1, input.lessonCount || 1);
  const topic = input.subStrand || input.strand || input.learningArea;
  const firstOutcome = input.sloDescriptions[0] || `explain the main ideas in ${topic}`;
  const selectedOutcomeSummary = input.sloDescriptions.length > 0
    ? input.sloDescriptions.slice(0, 3).join("; ")
    : `the main ideas in ${topic}`;
  const profile = getAreaProfile(input.learningArea);

  const generic: LessonGuidance = {
    lessonFocus: topic,
    lessonNumber: 1,
    lessonCount,
    priorKnowledge: `Learners recall related ideas from earlier work and share a familiar example of ${topic} from their home, school or community.`,
    vocabulary: `${topic}; key terms from the selected learning outcomes`,
    teacherPreparation: `Review the selected outcomes for ${topic}. ${profile.preparation}`,
    valuesAndPcis: profile.values,
    safetyNotes: profile.safety,
    differentiation: `Support learners with examples, a word bank and mixed-ability grouping. Extend confident learners with an application or explanation task linked to ${topic}.`,
    homework: profile.homework.replace(/the topic/gi, topic),
    activities: {
      introduction: `${introduction} min\nTeacher: Introduce ${topic} ${profile.introduction}.\nLearners: Share what they already know and make an initial prediction or response.\nCheck: Listen for the vocabulary and skills needed for this lesson and address misconceptions before the main activity.`,
      development: `${development} min\n1. Teacher introduces ${topic} and connects the lesson to the first outcome: ${firstOutcome}.\n2. Learners work ${profile.development} and focus on the selected outcomes: ${selectedOutcomeSummary}.\n3. Learners explain, demonstrate or present their findings while the teacher consolidates accurate ideas and links them to the lesson focus.\nCompetencies: Communication and Collaboration; Critical Thinking and Problem Solving.`,
      conclusion: `${conclusion} min\nLearners: ${profile.conclusion}.\nTeacher checks the selected outcomes and notes learners who need additional support.`,
    },
    assessment: {
      strategy: profile.assessmentStrategy,
      description: `Assess learner explanations, participation and written work against the selected outcomes:\n${objectives}\n\nUse the exit question to identify learners who need further support.`,
    },
  };

  if (
    input.learningArea === "Wood Technology" &&
    /overview of wood technology/i.test(input.subStrand)
  ) {
    return {
      lessonFocus: "Meaning, scope and importance of Wood Technology",
      lessonNumber: 1,
      lessonCount,
      priorKnowledge: "Learners identify wooden furniture, buildings, tools and household products they have seen or used at home and in the community.",
      vocabulary: "wood technology, woodwork, timber, workshop, furniture, joinery, wood product",
      teacherPreparation: "Arrange safe wood samples or photographs of furniture, buildings and tools. Display a short list of familiar wooden products and prepare group discussion prompts.",
      valuesAndPcis: "Values: responsibility, respect and unity. PCIs: occupational safety, environmental conservation, responsible use of trees and career awareness.",
      safetyNotes: "Use photographs, blunt samples or secured tools for this introductory lesson. Remind learners not to handle sharp tools without instruction and to keep the workshop area organised.",
      differentiation: "Support: provide labelled pictures and a word bank. Extension: ask learners to compare two wooden products by use, material and user. Include learners through assigned roles such as reader, recorder, reporter and resource manager.",
      homework: "Identify three wooden products at home or in the community. Record each product, its use and the type of work or career involved in producing it.",
      activities: {
        introduction: `${introduction} min\nTeacher: Display a chair, door, tool handle or photographs of wooden products and ask: What are these made from? Where did the material come from?\nLearners: Observe, name the products and share their experiences.\nLink: Explain that Wood Technology covers the knowledge, skills and processes used to work with wood and make useful products.`,
        development: `${development} min\n1. Meaning and scope (${Math.max(5, Math.floor(development * 0.3))} min): Teacher guides learners to build a definition using the words wood, tools, processes, products and technology.\n2. Group classification (${Math.max(7, Math.floor(development * 0.35))} min): Groups classify examples such as furniture, roofing members, tool handles, doors and decorative items according to their uses.\n3. Application and careers (${Math.max(5, development - Math.max(5, Math.floor(development * 0.3)) - Math.max(7, Math.floor(development * 0.35)))} min): Learners connect products to carpentry, joinery, furniture making, timber processing, construction and design. Groups present one finding; the teacher consolidates the definition, scope and importance of Wood Technology.\nCompetencies: Communication and Collaboration through group reporting; Critical Thinking and Problem Solving through classification; Self-Efficacy through presentation.`,
        conclusion: `${conclusion} min\nTeacher: Recap the meaning, scope and importance of Wood Technology.\nLearners: Answer: (1) What is Wood Technology? (2) Name two products made using wood. (3) Name one related career.\nExit check: Each learner writes one reason why safe and responsible use of wood matters.`,
      },
      assessment: {
        strategy: "Observation",
        description: `Assess group discussion, classification and individual exit responses. Look for the ability to:\n- explain the meaning of Wood Technology in simple terms;\n- identify common wood products and their uses;\n- connect Wood Technology to at least one career;\n- demonstrate respectful collaboration and safe handling of materials.\n\nShort written check:\n1. Define Wood Technology.\n2. List two areas where Wood Technology is applied.\n3. State one reason for conserving trees used for timber.`,
      },
    };
  }

  return generic;
}
