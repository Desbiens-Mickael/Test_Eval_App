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
  imageBanner?: string | null;
  slug: string;
  subject: string;
  subjectColor: string;
  gradeLevel: string;
  gradeLevelColor: string;
};

export type LessonForStudent = {
  id: string;
  title: string;
  imageBanner: string | null;
  slug: string;
  content: JSONContent;
  LessonSubject: {
    id: string;
    label: string;
    color: string;
  };
  GradeLevels: {
    id: string;
    label: string;
    color: string;
  };
};

export type ShowLessonType = {
  imageBanner?: string | null;
  title: string;
  subject?: string;
  subjectColor?: string;
  gradeLevel?: string;
  gradeLevelColor?: string;
  content: JSONContent | undefined;
};
