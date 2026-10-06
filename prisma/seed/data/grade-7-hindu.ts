/**
 * Grade 7 Hindu Religious Education — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, HINDU RELIGIOUS EDUCATION, GRADE 7",
 *         Kenya Institute of Curriculum Development. First published 2022,
 *         revised 2024.
 *
 * Transcribed mechanically from the design PDF: strand numbers and names,
 * sub-strand names, the published lesson count for each sub-strand, and the
 * specific learning outcomes verbatim.
 *
 * The design publishes six strands with eight sub-strands total:
 *   1.0 Manifestation of Supreme Being (Paramatma) — 1.1 Enlightened Beings (15)
 *   2.0 Scriptures — 2.1 Scriptural Texts (14)
 *   3.0 Principles of Dharma (Dharmic Siddhant) — 3.1 Fundamental Principles (14)
 *   4.0 Religious Practices — 4.1 Buddhist Practices (15), 4.2 Places of Worship (16)
 *   5.0 Yog — 5.1 Concepts of Yog (16), 5.2 Path of Devotion (Bhakti Yog) (15)
 *   6.0 Rites of Passage (Sanskaars) — 6.1 Religious Ceremonies (15)
 * Total = 120 lessons.
 *
 * The summary table (p.x) is internally consistent: 15+14+14+15+16+16+15+15 = 120.
 *
 * cognitiveLevel is NOT from the design: KICD publishes no Bloom level per
 * outcome, so it falls back to "apply" and must be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7HinduData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Hindu Religious Education",
      strands: [
        {
          name: "MANIFESTATION OF SUPREME BEING (PARAMATMA)",
          order: 1,
          subStrands: [
            {
              name: "Enlightened Beings",
              order: 1,
              suggestedLessons: 15,
              sourceRef: "KICD G7 Hindu p.13, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "narrate the stories of the Enlightened Beings", cognitiveLevel: "apply" },
                { description: "explore the interrelationships of the Enlightened Beings", cognitiveLevel: "apply" },
                { description: "illustrate the events mentioned in the lives of the Enlightened Beings", cognitiveLevel: "apply" },
                { description: "appreciate the values taught by the Enlightened Beings", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "SCRIPTURES",
          order: 2,
          subStrands: [
            {
              name: "Scriptural Texts",
              order: 1,
              suggestedLessons: 14,
              sourceRef: "KICD G7 Hindu p.16, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "distinguish the four Scriptural texts", cognitiveLevel: "apply" },
                { description: "apply values from the four selected Scriptures in daily life for sustainable living", cognitiveLevel: "apply" },
                { description: "create content to share relevant Scriptural messages that foster peace and harmony", cognitiveLevel: "apply" },
                { description: "appreciate approaches for restoring peace and harmony in society as stipulated in the Scriptures", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "PRINCIPLES OF DHARMA (DHARMIC SIDDHANT)",
          order: 3,
          subStrands: [
            {
              name: "Fundamental Principles",
              order: 1,
              suggestedLessons: 14,
              sourceRef: "KICD G7 Hindu p.19, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe the four fundamental Principles of Dharma for knowledge in the four faiths", cognitiveLevel: "apply" },
                { description: "examine the Scriptural stories based on the four selected Principles of Dharma for social cohesion", cognitiveLevel: "apply" },
                { description: "practice the Principles of Dharma for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "appreciate the Principles of Dharma for a balanced life", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "RELIGIOUS PRACTICES",
          order: 4,
          subStrands: [
            {
              name: "Buddhist Practices",
              order: 1,
              suggestedLessons: 15,
              sourceRef: "KICD G7 Hindu p.22, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "examine the Buddhist daily scheduled practices for generalisation", cognitiveLevel: "apply" },
                { description: "illustrate the observance of the scheduled religious practices in daily life", cognitiveLevel: "apply" },
                { description: "practice the Buddhist scheduled religious practices in daily life", cognitiveLevel: "apply" },
                { description: "appreciate the benefits of the Buddhist scheduled practices for harmonious living", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Places of Worship",
              order: 2,
              suggestedLessons: 16,
              sourceRef: "KICD G7 Hindu p.25, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify the various places of worship used by the four faiths", cognitiveLevel: "apply" },
                { description: "describe the significance of the places of worship for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "appreciate the role of places of worship for cultural preservation", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "YOG",
          order: 5,
          subStrands: [
            {
              name: "Concepts of Yog",
              order: 1,
              suggestedLessons: 16,
              sourceRef: "KICD G7 Hindu p.28, Strand 5.0, Sub-strand 5.1",
              verification: "unverified" as const,
              slos: [
                { description: "explore the three selected concepts of Yog for personal development", cognitiveLevel: "apply" },
                { description: "distinguish the three selected Yog concepts for better understanding", cognitiveLevel: "apply" },
                { description: "illustrate circumstances under which Yog is applicable in daily life", cognitiveLevel: "apply" },
                { description: "acknowledge the role of Yog for spiritual growth", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Path of Devotion (Bhakti Yog)",
              order: 2,
              suggestedLessons: 15,
              sourceRef: "KICD G7 Hindu p.30, Strand 5.0, Sub-strand 5.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe the elements of Bhakti Yog as per the four faiths", cognitiveLevel: "apply" },
                { description: "explore the key elements of Bhakti Yog", cognitiveLevel: "apply" },
                { description: "design and present a Bhakti Yog for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "use digital devices/print media while practising Bhakti Yog", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "RITES OF PASSAGE (SANSKAARS)",
          order: 6,
          subStrands: [
            {
              name: "Religious Ceremonies",
              order: 1,
              suggestedLessons: 15,
              sourceRef: "KICD G7 Hindu p.33, Strand 6.0, Sub-strand 6.1",
              verification: "unverified" as const,
              slos: [
                { description: "examine the three selected religious ceremonies performed in the four faiths", cognitiveLevel: "apply" },
                { description: "interpret the significance of the three selected religious ceremonies for social cohesion", cognitiveLevel: "apply" },
                { description: "participate in the religious ceremonies in the four faiths", cognitiveLevel: "apply" },
                { description: "appreciate the practice of religious ceremonies for cultural preservation", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
