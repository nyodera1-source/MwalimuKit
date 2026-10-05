/**
 * Grade 7 Islamic Religious Education — transcribed from the KICD curriculum
 * design.
 *
 * Source: "JUNIOR SCHOOL CURRICULUM DESIGN, ISLAMIC RELIGIOUS EDUCATION,
 *         GRADE 7", Kenya Institute of Curriculum Development, first published
 *         2023, revised 2024.
 *
 * Two levels, like Mathematics, Integrated Science and Social Studies.
 *
 * Transcribed mechanically: 7 strands, 16 sub-strands, 121 published lessons
 * and 76 specific learning outcomes, verbatim.
 *
 * ONE LESSON MORE THAN THE ALLOCATION ALLOWS. The lesson-allocation table in
 * this same document gives Religious Education 4 lessons a week, which is 120
 * over 30 teaching weeks, and the design publishes 121. Its Christian
 * counterpart publishes 100 against the same allocation. Transcribed as
 * published in both cases and left for a teacher to resolve rather than
 * rounded to the allocation.
 *
 * SOURCE REFERENCES CARRY NO PAGE NUMBER. The design prints one numeric page
 * marker, before the first sub-strand, and none after it, so every citation
 * would read "p.1". Sub-strands are cited by strand and number.
 *
 * WHAT THE FIRST PASS GOT WRONG
 *
 * - There is no "STRAND n.0" heading in this design. The strand sits in the
 *   last column of the repeating table header — "... Key Inquiry Question(s)
 *   5.0 Akhlaq (Moral values) 5.1 ..." — once per sub-strand, with the
 *   contents page spelling the names in capitals. A pass looking for the
 *   heading found nothing, so no sub-strand had a strand.
 * - "1.1 Ulumul Qur’an" and "7.1 Reforms introduced By Prophet Muhammad
 *   (S.A.W.)" were rebuilt with the name cut in half, because the name class
 *   excluded the curly apostrophe and the full stop.
 * - The last unit's block runs to the appendix, and the Community Service
 *   Learning activity opens with a cue of its own and has seven outcomes to
 *   7.1's four. The longest ascending run won, so four real outcomes were
 *   replaced by seven belonging to another section. Outcomes are now taken
 *   from the first list after the cue and nothing beyond the next cue.
 *
 * cognitiveLevel is not from the design, so it falls back to "apply" and must
 * be reviewed.
 *
 * verification stays "unverified": no teacher has reviewed this yet.
 */

import type { GradeData } from "./index";

