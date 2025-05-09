import { JSONContent } from "novel";

export type CreateLessonType = {
  title: string;
  content: JSONContent;
  authorId: string;
  slug: string;
  LessonSubjectID: string;
  GradeLevelsID: string;
};

export type Lesson = {
  id: string;
  title: string;
  imageBanner: string;
  slug: string;
  subject: string;
  subjectColor: string;
  gradeLevel: string;
  gradeLevelColor: string;
};
