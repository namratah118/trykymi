import { useState } from 'react';

interface HeatmapCell {
  id: string;
  score: number;
  day: string;
}

export function ProductivityHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const generateHeatmapData = (): HeatmapCell[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const cells: HeatmapCell[] = [];
    let id = 0;

    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        cells.push({
          id: `cell-${id++}`,
          score: Math.floor(Math.random() * 100),
          day: `W${week + 1} ${days[day]}`,
        });
      }
    }

    return cells;
  };

  const cells = generateHeatmapData();

  const getIntensityClass = (score: number) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return (
    <div className="productivity-heatmap">
      {cells.map(cell => (
        <div
          key={cell.id}
          className={`heatmap-cell ${getIntensityClass(cell.score)}`}
          onMouseEnter={() => setHoveredCell(cell.id)}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <div className="heatmap-tooltip">
            Productivity: {cell.score}%
          </div>
        </div>
      ))}
    </div>
  );
}
