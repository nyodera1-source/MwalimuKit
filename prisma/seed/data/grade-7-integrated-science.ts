/**
 * Grade 7 Integrated Science — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, INTEGRATED SCIENCE, GRADE 7",
 *         Kenya Institute of Curriculum Development.
 *
 * Two levels, like Mathematics: strand (1.0) and sub strand (1.1), with the
 * published lesson count on the sub strand.
 *
 * Transcribed mechanically: 4 strands, 9 sub-strands, 150 published lessons and
 * 39 specific learning outcomes, verbatim. 150 lessons matches the official
 * Junior School allocation of 5 Integrated Science periods a week over 30
 * teaching weeks.
 *
 * Replaces the previous seed, which had a strand called "Matter" and "Living
 * Things". The design calls them "Mixtures" and "Living Things and Their
 * Environment", and it publishes lesson counts the old seed had none of.
 *
 * cognitiveLevel is not from the design, so it falls back to "apply" and must
 * be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7IntegratedScienceData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Integrated Science",
      strands: [
        {
          name: "SCIENTIFIC INVESTIGATION",
          order: 1,
          subStrands: [
            {
              name: "Introduction to Integrated Science",
              order: 1,
              suggestedLessons: 12,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "outline the components of Integrated Science as a field of study", cognitiveLevel: "apply" },
                { description: "explain the importance of science in daily life", cognitiveLevel: "apply" },
                { description: "show interest in learning Integrated Science at junior school.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Laboratory Safety",
              order: 2,
              suggestedLessons: 14,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify common hazards and their symbols in the laboratory", cognitiveLevel: "apply" },
                { description: "explain causes of common accidents in the laboratory", cognitiveLevel: "apply" },
                { description: "demonstrate First Aid measures for common laboratory accidents", cognitiveLevel: "apply" },
                { description: "appreciate the importance of safety in the laboratory and access to a healthy working environment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Laboratory apparatus and instruments",
              order: 3,
              suggestedLessons: 16,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "describe the basic skills in science", cognitiveLevel: "apply" },
                { description: "use and care for apparatus and instruments in the laboratory", cognitiveLevel: "apply" },
                { description: "use the SI units for basic and derived quantities in science", cognitiveLevel: "apply" },
                { description: "appreciate consumer protection when handling different apparatus, instruments and other materials in day to day life.", cognitiveLevel: "apply" },
                { description: "(include parts, functions and care of a light microscope; and parts of a bunsen burner)", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "MIXTURES",
          order: 2,
          subStrands: [
            {
              name: "Mixtures",
              order: 1,
              suggestedLessons: 18,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "separate homogeneous mixtures using appropriate methods", cognitiveLevel: "apply" },
                { description: "outline applications of separating homogeneous mixtures in day to day life", cognitiveLevel: "apply" },
                { description: "appreciate the use of different methods of separating mixtures in day-to-day life.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Acids, bases and indicators",
              order: 2,
              suggestedLessons: 22,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify acids and bases using a litmus paper", cognitiveLevel: "apply" },
                { description: "prepare an acid-base indicator from plant extracts", cognitiveLevel: "apply" },
                { description: "describe the physical properties of acids and bases", cognitiveLevel: "apply" },
                { description: "outline applications of acids, bases and indicators in real life", cognitiveLevel: "apply" },
                { description: "appreciate the uses of acids and bases in real life.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "LIVING THINGS AND THEIR ENVIRONMENT",
          order: 3,
          subStrands: [
            {
              name: "Human reproductive system",
              order: 1,
              suggestedLessons: 16,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify parts of the human male and female reproductive systems", cognitiveLevel: "apply" },
                { description: "describe functions of parts of the male and female reproductive system", cognitiveLevel: "apply" },
                { description: "describe the physical changes that take place in boys and girls during adolescence", cognitiveLevel: "apply" },
                { description: "develop a plan to manage Learners", cognitiveLevel: "apply" },
                { description: "appreciate that physical changes in boys and girls during adolescence have social and reproductive implications. search for information on developmental challenges during adolescence and coping mechanisms, discuss and share with peers", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Human Excretory System",
              order: 2,
              suggestedLessons: 18,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify parts of human skin and their functions", cognitiveLevel: "apply" },
                { description: "identify parts of the urinary system and their functions", cognitiveLevel: "apply" },
                { description: "describe causes of kidney disorders", cognitiveLevel: "apply" },
                { description: "develop and maintain a daily log on activities that promote skin and kidney health", cognitiveLevel: "apply" },
                { description: "appreciate the need for a healthy lifestyle to promote kidney and skin health.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "FORCE AND ENERGY",
          order: 4,
          subStrands: [
            {
              name: "Electrical Energy",
              order: 1,
              suggestedLessons: 18,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify sources of electricity in the environment", cognitiveLevel: "apply" },
                { description: "demonstrate flow of electric current using simple electric circuits", cognitiveLevel: "apply" },
                { description: "identify common electrical appliances used in day to day life", cognitiveLevel: "apply" },
                { description: "identify safety measures observed when handling electrical appliances", cognitiveLevel: "apply" },
                { description: "appreciate the use of electricity in day to day life.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Magnetism",
              order: 2,
              suggestedLessons: 16,
              sourceRef: "KICD G7 Integrated Science p.1, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "demonstrate the properties of a magnet", cognitiveLevel: "apply" },
                { description: "classify materials as magnetic or non- magnetic", cognitiveLevel: "apply" },
                { description: "identify the uses of magnets in day-to-day life", cognitiveLevel: "apply" },
                { description: "appreciate the applications of magnets in day-to- day life.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
