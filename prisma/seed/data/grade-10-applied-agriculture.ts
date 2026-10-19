/**
 * Grade 10 Applied Agriculture transcribed from the KICD curriculum design.
 * Detailed-table lesson allocations take precedence over the summary table.
 * Animal Production uses the summary table's canonical 2.1-2.5 identifiers
 * because the detailed tables repeat 2.2 and shift the remaining identifiers.
 * Published wording is retained; cognitiveLevel falls back to apply because
 * the design does not publish Bloom levels.
 */

import type { GradeData } from "./index";

export const grade10AppliedAgricultureData: GradeData = {
  level: 10,
  name: "Grade 10",
  learningAreas: [
    {
      name: "Applied Agriculture",
      strands: [
        {
          name: "Crop Production",
          order: 1,
          subStrands: [
            {
              name: "Agricultural Land",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G10 Applied Agriculture p.1, Strand 1.0, Sub-Strand 1.1",
              verification: "unverified",
              slos: [
                { description: "describe ways of accessing land for agricultural use,", cognitiveLevel: "apply" },
                { description: "evaluate utility of land for agricultural production purposes,", cognitiveLevel: "apply" },
                { description: "analyse natural factors that determine productivity of land in agriculture,", cognitiveLevel: "apply" },
                { description: "appreciate importance of land in agricultural production.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Properties of soil",
              order: 2,
              suggestedLessons: 12,
              sourceRef: "KICD G10 Applied Agriculture p.3, Strand 1.0, Sub-Strand 1.2",
              verification: "unverified",
              slos: [
                { description: "describe properties of a soil for crop production,", cognitiveLevel: "apply" },
                { description: "investigate the properties of soil for crop production,", cognitiveLevel: "apply" },
                { description: "relate importance of soil profile to crop production,", cognitiveLevel: "apply" },
                { description: "acknowledge importance of soil properties in crop production.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Land Preparation",
              order: 3,
              suggestedLessons: 12,
              sourceRef: "KICD G10 Applied Agriculture p.5, Strand 1.0, Sub-Strand 1.3",
              verification: "unverified",
              slos: [
                { description: "describe activities of fallow land preparation to appropriate seedbed,", cognitiveLevel: "apply" },
                { description: "carry out land preparation operations for selected crop,", cognitiveLevel: "apply" },
                { description: "apply conservation tillage in crop production,", cognitiveLevel: "apply" },
                { description: "appreciate importance land preparation in crop production.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Field Management Practices",
              order: 4,
              suggestedLessons: 10,
              sourceRef: "KICD G10 Applied Agriculture p.7, Strand 1.0, Sub-Strand 1.4",
              verification: "unverified",
              slos: [
                { description: "describe management practices of selected vegetable and perennial crops,", cognitiveLevel: "apply" },
                { description: "carry out selected management practices in crop production,", cognitiveLevel: "apply" },
                { description: "appreciate importance of selected management practices in crop production.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Growing Selected Crop",
              order: 5,
              suggestedLessons: 10,
              sourceRef: "KICD G10 Applied Agriculture p.9, Strand 1.0, Sub-Strand 1.5",
              verification: "unverified",
              slos: [
                { description: "determine crops that are established through the nursery,", cognitiveLevel: "apply" },
                { description: "grow a selected crop applying appropriate management practices,", cognitiveLevel: "apply" },
                { description: "justify management practice for selected crop.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Crop Protection",
              order: 6,
              suggestedLessons: 14,
              sourceRef: "KICD G10 Applied Agriculture p.11, Strand 1.0, Sub-Strand 1.6",
              verification: "unverified",
              slos: [
                { description: "identify weeds in a crop field,", cognitiveLevel: "apply" },
                { description: "classify weeds based on provided criteria,", cognitiveLevel: "apply" },
                { description: "describe methods of weed control,", cognitiveLevel: "apply" },
                { description: "carry out weed control using appropriate methods,", cognitiveLevel: "apply" },
                { description: "appreciate economic importance of weeds in a farming household.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "General Crop Harvesting",
              order: 7,
              suggestedLessons: 10,
              sourceRef: "KICD G10 Applied Agriculture p.13, Strand 1.0, Sub-Strand 1.7",
              verification: "unverified",
              slos: [
                { description: "explain factors that determine harvesting of a crop produce,", cognitiveLevel: "apply" },
                { description: "carry out the harvesting process for selected crop produce,", cognitiveLevel: "apply" },
                { description: "acknowledge the importance of harvesting process in crop production.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Animal Production",
          order: 2,
          subStrands: [
            {
              name: "Breeds of Livestock",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G10 Applied Agriculture p.16, Strand 2.0, Sub-Strand 2.1",
              verification: "unverified",
              slos: [
                { description: "describe breeds of livestock based on their uses,", cognitiveLevel: "apply" },
                { description: "distinguish common breed livestock based on their characteristics,", cognitiveLevel: "apply" },
                { description: "appreciate diversity of productivity from different livestock breeds.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Animal handling and safety",
              order: 2,
              suggestedLessons: 9,
              sourceRef: "KICD G10 Applied Agriculture p.18, Strand 2.0, Sub-Strand 2.2",
              verification: "unverified",
              slos: [
                { description: "examine forms of animal handling in the community,", cognitiveLevel: "apply" },
                { description: "describe the structures used to ensure safety in handling domestic animals,", cognitiveLevel: "apply" },
                { description: "use tools and equipment to ensure safety in handling domestic animals,", cognitiveLevel: "apply" },
                { description: "explain ways of ensuring safety of persons handling domestic animals,", cognitiveLevel: "apply" },
                { description: "participate in promoting safety of domestic animal in the community.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "General Animal Health",
              order: 3,
              suggestedLessons: 12,
              sourceRef: "KICD G10 Applied Agriculture p.20, Strand 2.0, Sub-Strand 2.3",
              verification: "unverified",
              slos: [
                { description: "explain the benefits of keeping animals healthy in livestock production,", cognitiveLevel: "apply" },
                { description: "identify signs of ill health in livestock production,", cognitiveLevel: "apply" },
                { description: "propose general control measures of ill health in livestock production,", cognitiveLevel: "apply" },
                { description: "adopt practices that maintain animal health in livestock production.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Bee Keeping",
              order: 4,
              suggestedLessons: 8,
              sourceRef: "KICD G10 Applied Agriculture p.22, Strand 2.0, Sub-Strand 2.4",
              verification: "unverified",
              slos: [
                { description: "explain the factors to consider in siting an apiary,", cognitiveLevel: "apply" },
                { description: "describe the process of stocking a hive,", cognitiveLevel: "apply" },
                { description: "carry out safe apiary management practices,", cognitiveLevel: "apply" },
                { description: "demonstrate honey harvesting process.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Animal Rearing Project",
              order: 5,
              suggestedLessons: 15,
              sourceRef: "KICD G10 Applied Agriculture p.23, Strand 2.0, Sub-Strand 2.5",
              verification: "unverified",
              slos: [
                { description: "develop a project plan on rearing a selected animal,", cognitiveLevel: "apply" },
                { description: "prepare a budget for the animal rearing project,", cognitiveLevel: "apply" },
                { description: "implement the plan for the animal rearing project,", cognitiveLevel: "apply" },
                { description: "carry out routine management practices on the animal rearing project,", cognitiveLevel: "apply" },
                { description: "evaluate the animal rearing practices carried out in the project.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Agricultural Technologies and Entrepreneurship",
          order: 3,
          subStrands: [
            {
              name: "Tools and Equipment",
              order: 1,
              suggestedLessons: 14,
              sourceRef: "KICD G10 Applied Agriculture p.26, Strand 3.0, Sub-Strand 3.1",
              verification: "unverified",
              slos: [
                { description: "identify tools and equipment used for various agricultural tasks,", cognitiveLevel: "apply" },
                { description: "carry out various agricultural tasks using appropriate tools and equipment,", cognitiveLevel: "apply" },
                { description: "carry out appropriate maintenance practices on selected tools and equipment,", cognitiveLevel: "apply" },
                { description: "apply safety measures in the use of tools and equipment,", cognitiveLevel: "apply" },
                { description: "acknowledge importance of maintaining tools and equipment for efficient working.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Product Processing and Value Addition",
              order: 2,
              suggestedLessons: 20,
              sourceRef: "KICD G10 Applied Agriculture p.28, Strand 3.0, Sub-Strand 3.2",
              verification: "unverified",
              slos: [
                { description: "suggest methods of value addition for selected agricultural produce,", cognitiveLevel: "apply" },
                { description: "carry out processing of agricultural produce of plant origin,", cognitiveLevel: "apply" },
                { description: "carry out processing of agricultural produce of animal origin,", cognitiveLevel: "apply" },
                { description: "carry out home-based packaging and branding of processed agricultural products,", cognitiveLevel: "apply" },
                { description: "design innovative value addition equipment for agricultural produce,", cognitiveLevel: "apply" },
                { description: "appraise ethical issues in the processing and value addition processes.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Establishing Agricultural Enterprise",
              order: 3,
              suggestedLessons: 13,
              sourceRef: "KICD G10 Applied Agriculture p.30, Strand 3.0, Sub-Strand 3.3",
              verification: "unverified",
              slos: [
                { description: "explain factors of production in an agricultural enterprise,", cognitiveLevel: "apply" },
                { description: "propose ways of acquiring capital to establish an agricultural enterprise,", cognitiveLevel: "apply" },
                { description: "examine factors to consider in selecting an agricultural enterprise,", cognitiveLevel: "apply" },
                { description: "evaluate sources of support services for agricultural enterprise,", cognitiveLevel: "apply" },
                { description: "appreciate role of various factors of production in establishing an agricultural enterprise.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Marketing agricultural produce",
              order: 4,
              suggestedLessons: 6,
              sourceRef: "KICD G10 Applied Agriculture p.32, Strand 3.0, Sub-Strand 3.4",
              verification: "unverified",
              slos: [
                { description: "describe ways of preparing agricultural produce for marketing,", cognitiveLevel: "apply" },
                { description: "prepare agricultural produce for marketing,", cognitiveLevel: "apply" },
                { description: "discuss market outlets for agricultural produce,", cognitiveLevel: "apply" },
                { description: "evaluate expenses incurred in marketing agricultural produce,", cognitiveLevel: "apply" },
                { description: "appreciate the importance of preparing agricultural produce for marketing.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Composting Techniques",
              order: 5,
              suggestedLessons: 10,
              sourceRef: "KICD G10 Applied Agriculture p.34, Strand 3.0, Sub-Strand 3.5",
              verification: "unverified",
              slos: [
                { description: "describe composting in production of organic manure,", cognitiveLevel: "apply" },
                { description: "examine factors that influence quality of compost manure,", cognitiveLevel: "apply" },
                { description: "carry out conventional composting methods for production of organic manure,", cognitiveLevel: "apply" },
                { description: "carry out innovative composting methods for production of organic manure,", cognitiveLevel: "apply" },
                { description: "appreciate role of composting in soil improvement.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