export const grade7IreData: GradeData = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    {
      name: "Islamic Religious Education",
      strands: [
        {
          name: "Qur’an",
          order: 1,
          subStrands: [
            {
              name: "Ulumul Qur’an",
              order: 1,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 1.0, Sub-strand 1.1",
              verification: "unverified" as const,
              slos: [
                { description: "discuss the rationale for the revelation of the Qur’an as a guide to mankind", cognitiveLevel: "apply" },
                { description: "describe the stages of revelation of the Qur’an as a sign of mercy to mankind", cognitiveLevel: "apply" },
                { description: "describe the incident of the first revelation of the Qur’an at cave Hira to show the importance of seeking knowledge", cognitiveLevel: "apply" },
                { description: "explain the reasons for the revelation of the Qur’an in portions for ease of its implementation", cognitiveLevel: "apply" },
                { description: "assess the importance of the Qur’an in day-to-day life of a Muslim as a divine guidance for humanity", cognitiveLevel: "apply" },
                { description: "value the Qur’an as a book of guidance to mankind", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Selected Chapters (Surah)",
              order: 2,
              suggestedLessons: 12,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 1.0, Sub-strand 1.2",
              verification: "unverified" as const,
              slos: [
                { description: "read surah Ad-Dhuha (Q.93:1- 11) and surah Al-Balad (Q. 90:1-20) correctly for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "explain the meaning of surah Ad-Dhuha (Q.93:1-11) and surah Al-Balad (Q. 90:1-20) for better understanding", cognitiveLevel: "apply" },
                { description: "discuss the teachings/lessons of surah Ad-Dhuha (Q.93: 1-11) and surah Al-Balad (Q. 90:1-20) for application in daily life", cognitiveLevel: "apply" },
                { description: "apply the teachings of surah Ad- Dhuha (Q.93: 1-11) and surah Al-Balad (Q. 90:1-20) in their daily life to earn rewards from Allah", cognitiveLevel: "apply" },
                { description: "appreciate the teachings of surah Ad-Dhuha (Q.93: 1-11) and surah Al-Balad (Q. 90:1-20) as a guide in daily life", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Hadith",
          order: 2,
          subStrands: [
            {
              name: "Ulumul Hadith",
              order: 1,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 2.0, Sub-strand 2.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the meaning of hadith for better understanding", cognitiveLevel: "apply" },
                { description: "describe the forms of Hadith for better understanding of science of Hadith (Qaul, Fiil, Taqrir, Sifat)", cognitiveLevel: "apply" },
                { description: "state the components of Hadith for better understanding of science of Hadith", cognitiveLevel: "apply" },
                { description: "explain the types of Hadith (Hadith Qudsy and Nabawy) as the second source of Sharia", cognitiveLevel: "apply" },
                { description: "assess the importance of Hadith for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "emulate the life of the Prophet (S.A.W.) to earn Allah’s rewards and enhance the competency of self-efficacy", cognitiveLevel: "apply" },
                { description: "acknowledge Hadith as a primary source of Sharia", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Selected Hadith",
              order: 2,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 2.0, Sub-strand 2.2",
              verification: "unverified" as const,
              slos: [
                { description: "discuss the lessons learnt from the selected Hadith for character building", cognitiveLevel: "apply" },
                { description: "explain the relevance of the selected Hadith in the life of a Muslim", cognitiveLevel: "apply" },
                { description: "practise the teachings from the selected hadith in daily life", cognitiveLevel: "apply" },
                { description: "appreciate Hadith as the second source of Islamic law and spiritual guidance", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Pillars of Iman",
          order: 3,
          subStrands: [
            {
              name: "Significance of Tawheed",
              order: 1,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 3.0, Sub-strand 3.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the significance of Tawheed for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "Apply ways of showing belief in Tawhid", cognitiveLevel: "apply" },
                { description: "appreciate Tawheed as the basis of Islamic faith", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Shirk",
              order: 2,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 3.0, Sub-strand 3.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe different types of shirk to avoid associating Allah with other beings", cognitiveLevel: "apply" },
                { description: "describe different ways through which shirk is manifested to protect one’s Iman", cognitiveLevel: "apply" },
                { description: "explain the effects of shirk to safeguard one’s Iman", cognitiveLevel: "apply" },
                { description: "perform acts that are devoid of shirk in daily life", cognitiveLevel: "apply" },
                { description: "recognise the belief in One God as the foundation of Iman", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Devotional Acts",
          order: 4,
          subStrands: [
            {
              name: "Swalah",
              order: 1,
              suggestedLessons: 10,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 4.0, Sub-strand 4.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe how congregational prayers and sunnah prayers are performed to earn rewards. (Tahajud, Tahiyatul Masjid and Dhuha)", cognitiveLevel: "apply" },
                { description: "describe the performance of prayers on special occasions to earn Allah (S.W.T.)’s blessing (Swalatul Janaza,Musafir,Kusuf and Khusuf)", cognitiveLevel: "apply" },
                { description: "perform congregational prayers, sunnah prayers and prayers on special occasions for spiritual nourishment", cognitiveLevel: "apply" },
                { description: "assess the importance of performing congregational prayers, Sunnah prayers, and prayers on special occasions to earn rewards from Allah", cognitiveLevel: "apply" },
                { description: "appreciate the performance of congregational prayers, sunnah", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Zakat",
              order: 2,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 4.0, Sub-strand 4.2",
              verification: "unverified" as const,
              slos: [
                { description: "describe Zakatul Maal and Zakatul Fitr as an obligation on a Muslim", cognitiveLevel: "apply" },
                { description: "differentiate between Zakatul Maal and Zakatul Fitr as acts of ibadah", cognitiveLevel: "apply" },
                { description: "identify items exempted from Zakat payment", cognitiveLevel: "apply" },
                { description: "explain the importance of Zakatul Maal and Zakatul Fitr to the society", cognitiveLevel: "apply" },
                { description: "appreciate the role of zakat in the development of a Muslim society", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Saum",
              order: 3,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 4.0, Sub-strand 4.3",
              verification: "unverified" as const,
              slos: [
                { description: "describe types of Saum for ease of observance (Fardh,Sunnah,Nadhir,Kafara, Qadha)", cognitiveLevel: "apply" },
                { description: "assess the significance of Saum for spiritual growth", cognitiveLevel: "apply" },
                { description: "observe saum to earn rewards from Allah", cognitiveLevel: "apply" },
                { description: "appreciate the observance of Saum as a way of earning taqwa", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Akhlaq (Moral values)",
          order: 5,
          subStrands: [
            {
              name: "Dimensions of morality in Islam",
              order: 1,
              suggestedLessons: 4,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 5.0, Sub-strand 5.1",
              verification: "unverified" as const,
              slos: [
                { description: "identify sources of morality in Islam as a guide to good behaviour", cognitiveLevel: "apply" },
                { description: "explain the purpose of morality in promoting uprightness in the society", cognitiveLevel: "apply" },
                { description: "practise Islamic moral values in day- to-day life to earn rewards from Allah", cognitiveLevel: "apply" },
                { description: "regard Islamic values as a form of ibadah", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Virtues in Islam",
              order: 2,
              suggestedLessons: 5,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 5.0, Sub-strand 5.2",
              verification: "unverified" as const,
              slos: [
                { description: "explain Islamic teachings on truthfulness and forgiveness for moral growth", cognitiveLevel: "apply" },
                { description: "assess the significance of upholding truthfulness and forgiveness for harmonious co-existence in the society", cognitiveLevel: "apply" },
                { description: "practise truthfulness and forgiveness in day-to-day life to earn rewards from Allah (S.W.T.)", cognitiveLevel: "apply" },
                { description: "appreciate Islamic virtues for a morally upright society", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Prohibitions in Islam Drug abuse",
              order: 3,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 5.0, Sub-strand 5.3",
              verification: "unverified" as const,
              slos: [
                { description: "describe the effects of drug abuse for healthy living", cognitiveLevel: "apply" },
                { description: "examine the rationale behind prohibition of drugs as a way of fostering positive character formation", cognitiveLevel: "apply" },
                { description: "explain remedies for drug abuse for a healthy and morally upright society", cognitiveLevel: "apply" },
                { description: "abstain from abusing drugs to earn Allah’s pleasure", cognitiveLevel: "apply" },
                { description: "acknowledge the rationale for prohibition of drugs for the growth and development of the nation", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Muamalat (Social Relationship)",
          order: 6,
          subStrands: [
            {
              name: "Marriage",
              order: 1,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 6.0, Sub-strand 6.1",
              verification: "unverified" as const,
              slos: [
                { description: "explain the purpose of marriage as a means of fulfilling one’s faith", cognitiveLevel: "apply" },
                { description: "state the conditions for a valid marriage in Islam", cognitiveLevel: "apply" },
                { description: "describe the rights and responsibilities in marriage for observance of Allah (S.W.T.)’s commandments", cognitiveLevel: "apply" },
                { description: "regard marriage as a way of validating the establishment of a family", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Trade and Finance in Islam",
              order: 2,
              suggestedLessons: 8,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 6.0, Sub-strand 6.2",
              verification: "unverified" as const,
              slos: [
                { description: "identify the halal and haram sources of earning for legitimate livelihood", cognitiveLevel: "apply" },
                { description: "describe the legitimate ways of spending income to earn Allah (S.W.T.)’s Pleasure", cognitiveLevel: "apply" },
                { description: "analyse the effects of spending income in haram ways in the life of a Muslim", cognitiveLevel: "apply" },
                { description: "explain the importance of lawful earnings as an act of ibadah", cognitiveLevel: "apply" },
                { description: "apply the knowledge of halal way of earning in daily life", cognitiveLevel: "apply" },
                { description: "discuss the benefits of spending income in legitimate ways so as to earn rewards from Allah (S.W.T.)", cognitiveLevel: "apply" },
                { description: "appreciate halal sources of earning and spending as a fulfilment of Allah (S.W.T.)’s command", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Contemporary issues",
              order: 3,
              suggestedLessons: 6,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 6.0, Sub-strand 6.3",
              verification: "unverified" as const,
              slos: [
                { description: "identify the rights of women in Islam for gender parity", cognitiveLevel: "apply" },
                { description: "describe the modes of transmission of HIV and AIDS and COVID-19 to avoid transmission", cognitiveLevel: "apply" },
                { description: "explain the possible remedies for the spread of HIV and AIDS and COVID-19 for healthy living", cognitiveLevel: "apply" },
                { description: "honour the rights of women as a fulfilment of the teachings of the Prophet (S.A.W.)", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Islamic Heritage and Civilisation",
          order: 7,
          subStrands: [
            {
              name: "Reforms introduced By Prophet Muhammad (S.A.W.)",
              order: 1,
              suggestedLessons: 16,
              sourceRef: "KICD G7 Islamic Religious Education, Strand 7.0, Sub-strand 7.1",
              verification: "unverified" as const,
              slos: [
                { description: "describe the socio-religious, political and economic reforms introduced by Prophet Muhammad (S.A.W.) as an agent of change", cognitiveLevel: "apply" },
                { description: "assess the importance of the socio-religious, political and economic reforms introduced by Prophet Muhammad (S.A.W.) to the world civilisation", cognitiveLevel: "apply" },
                { description: "apply lessons learnt from the reforms introduced by Prophet Muhammad (S.A.W.)", cognitiveLevel: "apply" },
                { description: "treasure the reforms introduced by Prophet Muhammad (S.A.W.) for a morally upright society", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
