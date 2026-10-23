import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" || /^(?:(?:\+?254)|0)?[17]\d{8}$/.test(value.replace(/[\s-]/g, "")),
        "Please enter a valid Kenyan phone number"
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please retype your password"),
    schoolName: z.string().trim().max(160, "School name is too long"),
    referralCode: z.string().trim().max(50, "Referral code is too long"),
    acceptedTerms: z
      .string()
      .refine((value) => value === "on", "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  gradeId: z.string().min(1).max(100),
  learningAreaId: z.string().min(1).max(100),
  strandId: z.string().min(1).max(100),
  subStrandId: z.string().min(1).max(100),
  sloIds: z.array(z.string().max(100)).min(1, "Select at least one SLO").max(100),
  competencyIds: z.array(z.string().max(100)).max(30).default([]),
  date: z.string().min(1, "Date is required").max(30),
  duration: z.coerce.number().min(1, "Duration is required").max(480),
  schoolName: z.string().max(160).default(""),
  classGroup: z.string().max(100).default(""),
  time: z.string().max(80).default(""),
  lessonFocus: z.string().max(300).default(""),
  lessonNumber: z.coerce.number().min(1).max(500).default(1),
  lessonCount: z.coerce.number().min(1).max(500).default(1),
  priorKnowledge: z.string().max(20_000).default(""),
  vocabulary: z.string().max(5_000).default(""),
  teacherPreparation: z.string().max(20_000).default(""),
  valuesAndPcis: z.string().max(10_000).default(""),
  safetyNotes: z.string().max(10_000).default(""),
  differentiation: z.string().max(20_000).default(""),
  homework: z.string().max(10_000).default(""),
  objectives: z.string().max(30_000).default(""),
  keyInquiryQuestion: z.string().max(2_000).default(""),
  resources: z.string().max(10_000).default(""),
  digitalResources: z.string().max(10_000).default(""),
  activitiesIntroduction: z.string().max(20_000).default(""),
  activitiesDevelopment: z.string().max(40_000).default(""),
  activitiesConclusion: z.string().max(20_000).default(""),
  assessmentStrategy: z.string().max(200).default(""),
  assessmentDescription: z.string().max(30_000).default(""),
  reflection: z.string().max(20_000).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  isTemplate: z.coerce.boolean().default(false),
});

export const schemeOfWorkSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  gradeId: z.string().min(1).max(100),
  learningAreaId: z.string().min(1).max(100),
  term: z.coerce.number().min(1).max(3),
  year: z.coerce.number().min(2020).max(2050),
  schemeData: z.string().max(2_000_000, "Scheme data is too large"), // JSON string of full scheme config + entries
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

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gradeId: z.string().min(1, "Grade is required"),
  learningAreaId: z.string().min(1, "Learning area is required"),
  assignmentType: z.enum(["weekly", "mid_term", "end_term"]),
  term: z.coerce.number().min(1).max(3),
  year: z.coerce.number().min(2020).max(2050),
  weekNumber: z.coerce.number().min(1).max(14).optional().or(z.literal("")),
  totalMarks: z.coerce.number().min(1).optional(),
  timeMinutes: z.coerce.number().min(1).optional(),
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
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type TeachingNotesInput = z.infer<typeof teachingNotesSchema>;
