/**
 * Grade 10 Arabic transcribed from the KICD curriculum design.
 * Detailed-table lesson allocations take precedence over the summary table.
 * Arabic theme labels are stored in logical reading order because PDF text
 * extraction reverses their right-to-left characters. Identifier whitespace
 * is normalized; published outcome wording and punctuation are retained.
 */

import type { GradeData } from "./index";

export const grade10ArabicData: GradeData = {
  level: 10,
  name: "Grade 10",
  learningAreas: [
    {
      name: "Arabic",
      strands: [
        {
          name: "THEME 1: SOCIAL LIFE (الحياة الاجتماعية)",
          order: 1,
          subStrands: [
            {
              name: "1.1 Listening Comprehension",
              order: 1,
              skillStrand: "Listening and Speaking",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.1, Strand 1.0, Sub-Strand 1.1",
              verification: "unverified",
              slos: [
                { description: "identify Arabic letters and their sounds for comprehension,", cognitiveLevel: "apply" },
                { description: "combine syllables and sounds to form words,", cognitiveLevel: "apply" },
                { description: "respond to simple oral questions appropriately,", cognitiveLevel: "apply" },
                { description: "develop interest in learning the Arabic language.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "2.1 Reading for Comprehension",
              order: 2,
              skillStrand: "Reading",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.3, Strand 2.0, Sub-Strand 2.1",
              verification: "unverified",
              slos: [
                { description: "identify the main ideas in a text,", cognitiveLevel: "apply" },
                { description: "respond to questions from a text for comprehension,", cognitiveLevel: "apply" },
                { description: "summarise information from a short text,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of reading for comprehension in lifelong learning.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "3.1 Handwriting",
              order: 3,
              skillStrand: "Writing",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.5, Strand 3.0, Sub-Strand 3.1",
              verification: "unverified",
              slos: [
                { description: "trace letters of the Arabic Alphabet neatly and legibly for comprehension,", cognitiveLevel: "apply" },
                { description: "rewrite words, phrases and sentences neatly for accuracy,", cognitiveLevel: "apply" },
                { description: "appreciate the significance of neatness and legibility in writing.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "4.1 Word class: Nouns",
              order: 4,
              skillStrand: "Grammar",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.7, Strand 4.0, Sub-Strand 4.1",
              verification: "unverified",
              slos: [
                { description: "identify nouns in terms of their definiteness, gender, singular, dual and plural forms,", cognitiveLevel: "apply" },
                { description: "use nouns featuring definiteness, gender, singular, dual and plural to construct sentences correctly,", cognitiveLevel: "apply" },
                { description: "appreciate the significance of nouns in language acquisition.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THEME 2: MY ENVIRONMENT (بيئتي)",
          order: 2,
          subStrands: [
            {
              name: "1.2 Oral Presentations",
              order: 1,
              skillStrand: "Listening and Speaking",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.9, Strand 1.0, Sub-Strand 1.2",
              verification: "unverified",
              slos: [
                { description: "express opinions and ideas orally on a given context,", cognitiveLevel: "apply" },
                { description: "make a short speech for effective communication,", cognitiveLevel: "apply" },
                { description: "appreciate presenting ideas orally to convey a message.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "2.2 Reading Fluency",
              order: 2,
              skillStrand: "Reading",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.11, Strand 2.0, Sub-Strand 2.2",
              verification: "unverified",
              slos: [
                { description: "identify the techniques of reading fluently,", cognitiveLevel: "apply" },
                { description: "read a text with correct intonation, stress and pronunciation,", cognitiveLevel: "apply" },
                { description: "apply appropriate expression when reading a text for fluency,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of reading fluency for understanding.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "3.2 Mechanics of Writing: Spelling",
              order: 3,
              skillStrand: "Writing",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.13, Strand 3.0, Sub-Strand 3.2",
              verification: "unverified",
              slos: [
                { description: "identify vocabulary related to the theme for language acquisition,", cognitiveLevel: "apply" },
                { description: "write texts using correct spelling for comprehension,", cognitiveLevel: "apply" },
                { description: "acknowledge the role of spelling in communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "4.2 Word class: Pronouns and Conjunctions",
              order: 4,
              skillStrand: "Grammar",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.15, Strand 4.0, Sub-Strand 4.2",
              verification: "unverified",
              slos: [
                { description: "identify pronouns and conjunctions in texts,", cognitiveLevel: "apply" },
                { description: "use pronouns and conjunctions correctly in sentences,", cognitiveLevel: "apply" },
                { description: "value the use of pronouns and conjunctions in communication.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THEME 3: TOURISM (السياحة)",
          order: 3,
          subStrands: [
            {
              name: "1.3 Speaking Fluency",
              order: 1,
              skillStrand: "Listening and Speaking",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.17, Strand 1.0, Sub-Strand 1.3",
              verification: "unverified",
              slos: [
                { description: "express opinions and ideas fluently,", cognitiveLevel: "apply" },
                { description: "use appropriate stress and intonation to describe places,", cognitiveLevel: "apply" },
                { description: "respond fluently to given instructions,", cognitiveLevel: "apply" },
                { description: "acknowledge fluency speaking in communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "2.3 Reading for Information",
              order: 2,
              skillStrand: "Reading",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.19, Strand 2.0, Sub-Strand 2.3",
              verification: "unverified",
              slos: [
                { description: "identify main information from a text,", cognitiveLevel: "apply" },
                { description: "infer meaning of vocabulary or phrases for language acquisition,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of reading as a source of information.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "3.3 Creative Writing: Sequencing Ideas",
              order: 3,
              skillStrand: "Writing",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.21, Strand 3.0, Sub-Strand 3.3",
              verification: "unverified",
              slos: [
                { description: "express ideas and opinions in a logical and coherent manner,", cognitiveLevel: "apply" },
                { description: "use connectors of sequence to organise ideas for effective communication,", cognitiveLevel: "apply" },
                { description: "construct logical and coherent paragraphs for information,", cognitiveLevel: "apply" },
                { description: "appreciate the skill of organising ideas for effective communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "4.3 Word class: Pronouns and Articles",
              order: 4,
              skillStrand: "Grammar",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.23, Strand 4.0, Sub-Strand 4.3",
              verification: "unverified",
              slos: [
                { description: "identify demonstrative pronouns and interrogative articles in a variety of texts,", cognitiveLevel: "apply" },
                { description: "use demonstrative pronouns and interrogative articles correctly in sentences,", cognitiveLevel: "apply" },
                { description: "appreciate the use of correct demonstrative pronouns and interrogative articles for communication.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THEME 4: HEALTH (الصحة)",
          order: 4,
          subStrands: [
            {
              name: "1.4 Attentive Listening",
              order: 1,
              skillStrand: "Listening and Speaking",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.25, Strand 1.0, Sub-Strand 1.4",
              verification: "unverified",
              slos: [
                { description: "identify specific details from a text for comprehension,", cognitiveLevel: "apply" },
                { description: "listen to variety of texts to obtain information,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of listening attentively for lifelong learning.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "2.4 Intensive Reading: Poetry",
              order: 2,
              skillStrand: "Reading",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.27, Strand 2.0, Sub-Strand 2.4",
              verification: "unverified",
              slos: [
                { description: "read poems fluently for enjoyment,", cognitiveLevel: "apply" },
                { description: "analyse Arabic poems based on the subject matter for information,", cognitiveLevel: "apply" },
                { description: "develop interest in reading Arabic poems for enjoyment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "3.4 Descriptive Writing",
              order: 3,
              skillStrand: "Writing",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.29, Strand 3.0, Sub-Strand 3.4",
              verification: "unverified",
              slos: [
                { description: "identify descriptive words for information,", cognitiveLevel: "apply" },
                { description: "compose a short descriptive text about a person, thing or place,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of descriptive writing in communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "4.4 Word class",
              order: 4,
              skillStrand: "Grammar",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.31, Strand 4.0, Sub-Strand 4.4",
              verification: "unverified",
              slos: [
                { description: "identify adverbs, prepositions and adjectives from a reading text,", cognitiveLevel: "apply" },
                { description: "use adverbs, prepositions and adjectives correctly in sentences,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of using adverbs, prepositions and adjectives correctly for lifelong learning.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THEME 5: SCHOOL AND THE WORLD OF WORK (المدرسة وعالم العمل)",
          order: 5,
          subStrands: [
            {
              name: "1.5 Selective Listening",
              order: 1,
              skillStrand: "Listening and Speaking",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.33, Strand 1.0, Sub-Strand 1.5",
              verification: "unverified",
              slos: [
                { description: "pick out target vocabulary from an oral text for information,", cognitiveLevel: "apply" },
                { description: "listen to selected texts to deduce specific information,", cognitiveLevel: "apply" },
                { description: "acknowledge the significance of selective listening in communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "2.5 Extensive Reading: Library skills",
              order: 2,
              skillStrand: "Reading",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.35, Strand 2.0, Sub-Strand 2.5",
              verification: "unverified",
              slos: [
                { description: "read simple Arabic texts for enjoyment,", cognitiveLevel: "apply" },
                { description: "track reading progress for lifelong learning,", cognitiveLevel: "apply" },
                { description: "develop a positive reading culture for lifelong learning.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "3.5 Creative Writing",
              order: 3,
              skillStrand: "Writing",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.37, Strand 3.0, Sub-Strand 3.5",
              verification: "unverified",
              slos: [
                { description: "outline vocabulary related to the theme for language acquisition,", cognitiveLevel: "apply" },
                { description: "write short imaginative texts based on the theme,", cognitiveLevel: "apply" },
                { description: "appreciate the significance of creative writing in communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "4.5 Word class: Verbs",
              order: 4,
              skillStrand: "Grammar",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.39, Strand 4.0, Sub-Strand 4.5",
              verification: "unverified",
              slos: [
                { description: "identify the past, present and imperative verb forms,", cognitiveLevel: "apply" },
                { description: "apply past tense, present and imperative verb forms correctly,", cognitiveLevel: "apply" },
                { description: "acknowledge the significance of tense in language learning.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THEME 6: THE WORLD OF BUSINESS (عالم الأعمال)",
          order: 6,
          subStrands: [
            {
              name: "1.6 Listening for Gist",
              order: 1,
              skillStrand: "Listening and Speaking",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.41, Strand 1.0, Sub-Strand 1.6",
              verification: "unverified",
              slos: [
                { description: "identify the main idea from a text,", cognitiveLevel: "apply" },
                { description: "paraphrase a text for specific information,", cognitiveLevel: "apply" },
                { description: "acknowledge the importance of listening skills in communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "2.6 Intensive Reading: Arabic Prose",
              order: 2,
              skillStrand: "Reading",
              suggestedLessons: 7,
              sourceRef: "KICD G10 Arabic p.43, Strand 2.0, Sub-Strand 2.6",
              verification: "unverified",
              slos: [
                { description: "describe the characteristics of Arabic prose,", cognitiveLevel: "apply" },
                { description: "describe characters in a prose text for information,", cognitiveLevel: "apply" },
                { description: "discuss prose texts by author and events for information,", cognitiveLevel: "apply" },
                { description: "value the role of prose in culture transmission.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "3.6 Functional Writing: Informal letter",
              order: 3,
              skillStrand: "Writing",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.45, Strand 3.0, Sub-Strand 3.6",
              verification: "unverified",
              slos: [
                { description: "identify an informal letter by structure and format for comprehension,", cognitiveLevel: "apply" },
                { description: "write an informal letter following the correct format,", cognitiveLevel: "apply" },
                { description: "develop interest in writing informal letters for communication.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "4.6 Sentence patterns",
              order: 4,
              skillStrand: "Grammar",
              suggestedLessons: 8,
              sourceRef: "KICD G10 Arabic p.47, Strand 4.0, Sub-Strand 4.6",
              verification: "unverified",
              slos: [
                { description: "identify sentences featuring the subject and predicate,", cognitiveLevel: "apply" },
                { description: "use the sentence patterns correctly,", cognitiveLevel: "apply" },
                { description: "acknowledge the use of correct sentence patterns in communication.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
