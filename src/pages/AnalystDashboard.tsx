import AnalystQueue from '../features/minerals/components/AnalystQueue';

export default function AnalystDashboard() {
  return (
    <div className="min-h-screen p-8 md:p-12 max-w-5xl mx-auto w-full">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          Analyst Review Queue
        </h1>
        <p className="text-white/60 max-w-2xl text-lg">
          Review AI-generated market alerts before they are published to the main dashboard. 
          The pipeline drafts these alerts daily from industry RSS feeds.
        </p>
      </header>

      <section>
        <AnalystQueue />
      </section>
    </div>
  );
}
