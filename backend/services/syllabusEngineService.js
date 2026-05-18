import { EXAM_DATABASE, normalizeExamName } from '../constants/examSyllabus.js';

export const getExamSyllabus = (examName) => {
  const key = normalizeExamName(examName);
  return { key, ...EXAM_DATABASE[key] };
};

export const flattenSyllabus = (syllabus) =>
  syllabus.subjects.flatMap((subject) =>
    subject.chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({
        subject: subject.name,
        chapter: chapter.name,
        topic,
        subtopic: `${topic} Concepts and Practice`
      }))
    )
  );

export const priorityWeight = (subject, weakSubjects = [], priorities = []) => {
  const weakBoost = weakSubjects.includes(subject) ? 2 : 0;
  const priorityIndex = priorities.indexOf(subject);
  const orderBoost = priorityIndex >= 0 ? Math.max(0, priorities.length - priorityIndex) / priorities.length : 0;
  return 1 + weakBoost + orderBoost;
};
