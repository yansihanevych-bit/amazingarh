import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang } from '@/content/i18n';
import TavernGame from '@/components/tavern/TavernGame';

export const metadata: Metadata = { title: 'Tavern Builder', description: 'A tiny game about stacking a house, one block at a time.' };

export default async function TavernPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <main className="tavp" aria-label="Tavern Builder">
      <TavernGame lang={lang} />
    </main>
  );
}
