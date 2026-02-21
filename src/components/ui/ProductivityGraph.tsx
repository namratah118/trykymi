export function ProductivityGraph() {
  const points = '0,120 30,100 60,110 90,80 120,90 150,60 180,70 210,50 240,40 270,30 300,20 330,10 360,0';
  const pathD = `M ${points}`;

  return (
    <div className="w-full h-48 bg-transparent">
      <svg
        viewBox="0 0 400 150"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
          </linearGradient>
        </defs>

        <path
          d={pathD}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2"
          fill="none"
          className="svg-line-animate"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`M ${points} L 360,150 L 0,150 Z`}
          fill="url(#graphGradient)"
          className="opacity-40"
        />

        <circle cx="300" cy="20" r="3" fill="rgba(76, 175, 80, 0.6)" className="svg-line-pulse" />
      </svg>
    </div>
  );
}
