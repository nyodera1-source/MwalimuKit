export interface LessonPlanExportData {
  title: string;
  teacherName: string;
  schoolName?: string;
  grade: string;
  learningArea: string;
  strand: string;
  subStrand: string;
  slos: string[];
  competencies: string[];
  date: string;
  duration: number;
  classGroup?: string;
  time?: string;
  lessonFocus?: string;
  lessonNumber?: number;
  lessonCount?: number;
  priorKnowledge?: string;
  vocabulary?: string;
  teacherPreparation?: string;
  valuesAndPcis?: string;
  safetyNotes?: string;
  differentiation?: string;
  homework?: string;
  objectives: string;
  keyInquiryQuestion: string;
  resources: string;
  digitalResources: string;
  activities: {
    introduction?: string;
    development?: string;
    conclusion?: string;
  };
  assessmentStrategy: string;
  assessmentDescription: string;
  reflection: string;
}
