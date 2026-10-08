export interface LessonGuidance {
  activities: string;
  resources: string;
  inquiry: string;
  assessment: string;
}

type GuidanceTemplate = LessonGuidance;

function subjectTemplate(subject: string, topic: string, focus: string): GuidanceTemplate {
  const area = subject.toLowerCase();
  const goal = focus.replace(/[.!?]+$/, "").trim();

  if (/english|kiswahili|french|german|arabic|mandarin|language/.test(area)) {
    if (/read|comprehend|interpret|analyse.*(text|story|poem)|identify.*(text|narrative)/i.test(goal)) {
      return {
        activities: `Learners read a short text related to ${topic}, identify evidence for ${goal}, and compare interpretations in pairs.`,
        resources: "Relevant short text, exercise books",
        inquiry: `What in the text helps us understand ${topic}?`,
        assessment: `Ask learners to cite a detail from the text while explaining ${goal}.`,
      };
    }
    if (/speak|listen|conversation|pronounc|oral|communicat|introduc/i.test(goal)) {
      return {
        activities: `Learners model a short exchange about ${topic}, practise it in pairs, then give one another feedback on clarity and appropriate language.`,
        resources: "Dialogue prompts or audio example if available",
        inquiry: `How can we communicate clearly and appropriately about ${topic}?`,
        assessment: `Observe paired exchanges and check whether learners can ${goal}.`,
      };
    }
    return {
      activities: `Learners study an example of ${topic}, produce their own spoken or written example, and revise it after peer feedback.`,
      resources: "Relevant text or language examples, exercise books",
      inquiry: `How can we use ${topic} effectively in communication?`,
      assessment: `Review learners' examples for evidence that they can ${goal}.`,
    };
  }

  if (/science|biology|chemistry|physics/.test(area)) {
    return {
      activities: `Learners observe a safe example or illustration of ${topic}, record what they notice, and use their observations to ${goal}.`,
      resources: "Relevant specimen, diagram or demonstration materials if available; observation sheet",
      inquiry: `What evidence helps us explain ${topic}?`,
      assessment: `Review observation records and ask learners to use evidence to ${goal}.`,
    };
  }

  if (/social studies|history|geography|citizenship|business/.test(area)) {
    return {
      activities: `Learners examine a relevant map, source or local case about ${topic}, compare viewpoints, and explain their conclusion using evidence.`,
      resources: "Relevant map, source material or local case; exercise books",
      inquiry: `What evidence helps us understand ${topic} in our community?`,
      assessment: `Ask learners to use a detail from the source or case to ${goal}.`,
    };
  }

  if (/creative|art|music|sport|physical education/.test(area)) {
    return {
      activities: `Learners observe a model of ${topic}, practise the relevant skill, and improve their work or performance using peer feedback.`,
      resources: "Relevant examples and available art, music or sports materials",
      inquiry: `What helps us improve our work or performance in ${topic}?`,
      assessment: `Observe the practice and use a simple checklist to check whether learners can ${goal}.`,
    };
  }

  if (/pre-technical|computer|agriculture|nutrition|home science/.test(area)) {
    return {
      activities: `Learners examine a familiar example of ${topic}, demonstrate or plan a practical task, and explain the steps and safety considerations.`,
      resources: "Relevant local materials, tools or diagrams if available; exercise books",
      inquiry: `How can we apply ${topic} safely and effectively?`,
      assessment: `Observe the task or review learners' plans and ask them to explain how they ${goal}.`,
    };
  }

  if (/religious|\bcre\b|\bire\b|\bhre\b/.test(area)) {
    return {
      activities: `Learners discuss a relevant story, teaching or situation about ${topic}, compare responses, and connect their ideas to daily life.`,
      resources: "Relevant story, teaching or scenario; exercise books",
      inquiry: `What can ${topic} teach us about choices in daily life?`,
      assessment: `Ask learners to explain a reasoned response that shows how they ${goal}.`,
    };
  }

  if (/calculate|solve|determine|convert|construct/i.test(goal)) {
    return {
      activities: `Learners work through an example of ${topic}, practise ${goal} in pairs, and explain their method.`,
      resources: "Worked examples, exercise books",
      inquiry: `How can we check our method for ${topic}?`,
      assessment: `Review learners' worked examples and ask them to explain how they ${goal}.`,
    };
  }
  if (/identify|classify|compare|distinguish|describe/i.test(goal)) {
    return {
      activities: `Learners examine examples of ${topic}, sort or compare their features, and explain their findings to a partner.`,
      resources: "Relevant examples or illustrations, exercise books",
      inquiry: `What features help us understand ${topic}?`,
      assessment: `Ask learners to demonstrate and explain how they ${goal}.`,
    };
  }
  return {
    activities: `Learners examine an example related to ${topic}, discuss ${goal}, then record and share their conclusions.`,
    resources: "Relevant examples or illustrations, exercise books",
    inquiry: `What can we learn about ${topic} from this example?`,
    assessment: `Ask learners to show or explain how they ${goal}.`,
  };
}

