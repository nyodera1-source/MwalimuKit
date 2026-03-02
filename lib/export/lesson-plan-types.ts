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
