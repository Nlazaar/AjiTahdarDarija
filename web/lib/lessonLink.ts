export function getLessonHref(lesson: any) {
  if (!lesson) return '#';
  if (lesson.locked) return '#';
  // Go directly to lesson by id — avoids the /lecons/[slug] redirect chain
  return `/lesson/${lesson.id}`;
}

export default getLessonHref;
