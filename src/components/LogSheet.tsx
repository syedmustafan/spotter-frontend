import type { LogSheet as LogSheetType, DutySegment } from '../types';

interface LogSheetProps {
  logSheet: LogSheetType;
}

// Constants for the SVG grid
const GRID = {
  marginLeft: 60,
  marginRight: 50,
  marginTop: 40,
  marginBottom: 30,
  rowHeight: 40,
  hourWidth: 32,
  totalHours: 24,
  rows: ['OFF DUTY', 'SLEEPER', 'DRIVING', 'ON DUTY'],
};

const STATUS_COLORS: Record<string, string> = {
  off_duty: '#22c55e',
  sleeper: '#fbbf24',
  driving: '#2dd4bf',
  on_duty: '#f87171',
};

const STATUS_ROW_INDEX: Record<string, number> = {
  off_duty: 0,
  sleeper: 1,
  driving: 2,
  on_duty: 3,
};

export function LogSheet({ logSheet }: LogSheetProps) {
  const gridWidth = GRID.hourWidth * GRID.totalHours;
  const gridHeight = GRID.rowHeight * GRID.rows.length;
  const totalWidth = GRID.marginLeft + gridWidth + GRID.marginRight;
  const totalHeight = GRID.marginTop + gridHeight + GRID.marginBottom;

  // Generate segment colors for gradient effect
  const getSegmentPaths = (segments: DutySegment[]): Array<{ path: string; color: string }> => {
    const paths: Array<{ path: string; color: string }> = [];
    
    segments.forEach((segment, index) => {
      const rowIndex = STATUS_ROW_INDEX[segment.status] ?? 0;
      const y = GRID.marginTop + rowIndex * GRID.rowHeight + GRID.rowHeight / 2;
      const startX = GRID.marginLeft + segment.start_hour * GRID.hourWidth;
      const endX = GRID.marginLeft + segment.end_hour * GRID.hourWidth;
      const color = STATUS_COLORS[segment.status] || '#64748b';

      if (index > 0) {
        // Add vertical transition line
        const prevSegment = segments[index - 1];
        const prevRowIndex = STATUS_ROW_INDEX[prevSegment.status] ?? 0;
        const prevY = GRID.marginTop + prevRowIndex * GRID.rowHeight + GRID.rowHeight / 2;
        
        if (Math.abs(prevY - y) > 1) {
          paths.push({
            path: `M ${startX} ${prevY} L ${startX} ${y}`,
            color: color,
          });
        }
      }

      // Horizontal segment
      const path = `M ${startX} ${y} L ${endX} ${y}`;
      paths.push({ path, color });
    });

    return paths;
  };

  const segmentPaths = getSegmentPaths(logSheet.segments);

  return (
    <div className="bg-spotter-bg-dark border border-spotter-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-spotter-teal/20 to-spotter-bg-card border-b border-spotter-border px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              DRIVER'S DAILY LOG
            </h3>
            <p className="text-xs text-spotter-text-muted">
              U.S. DEPARTMENT OF TRANSPORTATION — ONE CALENDAR DAY (24 HOURS)
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-mono text-spotter-text-secondary">Day {logSheet.day_number}</p>
            <p className="text-lg font-mono font-bold text-spotter-teal">{logSheet.date}</p>
          </div>
        </div>
      </div>

      {/* Log Info Bar */}
      <div className="flex flex-wrap gap-6 px-6 py-3 bg-spotter-bg-card/30 border-b border-spotter-border text-sm">
        <div>
          <span className="text-spotter-text-muted">Total Miles:</span>
          <span className="ml-2 font-mono font-semibold text-white">
            {logSheet.total_miles.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-spotter-text-muted">Truck:</span>
          <span className="ml-2 font-mono text-spotter-text-secondary">4521</span>
        </div>
        <div>
          <span className="text-spotter-text-muted">Carrier:</span>
          <span className="ml-2 text-spotter-text-secondary">Spotter Logistics</span>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="w-full min-w-[800px]"
          style={{ height: totalHeight }}
        >
          {/* Background */}
          <rect
            x={GRID.marginLeft}
            y={GRID.marginTop}
            width={gridWidth}
            height={gridHeight}
            fill="#152428"
            rx={4}
          />

          {/* Row labels */}
          {GRID.rows.map((label, i) => (
            <text
              key={label}
              x={GRID.marginLeft - 8}
              y={GRID.marginTop + i * GRID.rowHeight + GRID.rowHeight / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-[10px] font-mono"
              fill="#94a3b8"
            >
              {label}
            </text>
          ))}

          {/* Hour grid lines */}
          {Array.from({ length: GRID.totalHours + 1 }).map((_, i) => (
            <g key={i}>
              <line
                x1={GRID.marginLeft + i * GRID.hourWidth}
                y1={GRID.marginTop}
                x2={GRID.marginLeft + i * GRID.hourWidth}
                y2={GRID.marginTop + gridHeight}
                stroke={i % 6 === 0 ? '#3d5a64' : '#2d4a54'}
                strokeWidth={i % 6 === 0 ? 1 : 0.5}
              />
              {/* Hour labels */}
              {i < GRID.totalHours && (
                <text
                  x={GRID.marginLeft + i * GRID.hourWidth + GRID.hourWidth / 2}
                  y={GRID.marginTop + gridHeight + 16}
                  textAnchor="middle"
                  className="text-[9px] font-mono"
                  fill="#64748b"
                >
                  {i === 0 ? 'M' : i}
                </text>
              )}
            </g>
          ))}

          {/* Horizontal row separator lines */}
          {Array.from({ length: GRID.rows.length + 1 }).map((_, i) => (
            <line
              key={i}
              x1={GRID.marginLeft}
              y1={GRID.marginTop + i * GRID.rowHeight}
              x2={GRID.marginLeft + gridWidth}
              y2={GRID.marginTop + i * GRID.rowHeight}
              stroke="#3d5a64"
              strokeWidth={1}
            />
          ))}

          {/* 15-minute grid lines (subtle) */}
          {Array.from({ length: GRID.totalHours * 4 }).map((_, i) => {
            if (i % 4 === 0) return null;
            return (
              <line
                key={`quarter-${i}`}
                x1={GRID.marginLeft + (i * GRID.hourWidth) / 4}
                y1={GRID.marginTop}
                x2={GRID.marginLeft + (i * GRID.hourWidth) / 4}
                y2={GRID.marginTop + gridHeight}
                stroke="#2d4a54"
                strokeWidth={0.25}
                strokeDasharray="2,4"
              />
            );
          })}

          {/* Duty status segments with colors */}
          {segmentPaths.map((segment, i) => (
            <path
              key={i}
              d={segment.path}
              stroke={segment.color}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Totals column */}
          {GRID.rows.map((label, i) => {
            const statusKey = label.toLowerCase().replace(' ', '_') as keyof typeof logSheet.totals;
            const total = logSheet.totals[statusKey] ?? 0;
            return (
              <text
                key={`total-${i}`}
                x={GRID.marginLeft + gridWidth + 25}
                y={GRID.marginTop + i * GRID.rowHeight + GRID.rowHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-mono font-bold"
                fill="#ffffff"
              >
                {total.toFixed(1)}
              </text>
            );
          })}

          {/* Total label */}
          <text
            x={GRID.marginLeft + gridWidth + 25}
            y={GRID.marginTop - 12}
            textAnchor="middle"
            className="text-[9px] font-mono"
            fill="#64748b"
          >
            HOURS
          </text>

          {/* Grand total */}
          <text
            x={GRID.marginLeft + gridWidth + 25}
            y={GRID.marginTop + gridHeight + 16}
            textAnchor="middle"
            className="text-[11px] font-mono font-bold"
            fill="#2dd4bf"
          >
            = 24
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-spotter-bg-card/30 border-t border-spotter-border">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-spotter-text-secondary">Off Duty</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded" style={{ backgroundColor: '#fbbf24' }} />
            <span className="text-spotter-text-secondary">Sleeper Berth</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded" style={{ backgroundColor: '#2dd4bf' }} />
            <span className="text-spotter-text-secondary">Driving</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded" style={{ backgroundColor: '#f87171' }} />
            <span className="text-spotter-text-secondary">On Duty (Not Driving)</span>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      {logSheet.remarks.length > 0 && (
        <div className="px-6 py-4 border-t border-spotter-border">
          <h4 className="text-xs font-semibold text-spotter-text-muted uppercase tracking-wider mb-3">
            Remarks
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {logSheet.remarks.map((remark, i) => (
              <div key={i} className="flex items-center gap-2 text-spotter-text-secondary">
                <span className="font-mono text-spotter-text-muted">{remark.time}</span>
                <span className="text-spotter-border-light">—</span>
                <span>{remark.location}</span>
                <span className="text-spotter-text-muted">({remark.activity})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
