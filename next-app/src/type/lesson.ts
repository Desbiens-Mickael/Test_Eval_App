export type CreateLessonType = {
  title: string;
  content: string;
  authorId: string;
  LessonSubjectID: string;
  GradeLevelsID: string;
};

export type Lesson = {
  id: string;
  title: string;
  slug: string;
  subject: string;
  subjectColor: string;
  gradeLevel: string;
  gradeLevelColor: string;
};