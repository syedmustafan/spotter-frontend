import { 
  Circle, 
  Package, 
  Flag, 
  Fuel, 
  Coffee, 
  BedDouble, 
  Truck,
  ClipboardCheck 
} from 'lucide-react';
import type { Stop } from '../types';

interface StopsListProps {
  stops: Stop[];
}

const stopIcons: Record<string, { icon: typeof Circle; color: string; bg: string }> = {
  start: { icon: Circle, color: 'text-green-400', bg: 'bg-green-500/20' },
  pickup: { icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  dropoff: { icon: Flag, color: 'text-red-400', bg: 'bg-red-500/20' },
  fuel: { icon: Fuel, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  break: { icon: Coffee, color: 'text-green-400', bg: 'bg-green-500/20' },
  rest: { icon: BedDouble, color: 'text-spotter-teal', bg: 'bg-spotter-teal/20' },
  pre_trip: { icon: ClipboardCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  end: { icon: ClipboardCheck, color: 'text-spotter-text-muted', bg: 'bg-spotter-border/50' },
};

const stopLabels: Record<string, string> = {
  start: 'Pre-trip Inspection',
  pickup: 'Pickup (Loading)',
  dropoff: 'Dropoff (Unloading)',
  fuel: 'Fuel Stop',
  break: '30-min Break',
  rest: '10-hour Rest',
  pre_trip: 'Pre-trip Inspection',
  end: 'Post-trip Inspection',
};

export function StopsList({ stops }: StopsListProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Group stops by day
  const stopsByDay: Record<number, Stop[]> = {};
  stops.forEach(stop => {
    if (!stopsByDay[stop.day]) {
      stopsByDay[stop.day] = [];
    }
    stopsByDay[stop.day].push(stop);
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
        <Truck className="w-5 h-5 text-spotter-teal" />
        Planned Stops
      </h3>

      {Object.entries(stopsByDay).map(([day, dayStops]) => (
        <div key={day} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-spotter-teal/20 text-spotter-teal text-sm font-semibold rounded-full">
              Day {day}
            </span>
            <span className="text-xs text-spotter-text-muted">
              {dayStops.length} stops
            </span>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-spotter-border via-spotter-border-light to-spotter-border" />

            <div className="space-y-3">
              {dayStops.map((stop) => {
                const config = stopIcons[stop.type] || stopIcons.start;
                const Icon = config.icon;
                
                return (
                  <div
                    key={stop.id}
                    className="relative flex gap-4 p-4 bg-spotter-bg-dark/30 hover:bg-spotter-bg-dark/50 border border-spotter-border/30 hover:border-spotter-border rounded-xl transition-all"
                  >
                    {/* Icon */}
                    <div className={`relative z-10 w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-white">
                            {stopLabels[stop.type] || stop.type}
                          </h4>
                          <p className="text-sm text-spotter-text-secondary truncate">
                            {stop.location}
                          </p>
                        </div>
                        <span className="text-xs text-spotter-text-muted whitespace-nowrap">
                          {formatTime(stop.arrival_time)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-spotter-text-muted">
                        <span className="flex items-center gap-1">
                          ⏱ {formatDuration(stop.duration_minutes)}
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {stop.cumulative_miles.toLocaleString()} mi
                        </span>
                        {stop.notes && (
                          <span className="text-spotter-text-secondary">
                            • {stop.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
