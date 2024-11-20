export type CreateLessonType = {
  name: string;
  content: string;
  authorId: string;
  LessonSubjectID: string;
  GradeLevelsID: string;
};

export type Lesson = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  gradeLevel: string;
  gradeLevelColor: string;
};