const mathematicsGuidance: {
  match: RegExp;
  activities: string;
  resources: string;
  inquiry: string;
  assessment: string;
}[] = [
  {
    match: /place value|total value/i,
    activities: "Learners build numbers with place-value cards, explain each digit's value, then solve examples from everyday quantities.",
    resources: "Place-value chart, digit cards, exercise books",
    inquiry: "How does a digit's position change its value?",
    assessment: "Check learners' number representations and ask them to justify the value of selected digits.",
  },
  {
    match: /read and write numbers/i,
    activities: "Learners convert numbers between words and numerals in pairs, then check one another's work using examples from everyday quantities.",
    resources: "Number cards, place-value chart, exercise books",
    inquiry: "How can we read and write a large number accurately?",
    assessment: "Give short word-to-numeral and numeral-to-word tasks; review errors in place grouping.",
  },
  {
    match: /round off|rounding/i,
    activities: "Learners place numbers on a number line, estimate the nearest target place, and explain their rounding decisions.",
    resources: "Number line, place-value chart, exercise books",
    inquiry: "When is an estimate more useful than an exact number?",
    assessment: "Ask learners to round sample quantities and explain which digit determined each answer.",
  },
  {
    match: /even, odd and prime|prime numbers/i,
    activities: "Learners sort number cards into even, odd and prime groups and defend their choices using factors.",
    resources: "Number cards, hundred chart, exercise books",
    inquiry: "How can factors help us classify a number?",
    assessment: "Observe the sorting task and ask learners to explain why selected numbers are prime or composite.",
  },
  {
    match: /operations of whole numbers|number sequence/i,
    activities: "Learners use number cards to work through the stated operation or sequence, explain the rule, and check a partner's example.",
    resources: "Number cards, number line, exercise books",
    inquiry: "What pattern or operation helps us solve this number problem?",
    assessment: "Check the worked examples and ask learners to explain the operation or sequence rule.",
  },
  {
    match: /divisibility|prime factors|common divisor|common multiples|\bGCD\b|\bLCM\b/i,
    activities: "Learners use factor trees or number grids to test divisibility and find common factors or multiples, then compare methods.",
    resources: "Factor trees, number grid, exercise books",
    inquiry: "How can factors and multiples help us solve a number problem?",
    assessment: "Give a number pair and review learners' factor method and explanation.",
  },
  {
    match: /fractions?/i,
    activities: "Learners model the fractions with diagrams or paper strips, work through the stated operation, and compare their answers in pairs.",
    resources: "Fraction strips or paper diagrams, exercise books",
    inquiry: "How can a model help us check a fraction calculation?",
    assessment: "Review worked fraction examples and ask learners to explain each step with a model.",
  },
  {
    match: /decimals?/i,
    activities: "Learners represent decimals on a place-value chart, work through sample calculations, and check answers by estimation.",
    resources: "Decimal place-value chart, number line, exercise books",
    inquiry: "How does place value help us work with decimals?",
    assessment: "Check decimal calculations and ask learners to explain the position of each digit.",
  },
  {
    match: /square roots?|squares of/i,
    activities: "Learners use square arrays or multiplication to find squares and test possible square roots, then compare their methods.",
    resources: "Square grids, multiplication table, exercise books",
    inquiry: "How can multiplication help us check a square root?",
    assessment: "Check worked squares and square roots and ask learners to justify one answer.",
  },
  {
    match: /algebraic expression|linear equation/i,
    activities: "Learners translate a simple situation into symbols, work through the expression or equation, and check the result by substitution.",
    resources: "Number cards, algebra tiles or sketches, exercise books",
    inquiry: "How can symbols represent an unknown quantity?",
    assessment: "Review a learner-written expression or equation and its substituted check.",
  },
  {
    match: /inequalit/i,
    activities: "Learners model the inequality with number cards, mark solutions on a number line, and explain which values satisfy it.",
    resources: "Number line, number cards, exercise books",
    inquiry: "How does an inequality describe more than one possible value?",
    assessment: "Ask learners to graph an inequality and test a value against it.",
  },
  {
    match: /pythagor|right-angled triangle/i,
    activities: "Learners label the sides of a right-angled triangle, compare their squared lengths, and solve a practical length problem.",
    resources: "Right-angle triangle diagrams, ruler, exercise books",
    inquiry: "How are the sides of a right-angled triangle related?",
    assessment: "Check triangle labels and ask learners to justify the relationship they used.",
  },
  {
    match: /profit|loss|discount|commission|bills|postal charges|mobile money/i,
    activities: "Learners interpret a simple price list or bill, calculate the stated amount, and explain their working to a partner.",
    resources: "Sample price lists or bills, exercise books",
    inquiry: "How can we check a money calculation before making a payment?",
    assessment: "Review learners' calculations and ask them to explain the units and final amount.",
  },
  {
    match: /speed|distance and time/i,
    activities: "Learners compare a short journey's distance and time, calculate or interpret speed, and check whether their units make sense.",
    resources: "Journey data, ruler or map, exercise books",
    inquiry: "How do distance and time determine speed?",
    assessment: "Review a journey calculation and ask learners to explain the unit used.",
  },
  {
    match: /temperature|celsius|kelvin/i,
    activities: "Learners compare temperature readings, convert units where required, and discuss what a change in reading means.",
    resources: "Temperature readings, thermometer if available, exercise books",
    inquiry: "What can a temperature reading tell us about the environment?",
    assessment: "Check comparisons or conversions and ask learners to explain their interpretation.",
  },
  {
    match: /bisect|construct.*triangle|construct.*circle|geometric construction/i,
    activities: "Learners follow a construction sequence with ruler and compasses, compare results, and explain why each step is needed.",
    resources: "Ruler, pair of compasses, plain paper",
    inquiry: "How can we construct a shape accurately without guessing?",
    assessment: "Inspect the construction marks and ask learners to explain the sequence of steps.",
  },
  {
    match: /angles?|transversal|polygons?|parallelogram/i,
    activities: "Learners mark and measure angles on diagrams, use the relevant angle property to find an unknown, and explain the steps.",
    resources: "Angle diagrams, protractor, ruler, exercise books",
    inquiry: "Which angle relationship helps us find an unknown angle?",
    assessment: "Review labelled diagrams and ask learners to name the angle property used.",
  },
  {
    match: /measure|length|area|volume|capacity|mass/i,
    activities: "Learners measure or estimate familiar objects, record results with units, and compare methods in pairs.",
    resources: "Suitable measuring tools, familiar objects, exercise books",
    inquiry: "How do we choose the right unit and tool for a measurement?",
    assessment: "Observe measurements and check that learners record values with appropriate units.",
  },
  {
    match: /data|probability|statistics/i,
    activities: "Learners collect a small set of class data, organise it visually, and explain what the results show.",
    resources: "Tally sheets, graph paper, exercise books",
    inquiry: "What can we learn by organising data?",
    assessment: "Review each representation and ask learners to interpret one finding.",
  },
];

