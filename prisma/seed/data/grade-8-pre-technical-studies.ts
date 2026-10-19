/**
 * Grade 8 Pre-Technical Studies — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, PRE-TECHNICAL STUDIES, GRADE 8",
 *         Kenya Institute of Curriculum Development, revised April 2024.
 *
 * Transcribed mechanically from the design PDF: strand numbers and names,
 * sub-strand names, the published lesson count for each sub-strand, and the
 * specific learning outcomes verbatim.
 *
 * cognitiveLevel is NOT from the design: KICD publishes no Bloom level per
 * outcome, so it falls back to "apply" and must be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade8PreTechnicalStudiesData: GradeData = {
  level: 8,
  name: "Grade 8",
  learningAreas: [
    {
      name: "Pre-Technical Studies",
      strands: [
        {
          name: "FOUNDATIONS OF PRE-TECHNICAL STUDIES",
          order: 1,
          subStrands: [
            {
              name: "Fire and Data Safety (Greetings and Introductions)",
              order: 1,
              suggestedLessons: 7,
              sourceRef: "KICD G8 Pre-Technical Studies p.10, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the possible causes of fire in a work environment,", cognitiveLevel: "apply" },
                { description: "describe ways of preventing fire in the environment,", cognitiveLevel: "apply" },
                { description: "use firefighting techniques to stop fire in an environment,", cognitiveLevel: "apply" },
                { description: "analyse threats to data in an electronic device,", cognitiveLevel: "apply" },
                { description: "secure data in an electronic device,", cognitiveLevel: "apply" },
                { description: "acknowledge the need for fire and data safety in day-to-day life.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Computer Hardware (Family)",
              order: 2,
              suggestedLessons: 11,
              sourceRef: "KICD G8 Pre-Technical Studies p.12, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "classify computer hardware devices in a user environment,", cognitiveLevel: "apply" },
                { description: "use computer hardware devices to carry out a given task,", cognitiveLevel: "apply" },
                { description: "value the importance of computer hardware devices in a user environment. : learner develops skills of interpretation and inference when categorising computer", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Consumer and Investor Protection (My Surrounding)",
              order: 3,
              suggestedLessons: 4,
              sourceRef: "KICD G8 Pre-Technical Studies p.14, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "explain the importance of consumer and investor protection in Kenya,", cognitiveLevel: "apply" },
                { description: "analyse ways in which consumers and investors are protected in Kenya,", cognitiveLevel: "apply" },
                { description: "explore the Government financial regulators in Kenya,", cognitiveLevel: "apply" },
                { description: "protect oneself from exploitation.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "COMMUNICATION",
          order: 2,
          subStrands: [
            {
              name: "Business Communication (Greetings and Introductions)",
              order: 1,
              suggestedLessons: 7,
              sourceRef: "KICD G8 Pre-Technical Studies p.17, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify forms of communication in a work environment,", cognitiveLevel: "apply" },
                { description: "explore the factors considered when selecting channels of communication,", cognitiveLevel: "apply" },
                { description: "analyse ethical and unethical practices in business communication,", cognitiveLevel: "apply" },
                { description: "recognize suitable channels of communication in a work environment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Plain Scale Drawing (Family)",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G8 Pre-Technical Studies p.19, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe the features of a plain scale used in drawing,", cognitiveLevel: "apply" },
                { description: "interpret a plain scale used in drawing,", cognitiveLevel: "apply" },
                { description: "draw plane figures to a given scale,", cognitiveLevel: "apply" },
                { description: "appreciate the use of plain scale drawing in the work environment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Visual Programming (My Surrounding)",
              order: 3,
              suggestedLessons: 14,
              sourceRef: "KICD G8 Pre-Technical Studies p.21, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify types of visual programming applications used to solve problems in day-to-day life,", cognitiveLevel: "apply" },
                { description: "explore the features of visual programming applications used in the work environment,", cognitiveLevel: "apply" },
                { description: "create instructions to solve problems using visual programming application,", cognitiveLevel: "apply" },
                { description: "value the importance of visual programming to solve problems in day-to- day life.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "MATERIALS FOR PRODUCTION",
          order: 3,
          subStrands: [
            {
              name: "Composite Materials (Greetings and Introductions)",
              order: 1,
              suggestedLessons: 7,
              sourceRef: "KICD G8 Pre-Technical Studies p.24, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify composite materials in the locality,", cognitiveLevel: "apply" },
                { description: "describe the composition of composite materials in the locality,", cognitiveLevel: "apply" },
                { description: "relate composite materials to their use in a work environment,", cognitiveLevel: "apply" },
                { description: "acknowledge the importance of composite materials used in the locality.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Ceramic Materials (Family)",
              order: 2,
              suggestedLessons: 7,
              sourceRef: "KICD G8 Pre-Technical Studies p.26, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify common ceramic materials in the locality,", cognitiveLevel: "apply" },
                { description: "describe the physical properties of ceramic materials in the locality,", cognitiveLevel: "apply" },
                { description: "relate ceramic materials to their use in a work environment,", cognitiveLevel: "apply" },
                { description: "acknowledge the importance of ceramic materials used in the locality.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "TOOLS AND PRODUCTION",
          order: 4,
          subStrands: [
            {
              name: "Specific Learning 4.1 Cutting Tools (Greetings and Introductions)",
              order: 1,
              suggestedLessons: 15,
              sourceRef: "KICD G8 Pre-Technical Studies p.28, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify cutting tools used in the work environment,", cognitiveLevel: "apply" },
                { description: "select cutting tools for given tasks in a workplace,", cognitiveLevel: "apply" },
                { description: "use cutting tools to perform a given task,", cognitiveLevel: "apply" },
                { description: "care for cutting tools in the work environment,", cognitiveLevel: "apply" },
                { description: "recognise the importance of cutting tools in the work environment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Production Unit (Family)",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G8 Pre-Technical Studies p.30, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "explain the factors considered when locating a production unit,", cognitiveLevel: "apply" },
                { description: "analyse the factors determining the size of a production unit,", cognitiveLevel: "apply" },
                { description: "locate a production unit in a suitable area.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "ENTREPRENEURSHIP",
          order: 5,
          subStrands: [
            {
              name: "Bookkeeping (Greetings and Introductions)",
              order: 1,
              suggestedLessons: 12,
              sourceRef: "KICD G8 Pre-Technical Studies p.32, Strand 5.0, Sub-strand 5.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the importance of bookkeeping in entrepreneurship,", cognitiveLevel: "apply" },
                { description: "classify business transactions in bookkeeping,", cognitiveLevel: "apply" },
                { description: "prepare simple financial statements for a business,", cognitiveLevel: "apply" },
                { description: "keep financial records for effective decision making.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Income and Budgeting (Family)",
              order: 2,
              suggestedLessons: 9,
              sourceRef: "KICD G8 Pre-Technical Studies p.34, Strand 5.0, Sub-strand 5.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify sources of income for an individual,", cognitiveLevel: "apply" },
                { description: "explain the importance of budgeting in day-to-day life,", cognitiveLevel: "apply" },
                { description: "prepare a simple budget for personal finance management,", cognitiveLevel: "apply" },
                { description: "explore ethical and unethical practices in budgeting,", cognitiveLevel: "apply" },
                { description: "practice financial planning in income management.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Marketing of Goods and Services (My Surrounding)",
              order: 3,
              suggestedLessons: 8,
              sourceRef: "KICD G8 Pre-Technical Studies p.36, Strand 5.0, Sub-strand 5.3",
              verification: "unverified" as const,
              slos: [
                { description: "explain the importance of marketing to a business,", cognitiveLevel: "apply" },
                { description: "analyse the sources of information about the market for its potential customers,", cognitiveLevel: "apply" },
                { description: "explore factors considered when selecting a suitable market for goods and services,", cognitiveLevel: "apply" },
                { description: "select tools to market goods and services,", cognitiveLevel: "apply" },
                { description: "recognise suitable markets for goods and services.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Saving and Investment (Time)",
              order: 4,
              suggestedLessons: 7,
              sourceRef: "KICD G8 Pre-Technical Studies p.38, Strand 5.0, Sub-strand 5.4",
              verification: "unverified" as const,
              slos: [
                { description: "explain the reasons for saving and investment in financial management,", cognitiveLevel: "apply" },
                { description: "explore the methods of saving and investment for effective financial management,", cognitiveLevel: "apply" },
                { description: "prepare a simple saving and investment plan for personal financial management,", cognitiveLevel: "apply" },
                { description: "analyse ethical and unethical practices in saving and investing money,", cognitiveLevel: "apply" },
                { description: "practice saving and", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
