/**
 * Grade 7 Christian Religious Education — transcribed from the KICD curriculum
 * design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, CHRISTIAN RELIGIOUS EDUCATION,
 *         GRADE 7", Kenya Institute of Curriculum Development, 2021.
 *
 * Two levels, like Mathematics, Integrated Science and Social Studies.
 *
 * Transcribed mechanically: 6 strands, 18 sub-strands, 100 published lessons
 * and 87 specific learning outcomes, verbatim.
 *
 * THE LESSON COUNT DOES NOT RECONCILE WITH THE ALLOCATION, AND THE GAP IS IN
 * THE SOURCE. The time-allocation table printed in this same document gives
 * Religious Education (CRE, HRE, IRE) 4 lessons a week, which is 120 over 30
 * teaching weeks. The design publishes 100. Two independent passes over the
 * source agree there are 18 sub-strands: the lesson parentheticals, and the
 * "should be able to" cue counted strand by strand (1, 4, 4, 2, 2, 5). So the
 * 20-lesson gap is not an extraction loss. It is transcribed as published and
 * left for a teacher to resolve.
 *
 * THREE THINGS THE FIRST PASS GOT WRONG
 *
 * - 4.1 "Prophecies about the Messiah" prints its lesson count across a page
 *   break, three sentences after its name. Requiring the count to follow the
 *   name immediately dropped the sub-strand and its 6 lessons.
 * - The contents page and the body disagree on strand 4's name: "EARLY LIFE OF
 *   JESUS CHRIST" against "THE EARLY LIFE OF JESUS CHRIST". De-duplicating on
 *   the name kept both, and every later sub-strand was attributed to the wrong
 *   strand.
 * - Appendix 1 repeats every sub-strand with suggested assessment methods. It
 *   carries a lesson count and no outcomes, so it was taken as a unit of its
 *   own, complete with a phantom "6.2 Christian Marriage and Family (7)".
 *
 * A table row that spans a page break puts the learning-experience column and
 * the running footer inside the outcome list. One outcome was stitched back
 * across that break; two others had a fragment of the other column stripped.
 *
 * cognitiveLevel is not from the design, so it falls back to "apply" and must
 * be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7CreData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Christian Religious Education",
      strands: [
        {
          name: "INTRODUCTION TO CHRISTIAN RELIGIOUS EDUCATION",
          order: 1,
          subStrands: [
            {
              name: "Importance of Studying Christian Religious Education",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.1, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "analyse the importance of learning Christian Religious Education", cognitiveLevel: "apply" },
                { description: "discuss how Christian Religious Education promote sound moral and religious values", cognitiveLevel: "apply" },
                { description: "compile five values needed to foster responsible living", cognitiveLevel: "apply" },
                { description: "apply the values acquired in their daily interactions to lead morally upright lives", cognitiveLevel: "apply" },
                { description: "appreciate the learning of Christian Religious Education by living responsibly", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "CREATION",
          order: 2,
          subStrands: [
            {
              name: "Accounts of Creation",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.4, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe the biblical accounts of creation", cognitiveLevel: "apply" },
                { description: "discuss the similarities and differences between the two accounts of creation", cognitiveLevel: "apply" },
                { description: "identify the attributes of God from the biblical accounts of creation", cognitiveLevel: "apply" },
                { description: "appreciate God’s creative work by taking care of the environment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Stewardship over Creation",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.6, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "explain the biblical responsibilities given to human beings over creation", cognitiveLevel: "apply" },
                { description: "discuss ways he/she can protect animals, fish and birds", cognitiveLevel: "apply" },
                { description: "practise good stewardship by taking care of animals, fish and birds", cognitiveLevel: "apply" },
                { description: "desire to take good care of God's creation in his/her environment", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Responsibility over Plants",
              order: 3,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.8, Strand 2.0, Sub-strand 2.3",
              verification: "unverified" as const,
              slos: [
                { description: "describe the biblical responsibilities given to human beings over plants", cognitiveLevel: "apply" },
                { description: "apply the biblical teachings acquired to conserve the environment", cognitiveLevel: "apply" },
                { description: "discuss ways responsible use of plants contribute to economic growth", cognitiveLevel: "apply" },
                { description: "desire to contribute to a healthy ecosystem", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Use of Natural Resources",
              order: 4,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Christian Religious Education p.10, Strand 2.0, Sub-strand 2.4",
              verification: "unverified" as const,
              slos: [
                { description: "explain ways in which human beings use and misuse natural resources", cognitiveLevel: "apply" },
                { description: "explore the effects of misusing natural resources", cognitiveLevel: "apply" },
                { description: "discuss Biblical teachings on good use of God’s creation", cognitiveLevel: "apply" },
                { description: "desire to conserve the environment as responsible citizens.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THE BIBLE",
          order: 3,
          subStrands: [
            {
              name: "Functions of the Bible",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.14, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "outline the importance of the Bible in the society today", cognitiveLevel: "apply" },
                { description: "describe how the Bible promotes holistic growth", cognitiveLevel: "apply" },
                { description: "analyse how God’s Word inspires different services among Christians", cognitiveLevel: "apply" },
                { description: "appreciate the Bible as the inspired Word of God", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Divisions of the Bible",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.16, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify the two divisions of the Bible", cognitiveLevel: "apply" },
                { description: "classify the books of the Old and New Testament appropriately", cognitiveLevel: "apply" },
                { description: "appreciate the Bible for reflective learning and living", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Bible Translations",
              order: 3,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.17, Strand 3.0, Sub-strand 3.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify different Bible translations used in Kenya today", cognitiveLevel: "apply" },
                { description: "discuss reasons for translation of the Bible to local languages", cognitiveLevel: "apply" },
                { description: "examine the social and economic effects of translation of the Bible into local languages", cognitiveLevel: "apply" },
                { description: "appreciate the work of Bible translation in Kenya.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Leadership in Israel: Moses",
              order: 4,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.19, Strand 3.0, Sub-strand 3.4",
              verification: "unverified" as const,
              slos: [
                { description: "describe how God prepared Moses for leadership", cognitiveLevel: "apply" },
                { description: "identify the roles played by Moses during the Exodus", cognitiveLevel: "apply" },
                { description: "outline leadership qualities he/she can emulate from Moses", cognitiveLevel: "apply" },
                { description: "apply leadership qualities learnt from Moses in their daily life", cognitiveLevel: "apply" },
                { description: "desire to choose leaders of integrity for the good of the society", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THE EARLY LIFE OF JESUS CHRIST",
          order: 4,
          subStrands: [
            {
              name: "Prophecies about the Messiah",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.22, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "outline the Old Testament prophecies about the Messiah", cognitiveLevel: "apply" },
                { description: "describe the fulfilment of the Old Testament prophecies about the Messiah", cognitiveLevel: "apply" },
                { description: "appreciate the fulfillment of the Old Testament prophecies.", cognitiveLevel: "apply" },
                { description: "describe the annunciation and birth of John the Baptist", cognitiveLevel: "apply" },
                { description: "relate the birth of John the Baptist to the coming of Jesus Christ", cognitiveLevel: "apply" },
                { description: "utilize the values of sharing and integrity to form harmonious relationships", cognitiveLevel: "apply" },
                { description: "desire to be God fearing Christians as portrayed by John the Baptist.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "The Birth and Childhood of Jesus Christ",
              order: 2,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.26, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "outline the events that took place during the annunciation and the birth of Jesus Christ", cognitiveLevel: "apply" },
                { description: "describe the dedication of baby Jesus", cognitiveLevel: "apply" },
                { description: "analyse the story of Jesus Christ in the Temple", cognitiveLevel: "apply" },
                { description: "identify values learnt from the birth and childhood of Jesus Christ", cognitiveLevel: "apply" },
                { description: "appreciate the dedication of Jesus", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "THE CHURCH",
          order: 5,
          subStrands: [
            {
              name: "Selected Forms of Worship",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Christian Religious Education p.31, Strand 5.0, Sub-strand 5.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain teachings on selected forms of worship", cognitiveLevel: "apply" },
                { description: "discuss the importance of prayer and fasting", cognitiveLevel: "apply" },
                { description: "describe how they practice the teachings of Jesus Christ on prayer and fasting", cognitiveLevel: "apply" },
                { description: "practise different forms of worship in his/her day-to- day life", cognitiveLevel: "apply" },
                { description: "desire to use different forms of worship to build a strong relationship with God", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Role of the Church in Education and Health",
              order: 2,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Christian Religious Education p.33, Strand 5.0, Sub-strand 5.2",
              verification: "unverified" as const,
              slos: [
                { description: "discuss the contribution of the Church towards education and health", cognitiveLevel: "apply" },
                { description: "identify barriers to effective Church mission work in Kenya today", cognitiveLevel: "apply" },
                { description: "appreciate the contribution of the Church in education and health", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "CHRISTIAN LIVING TODAY",
          order: 6,
          subStrands: [
            {
              name: "Human Sexuality",
              order: 1,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Christian Religious Education p.36, Strand 6.0, Sub-strand 6.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the meaning of human sexuality for holistic development", cognitiveLevel: "apply" },
                { description: "discuss healthy and unhealthy relationships for responsible living", cognitiveLevel: "apply" },
                { description: "discuss the circumstances that lead to unhealthy relationships", cognitiveLevel: "apply" },
                { description: "outline the consequences of engaging in sex before marriage", cognitiveLevel: "apply" },
                { description: "apply Christian values as they relate with others", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Christian Marriage and Family",
              order: 2,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Christian Religious Education p.38, Strand 6.0, Sub-strand 6.2",
              verification: "unverified" as const,
              slos: [
                { description: "discuss the biblical teachings on marriage and family", cognitiveLevel: "apply" },
                { description: "explain ways the church promote values among young people before marriage", cognitiveLevel: "apply" },
                { description: "identify values and life skills needed to maintain stability in families", cognitiveLevel: "apply" },
                { description: "appreciate the family as a sacred institution ordained by God.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Alcohol, Drugs and Substance Abuse",
              order: 3,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Christian Religious Education p.40, Strand 6.0, Sub-strand 6.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify drugs commonly abused by youths in Kenya today", cognitiveLevel: "apply" },
                { description: "discuss reasons why young people abuse drugs today", cognitiveLevel: "apply" },
                { description: "explore effects of alcohol, substance and drug abuse on an individual and the family", cognitiveLevel: "apply" },
                { description: "analyse the biblical teachings on alcohol, drug and substance abuse for responsible living", cognitiveLevel: "apply" },
                { description: "recommend values and life-skills needed to stay free from alcohol, drug and substance abuse", cognitiveLevel: "apply" },
                { description: "utilize values and life- skills acquired to live an alcohol, drug and substance free life.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Gambling",
              order: 4,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Christian Religious Education p.43, Strand 6.0, Sub-strand 6.4",
              verification: "unverified" as const,
              slos: [
                { description: "identify different types of gambling", cognitiveLevel: "apply" },
                { description: "explain the biblical teachings on gambling", cognitiveLevel: "apply" },
                { description: "discuss the causes of gambling in the society today", cognitiveLevel: "apply" },
                { description: "examine the effects of gambling on individuals and families", cognitiveLevel: "apply" },
                { description: "explore measures taken by Christians and the government to help young people overcome gambling", cognitiveLevel: "apply" },
                { description: "recommend values and life-skills needed to overcome gambling", cognitiveLevel: "apply" },
                { description: "apply the skills and values learnt to live responsibly", cognitiveLevel: "apply" },
                { description: "desire to live a gambling free life for the good of their well- being.", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Social Media",
              order: 5,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Christian Religious Education p.45, Strand 6.0, Sub-strand 6.5",
              verification: "unverified" as const,
              slos: [
                { description: "identify different social media platforms used by young people today", cognitiveLevel: "apply" },
                { description: "describe ways of using social media responsibly", cognitiveLevel: "apply" },
                { description: "examine ways in which social media is misused today", cognitiveLevel: "apply" },
                { description: "discuss ways they should respond to cyberbullying", cognitiveLevel: "apply" },
                { description: "recommend values and life –skills needed for responsible use of social media.", cognitiveLevel: "apply" },
                { description: "apply Christian values as they use different social media platforms", cognitiveLevel: "apply" },
                { description: "desire to use social media/internet appropriately as God fearing Christians.", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
