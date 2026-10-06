/**
 * Grade 7 German — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, GERMAN, GRADE 7",
 *         Kenya Institute of Curriculum Development. First published 2022,
 *         revised 2024.
 *
 * Transcribed mechanically from the design PDF: strand numbers and names,
 * sub-strand names, the published lesson count for each sub-strand, and the
 * specific learning outcomes verbatim.
 *
 * The design publishes three strands, each with nine sub-strands (one per
 * theme). The sub-strand names are compound (e.g., "Active listening, Oral
 * expression") combining two skill areas.
 *
 * Lesson allocation: the PDF publishes per-sub-strand lesson counts
 * ("(3 lessons)", "(2 lessons)", "(1 Session)") for each sub-strand.
 * Strand 1.0 = 9 × 3 = 27, Strand 2.0 = 9 × 2 = 18, Strand 3.0 = 9 × 1 = 9.
 * Total = 54 + 6 showcasing = 60.
 *
 * cognitiveLevel is NOT from the design: KICD publishes no Bloom level per
 * outcome, so it falls back to "apply" and must be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7GermanData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "German",
      strands: [
        {
          name: "LISTENING AND SPEAKING",
          order: 1,
          subStrands: [
            {
              name: "Active listening, Oral expression",
              order: 1,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.13, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify listening markers in a text for communication", cognitiveLevel: "apply" },
                { description: "listen actively for comprehension", cognitiveLevel: "apply" },
                { description: "use acquired vocabulary to communicate in varied contexts", cognitiveLevel: "apply" },
                { description: "appreciate the role of vocabulary in foreign language learning", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for information, Interactive speaking",
              order: 2,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.15, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "listen to texts for information", cognitiveLevel: "apply" },
                { description: "interact with peers on varied topics", cognitiveLevel: "apply" },
                { description: "value the role of listening texts in language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Active listening, Oral expression",
              order: 3,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.17, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary related to the given context for learning", cognitiveLevel: "apply" },
                { description: "listen actively to varied speakers for communication", cognitiveLevel: "apply" },
                { description: "value the role vocabulary plays in language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for information, Interactive speaking",
              order: 4,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.19, Strand 1.0, Sub-strand 1.4",
              verification: "unverified" as const,
              slos: [
                { description: "identify required information from listening texts", cognitiveLevel: "apply" },
                { description: "speak interactively on given topics", cognitiveLevel: "apply" },
                { description: "appreciate the role listening texts play in language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Active Listening, Oral Expressions",
              order: 5,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.21, Strand 1.0, Sub-strand 1.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify appropriate vocabulary in given texts", cognitiveLevel: "apply" },
                { description: "listen to texts for comprehension", cognitiveLevel: "apply" },
                { description: "value the role active listening plays in communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for information, Interactive speaking",
              order: 6,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.23, Strand 1.0, Sub-strand 1.6",
              verification: "unverified" as const,
              slos: [
                { description: "identify required information from listening texts", cognitiveLevel: "apply" },
                { description: "speak interactively on given topics", cognitiveLevel: "apply" },
                { description: "appreciate the role listening texts play in language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Active Listening, Oral Expressions",
              order: 7,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.25, Strand 1.0, Sub-strand 1.7",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary related to the given context for learning", cognitiveLevel: "apply" },
                { description: "listen actively to varied speakers for communication", cognitiveLevel: "apply" },
                { description: "value the role vocabulary plays in language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for information, Interactive speaking",
              order: 8,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.27, Strand 1.0, Sub-strand 1.8",
              verification: "unverified" as const,
              slos: [
                { description: "identify required information from listening texts", cognitiveLevel: "apply" },
                { description: "speak interactively on given topics", cognitiveLevel: "apply" },
                { description: "appreciate the role listening texts play in language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Active Listening, Oral expressions",
              order: 9,
              suggestedLessons: 3,
              sourceRef: "KICD G7 German p.29, Strand 1.0, Sub-strand 1.9",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary related to the given context for learning", cognitiveLevel: "apply" },
                { description: "listen actively to varied speakers for communication", cognitiveLevel: "apply" },
                { description: "value the role vocabulary plays in language acquisition", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "READING",
          order: 2,
          subStrands: [
            {
              name: "Reading aloud (Articulation)",
              order: 1,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.32, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "differentiate words and phrases based on their pronunciation correctly", cognitiveLevel: "apply" },
                { description: "read simple sentences on basic introductions fluently", cognitiveLevel: "apply" },
                { description: "develop interest in reading German texts for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading comprehension (Vocabulary)",
              order: 2,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.34, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary and phrases in a written text", cognitiveLevel: "apply" },
                { description: "infer meaning of new words in a text", cognitiveLevel: "apply" },
                { description: "appreciate vocabulary building for language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading aloud (Articulation)",
              order: 3,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.36, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "read short and simple sentences fluently", cognitiveLevel: "apply" },
                { description: "use appropriate pace to read simple texts for fluency", cognitiveLevel: "apply" },
                { description: "read texts in German for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading comprehension",
              order: 4,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.38, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "pronounce target words accurately for effective communication", cognitiveLevel: "apply" },
                { description: "respond to questions on a text for comprehension", cognitiveLevel: "apply" },
                { description: "develop interest in reading German texts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud (fluency)",
              order: 5,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.40, Strand 2.0, Sub-strand 2.5",
              verification: "unverified" as const,
              slos: [
                { description: "read target vocabulary in a given text", cognitiveLevel: "apply" },
                { description: "read a short passage with proper intonation and appropriate speed", cognitiveLevel: "apply" },
                { description: "develop interest in reading German texts fluently", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Comprehension",
              order: 6,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.42, Strand 2.0, Sub-strand 2.6",
              verification: "unverified" as const,
              slos: [
                { description: "identify locations where various foods are bought", cognitiveLevel: "apply" },
                { description: "summarise ideas presented in a written text for comprehension", cognitiveLevel: "apply" },
                { description: "read German texts for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud (Fluency)",
              order: 7,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.44, Strand 2.0, Sub-strand 2.7",
              verification: "unverified" as const,
              slos: [
                { description: "identify descriptive words from a text for comprehension", cognitiveLevel: "apply" },
                { description: "read a passage related to the theme using correct pronunciation for fluency", cognitiveLevel: "apply" },
                { description: "acknowledge the need for correct pronunciation for effective communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Comprehension",
              order: 8,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.46, Strand 2.0, Sub-strand 2.8",
              verification: "unverified" as const,
              slos: [
                { description: "identify the various clothing used for different weather seasons", cognitiveLevel: "apply" },
                { description: "respond to questions based on the theme for comprehension", cognitiveLevel: "apply" },
                { description: "advocate for reading of German texts for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud",
              order: 9,
              suggestedLessons: 2,
              sourceRef: "KICD G7 German p.48, Strand 2.0, Sub-strand 2.9",
              verification: "unverified" as const,
              slos: [
                { description: "select a reading text from a collection of materials", cognitiveLevel: "apply" },
                { description: "track the reading progress for self-assessment", cognitiveLevel: "apply" },
                { description: "develop a positive attitude towards reading", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "WRITING",
          order: 3,
          subStrands: [
            {
              name: "Guided Writing: Vocabulary",
              order: 1,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.51, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with the correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Orthography",
              order: 2,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.53, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "use language to convey short written interactive messages", cognitiveLevel: "apply" },
                { description: "construct relatively long simple texts", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided writing: Vocabulary, Functional writing: Shopping lists",
              order: 3,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.55, Strand 3.0, Sub-strand 3.3",
              verification: "unverified" as const,
              slos: [
                { description: "decode the meaning of words from texts", cognitiveLevel: "apply" },
                { description: "construct simple, coherent sentences and short paragraphs", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in varied contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: German writing rules",
              order: 4,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.57, Strand 3.0, Sub-strand 3.4",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided writing: Descriptive writing",
              order: 5,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.59, Strand 3.0, Sub-strand 3.5",
              verification: "unverified" as const,
              slos: [
                { description: "apply basic spelling and punctuation rules in simple written communication", cognitiveLevel: "apply" },
                { description: "write texts on leisure, games and sporting activities", cognitiveLevel: "apply" },
                { description: "display increased interest to express ideas and information in a coherent and organized manner through writing", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided writing: Creative writing: Dialogues, Functional writing: Shopping lists",
              order: 6,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.61, Strand 3.0, Sub-strand 3.6",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Descriptive writing",
              order: 7,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.63, Strand 3.0, Sub-strand 3.7",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided writing: German Orthography writing rules",
              order: 8,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.65, Strand 3.0, Sub-strand 3.8",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided writing: Creative writing: Dialogues",
              order: 9,
              suggestedLessons: 1,
              sourceRef: "KICD G7 German p.67, Strand 3.0, Sub-strand 3.9",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
