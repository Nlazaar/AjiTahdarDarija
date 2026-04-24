import RevisionPlayer from './RevisionPlayer';

export default async function RevisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RevisionPlayer id={id} />;
}
