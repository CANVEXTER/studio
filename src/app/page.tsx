import { BookOpenCheck } from 'lucide-react';
import StudyPlannerClient from '@/components/study-planner-client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="bg-primary/10 p-3 rounded-full mb-4 border border-primary/20">
            <BookOpenCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground/90">
            StudyPlanAI
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Answer a few questions and let our AI craft the perfect, personalized study schedule for you.
          </p>
        </header>
        <StudyPlannerClient />
      </div>
      <footer className="w-full max-w-4xl mx-auto mt-16 text-center text-sm text-muted-foreground no-print">
        <p>Built with Next.js and Firebase Genkit. Styled with ShadCN/UI and Tailwind CSS.</p>
      </footer>
    </main>
  );
}
