/**
 * Grade 7 Arabic — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, ARABIC, GRADE 7",
 *         Kenya Institute of Curriculum Development. First published 2022,
 *         revised 2024.
 *
 * Transcribed mechanically from the design PDF: strand numbers and names,
 * sub-strand names, the published lesson count for each sub-strand, and the
 * specific learning outcomes verbatim.
 *
 * The design publishes three strands, each with nine sub-strands (one per
 * theme). Each sub-strand has "(2 sessions)" explicitly published.
 * Strand 1.0 = 9 × 2 = 18, Strand 2.0 = 9 × 2 = 18, Strand 3.0 = 9 × 2 = 18.
 * Total = 54 + 6 showcasing = 60.
 *
 * NOTE: The summary table (p.x) is internally inconsistent — it lists 5
 * sub-strands for strand 1.0 with counts 4/6/6/2/2 (sum 20) but states
 * "Total 16". The body publishes 9 sub-strands × 2 sessions = 18. The body
 * is the authority for the SLOs; the summary conflict is documented in the
 * audit.
 *
 * cognitiveLevel is NOT from the design: KICD publishes no Bloom level per
 * outcome, so it falls back to "apply" and must be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7ArabicData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Arabic",
      strands: [
        {
          name: "LISTENING AND SPEAKING",
          order: 1,
          subStrands: [
            {
              name: "Listening for Gist",
              order: 1,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.13, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify the main idea in a spoken text", cognitiveLevel: "apply" },
                { description: "respond to simple questions on greetings and introduction of self and others", cognitiveLevel: "apply" },
                { description: "develop interest in learning Arabic", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Imitative Speaking: Pronunciation",
              order: 2,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.15, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify family members by their names and professions", cognitiveLevel: "apply" },
                { description: "apply appropriate intonation and stress in pronouncing words for fluency", cognitiveLevel: "apply" },
                { description: "appreciate the role of immediate family members for social co-existence", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Phonological Awareness",
              order: 3,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.17, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "pronounce words related to the theme appropriately", cognitiveLevel: "apply" },
                { description: "apply appropriate stress and intonation for fluency", cognitiveLevel: "apply" },
                { description: "develop interest pronouncing Arabic words correctly", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for Gist",
              order: 4,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.19, Strand 1.0, Sub-strand 1.4",
              verification: "unverified" as const,
              slos: [
                { description: "identify key ideas from a spoken text related to the theme", cognitiveLevel: "apply" },
                { description: "use acquired vocabulary to make sentences for comprehension", cognitiveLevel: "apply" },
                { description: "acknowledge important dates and holidays for lifelong learning", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for Information",
              order: 5,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.21, Strand 1.0, Sub-strand 1.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify specific information from an oral text for information", cognitiveLevel: "apply" },
                { description: "respond to simple verbal instructions correctly", cognitiveLevel: "apply" },
                { description: "acknowledge the role of listening keenly for lifelong learning", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Phonological Awareness",
              order: 6,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.23, Strand 1.0, Sub-strand 1.6",
              verification: "unverified" as const,
              slos: [
                { description: "pronounce vocabulary accurately for fluency", cognitiveLevel: "apply" },
                { description: "use acquired vocabulary to describe an event fluently", cognitiveLevel: "apply" },
                { description: "appreciate fluency in speech using acquired vocabulary", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Imitative Speaking",
              order: 7,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.25, Strand 1.0, Sub-strand 1.7",
              verification: "unverified" as const,
              slos: [
                { description: "identify words used to describe people and things", cognitiveLevel: "apply" },
                { description: "describe different things and events using relevant descriptive words", cognitiveLevel: "apply" },
                { description: "appreciate vocabulary building for language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Conversational Skills",
              order: 8,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.27, Strand 1.0, Sub-strand 1.8",
              verification: "unverified" as const,
              slos: [
                { description: "identify non-verbal cues used for effective communication", cognitiveLevel: "apply" },
                { description: "use appropriate non-verbal cues in oral presentations", cognitiveLevel: "apply" },
                { description: "develop interest in speaking skills", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Phonological Awareness: Pronunciation",
              order: 9,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.29, Strand 1.0, Sub-strand 1.9",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary related to the theme from an oral text", cognitiveLevel: "apply" },
                { description: "use accurate pronunciation in target words for fluency", cognitiveLevel: "apply" },
                { description: "appreciate the role of fluency in effective communication", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "READING",
          order: 2,
          subStrands: [
            {
              name: "Reading Aloud: Fluency",
              order: 1,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.33, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "differentiate words and phrases based on their pronunciation correctly", cognitiveLevel: "apply" },
                { description: "read simple sentences on basic introductions fluently", cognitiveLevel: "apply" },
                { description: "develop interest in reading Arabic texts for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Comprehension",
              order: 2,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.35, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary and phrases in a written text", cognitiveLevel: "apply" },
                { description: "infer meaning of new words in a text", cognitiveLevel: "apply" },
                { description: "appreciate vocabulary building for language acquisition", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Fluency",
              order: 3,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.37, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "read short and simple sentences fluently", cognitiveLevel: "apply" },
                { description: "use appropriate pace to read simple texts for fluency", cognitiveLevel: "apply" },
                { description: "read texts in Arabic for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Comprehension",
              order: 4,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.39, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "pronounce target words accurately for effective communication", cognitiveLevel: "apply" },
                { description: "respond to questions on a text for comprehension", cognitiveLevel: "apply" },
                { description: "develop interest in reading Arabic texts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Fluency",
              order: 5,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.41, Strand 2.0, Sub-strand 2.5",
              verification: "unverified" as const,
              slos: [
                { description: "read target vocabulary in a given text", cognitiveLevel: "apply" },
                { description: "read a short passage with proper intonation and appropriate speed", cognitiveLevel: "apply" },
                { description: "develop interest in reading Arabic texts fluently", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading for Information",
              order: 6,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.43, Strand 2.0, Sub-strand 2.6",
              verification: "unverified" as const,
              slos: [
                { description: "identify locations where various foods are bought", cognitiveLevel: "apply" },
                { description: "summarise ideas presented in a written text for comprehension", cognitiveLevel: "apply" },
                { description: "read Arabic texts for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Fluency",
              order: 7,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.45, Strand 2.0, Sub-strand 2.7",
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
              sourceRef: "KICD G7 Arabic p.47, Strand 2.0, Sub-strand 2.8",
              verification: "unverified" as const,
              slos: [
                { description: "identify the various clothing used for different weather seasons", cognitiveLevel: "apply" },
                { description: "respond to questions based on the theme for comprehension", cognitiveLevel: "apply" },
                { description: "advocate for reading of Arabic texts for enjoyment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Extensive Reading: Library Skills",
              order: 9,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.49, Strand 2.0, Sub-strand 2.9",
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
              name: "Guided Writing: Handwriting",
              order: 1,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.52, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with the correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Spelling",
              order: 2,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.54, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "use language to convey short written interactive messages", cognitiveLevel: "apply" },
                { description: "construct relatively long simple texts", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Paragraph Writing",
              order: 3,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.56, Strand 3.0, Sub-strand 3.3",
              verification: "unverified" as const,
              slos: [
                { description: "decode the meaning of words from texts", cognitiveLevel: "apply" },
                { description: "construct simple, coherent sentences and short paragraphs", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in varied contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Sequencing Ideas",
              order: 4,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.58, Strand 3.0, Sub-strand 3.4",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Imaginative Writing",
              order: 5,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.60, Strand 3.0, Sub-strand 3.5",
              verification: "unverified" as const,
              slos: [
                { description: "apply basic spelling and punctuation rules in simple written communication", cognitiveLevel: "apply" },
                { description: "write texts on leisure, games and sporting activities", cognitiveLevel: "apply" },
                { description: "display increased interest to express ideas and information in a coherent and organized manner through writing", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Punctuation",
              order: 6,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.62, Strand 3.0, Sub-strand 3.6",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Poetry",
              order: 7,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.64, Strand 3.0, Sub-strand 3.7",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Paragraph Writing",
              order: 8,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.66, Strand 3.0, Sub-strand 3.8",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Paragraph Writing",
              order: 9,
              suggestedLessons: 2,
              sourceRef: "KICD G7 Arabic p.68, Strand 3.0, Sub-strand 3.9",
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
