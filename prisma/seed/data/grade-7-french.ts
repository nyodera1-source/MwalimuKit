/**
 * Grade 7 French — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, FRENCH, GRADE 7",
 *         Kenya Institute of Curriculum Development. First published 2022,
 *         revised 2024. ISBN: 978-9914-43-934-2.
 *
 * Transcribed mechanically from the design PDF: strand numbers and names,
 * sub-strand names, the published lesson count for each sub-strand, and the
 * specific learning outcomes verbatim.
 *
 * The design publishes three strands, each with nine sub-strands (one per
 * theme). The sub-strand names cycle through a set of skill types (e.g.,
 * "Interactive Speaking", "Oral Expression") combined with a theme-specific
 * topic. The skill type repeats across themes; the full name (skill type +
 * topic) is unique.
 *
 * Lesson allocation: the PDF publishes strand-level totals (27/18/9) on the
 * first sub-strand row of each strand in the summary table. These are
 * strand totals, NOT per-sub-strand counts. The body publishes no
 * per-sub-strand lesson counts. Per the transcription rules, strand-level
 * totals are NOT assigned to sub-strands.
 *
 * cognitiveLevel is NOT from the design: KICD publishes no Bloom level per
 * outcome, so it falls back to "apply" and must be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7FrenchData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "French",
      strands: [
        {
          name: "LISTENING AND SPEAKING",
          order: 1,
          subStrands: [
            {
              name: "Interactive Speaking: Informal and Other Forms of Greetings",
              order: 1,
              skillStrand: "Interactive Speaking",
              sourceRef: "KICD G7 French p.13, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "respond to questions and prompts to show comprehension and engagement", cognitiveLevel: "apply" },
                { description: "use vocabulary and expressions appropriately to probe and engage in oral interactions", cognitiveLevel: "apply" },
                { description: "use non-verbal communication cues to enhance communication", cognitiveLevel: "apply" },
                { description: "exhibit confidence to contribute actively in conversations", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Oral Expression: Nuclear Family",
              order: 2,
              skillStrand: "Oral Expression",
              sourceRef: "KICD G7 French p.15, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "use varied vocabulary when speaking", cognitiveLevel: "apply" },
                { description: "employ fluency in verbal", cognitiveLevel: "apply" },
                { description: "express enthusiasm in oral communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Interactive Listening: The market",
              order: 3,
              skillStrand: "Interactive Listening",
              sourceRef: "KICD G7 French p.17, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify key points from audio stimuli", cognitiveLevel: "apply" },
                { description: "ask and give information in oral interactions", cognitiveLevel: "apply" },
                { description: "value the importance of paying attention to details while listening", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Active Listening: Important Dates",
              order: 4,
              skillStrand: "Active Listening",
              sourceRef: "KICD G7 French p.19, Strand 1.0, Sub-strand 1.4",
              verification: "unverified" as const,
              slos: [
                { description: "recall details and information accurately from oral interactions", cognitiveLevel: "apply" },
                { description: "interpret verbal cues from audio stimuli", cognitiveLevel: "apply" },
                { description: "demonstrate willingness to be receptive to new ideas in oral interactions", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Listening for Information: Leisure Time",
              order: 5,
              skillStrand: "Listening for Information",
              sourceRef: "KICD G7 French p.20, Strand 1.0, Sub-strand 1.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify key points from audio stimuli", cognitiveLevel: "apply" },
                { description: "use information from audio stimuli to respond to questions or prompts", cognitiveLevel: "apply" },
                { description: "cultivate awareness on the importance of paying attention to details when listening for information", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Interactive Speaking: Shopping for Food",
              order: 6,
              skillStrand: "Interactive Speaking",
              sourceRef: "KICD G7 French p.22, Strand 1.0, Sub-strand 1.6",
              verification: "unverified" as const,
              slos: [
                { description: "respond to questions and prompts to show comprehension and engagement", cognitiveLevel: "apply" },
                { description: "use vocabulary and expressions appropriately to probe and engage in oral interactions", cognitiveLevel: "apply" },
                { description: "exhibit confidence to contribute actively in conversations", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Oral Expression: Physical Appearance",
              order: 7,
              skillStrand: "Oral Expression",
              sourceRef: "KICD G7 French p.24, Strand 1.0, Sub-strand 1.7",
              verification: "unverified" as const,
              slos: [
                { description: "structure oral communication in a clear and coherent manner", cognitiveLevel: "apply" },
                { description: "use gestures and facial expressions to enhance oral communication", cognitiveLevel: "apply" },
                { description: "express enthusiasm to engage in oral communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Active Listening: Seasons",
              order: 8,
              skillStrand: "Active Listening",
              sourceRef: "KICD G7 French p.26, Strand 1.0, Sub-strand 1.8",
              verification: "unverified" as const,
              slos: [
                { description: "recall key points in spoken communication", cognitiveLevel: "apply" },
                { description: "interpret verbal cues from audio stimuli", cognitiveLevel: "apply" },
                { description: "demonstrate willingness to be receptive to new ideas in oral interactions", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Interactive Speaking: In the Neighbourhood",
              order: 9,
              skillStrand: "Interactive Speaking",
              sourceRef: "KICD G7 French p.28, Strand 1.0, Sub-strand 1.9",
              verification: "unverified" as const,
              slos: [
                { description: "respond to questions and prompts to show comprehension and engagement", cognitiveLevel: "apply" },
                { description: "use vocabulary and expressions appropriately to probe and engage in oral interactions", cognitiveLevel: "apply" },
                { description: "use non-verbal communication cues to enhance communication", cognitiveLevel: "apply" },
                { description: "exhibit confidence to contribute actively in conversations", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "READING",
          order: 2,
          subStrands: [
            {
              name: "Reading Aloud: Informal and Other Forms of Greetings",
              order: 1,
              skillStrand: "Reading Aloud",
              sourceRef: "KICD G7 French p.31, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "infer meaning of words from simple texts", cognitiveLevel: "apply" },
                { description: "read simple texts fluently using the right intonation and pace", cognitiveLevel: "apply" },
                { description: "show enthusiasm in reading simple varied texts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Nuclear family",
              order: 2,
              skillStrand: "Reading Aloud",
              sourceRef: "KICD G7 French p.33, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary and expressions in texts", cognitiveLevel: "apply" },
                { description: "read simple texts for comprehension", cognitiveLevel: "apply" },
                { description: "read texts with confidence with support", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading for understanding: The Market",
              order: 3,
              skillStrand: "Reading for understanding",
              sourceRef: "KICD G7 French p.34, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "Summarize key details and facts from the text", cognitiveLevel: "apply" },
                { description: "read fluently using the right intonation and pace", cognitiveLevel: "apply" },
                { description: "read texts for understanding", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Important Dates",
              order: 4,
              skillStrand: "Reading Aloud",
              sourceRef: "KICD G7 French p.35, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "decode familiar sounds in words to read simple short texts", cognitiveLevel: "apply" },
                { description: "read texts with correct intonation, pace and fluency", cognitiveLevel: "apply" },
                { description: "read varied texts with enthusiasm", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading for Understanding: Leisure Time",
              order: 5,
              skillStrand: "Reading for Understanding",
              sourceRef: "KICD G7 French p.36, Strand 2.0, Sub-strand 2.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify key details and facts from written texts", cognitiveLevel: "apply" },
                { description: "apply information from the text and answer questions", cognitiveLevel: "apply" },
                { description: "show an increasing ability to understand words and phrases in context", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Shopping for Food",
              order: 6,
              skillStrand: "Reading Aloud",
              sourceRef: "KICD G7 French p.37, Strand 2.0, Sub-strand 2.6",
              verification: "unverified" as const,
              slos: [
                { description: "identify vocabulary and expressions from texts", cognitiveLevel: "apply" },
                { description: "read texts with correct intonation, pace and fluency", cognitiveLevel: "apply" },
                { description: "read varied texts with enthusiasm", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Physical Appearance",
              order: 7,
              skillStrand: "Reading Aloud",
              sourceRef: "KICD G7 French p.38, Strand 2.0, Sub-strand 2.7",
              verification: "unverified" as const,
              slos: [
                { description: "decode familiar sounds in words to read simple short texts", cognitiveLevel: "apply" },
                { description: "read texts with correct intonation, pace and fluency", cognitiveLevel: "apply" },
                { description: "read varied texts with enthusiasm", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Reading Aloud: Seasons",
              order: 8,
              skillStrand: "Reading Aloud",
              sourceRef: "KICD G7 French p.39, Strand 2.0, Sub-strand 2.8",
              verification: "unverified" as const,
              slos: [
                { description: "decode familiar sounds in words to read simple short texts", cognitiveLevel: "apply" },
                { description: "read texts with correct intonation, pace and fluency", cognitiveLevel: "apply" },
                { description: "read varied texts with enthusiasm", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Reading: In the Neighbourhood",
              order: 9,
              skillStrand: "Guided Reading",
              sourceRef: "KICD G7 French p.41, Strand 2.0, Sub-strand 2.9",
              verification: "unverified" as const,
              slos: [
                { description: "decode familiar sounds in words to read simple short texts", cognitiveLevel: "apply" },
                { description: "read texts with correct intonation, pace and fluency", cognitiveLevel: "apply" },
                { description: "read varied texts with enthusiasm", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "WRITING",
          order: 3,
          subStrands: [
            {
              name: "Guided Writing: Informal and Other Forms of Greetings",
              order: 1,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.44, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with the correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Nuclear Family",
              order: 2,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.46, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "use language to convey short written interactive messages", cognitiveLevel: "apply" },
                { description: "construct relatively long simple texts", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: The Market",
              order: 3,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.47, Strand 3.0, Sub-strand 3.3",
              verification: "unverified" as const,
              slos: [
                { description: "decode the meaning of words from texts", cognitiveLevel: "apply" },
                { description: "construct simple, coherent sentences and short paragraphs", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in varied contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Important Dates",
              order: 4,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.48, Strand 3.0, Sub-strand 3.4",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Leisure Time",
              order: 5,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.49, Strand 3.0, Sub-strand 3.5",
              verification: "unverified" as const,
              slos: [
                { description: "apply basic spelling and punctuation rules in simple written communication", cognitiveLevel: "apply" },
                { description: "write texts on leisure, games and sporting activities", cognitiveLevel: "apply" },
                { description: "display increased interest to express ideas and information in a coherent and organized manner through writing", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Shopping for Food",
              order: 6,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.50, Strand 3.0, Sub-strand 3.6",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Physical Appearance",
              order: 7,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.51, Strand 3.0, Sub-strand 3.7",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: Seasons",
              order: 8,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.52, Strand 3.0, Sub-strand 3.8",
              verification: "unverified" as const,
              slos: [
                { description: "write common words with correct orthography", cognitiveLevel: "apply" },
                { description: "create simple sentences using correct structures", cognitiveLevel: "apply" },
                { description: "appreciate the role of writing in interactive communication contexts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Guided Writing: In the Neighbourhood",
              order: 9,
              skillStrand: "Guided Writing",
              sourceRef: "KICD G7 French p.54, Strand 3.0, Sub-strand 3.9",
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
