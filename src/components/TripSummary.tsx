import { Route, Clock, Calendar, Fuel, Coffee, BedDouble } from 'lucide-react';
import type { TripSummary as TripSummaryType } from '../types';

interface TripSummaryProps {
  summary: TripSummaryType;
}

export function TripSummary({ summary }: TripSummaryProps) {
  return (
    <div className="spotter-card p-6">
      <h2 className="text-lg font-display font-semibold text-white mb-4">
        Trip Summary
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Distance */}
        <div className="bg-spotter-bg-dark/50 rounded-xl p-4 border border-spotter-border/50">
          <div className="flex items-center gap-2 text-spotter-text-secondary mb-1">
            <Route className="w-4 h-4 text-spotter-teal" />
            <span className="text-xs font-medium">Distance</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {summary.total_distance_miles.toLocaleString()}
            <span className="text-sm font-normal text-spotter-text-muted ml-1">mi</span>
          </p>
        </div>

        {/* Duration */}
        <div className="bg-spotter-bg-dark/50 rounded-xl p-4 border border-spotter-border/50">
          <div className="flex items-center gap-2 text-spotter-text-secondary mb-1">
            <Clock className="w-4 h-4 text-spotter-gold" />
            <span className="text-xs font-medium">Duration</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {summary.total_duration_hours.toFixed(1)}
            <span className="text-sm font-normal text-spotter-text-muted ml-1">hrs</span>
          </p>
        </div>

        {/* Days */}
        <div className="bg-spotter-bg-dark/50 rounded-xl p-4 border border-spotter-border/50">
          <div className="flex items-center gap-2 text-spotter-text-secondary mb-1">
            <Calendar className="w-4 h-4 text-spotter-coral" />
            <span className="text-xs font-medium">Days</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {summary.total_days}
            <span className="text-sm font-normal text-spotter-text-muted ml-1">
              {summary.total_days === 1 ? 'day' : 'days'}
            </span>
          </p>
        </div>

        {/* Stops Summary */}
        <div className="bg-spotter-bg-dark/50 rounded-xl p-4 border border-spotter-border/50">
          <div className="text-xs font-medium text-spotter-text-secondary mb-2">Stops</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-spotter-text-secondary">{summary.fuel_stops} fuel</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="w-3.5 h-3.5 text-green-400" />
              <span className="text-spotter-text-secondary">{summary.rest_breaks} breaks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BedDouble className="w-3.5 h-3.5 text-spotter-teal" />
              <span className="text-spotter-text-secondary">{summary.rest_stops} rest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle Hours */}
      <div className="mt-4 p-4 bg-gradient-to-r from-spotter-teal/10 to-spotter-gold/10 border border-spotter-teal/20 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-sm text-spotter-text-secondary">Cycle Hours After Trip</span>
          <span className="text-lg font-bold text-white">
            {summary.cycle_hours_after}
            <span className="text-sm font-normal text-spotter-text-muted"> / 70 hrs</span>
          </span>
        </div>
        <div className="mt-2 h-2 bg-spotter-bg-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-spotter-teal to-spotter-gold rounded-full transition-all"
            style={{ width: `${(summary.cycle_hours_after / 70) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
