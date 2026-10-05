/**
 * Grade 7 Pre-Technical Studies transcribed from the revised KICD design.
 *
 * The design allocates 120 lessons across five strands and fourteen
 * sub-strands. KICD does not publish Bloom levels per outcome, so all outcomes
 * retain the project's neutral "apply" fallback pending teacher review.
 */

const outcomes = (...descriptions: string[]) =>
  descriptions.map((description) => ({ description, cognitiveLevel: "apply" }));

const SOURCE_PAGES: Record<string, number> = {
  "1.1": 1,
  "1.2": 3,
  "1.3": 5,
  "2.1": 7,
  "2.2": 9,
  "2.3": 11,
  "3.1": 13,
  "3.2": 15,
  "3.3": 17,
  "4.1": 20,
  "4.2": 23,
  "5.1": 25,
  "5.2": 27,
  "5.3": 29,
};

const sourceRef = (strand: string, subStrand: string) =>
  `KICD G7 Pre-Technical Studies p.${SOURCE_PAGES[subStrand]}, Strand ${strand}, Sub-strand ${subStrand}`;

export const grade7PreTechnicalStudiesData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Pre-Technical Studies",
      strands: [
        {
          name: "Foundations of Pre-Technical Studies",
          order: 1,
          subStrands: [
            {
              name: "Introduction to Pre-Technical Studies",
              order: 1,
              suggestedLessons: 4,
              sourceRef: sourceRef("1.0", "1.1"),
              verification: "unverified" as const,
              slos: outcomes(
                "identify the components of Pre-Technical Studies as a learning area",
                "explain the role of Pre-Technical Studies in day-to-day life",
                "embrace Pre-Technical Studies in career development."
              ),
            },
            {
              name: "Safety in the Work Environment",
              order: 2,
              suggestedLessons: 6,
              sourceRef: sourceRef("1.0", "1.2"),
              verification: "unverified" as const,
              slos: outcomes(
                "identify potential safety threats in a work environment",
                "outline safety rules and regulations in the work environment",
                "observe safety in a work environment",
                "appreciate the importance of observing safety in a work environment."
              ),
            },
            {
              name: "Computer Concepts",
              order: 3,
              suggestedLessons: 6,
              sourceRef: sourceRef("1.0", "1.3"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the characteristics of a computer in a user environment",
                "classify computers in a user environment",
                "use a computer to perform tasks in a user environment",
                "acknowledge the importance of different types of computers in a user environment."
              ),
            },
          ],
        },
        {
          name: "Communication",
          order: 2,
          subStrands: [
            {
              name: "Fundamentals of Communication",
              order: 1,
              suggestedLessons: 6,
              sourceRef: sourceRef("2.0", "2.1"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the importance of communication in a work environment",
                "describe the ICT tools used in communication",
                "use ICT to enhance communication",
                "acknowledge the role of effective communication in the work environment."
              ),
            },
            {
              name: "Introduction to Drawing",
              order: 2,
              suggestedLessons: 10,
              sourceRef: sourceRef("2.0", "2.2"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the importance of drawing as a means of communication",
                "distinguish between artistic and technical drawings used in technical fields",
                "print numbers and letters of the alphabet as used in drawing",
                "draw types of lines used in drawing",
                "illustrate symbols and abbreviations used in drawing",
                "appreciate the role of drawing in communication."
              ),
            },
            {
              name: "Plane Geometry",
              order: 3,
              suggestedLessons: 8,
              sourceRef: sourceRef("2.0", "2.3"),
              verification: "unverified" as const,
              slos: outcomes(
                "describe methods of dimensioning drawings in plane geometry",
                "construct combined shapes used in a work environment",
                "dimension combined shapes in plane geometry",
                "embrace the use of plane geometry in a work environment."
              ),
            },
          ],
        },
        {
          name: "Materials for Production",
          order: 3,
          subStrands: [
            {
              name: "Economic Resources",
              order: 1,
              suggestedLessons: 6,
              sourceRef: sourceRef("3.0", "3.1"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the characteristics of economic resources used for production of goods and services",
                "classify economic resources in Kenya",
                "distinguish between metallic and non-metallic materials as economic resources",
                "analyse sustainable ways of using economic resources in Kenya",
                "practice sustainable use of economic resources in the community."
              ),
            },
            {
              name: "Metallic Materials",
              order: 2,
              suggestedLessons: 10,
              sourceRef: sourceRef("3.0", "3.2"),
              verification: "unverified" as const,
              slos: outcomes(
                "identify types of metallic materials used in a work environment",
                "describe the physical properties of metallic materials found in a work environment",
                "relate metallic materials to their use in a work environment",
                "appreciate the use of metallic materials in production."
              ),
            },
            {
              name: "Non-Metallic Materials",
              order: 3,
              suggestedLessons: 10,
              sourceRef: sourceRef("3.0", "3.3"),
              verification: "unverified" as const,
              slos: outcomes(
                "identify non-metallic materials found in the locality",
                "categorise non-metallic materials as either synthetic or natural",
                "describe the physical properties of non-metallic materials found in the locality",
                "relate non-metallic materials to their uses in the locality",
                "appreciate the use of non-metallic materials in production."
              ),
            },
          ],
        },
        {
          name: "Tools and Production",
          order: 4,
          subStrands: [
            {
              name: "Measuring and Marking Out Tools",
              order: 1,
              suggestedLessons: 18,
              sourceRef: sourceRef("4.0", "4.1"),
              verification: "unverified" as const,
              slos: outcomes(
                "identify measuring and marking out tools in the work environment",
                "select measuring and marking out tools for a given task",
                "use measuring and marking out tools to perform a given task",
                "care for measuring and marking out tools in the work environment",
                "recognise the importance of measuring and marking out tools in the work environment."
              ),
            },
            {
              name: "Production of Goods and Services",
              order: 2,
              suggestedLessons: 8,
              sourceRef: sourceRef("4.0", "4.2"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the benefits of production to the community",
                "distinguish between goods and services found in the local market",
                "describe the factors of production in the community",
                "analyse ethical and unethical practices in production of goods and services",
                "participate in production activities in the community."
              ),
            },
          ],
        },
        {
          name: "Entrepreneurship",
          order: 5,
          subStrands: [
            {
              name: "Introduction to Entrepreneurship",
              order: 1,
              suggestedLessons: 8,
              sourceRef: sourceRef("5.0", "5.1"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the importance of entrepreneurship to an individual and community",
                "describe the qualities of an entrepreneur in business",
                "explore sources of business ideas for a business venture",
                "analyse the factors considered when evaluating the viability of a business opportunity",
                "evaluate the factors that enhance success in a business",
                "practice entrepreneurship for self and community development."
              ),
            },
            {
              name: "Money",
              order: 2,
              suggestedLessons: 10,
              sourceRef: sourceRef("5.0", "5.2"),
              verification: "unverified" as const,
              slos: outcomes(
                "identify the characteristics of money as a medium of exchange",
                "explain the uses of money in day-to-day life",
                "describe the key security features of the Kenyan currency",
                "analyse the themes and symbols on the Kenyan currency",
                "appreciate the use of money in day-to-day life."
              ),
            },
            {
              name: "Financial Goals",
              order: 3,
              suggestedLessons: 10,
              sourceRef: sourceRef("5.0", "5.3"),
              verification: "unverified" as const,
              slos: outcomes(
                "explain the importance of setting goals in financial management",
                "analyse the factors to consider when setting financial goals",
                "formulate financial goals for individual development",
                "observe financial discipline in financial management."
              ),
            },
          ],
        },
      ],
    },
  ],
};
