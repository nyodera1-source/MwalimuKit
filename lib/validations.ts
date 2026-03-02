import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  county: z.string().min(1, "Please select your county"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  tscNumber: z.string().optional(),
  county: z.string().optional(),
  primaryGradeId: z.string().optional(),
  primaryAreas: z.array(z.string()).optional(),
});

export const lessonPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gradeId: z.string().min(1, "Grade is required"),
  learningAreaId: z.string().min(1, "Learning area is required"),
  strandId: z.string().min(1, "Strand is required"),
  subStrandId: z.string().min(1, "Sub-strand is required"),
  sloIds: z.array(z.string()).min(1, "Select at least one SLO"),
  competencyIds: z.array(z.string()).default([]),
  date: z.string().min(1, "Date is required"),
  duration: z.coerce.number().min(1, "Duration is required"),
  objectives: z.string().default(""),
  keyInquiryQuestion: z.string().default(""),
  resources: z.string().default(""),
  digitalResources: z.string().default(""),
  activitiesIntroduction: z.string().default(""),
  activitiesDevelopment: z.string().default(""),
  activitiesConclusion: z.string().default(""),
  assessmentStrategy: z.string().default(""),
  assessmentDescription: z.string().default(""),
  reflection: z.string().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  isTemplate: z.coerce.boolean().default(false),
});

export const schemeOfWorkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gradeId: z.string().min(1, "Grade is required"),
  learningAreaId: z.string().min(1, "Learning area is required"),
  term: z.coerce.number().min(1).max(3),
  year: z.coerce.number().min(2020).max(2050),
  schemeData: z.string(), // JSON string of full scheme config + entries
  status: z.enum(["draft", "published"]).default("draft"),
});

export const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gradeId: z.string().min(1, "Grade is required"),
  learningAreaId: z.string().min(1, "Learning area is required"),
  examType: z.string().min(1, "Exam type is required"),
  assessmentType: z.string().default("end_term"),
  term: z.coerce.number().min(1).max(3),
  year: z.coerce.number().min(2020).max(2050),
  totalMarks: z.coerce.number().optional(),
  timeMinutes: z.coerce.number().optional(),
  instructions: z.string().default(""),
  strandIds: z.string().default("[]"),
  subStrandIds: z.string().default("[]"),
  sloIds: z.string().default("[]"),
  competencyIds: z.string().default("[]"),
  questions: z.string(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const teachingNotesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gradeId: z.string().min(1, "Grade is required"),
  learningAreaId: z.string().min(1, "Learning area is required"),
  strandId: z.string().min(1, "Strand is required"),
  subStrandId: z.string().min(1, "Sub-strand is required"),
  noteType: z.enum(["lecture", "discussion", "revision"]),
  content: z.string().default("{}"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type LessonPlanInput = z.infer<typeof lessonPlanSchema>;
export type SchemeOfWorkInput = z.infer<typeof schemeOfWorkSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type TeachingNotesInput = z.infer<typeof teachingNotesSchema>;
