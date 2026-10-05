/**
 * Grade 7 Agriculture and Nutrition — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, AGRICULTURE AND NUTRITION, GRADE 7",
 *         Kenya Institute of Curriculum Development.
 *
 * Two levels, like Mathematics, Integrated Science and Social Studies.
 *
 * Transcribed mechanically: 4 strands, 14 sub-strands, 120 published lessons
 * and 42 specific learning outcomes, verbatim. The 120 lessons reconcile exactly
 * against the official Junior School allocation of 4 periods a week over 30
 * teaching weeks.
 *
 * SUBJECT RENAMED. The design is "Agriculture and Nutrition", a combined
 * subject, and it replaces the previously seeded "Agriculture", which had three
 * strands (Soil Science, Crop Production, Animal Production) that are not the
 * Junior School structure at all. A teacher looking for Agriculture and Nutrition
 * would not have found it under the old name.
 *
 * SOURCE REFERENCES CARRY NO PAGE NUMBER. This design prints bare page numbers
 * with no recoverable marker, so sub-strands are cited by strand and number.
 *
 * cognitiveLevel is not from the design, so it falls back to "apply" and must
 * be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7AgricultureData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Agriculture and Nutrition",
      strands: [
        {
          name: "CONSERVATION OF RESOURCES",
          order: 1,
          subStrands: [
            {
              name: "Controlling Soil Pollution",
              order: 1,
              suggestedLessons: 7,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the causes of soil pollution in gardening", cognitiveLevel: "apply" },
                { description: "control soil pollution in home environment", cognitiveLevel: "apply" },
                { description: "demonstrate responsibility in using safe farming practices to conserve the soil.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Constructing Water Retention Structures",
              order: 2,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe how surface run-off can be used in gardening", cognitiveLevel: "apply" },
                { description: "construct water retention structures to conserve surface runoff", cognitiveLevel: "apply" },
                { description: "adopt utilization of surface run-off in gardening.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Conserving Food Nutrients",
              order: 3,
              suggestedLessons: 9,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify ways of conserving vitamins and mineral salts in vegetables", cognitiveLevel: "apply" },
                { description: "conserve vitamins and mineral salts in vegetables", cognitiveLevel: "apply" },
                { description: "adopt conservation of vitamins and mineral salts in vegetables.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Growing Trees",
              order: 4,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 1.0, Sub-strand 1.4",
              verification: "unverified" as const,
              slos: [
                { description: "explain the importance of trees in conserving the environment", cognitiveLevel: "apply" },
                { description: "plant trees to conserve the environment", cognitiveLevel: "apply" },
                { description: "adopt tree planting as a way of conserving the environment.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "FOOD PRODUCTION PROCESSES",
          order: 2,
          subStrands: [
            {
              name: "Preparing Planting Site and Establishing crop",
              order: 1,
              suggestedLessons: 9,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "determine appropriate tilth for selected planting material", cognitiveLevel: "apply" },
                { description: "prepare a suitable tilth for establishing selected planting material", cognitiveLevel: "apply" },
                { description: "adopt appropriate tilth in establishing a selected planting material.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Selected Crop Management Practices",
              order: 2,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "explain management practices carried out on crops", cognitiveLevel: "apply" },
                { description: "carry out management practices in crop production", cognitiveLevel: "apply" },
                { description: "appreciate importance of various management practices in crop production.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Preparing Animal Products: Eggs and Honey",
              order: 3,
              suggestedLessons: 9,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "explain how to prepare animal products for various purposes", cognitiveLevel: "apply" },
                { description: "prepare animal products for various purposes", cognitiveLevel: "apply" },
                { description: "embrace preparation of animal products for various purposes.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Cooking: Grilling, Roasting and Steaming",
              order: 4,
              suggestedLessons: 9,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "describe methods of cooking different types of foods", cognitiveLevel: "apply" },
                { description: "cook food using various methods", cognitiveLevel: "apply" },
                { description: "appreciate the use of varied methods of cooking food.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "HYGIENE PRACTICES",
          order: 3,
          subStrands: [
            {
              name: "Hygiene in Rearing Animals",
              order: 1,
              suggestedLessons: 9,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe hygiene practices in rearing domestic animals", cognitiveLevel: "apply" },
                { description: "carry out hygiene practices in rearing domestic animals", cognitiveLevel: "apply" },
                { description: "appreciate importance of hygiene practices in rearing domestic animals.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Laundry: Loose Coloured Items",
              order: 2,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe how to launder a loose coloured article for hygiene purpose", cognitiveLevel: "apply" },
                { description: "launder a loose coloured article for hygiene purposes", cognitiveLevel: "apply" },
                { description: "embrace laundering of loose coloured article for hygiene purposes.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "PRODUCTION TECHNIQUES",
          order: 4,
          subStrands: [
            {
              name: "Sewing Skills: Knitting",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe knitting stitches used in making household articles", cognitiveLevel: "apply" },
                { description: "knit various articles for household use", cognitiveLevel: "apply" },
                { description: "embrace knitted articles for household use", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Constructing Framed Suspended Garden",
              order: 2,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe framed suspended garden for growing crops", cognitiveLevel: "apply" },
                { description: "construct a framed structure for suspended garden", cognitiveLevel: "apply" },
                { description: "embrace the use of framed suspended garden for growing crops.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Adding Value to Crop Produce",
              order: 3,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 4.0, Sub-strand 4.3",
              verification: "unverified" as const,
              slos: [
                { description: "explain ways of adding value on crop produce", cognitiveLevel: "apply" },
                { description: "add value to a selected crop produce", cognitiveLevel: "apply" },
                { description: "appreciate the importance of value addition on crop produce.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Making Homemade Soap",
              order: 4,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Agriculture and Nutrition, Strand 4.0, Sub-strand 4.4",
              verification: "unverified" as const,
              slos: [
                { description: "identify the forms of soap used at household level", cognitiveLevel: "apply" },
                { description: "make homemade soap using natural ingredients", cognitiveLevel: "apply" },
                { description: "embrace homemade soap for household use.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
