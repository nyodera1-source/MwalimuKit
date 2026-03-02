export interface SchemeBreak {
  title: string;
  weekNumber: number;
  duration: number; // in weeks
}

export interface SchemeLessonEntry {
  week: number;
  lesson: string; // e.g. "1-2", "3", "4-5"
  topic: string;
  subTopic: string;
  objectives: string;
  tlActivities: string;
  tlAids: string;
  reference: string;
  remarks: string;
}

export interface SchemeConfig {
  schoolName: string;
  referenceBook: string;
  lessonsPerWeek: number;
  firstWeek: number;
  firstLesson: number;
  lastWeek: number;
  lastLesson: number;
  selectedSubStrandIds: string[];
  breaks: SchemeBreak[];
  entries: SchemeLessonEntry[];
  // Previous term spillover
  carryoverEnabled?: boolean;
  carryoverTopic?: string;
  carryoverSubTopic?: string;
  carryoverObjectives?: string;
  carryoverLessons?: number;
}

export interface SchemeOfWorkExportData {
  title: string;
  teacherName: string;
  schoolName: string;
  grade: string;
  learningArea: string;
  referenceBook: string;
  term: number;
  year: number;
  lessonsPerWeek: number;
  entries: SchemeLessonEntry[];
  breaks: SchemeBreak[];
}
