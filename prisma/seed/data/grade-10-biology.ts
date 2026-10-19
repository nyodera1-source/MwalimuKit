/**
 * Grade 10 Biology transcribed from the KICD curriculum design.
 * Detailed-table names and lesson allocations take precedence over the summary
 * table; extraction-only whitespace is normalized while source wording remains.
 * cognitiveLevel falls back to apply because the design does not publish Bloom levels.
 */

import type { GradeData } from "./index";

export const grade10BiologyData: GradeData =
{
  "level": 10,
  "name": "Grade 10",
  "learningAreas": [
    {
      "name": "Biology",
      "strands": [
        {
          "name": "CELL BIOLOGY AND BIODIVERSITY",
          "order": 1,
          "subStrands": [
            {
              "name": "Introduction to Biology",
              "order": 1,
              "suggestedLessons": 6,
              "sourceRef": "KICD G10 Biology p.1, Strand 1.0, Sub-Strand 1.1",
              "verification": "unverified",
              "slos": [
                {
                  "description": "explain the application of Biology in everyday life,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "relate fields of study in Biology to career opportunities,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "Illustrate the careers related to fields of study in Biology,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the importance of Biology in everyday life.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Specimen Collection and Preservation",
              "order": 2,
              "suggestedLessons": 14,
              "sourceRef": "KICD G10 Biology p.3, Strand 1.0, Sub-Strand 1.2",
              "verification": "unverified",
              "slos": [
                {
                  "description": "identify apparatus and materials used for collecting, processing and preserving specimens,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "collect, process and preserve specimens for biological studies using improvised and conventional apparatus,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the importance of collecting, processing and preserving specimens in Biology.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Cell Structure and Specialization",
              "order": 3,
              "suggestedLessons": 30,
              "sourceRef": "KICD G10 Biology p.6, Strand 1.0, Sub-Strand 1.3",
              "verification": "unverified",
              "slos": [
                {
                  "description": "differentiate between light and electron microscope as used in the study of cell structure,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the structure and functions of plant and animal cells as observed in an electron microscope,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "prepare temporary slides for observation and estimation of cell size using a light microscope,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "relate the structures of specialized cells in plants and animals to their functions,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the cell as the basic unit of life.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Chemicals of Life",
              "order": 4,
              "suggestedLessons": 28,
              "sourceRef": "KICD G10 Biology p.9, Strand 1.0, Sub-Strand 1.4",
              "verification": "unverified",
              "slos": [
                {
                  "description": "describe the composition, properties and functions of the chemicals of life in organisms,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "investigate the presence of carbohydrates, lipids, proteins and vitamin C in food substances,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "investigate the presence of enzymes in living tissues,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "determine factors affecting enzymatic reactions in cells,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the importance of chemical components in cells.",
                  "cognitiveLevel": "apply"
                }
              ]
            }
          ]
        },
        {
          "name": "ANATOMY AND PHYSIOLOGY OF PLANTS",
          "order": 2,
          "subStrands": [
            {
              "name": "Nutrition",
              "order": 1,
              "suggestedLessons": 12,
              "sourceRef": "KICD G10 Biology p.12, Strand 2.0, Sub-Strand 2.1",
              "verification": "unverified",
              "slos": [
                {
                  "description": "describe types of nutrition in plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "relate the structure of the chloroplast to its function in plant cells,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "illustrate the light and dark stages of photosynthesis in plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the significance of photosynthesis in nature.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Transport",
              "order": 2,
              "suggestedLessons": 18,
              "sourceRef": "KICD G10 Biology p.14, Strand 2.0, Sub-Strand 2.2",
              "verification": "unverified",
              "slos": [
                {
                  "description": "relate structures of the plant transport system to their functions in plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "illustrate the arrangement of vascular tissues in monocotyledonous and dicotyledonous plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "demonstrate the uptake of water and mineral salts from the roots to the leaves,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "demonstrate factors that affect the rate of transpiration in plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the translocation of manufactured food in plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the significance of transport in plants.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Gaseous Exchange and Respiration",
              "order": 3,
              "suggestedLessons": 22,
              "sourceRef": "KICD G10 Biology p.17, Strand 2.0, Sub-Strand 2.3",
              "verification": "unverified",
              "slos": [
                {
                  "description": "relate the structure of gaseous exchange sites in plants to their function,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the mechanism of opening and closing of stomata in plants,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "investigate aerobic and anaerobic respiration in living organisms,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "explain the economic importance of anaerobic respiration in nature,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the significance of gaseous exchange and respiration to plants and the environment.",
                  "cognitiveLevel": "apply"
                }
              ]
            }
          ]
        },
        {
          "name": "ANATOMY AND PHYSIOLOGY OF ANIMALS",
          "order": 3,
          "subStrands": [
            {
              "name": "Nutrition",
              "order": 1,
              "suggestedLessons": 12,
              "sourceRef": "KICD G10 Biology p.21, Strand 3.0, Sub-Strand 3.1",
              "verification": "unverified",
              "slos": [
                {
                  "description": "relate the structure of mouthparts of insects to their functions,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "illustrate mouthparts in different insects,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "relate the structure of beaks of birds to their functions,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate diversity in feeding modes of insects and birds.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Transport",
              "order": 2,
              "suggestedLessons": 14,
              "sourceRef": "KICD G10 Biology p.23, Strand 3.0, Sub-Strand 3.2",
              "verification": "unverified",
              "slos": [
                {
                  "description": "explain the importance of transport in animals,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "illustrate structure of the transport systems in insects, fish, amphibians, reptiles and mammals,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the pumping mechanism of the mammalian heart,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the human lymphatic and immune systems, and blood clotting mechanism,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "explain the ABO and rhesus factor blood grouping systems in humans,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the diversity of transport systems in animals.",
                  "cognitiveLevel": "apply"
                }
              ]
            },
            {
              "name": "Gaseous Exchange and Respiration",
              "order": 3,
              "suggestedLessons": 24,
              "sourceRef": "KICD G10 Biology p.26, Strand 3.0, Sub-Strand 3.3",
              "verification": "unverified",
              "slos": [
                {
                  "description": "explain the general characteristics of respiratory surfaces in animals,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the structure and adaptations of respiratory structures in animals,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the mechanism of gaseous exchange in humans,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "describe the process of aerobic and anaerobic respiration,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "calculate the respiratory quotient for different foods,",
                  "cognitiveLevel": "apply"
                },
                {
                  "description": "appreciate the importance of gaseous exchange and respiration in animals.",
                  "cognitiveLevel": "apply"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
;
