import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

async function getLessonBySlug(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/lessons/slug/${slug}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function LessonBySlugPage({ params }: { params: { slug: string } }) {
  const lesson = await getLessonBySlug(params.slug);
  if (!lesson?.id) return notFound();
  // Route vers le vrai player de leçon
  redirect(`/lesson/${lesson.id}`);
}
