/**
 * Grade 7 Mathematics — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, MATHEMATICS, GRADE 7",
 *         Kenya Institute of Curriculum Development. First published 2022,
 *         revised 2024.
 *
 * Transcribed mechanically from the design PDF: strand numbers and names,
 * sub-strand names, the published lesson count for each sub-strand, and the
 * specific learning outcomes verbatim.
 *
 * This REPLACES the previously seeded Mathematics for Grade 7, whose strands
 * did not correspond to the design — it had "Coordinates and Graphs" as a
 * strand and omitted "Measurements" entirely.
 *
 * Two outcomes are incomplete in the source document itself and are recorded
 * verbatim rather than guessed — see INCOMPLETE_IN_SOURCE below.
 *
 * cognitiveLevel is NOT from the design: KICD publishes no Bloom level per
 * outcome, so it falls back to "apply" and must be reviewed.
 *
 * verification stays "unverified" — no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7MathematicsData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Mathematics",
      strands: [
        {
          name: "Numbers",
          order: 1,
          subStrands: [
            {
              name: "Whole Numbers",
              order: 1,
              suggestedLessons: 20,
              sourceRef: "KICD G7 Mathematics p.1, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "use place value and total value of digits up to hundreds of millions in real life", cognitiveLevel: "apply" },
                { description: "read and write numbers in symbols up to hundreds of millions in real life situations", cognitiveLevel: "apply" },
                { description: "read and write numbers in words up to millions for fluency", cognitiveLevel: "apply" },
                { description: "round off numbers up to the nearest hundreds of millions in real life situations", cognitiveLevel: "apply" },
                { description: "classify natural numbers as even, odd and prime in different situations", cognitiveLevel: "apply" },
                { description: "apply operations of whole numbers in real life situations", cognitiveLevel: "apply" },
                { description: "identify number sequence in different situations", cognitiveLevel: "apply" },
                { description: "create number sequence for playing number games", cognitiveLevel: "apply" },
                { description: "appreciate use of whole numbers in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Factors",
              order: 2,
              suggestedLessons: 7,
              sourceRef: "KICD G7 Mathematics p.3, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "test divisibility of numbers by 2, 3, 4, 5, 6, 8, 9,10 and 11 in different situations", cognitiveLevel: "apply" },
                { description: "express composite numbers as a product of prime factors in different situations", cognitiveLevel: "apply" },
                { description: "work out the Greatest Common Divisor (GCD) and the Least Common Multiples (LCM) of numbers by factor method in different situations", cognitiveLevel: "apply" },
                { description: "apply the Greatest Common Divisor (GCD) and the Least Common Multiples (LCM) in real life situations", cognitiveLevel: "apply" },
                { description: "reflect on use of factors in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Fractions",
              order: 3,
              suggestedLessons: 9,
              sourceRef: "KICD G7 Mathematics p.4, Strand 1.0, Sub-strand 1.3",
              verification: "unverified" as const,
              slos: [
                { description: "compare fractions in different situations", cognitiveLevel: "apply" },
                { description: "add fractions in different situations", cognitiveLevel: "apply" },
                { description: "subtract fractions in different situations", cognitiveLevel: "apply" },
                { description: "multiply fractions by a whole number, fraction and a mixed number in real life situations", cognitiveLevel: "apply" },
                { description: "identify the reciprocals of fractions in different situations", cognitiveLevel: "apply" },
                { description: "divide fractions by a whole number, fraction and a mixed fraction in real life situations", cognitiveLevel: "apply" },
                { description: "divide a whole number by fractions in different situations", cognitiveLevel: "apply" },
                { description: "identify number sequence involving fractions in different situations", cognitiveLevel: "apply" },
                { description: "create number sequence involving fractions for playing number games", cognitiveLevel: "apply" },
                { description: "recognise use of fractions in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Decimals",
              order: 4,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Mathematics p.6, Strand 1.0, Sub-strand 1.4",
              verification: "unverified" as const,
              slos: [
                { description: "identify the place value and the total value of digits in decimals in real life", cognitiveLevel: "apply" },
                { description: "multiply decimals by a whole number and by a decimal in real life situations", cognitiveLevel: "apply" },
                { description: "divide decimals by a whole number and by a decimal in real life situations", cognitiveLevel: "apply" },
                { description: "recognise use of decimals in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Squares and Square Roots",
              order: 5,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Mathematics p.8, Strand 1.0, Sub-strand 1.5",
              verification: "unverified" as const,
              slos: [
                { description: "determine the squares of whole numbers, fractions and decimals by multiplication in different situations", cognitiveLevel: "apply" },
                { description: "determine the square roots of whole numbers, fractions and decimals of perfect squares in different situations", cognitiveLevel: "apply" },
                { description: "appreciate use of squares and square roots in real life situations.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Algebra",
          order: 2,
          subStrands: [
            {
              name: "Algebraic Expressions",
              order: 1,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Mathematics p.12, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "form algebraic expressions from real life situations", cognitiveLevel: "apply" },
                { description: "form algebraic expressions from simple algebraic statements in real life situations", cognitiveLevel: "apply" },
                { description: "simplify algebraic expressions in real life situations", cognitiveLevel: "apply" },
                { description: "appreciate use of algebraic expressions in real life.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Linear Equations",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Mathematics p.13, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "form linear equations in one unknown in different situations", cognitiveLevel: "apply" },
                { description: "solve linear equations in one unknown in different situations", cognitiveLevel: "apply" },
                { description: "apply linear equations in one unknown to real life situations", cognitiveLevel: "apply" },
                { description: "reflect on use of linear equations in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Linear Inequalities",
              order: 3,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Mathematics p.15, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "apply inequality symbols to inequality statements in learning situations", cognitiveLevel: "apply" },
                { description: "form simple linear inequalities in one unknown in different situations", cognitiveLevel: "apply" },
                { description: "illustrate simple inequalities on a number line", cognitiveLevel: "apply" },
                { description: "form compound inequality statements in one unknown in different situations", cognitiveLevel: "apply" },
                { description: "illustrate compound inequalities in one unknown on a number line", cognitiveLevel: "apply" },
                { description: "appreciate use of linear inequalities in real life.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Measurements",
          order: 3,
          subStrands: [
            {
              name: "Pythagorean Relationship",
              order: 1,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Mathematics p.17, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "recognize the sides of a right-angled triangle in different situations", cognitiveLevel: "apply" },
                { description: "identify Pythagorean relationship in different situations", cognitiveLevel: "apply" },
                { description: "apply Pythagorean relationship to real life situations", cognitiveLevel: "apply" },
                { description: "promote use of Pythagoras Theorem in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Length",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Mathematics p.19, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "convert units of length from one form to another involving cm, dm, m, Dm, Hm in learning situations", cognitiveLevel: "apply" },
                { description: "perform operations involving units of length in different situations", cognitiveLevel: "apply" },
                { description: "work out the perimeter of plane figures in different situations", cognitiveLevel: "apply" },
                { description: "work out the circumference of circles in different situations", cognitiveLevel: "apply" },
                { description: "promote use of length in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Area",
              order: 3,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Mathematics p.21, Strand 3.0, Sub-strand 3.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify square metre (m 2 ), acres and hectares as units of measuring area", cognitiveLevel: "apply" },
                { description: "work out the area of rectangle, parallelogram, rhombus and trapezium in different situations", cognitiveLevel: "apply" },
                { description: "work out the area of circles in different situations", cognitiveLevel: "apply" },
                { description: "calculate the area of borders and combined shapes in real life situations", cognitiveLevel: "apply" },
                { description: "recognise use of area in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Volume and Capacity",
              order: 4,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Mathematics p.22, Strand 3.0, Sub-strand 3.4",
              verification: "unverified" as const,
              slos: [
                { description: "identify metre cube (m 3 ) as a unit of volume in measurements", cognitiveLevel: "apply" },
                { description: "convert metre cube (m 3 ) into centimeter cube (cm 3 ) and", cognitiveLevel: "apply" },
                { description: "work out the volume of cubes, cuboids and cylinder in different situations", cognitiveLevel: "apply" },
                { description: "identify the relationship between cm 3 , m 3 and litres in real life situations", cognitiveLevel: "apply" },
                { description: "relate volume to capacity in real life situations", cognitiveLevel: "apply" },
                { description: "work out the capacity of containers in real life situations", cognitiveLevel: "apply" },
                { description: "promote use of volume and capacity in real life situations.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Time, Distance and Speed",
              order: 5,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Mathematics p.24, Strand 3.0, Sub-strand 3.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify units of measuring time in real life situations", cognitiveLevel: "apply" },
                { description: "convert units of time from one form to another in learning situations", cognitiveLevel: "apply" },
                { description: "convert units of measuring distance in learning situations", cognitiveLevel: "apply" },
                { description: "identify speed as distance covered per unit time in different situations", cognitiveLevel: "apply" },
                { description: "work out speed in km/h and m/s in real life situations", cognitiveLevel: "apply" },
                { description: "convert units of speed from kilometers per hour (Km/h) to meters per second (m/s) and", cognitiveLevel: "apply" },
                { description: "reflect on use of time, distance and speed in real life situations", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Temperature",
              order: 6,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Mathematics p.26, Strand 3.0, Sub-strand 3.6",
              verification: "unverified" as const,
              slos: [
                { description: "describe the temperature conditions of the immediate environment as either warm, hot or cold", cognitiveLevel: "apply" },
                { description: "compare temperature using hotter, warmer, colder and same as in different situations", cognitiveLevel: "apply" },
                { description: "identify units of measuring temperature as degree Celsius and Kelvin in different situations", cognitiveLevel: "apply" },
                { description: "convert units of measuring temperature from degree Celsius to Kelvin and vice- versa", cognitiveLevel: "apply" },
                { description: "work out temperature in degree Celsius and Kelvin in real life situations", cognitiveLevel: "apply" },
                { description: "use IT devices or other resources to read temperature conditions of different places", cognitiveLevel: "apply" },
                { description: "recognise temperature changes in the environment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Money",
              order: 7,
              suggestedLessons: 12,
              sourceRef: "KICD G7 Mathematics p.28, Strand 3.0, Sub-strand 3.7",
              verification: "unverified" as const,
              slos: [
                { description: "work out profit and loss in real life situations", cognitiveLevel: "apply" },
                { description: "calculate the percentage profit and loss in different situations", cognitiveLevel: "apply" },
                { description: "calculate discount and percentage discount of different goods and services", cognitiveLevel: "apply" },
                { description: "calculate commission and percentage commission in real life situations", cognitiveLevel: "apply" },
                { description: "interpret bills at home", cognitiveLevel: "apply" },
                { description: "prepare bills in real life situations", cognitiveLevel: "apply" },
                { description: "work out postal charges in real life situations", cognitiveLevel: "apply" },
                { description: "identify mobile money services for different transactions", cognitiveLevel: "apply" },
                { description: "work out mobile money transactions in real life situations", cognitiveLevel: "apply" },
                { description: "use IT devices to learn more on money transactions", cognitiveLevel: "apply" },
                { description: "recognise use of money in day to day activities.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Geometry",
          order: 4,
          subStrands: [
            {
              name: "Angles",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Mathematics p.33, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "relate different types of angles on a straight line in real life situations", cognitiveLevel: "apply" },
                { description: "solve angles at a point in learning situations", cognitiveLevel: "apply" },
                { description: "relate angles on a transversal in different situations", cognitiveLevel: "apply" },
                { description: "solve angles in a parallelogram in different situation", cognitiveLevel: "apply" },
                { description: "identify angle properties of polygons up to hexagon in different situations", cognitiveLevel: "apply" },
                { description: "relate interior angles, exterior angles and the number of sides of a polygon", cognitiveLevel: "apply" },
                { description: "solve angles and sides of polygons up to hexagon in learning situations,", cognitiveLevel: "apply" },
                { description: "reflect on use of angles in objects within the environment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Geometrical Constructions",
              order: 2,
              suggestedLessons: 12,
              sourceRef: "KICD G7 Mathematics p.35, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "measure different angles in learning situations", cognitiveLevel: "apply" },
                { description: "bisect angles using a ruler and a pair of compasses only in learning situations", cognitiveLevel: "apply" },
                { description: "construct 90 0 , 45 0 60 0 , 30 0 and other angles that are multiples of 7.5 0 using a ruler and a pair of compasses only in learning situations", cognitiveLevel: "apply" },
                { description: "construct different triangles using a ruler and a pair of compasses only in different situations", cognitiveLevel: "apply" },
                { description: "construct circles using a ruler and a pair of compasses only in different situations", cognitiveLevel: "apply" },
                { description: "recognise use of geometric constructions of different shapes in objects", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Data Handling and Probability",
          order: 5,
          subStrands: [
            {
              name: "Data Handling",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Mathematics p.38, Strand 5.0, Sub-strand 5.1",
              verification: "unverified" as const,
              slos: [
                { description: "state the meaning of data in learning situation", cognitiveLevel: "apply" },
                { description: "collect data from different situations", cognitiveLevel: "apply" },
                { description: "draw frequency distribution table of data from different sources", cognitiveLevel: "apply" },
                { description: "determine suitable scale for graphs of data from different situations", cognitiveLevel: "apply" },
                { description: "draw pictographs of data from real life situations", cognitiveLevel: "apply" },
                { description: "draw bar graphs of data from different sources", cognitiveLevel: "apply" },
                { description: "interpret bar graphs of data from real life situations", cognitiveLevel: "apply" },
                { description: "draw pie charts of data from real life situations", cognitiveLevel: "apply" },
                { description: "interpret pie charts of data from real life situations", cognitiveLevel: "apply" },
                { description: "draw a line graph of data from different situations", cognitiveLevel: "apply" },
                { description: "interpret travel graphs from real life situations", cognitiveLevel: "apply" },
                { description: "promote use of data in real life situations.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Outcomes that terminate mid-sentence in the published KICD design. Transcribed
 * verbatim; the missing text must be supplied by a teacher, not inferred.
 */
export const INCOMPLETE_IN_SOURCE = [
  {
    location: "Strand 3.0, Sub-strand 3.4 Volume and Capacity",
    text: "convert metre cube (m 3 ) into centimeter cube (cm 3 ) and",
    issue: "Dangling conjunction; the design ends the outcome there.",
  },
  {
    location: "Strand 3.0, Sub-strand 3.5 Time, Distance and Speed",
    text: "convert units of speed from kilometers per hour (Km/h) to meters per second (m/s) and",
    issue: "Dangling conjunction; the design ends the outcome there.",
  },
] as const;
