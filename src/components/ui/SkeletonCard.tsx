export function SkeletonCard({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`card ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-lg overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-4 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
