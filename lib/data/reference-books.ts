/**
 * KICD-approved textbook publishers and common reference books
 * Based on KICD approved lists (updated 2026)
 * Sources: https://kicd.ac.ke/books/ and https://educationnews.co.ke/kicd-releases-a-full-list-of-approved-textbooks-for-schools/
 */

// Major KICD-approved publishers
export const PUBLISHERS = [
  "KLB (Kenya Literature Bureau)",
  "Longhorn Publishers",
  "Oxford University Press East Africa",
  "Mentor Publishers",
  "Moran Publishers",
  "Spotlight Publishers",
  "Jomo Kenyatta Foundation",
  "East African Educational Publishers",
  "Mountain Top Publishers",
  "Queenex Publishers",
] as const;

/**
 * Generate reference book options based on grade and learning area
 * Returns common KICD-approved textbook titles
 */
export function getReferenceBookOptions(
  grade: string,
  learningArea: string
): string[] {
  const gradeNum = grade.toLowerCase();
  const subject = learningArea.toLowerCase();

  const books: string[] = [];

  // Common patterns for all subjects
  const commonPublishers = [
    "KLB",
    "Longhorn",
    "Oxford",
    "Mentor",
    "Moran",
    "Spotlight",
  ];

  // Generate subject-specific book titles
  commonPublishers.forEach((publisher) => {
    books.push(`${publisher} ${learningArea} ${grade}`);
  });

  // Subject-specific popular titles (based on KICD approved lists)
  if (subject.includes("math")) {
    books.push(
      `Choice Mathematics ${grade}`,
      `Top Scholar Mathematics ${grade}`,
      `Active Mathematics ${grade}`,
      `Master Mathematics ${grade}`,
      `Let's Do Mathematics ${grade}`
    );
  } else if (subject.includes("english")) {
    books.push(
      `New Progressive English ${grade}`,
      `Excel English ${grade}`,
      `Fountain English ${grade}`
    );
  } else if (subject.includes("kiswahili")) {
    books.push(
      `Kiswahili Bora ${grade}`,
      `Kiswahili Fasaha ${grade}`,
      `Elimu ya Kiswahili ${grade}`
    );
  } else if (
    subject.includes("science") ||
    subject.includes("integrated science")
  ) {
    books.push(
      `New Planet Science ${grade}`,
      `Spotlight Science ${grade}`,
      `Top Science ${grade}`,
      `Science Explorer ${grade}`
    );
  } else if (
    subject.includes("social") ||
    subject.includes("studies") ||
    subject.includes("cre") ||
    subject.includes("ire")
  ) {
    books.push(
      `Spotlight Social Studies ${grade}`,
      `New Era Social Studies ${grade}`,
      `Social Studies Companion ${grade}`
    );
  } else if (subject.includes("business")) {
    books.push(
      `Business Studies Made Simple ${grade}`,
      `Mentor Business Studies ${grade}`
    );
  } else if (subject.includes("agriculture")) {
    books.push(`Practical Agriculture ${grade}`, `Agriculture for Schools ${grade}`);
  } else if (subject.includes("computer") || subject.includes("ict")) {
    books.push(`ICT Excellence ${grade}`, `Computer Studies Focus ${grade}`);
  } else if (subject.includes("home")) {
    books.push(
      `Home Science Dynamics ${grade}`,
      `Practical Home Science ${grade}`
    );
  }

  // Add a custom option at the end
  books.push("Other (specify below)");

  // Remove duplicates and return
  return Array.from(new Set(books));
}
