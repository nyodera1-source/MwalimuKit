export type FormType =
  | "adjudication"
  | "rehearsal_plan"
  | "performance_program"
  | "portfolio_assessment";

export type ArtDiscipline =
  | "choir"
  | "dance"
  | "drama"
  | "visual_art"
  | "instrumental"
  | "ensemble"
  | "mixed";

// ─── Adjudication Form ───

export interface JudgingCriterion {
  criterion: string;
  description: string;
  maxScore: number;
  ratingScale: string;
}

export interface CommentSection {
  label: string;
  purpose: string;
}

export interface AdjudicationFormData {
  category: string;
  eventContext: string;
  judgingCriteria: JudgingCriterion[];
  commentSections: CommentSection[];
  totalPossibleScore: number;
}

// ─── Rehearsal Plan ───

export interface WarmUpActivity {
  activity: string;
  duration: number;
}

export interface RepertoireItem {
  title: string;
  composer?: string;
  focus: string;
}

export interface SectionFocus {
  section: string;
  goals: string[];
  exercises: string[];
}

export interface RehearsalPlanFormData {
  ensembleType: string;
  duration: number;
  rehearsalObjectives: string[];
  warmUpActivities: WarmUpActivity[];
  repertoire: RepertoireItem[];
  sectionFocus: SectionFocus[];
  coolDown: string;
  notesForNextSession: string;
}

// ─── Performance Program ───

export interface ProgramItem {
  order: number;
  title: string;
  performerOrGroup: string;
  composer?: string;
  genre?: string;
  duration: number;
}

export interface Intermission {
  afterItemNumber: number;
  duration: number;
}

export interface PerformanceProgramFormData {
  eventName: string;
  venue: string;
  eventDate: string;
  eventTime: string;
  programItems: ProgramItem[];
  intermissions: Intermission[];
  acknowledgments: string;
  specialNotes: string;
}

// ─── Portfolio Assessment ───

export interface PortfolioComponent {
  component: string;
  description: string;
}

export interface RubricLevel {
  level: string;
  description: string;
  pointValue: number;
}

export interface AssessmentCriterion {
  criterion: string;
  rubricLevels: RubricLevel[];
}

export interface PortfolioAssessmentFormData {
  portfolioType: string;
  requiredComponents: PortfolioComponent[];
  assessmentCriteria: AssessmentCriterion[];
  growthIndicators: string[];
  reflectionPrompts: string[];
  totalPoints: number;
}

export type CreativeArtsFormData =
  | AdjudicationFormData
  | RehearsalPlanFormData
  | PerformanceProgramFormData
  | PortfolioAssessmentFormData;