export function buildLessonGuidance(
  subject: string,
  subTopic: string,
  outcome: string,
  repeatIndex = 0
): LessonGuidance {
  const focus = outcome.replace(/[.!?]+$/, "").trim();
  const topic = subTopic.split("\n")[0]?.trim() || "this topic";
  if (subject.trim().toLowerCase() === "mathematics") {
    const specific = mathematicsGuidance.find((item) => item.match.test(focus));
    if (specific) {
      if (repeatIndex % 3 === 1) {
        return {
          activities: `After reviewing ${topic}, learners practise ${focus} with new examples, then explain their answers in pairs.`,
          resources: specific.resources,
          inquiry: specific.inquiry,
          assessment: `Check individual examples of ${topic} and ask learners to correct one mistake they found.`,
        };
      }
      if (repeatIndex % 3 === 2) {
        return {
          activities: `Learners create a real-life task about ${topic}, exchange it with a partner, and compare solution methods.`,
          resources: specific.resources,
          inquiry: specific.inquiry,
          assessment: `Review the learner-created ${topic} tasks and ask partners to explain their solutions.`,
        };
      }
      return {
        activities: specific.activities,
        resources: specific.resources,
        inquiry: specific.inquiry,
        assessment: specific.assessment,
      };
    }
  }
  const guidance = subjectTemplate(subject, topic, focus);
  if (repeatIndex % 3 === 1) {
    return {
      ...guidance,
      activities: `Learners revisit ${topic} with a new example, practise the skill in pairs, and explain what they changed after feedback.`,
      assessment: `Check individual work on ${topic} and ask learners to correct one mistake or improve one response.`,
    };
  }
  if (repeatIndex % 3 === 2) {
    return {
      ...guidance,
      activities: `Learners apply ${topic} to a new situation, compare their approaches, and present a reasoned result.`,
      assessment: `Review each learner's application of ${topic} and ask them to justify their result.`,
    };
  }
  return guidance;
}
