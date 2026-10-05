/**
 * Grade 7 Social Studies — transcribed from the KICD curriculum design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, SOCIAL STUDIES, GRADE 7",
 *         Kenya Institute of Curriculum Development, April 2024.
 *
 * Two levels, like Mathematics and Integrated Science: strand (N.0) and
 * sub strand (N.1), with the published lesson count on the sub strand.
 *
 * Transcribed mechanically: 5 strands, 20 sub-strands, 114 lessons and 86
 * specific learning outcomes, verbatim.
 *
 * Replaces the previous seed, which had three strands (History, Geography,
 * Citizenship and Governance) and omitted Community Service Learning entirely.
 * CSL is a flagship CBC component and now has its own strand.
 *
 * THE DESIGN CONTRADICTS ITSELF ON LESSON COUNTS. Its summary table totals
 * 120 lessons, matching the official allocation of 4 periods a week over 30
 * teaching weeks. Four sub-strand headings in the body state 4 where the
 * summary states 5, so the body headings total 114. Body values are
 * transcribed verbatim and the conflicts are listed in SOURCE_CONFLICTS below
 * for a teacher to settle. This is the first subject where the two disagree.
 *
 * SOURCE REFERENCES CARRY NO PAGE NUMBER. This design prints bare page
 * numbers with no recoverable marker, so pages are not guessed; sub-strands
 * are cited by strand and number.
 *
 * cognitiveLevel is not from the design, so it falls back to "apply" and must
 * be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

export const grade7SocialStudiesData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Social Studies",
      strands: [
        {
          name: "SOCIAL STUDIES AND PERSONAL DEVELOPMENT",
          order: 1,
          subStrands: [
            {
              name: "Self- Exploration",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Social Studies, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "explore personal abilities and interests for holistic development", cognitiveLevel: "apply" },
                { description: "develop personal values for a steady personality", cognitiveLevel: "apply" },
                { description: "manage emotions in day-to- day life", cognitiveLevel: "apply" },
                { description: "appreciate personal awareness in day-to-day life.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Entrepreneurial Opportunities in Social Studies",
              order: 2,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify entrepreneurial opportunities that closely match their personality", cognitiveLevel: "apply" },
                { description: "describe requirements for social entrepreneurial opportunities in the world of work", cognitiveLevel: "apply" },
                { description: "appreciate entrepreneurial opportunities in social studies.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "PEOPLE AND RELATIONSHIPS",
          order: 2,
          subStrands: [
            {
              name: "Human Origin",
              order: 1,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "explore traditional stories of human origin from African communities", cognitiveLevel: "apply" },
                { description: "explain religious stories about the origin of humankind", cognitiveLevel: "apply" },
                { description: "illustrate common aspects found in traditional and religious stories of human origin", cognitiveLevel: "apply" },
                { description: "acknowledge religious and traditional stories of human origin.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Early Civilization",
              order: 2,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "explore factors that led to the growth of the selected ancient Kingdoms in Africa", cognitiveLevel: "apply" },
                { description: "locate the selected ancient Kingdoms on a map of Africa", cognitiveLevel: "apply" },
                { description: "assess the contribution of ancient Kingdoms to the modern world civilisation", cognitiveLevel: "apply" },
                { description: "appreciate the contribution of ancient kingdoms to the development of the modern world.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Slavery and Servitude",
              order: 3,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify the various forms of slavery and servitude in traditional African society", cognitiveLevel: "apply" },
                { description: "explain factors which led to development of Indian ocean slave trade", cognitiveLevel: "apply" },
                { description: "sketch the geographical extent of the regions covered by Indian Ocean slave trade in Africa", cognitiveLevel: "apply" },
                { description: "desire to promote human dignity for a just and peaceful world.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Developments in medium of trade",
              order: 4,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "compare barter trade and the use of currency trade in Africa", cognitiveLevel: "apply" },
                { description: "trace the factors that led to introduction of money in Africa", cognitiveLevel: "apply" },
                { description: "deduce the impact of introduction of money in Africa", cognitiveLevel: "apply" },
                { description: "appreciate medium of trade for sustainability.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Diversity and interpersonal relationships",
              order: 5,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 2.0, Sub-strand 2.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify factors that determine human diversity in the society", cognitiveLevel: "apply" },
                { description: "explain interpersonal skills that enhance healthy interactions in a multicultural society", cognitiveLevel: "apply" },
                { description: "classify the desirable and undesirable personality attributes", cognitiveLevel: "apply" },
                { description: "appreciate the importance of building healthy relationships in multicultural society.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Peaceful Coexistence",
              order: 6,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 2.0, Sub-strand 2.6",
              verification: "unverified" as const,
              slos: [
                { description: "outline qualities of a peaceful person in the community", cognitiveLevel: "apply" },
                { description: "explore factors that promote peaceful coe- existence", cognitiveLevel: "apply" },
                { description: "assess peaceful conflict resolution process in day- to-day life", cognitiveLevel: "apply" },
                { description: "value importance peaceful coexistence in the community in day-to- day life. Learner", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "COMMUNITY SERVICE LEARNING",
          order: 3,
          subStrands: [
            {
              name: "Community Service Learning Community Service Learning",
              order: 1,
              suggestedLessons: 20,
              sourceRef: "KICD G7 Social Studies, Strand 3.0, Sub-strand 3.0",
              verification: "unverified" as const,
              slos: [
                { description: "explain the meaning of key terms used in community service learning (CSL) and CSL projects", cognitiveLevel: "apply" },
                { description: "describe the importance of CSL in the community", cognitiveLevel: "apply" },
                { description: "outline steps of a CSL project/activity", cognitiveLevel: "apply" },
                { description: "execute a class CSL project", cognitiveLevel: "apply" },
                { description: "Desire to conduct CSL project in the community Learner", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "NATURAL AND HISTORIC BUILT ENVIRONMENTS IN AFRICA",
          order: 4,
          subStrands: [
            {
              name: "Historical information",
              order: 1,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify various sources of historical information in the society", cognitiveLevel: "apply" },
                { description: "distinguish between primary and secondary sources of historical information", cognitiveLevel: "apply" },
                { description: "explore how various sources of historical information have been preserved over the years", cognitiveLevel: "apply" },
                { description: "appreciate the significance of various sources of historical information in providing evidence of past human accounts. Learner", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Historical Development of Agriculture",
              order: 2,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "locate areas where early agriculture was practised in selected geographical regions in Africa", cognitiveLevel: "apply" },
                { description: "explore crops grown and animals kept in selected regions during early agriculture", cognitiveLevel: "apply" },
                { description: "illustrate methods of irrigation used in ancient Egypt", cognitiveLevel: "apply" },
                { description: "assess the contribution of the Nile valley agriculture to world civilization", cognitiveLevel: "apply" },
                { description: "explore possible careers in Agriculture", cognitiveLevel: "apply" },
                { description: "value the importance of domestication of plants and animals in Africa. The learners", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Maps and map work",
              order: 3,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Social Studies, Strand 4.0, Sub-strand 4.3",
              verification: "unverified" as const,
              slos: [
                { description: "describe the position, shape and size of Africa", cognitiveLevel: "apply" },
                { description: "locate places and features using latitudes and longitudes on a map", cognitiveLevel: "apply" },
                { description: "calculate the time of different places in the world", cognitiveLevel: "apply" },
                { description: "appreciate the location of key features in the continent.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Earth and the Solar System",
              order: 4,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Social Studies, Strand 4.0, Sub-strand 4.4",
              verification: "unverified" as const,
              slos: [
                { description: "describe the origin of the earth", cognitiveLevel: "apply" },
                { description: "explore the size, shape and position of the earth in the solar system", cognitiveLevel: "apply" },
                { description: "examine the effects of rotation and revolution of the earth on human activities", cognitiveLevel: "apply" },
                { description: "illustrate the internal structure of the earth in the solar system", cognitiveLevel: "apply" },
                { description: "appreciate the effects of rotation and revolution of the earth on human activities.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Weather",
              order: 5,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 4.0, Sub-strand 4.5",
              verification: "unverified" as const,
              slos: [
                { description: "describe the elements of weather in the environment", cognitiveLevel: "apply" },
                { description: "construct selected instruments for measuring elements of weather", cognitiveLevel: "apply" },
                { description: "examine the significance of weather to human environment", cognitiveLevel: "apply" },
                { description: "respond appropriately to different weather conditions in the environment.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Field work",
              order: 6,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Social Studies, Strand 4.0, Sub-strand 4.6",
              verification: "unverified" as const,
              slos: [
                { description: "examine methods of data collection used in field work", cognitiveLevel: "apply" },
                { description: "use analysis methods to process data from the field work", cognitiveLevel: "apply" },
                { description: "explore solutions to challenges in carrying out field work", cognitiveLevel: "apply" },
                { description: "value field work in investigating phenomena.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "POLITICAL DEVELOPMENT AND GOVERNANCE",
          order: 5,
          subStrands: [
            {
              name: "Political Development in Africa",
              order: 1,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Social Studies, Strand 5.0, Sub-strand 5.1",
              verification: "unverified" as const,
              slos: [
                { description: "explore roles of European groups in the ‘Scramble for and Partition’ of Africa", cognitiveLevel: "apply" },
                { description: "examine the terms of the Berlin Conference of 1884- 1885 on the partitioning of Africa", cognitiveLevel: "apply" },
                { description: "locate the regions partitioned by the European groups that came to Africa.", cognitiveLevel: "apply" },
                { description: "acknowledge the political organisation of the selected African communities up to 1900", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "The Constitution of Kenya",
              order: 2,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Social Studies, Strand 5.0, Sub-strand 5.2",
              verification: "unverified" as const,
              slos: [
                { description: "discuss the importance of the Constitution of Kenya", cognitiveLevel: "apply" },
                { description: "analyse ways of upholding and protecting the Constitution of Kenya for social cohesion", cognitiveLevel: "apply" },
                { description: "apply the national values in day-to-day life as provided in the Constitution of Kenyage", cognitiveLevel: "apply" },
                { description: "uphold and protect the Constitution of Kenya to promotion ethical and responsible citizenship.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Human Rights",
              order: 3,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Social Studies, Strand 5.0, Sub-strand 5.3",
              verification: "unverified" as const,
              slos: [
                { description: "classify human rights as stipulated in the human rights instruments", cognitiveLevel: "apply" },
                { description: "explore characteristics of human rights in the society", cognitiveLevel: "apply" },
                { description: "explain the concept of equity and non- discrimination in fostering solidarity", cognitiveLevel: "apply" },
                { description: "take action to promote equity and non- discrimination for social justice", cognitiveLevel: "apply" },
                { description: "value human rights for promotion of human dignity.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "African Diasporas",
              order: 4,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 5.0, Sub-strand 5.4",
              verification: "unverified" as const,
              slos: [
                { description: "explore the factors that contributed to the presence of African diasporas across the world", cognitiveLevel: "apply" },
                { description: "locate countries inhabited by African diasporas by 1960 on a world map", cognitiveLevel: "apply" },
                { description: "assess the role of the diasporas in the political development in Africa", cognitiveLevel: "apply" },
                { description: "acknowledge the African diasporas and promotion of African unity in society today.", cognitiveLevel: "apply" },
                { description: "and present in class", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Citizenship",
              order: 5,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Social Studies, Strand 5.0, Sub-strand 5.5",
              verification: "unverified" as const,
              slos: [
                { description: "explain why there is interconnectedness and interdependence among countries in the world today", cognitiveLevel: "apply" },
                { description: "examine effects of globalisation at national and global levels", cognitiveLevel: "apply" },
                { description: "describe qualities of a global citizen in the modern society", cognitiveLevel: "apply" },
                { description: "create awareness on the effects of globalisation at national and global levels", cognitiveLevel: "apply" },
                { description: "contribute to the international community while", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Places where the design's own summary table and its body headings disagree.
 * Body values are what is stored; a teacher must decide which is authoritative.
 */
export const SOURCE_CONFLICTS = [
  { subStrand: "1.2", summaryLessons: 5, bodyLessons: 4, note: "summary calls it \"Social Entrepreneurial Opportunities\", body calls it \"Entrepreneurial Opportunities in Social Studies\"" },
  { subStrand: "2.3", summaryLessons: 5, bodyLessons: 4, note: "Slavery and Servitude" },
  { subStrand: "2.5", summaryLessons: 5, bodyLessons: 4, note: "Diversity and interpersonal relationships" },
  { subStrand: "5.4", summaryLessons: 5, bodyLessons: 4, note: "African Diasporas" },
  { subStrand: "2.2", summaryLessons: 4, bodyLessons: 4, note: "spelling only: summary \"Early Civilisation\", body \"Early Civilization\"" },
] as const;
