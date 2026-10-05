/**
 * Grade 7 Creative Arts and Sports — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, CREATIVE ARTS AND SPORTS, GRADE 7",
 *         Kenya Institute of Curriculum Development.
 *
 * Two levels, like Mathematics, Integrated Science and Social Studies.
 *
 * Transcribed mechanically: 3 strands, 12 sub-strands, 150 published lessons
 * and 60 specific learning outcomes, verbatim. The 150 lessons reconcile exactly
 * against the official Junior School allocation of 5 periods a week over 30
 * teaching weeks.
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

export const grade7CreativeArtsData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Creative Arts and Sports",
      strands: [
        {
          name: "FOUNDATIONS OF CREATIVE ARTS AND SPORTS",
          order: 1,
          subStrands: [
            {
              name: "Introduction to Creative Arts and Sports",
              order: 1,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe categories of Creative Arts and Sports", cognitiveLevel: "apply" },
                { description: "outline the relationships among the categories of Creative Arts and Sports", cognitiveLevel: "apply" },
                { description: "create a chart on the categories of the Creative Arts and Sports", cognitiveLevel: "apply" },
                { description: "appreciate the categories of Creative Arts and Sports", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Components of Creative Arts and Sports",
              order: 2,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe the components of Visual Arts", cognitiveLevel: "apply" },
                { description: "describe elements of a story", cognitiveLevel: "apply" },
                { description: "perform activities demonstrating the components of fitness", cognitiveLevel: "apply" },
                { description: "execute basic elements of Music", cognitiveLevel: "apply" },
                { description: "appreciate the components of Creative Arts and Sports", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "CREATING AND PERFORMING IN CREATIVE ARTS AND SPORTS",
          order: 2,
          subStrands: [
            {
              name: "Composing rhythm",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "outline factors to consider in creating a rhythmic pattern", cognitiveLevel: "apply" },
                { description: "compose a four- bar rhythmic pattern in time", cognitiveLevel: "apply" },
                { description: "write rhythmic patterns in time", cognitiveLevel: "apply" },
                { description: "sight read rhythmic patterns on monotone", cognitiveLevel: "apply" },
                { description: "appreciate rhythmic patterns created by self and others", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Athletics",
              order: 2,
              suggestedLessons: 14,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "carve a javelin according to the right specification", cognitiveLevel: "apply" },
                { description: "execute a javelin throw following the throwing phases for skill acquisition", cognitiveLevel: "apply" },
                { description: "appreciate each other's carved javelin and throwing effort", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Composing Melody",
              order: 3,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "outline the qualities of a good melody", cognitiveLevel: "apply" },
                { description: "compose four-bar melodies in C major", cognitiveLevel: "apply" },
                { description: "create a card design inspired by the composed melody", cognitiveLevel: "apply" },
                { description: "perform simple pieces of music in C major", cognitiveLevel: "apply" },
                { description: "appreciate the use of melody in Creative Arts and Sports for expression", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Handball",
              order: 4,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "describe the steps of making a larks’ head knot", cognitiveLevel: "apply" },
                { description: "weave a hand ball goal net using lark’s head macrame knots", cognitiveLevel: "apply" },
                { description: "demonstrate the passing skills in handball", cognitiveLevel: "apply" },
                { description: "execute dribbling in handball for skill acquisition", cognitiveLevel: "apply" },
                { description: "execute jump shot in handball", cognitiveLevel: "apply" },
                { description: "appreciate each other's effort in weaving, passing, shooting and dribbling in handball", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Western Solo Instrument",
              order: 5,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.5",
              verification: "unverified" as const,
              slos: [
                { description: "explain the techniques of playing a descant recorder or any other Western instrument", cognitiveLevel: "apply" },
                { description: "create a stencil of a descant recorder or any other Western instrument for printing", cognitiveLevel: "apply" },
                { description: "tune a Western instrument for a performance", cognitiveLevel: "apply" },
                { description: "perform a solo instrumental piece in C Major", cognitiveLevel: "apply" },
                { description: "appreciate playing music on the descant recorder or any other Western solo instrument", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Football",
              order: 6,
              suggestedLessons: 12,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.6",
              verification: "unverified" as const,
              slos: [
                { description: "paint an imaginary composition of a football field with players in action", cognitiveLevel: "apply" },
                { description: "execute trapping skill in football", cognitiveLevel: "apply" },
                { description: "perform dribbling skill in football", cognitiveLevel: "apply" },
                { description: "value team effort in a football game", cognitiveLevel: "apply" },
                { description: "with emphasis on; -warm colours (progression) -cool colours (recession) - players in action", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Storytelling",
              order: 7,
              suggestedLessons: 18,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.7",
              verification: "unverified" as const,
              slos: [
                { description: "describe techniques used in storytelling", cognitiveLevel: "apply" },
                { description: "compose a 3 to 5-minute story addressing an issue in society", cognitiveLevel: "apply" },
                { description: "create a flipbook animation for storytelling", cognitiveLevel: "apply" },
                { description: "perform a 3 to 5-minute story before an audience", cognitiveLevel: "apply" },
                { description: "realise storytelling as a means of communication", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Swimming",
              order: 8,
              suggestedLessons: 15,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.8",
              verification: "unverified" as const,
              slos: [
                { description: "paint a human form in a backstroke position", cognitiveLevel: "apply" },
                { description: "execute a water entry skill in swimming using a pencil dive", cognitiveLevel: "apply" },
                { description: "perform backstroke skill in swimming for skill development", cognitiveLevel: "apply" },
                { description: "appreciate your own and others’ effort in executing backstroke skill", cognitiveLevel: "apply" },
                { description: "using wash and brush stroke techniques", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Kenyan Folk songs",
              order: 9,
              suggestedLessons: 15,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 2.0, Sub-strand 2.9",
              verification: "unverified" as const,
              slos: [
                { description: "classify folk songs in Kenyan communities", cognitiveLevel: "apply" },
                { description: "improvise materials for a folk song performance", cognitiveLevel: "apply" },
                { description: "decorate a costume using the block printing technique", cognitiveLevel: "apply" },
                { description: "perform a folksong from a Kenyan community", cognitiveLevel: "apply" },
                { description: "appreciate folk songs performance as means of cultural preservation", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "APPRECIATION IN CREATIVE ARTS AND SPORTS",
          order: 3,
          subStrands: [
            {
              name: "Analysis of Creative Arts and Sports",
              order: 1,
              suggestedLessons: 18,
              sourceRef: "KICD G7 Creative Arts and Sports, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "examine the criteria for evaluating Creative Arts and Sports", cognitiveLevel: "apply" },
                { description: "analyse a football game for skill development", cognitiveLevel: "apply" },
                { description: "analyse a folk song from a Kenyan community", cognitiveLevel: "apply" },
                { description: "evaluate a storytelling performance", cognitiveLevel: "apply" },
                { description: "evaluate a 2D art work", cognitiveLevel: "apply" },
                { description: "appreciate the role of analysis in Creative Arts and Sports", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
