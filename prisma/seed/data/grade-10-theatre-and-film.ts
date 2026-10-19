/**
 * Grade 10 Theatre and Film transcribed from the official KICD curriculum
 * design. Outcomes omitted from the supplied JSON were restored from the
 * detailed curriculum tables.
 */

import type { GradeData } from "./index";

export const grade10TheatreAndFilmData: GradeData = {
  level: 10,
  name: "Grade 10",
  learningAreas: [
    {
      name: "Theatre and Film",
      strands: [
        {
          name: "Creating",
          order: 1,
          subStrands: [
            {
              name: "Play Writing",
              order: 1,
              suggestedLessons: 25,
              sourceRef: "KICD G10 Theatre and Film p.1, Strand 1.0, Sub-Strand 1.1",
              verification: "unverified",
              slos: [
                { description: "describe the elements of play writing,", cognitiveLevel: "apply" },
                { description: "write a three-act structure play based on a Pertinent and Contemporary Issue,", cognitiveLevel: "apply" },
                { description: "develop a community engagement story addressing a Pertinent and Contemporary Issue,", cognitiveLevel: "apply" },
                { description: "acknowledge the value of artistic creation in addressing societal issues.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Poetry writing",
              order: 2,
              suggestedLessons: 15,
              sourceRef: "KICD G10 Theatre and Film p.4, Strand 1.0, Sub-Strand 1.2",
              verification: "unverified",
              slos: [
                { description: "describe the characteristics of a spoken word poem,", cognitiveLevel: "apply" },
                { description: "select a relevant theme for writing a spoken word poem,", cognitiveLevel: "apply" },
                { description: "develop a character bible for a suitable persona to convey a message in a spoken word poem,", cognitiveLevel: "apply" },
                { description: "compose a spoken word poem using poetic elements,", cognitiveLevel: "apply" },
                { description: "value the spoken word poem as a means of self-expression.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Production",
          order: 2,
          subStrands: [
            {
              name: "Acting",
              order: 1,
              suggestedLessons: 35,
              sourceRef: "KICD G10 Theatre and Film p.7, Strand 2.0, Sub-Strand 2.1",
              verification: "unverified",
              slos: [
                { description: "demonstrate the use of theatre games and exercises in preparation for rehearsal and performance,", cognitiveLevel: "apply" },
                { description: "master the lines in a stage piece for a performance,", cognitiveLevel: "apply" },
                { description: "perform a selected character role using the actors tools,", cognitiveLevel: "apply" },
                { description: "appreciate acting as a key component of creative expression.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Theatre Directing",
              order: 2,
              suggestedLessons: 35,
              sourceRef: "KICD G10 Theatre and Film p.9, Strand 2.0, Sub-Strand 2.2",
              verification: "unverified",
              slos: [
                { description: "describe the director’s responsibilities in theatre production,", cognitiveLevel: "apply" },
                { description: "describe the different types of performance stages,", cognitiveLevel: "apply" },
                { description: "develop a directorial concept for a stage performance,", cognitiveLevel: "apply" },
                { description: "create a prompt book for a stage performance,", cognitiveLevel: "apply" },
                { description: "direct a stage performance using the directorial concept,", cognitiveLevel: "apply" },
                { description: "appreciate a director’s role in performance.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Theatre Design",
              order: 3,
              suggestedLessons: 25,
              sourceRef: "KICD G10 Theatre and Film p.12, Strand 2.0, Sub-Strand 2.3",
              verification: "unverified",
              slos: [
                { description: "describe the components of design in theatre,", cognitiveLevel: "apply" },
                { description: "design a stage set for performance,", cognitiveLevel: "apply" },
                { description: "use costumes and make-up in a production,", cognitiveLevel: "apply" },
                { description: "utilise lighting and sound resources in a stage performance,", cognitiveLevel: "apply" },
                { description: "appreciate the use of production elements in a performance.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Theatre, Film and Society",
          order: 3,
          subStrands: [
            {
              name: "Theatre Adjudication",
              order: 1,
              suggestedLessons: 20,
              sourceRef: "KICD G10 Theatre and Film p.16, Strand 3.0, Sub-Strand 3.1",
              verification: "unverified",
              slos: [
                { description: "examine the criteria for adjudicating theatre performances,", cognitiveLevel: "apply" },
                { description: "develop a criteria for adjudicating theatrical performances,", cognitiveLevel: "apply" },
                { description: "adjudicate theatrical performances using a criteria,", cognitiveLevel: "apply" },
                { description: "develop a report on the adjudication process,", cognitiveLevel: "apply" },
                { description: "appreciate the process of adjudication in adding value to a performance.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Theatre and Community",
              order: 2,
              suggestedLessons: 25,
              sourceRef: "KICD G10 Theatre and Film p.18, Strand 3.0, Sub-Strand 3.2",
              verification: "unverified",
              slos: [
                { description: "analyse the role of theatre in society,", cognitiveLevel: "apply" },
                { description: "analyse principles guiding theatre and Film club management,", cognitiveLevel: "apply" },
                { description: "execute a community theatre piece addressing a Pertinent and Contemporary Issue,", cognitiveLevel: "apply" },
                { description: "appreciate the role of management in theatre.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
