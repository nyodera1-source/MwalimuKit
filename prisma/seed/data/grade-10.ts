/**
 * Grade 10 catalogue assembled only from reviewed KICD curriculum designs.
 * Add learning areas here after their source transcription passes audit.
 */

import { grade10BiologyData } from "./grade-10-biology";
import { grade10BusinessStudiesData } from "./grade-10-business-studies";
import { grade10AppliedAgricultureData } from "./grade-10-applied-agriculture";
import { grade10AviationTechnologyData } from "./grade-10-aviation-technology";
import { grade10BuildingConstructionData } from "./grade-10-building-construction";
import { grade10ArabicData } from "./grade-10-arabic";
import { grade10KiswahiliData } from "./grade-10-kiswahili";
import { grade10GermanData } from "./grade-10-german";
import { grade10MandarinChineseData } from "./grade-10-mandarin-chinese";
import { grade10MetalTechnologyData } from "./grade-10-metal-technology";
import { grade10MusicAndDanceData } from "./grade-10-music-and-dance";
import { grade10TheatreAndFilmData } from "./grade-10-theatre-and-film";
import { grade10FasihiYaKiswahiliData } from "./grade-10-fasihi-ya-kiswahili";
import { grade10LiteratureInEnglishData } from "./grade-10-literature-in-english";
import { grade10WoodTechnologyData } from "./grade-10-wood-technology";
import { grade10ChemistryData } from "./grade-10-chemistry";
import { grade10ComputerScienceData } from "./grade-10-computer-science";
import { grade10InformationAndCommunicationTechnologyData } from "./grade-10-information-and-communication-technology";
import { grade10EnglishData } from "./grade-10-english";
import { grade10HistoryAndCitizenshipData } from "./grade-10-history-and-citizenship";
import { grade10HomeScienceData } from "./grade-10-home-science";
import { grade10IslamicReligiousEducationData } from "./grade-10-islamic-religious-education";
import { grade10HinduReligiousEducationData } from "./grade-10-hindu-religious-education";
import { grade10GeographyData } from "./grade-10-geography";
import { grade10GeneralScienceData } from "./grade-10-general-science";
import { grade10MathematicsData } from "./grade-10-mathematics";
import { grade10PhysicsData } from "./grade-10-physics";
import { grade10SportsAndRecreationData } from "./grade-10-sports-and-recreation";
import type { GradeData } from "./index";

export const grade10Data: GradeData = {
  level: 10,
  name: "Grade 10",
  learningAreas: [
    ...grade10ComputerScienceData.learningAreas,
    ...grade10InformationAndCommunicationTechnologyData.learningAreas,
    ...grade10SportsAndRecreationData.learningAreas,
    ...grade10MathematicsData.learningAreas,
    ...grade10HistoryAndCitizenshipData.learningAreas,
    ...grade10HomeScienceData.learningAreas,
    ...grade10IslamicReligiousEducationData.learningAreas,
    ...grade10HinduReligiousEducationData.learningAreas,
    ...grade10GeographyData.learningAreas,
    ...grade10GeneralScienceData.learningAreas,
    ...grade10BiologyData.learningAreas,
    ...grade10BusinessStudiesData.learningAreas,
    ...grade10ChemistryData.learningAreas,
    ...grade10PhysicsData.learningAreas,
    ...grade10EnglishData.learningAreas,
    ...grade10AppliedAgricultureData.learningAreas,
    ...grade10AviationTechnologyData.learningAreas,
    ...grade10BuildingConstructionData.learningAreas,
    ...grade10ArabicData.learningAreas,
    ...grade10KiswahiliData.learningAreas,
    ...grade10GermanData.learningAreas,
    ...grade10MandarinChineseData.learningAreas,
    ...grade10MetalTechnologyData.learningAreas,
    ...grade10MusicAndDanceData.learningAreas,
    ...grade10TheatreAndFilmData.learningAreas,
    ...grade10FasihiYaKiswahiliData.learningAreas,
    ...grade10LiteratureInEnglishData.learningAreas,
    ...grade10WoodTechnologyData.learningAreas,
  ],
};
