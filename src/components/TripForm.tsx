import { useState } from 'react';
import { MapPin, Package, Flag, Clock, Loader2 } from 'lucide-react';
import type { TripInput } from '../types';

interface TripFormProps {
  onSubmit: (input: TripInput) => void;
  loading: boolean;
}

export function TripForm({ onSubmit, loading }: TripFormProps) {
  const [formData, setFormData] = useState<TripInput>({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_hours: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="spotter-card p-6">
      <h2 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-2">
        <span className="p-1.5 bg-spotter-teal/20 rounded-lg">
          <MapPin className="w-4 h-4 text-spotter-teal" />
        </span>
        Trip Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-spotter-text-secondary">
            <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </span>
            Current Location
          </label>
          <input
            type="text"
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g., Los Angeles, CA"
            required
            className="spotter-input"
          />
        </div>

        {/* Pickup Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-spotter-text-secondary">
            <span className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center">
              <Package className="w-3 h-3 text-amber-500" />
            </span>
            Pickup Location
          </label>
          <input
            type="text"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="e.g., Phoenix, AZ"
            required
            className="spotter-input"
          />
        </div>

        {/* Dropoff Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-spotter-text-secondary">
            <span className="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center">
              <Flag className="w-3 h-3 text-red-400" />
            </span>
            Dropoff Location
          </label>
          <input
            type="text"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="e.g., Dallas, TX"
            required
            className="spotter-input"
          />
        </div>

        {/* Current Cycle Hours */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-spotter-text-secondary">
            <span className="w-5 h-5 rounded bg-spotter-teal/20 flex items-center justify-center">
              <Clock className="w-3 h-3 text-spotter-teal" />
            </span>
            Current Cycle Hours Used
            <span className="text-xs text-spotter-text-muted">(0-70)</span>
          </label>
          <input
            type="number"
            name="current_cycle_hours"
            value={formData.current_cycle_hours}
            onChange={handleChange}
            min={0}
            max={70}
            step={0.5}
            required
            className="spotter-input"
          />
          <p className="text-xs text-spotter-text-muted">
            Hours already worked in your rolling 8-day period
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full spotter-btn flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Planning Route...
            </>
          ) : (
            'Plan Trip'
          )}
        </button>
      </form>

      {/* HOS Info */}
      <div className="mt-6 pt-5 border-t border-spotter-border">
        <h3 className="text-xs font-semibold text-spotter-text-muted uppercase tracking-wider mb-3">
          HOS Rules Applied
        </h3>
        <ul className="space-y-1.5 text-xs text-spotter-text-muted">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-spotter-teal" />
            11-hour driving limit per day
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-spotter-teal" />
            14-hour on-duty window
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-spotter-teal" />
            30-min break after 8 hours driving
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-spotter-teal" />
            10-hour off-duty reset
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-spotter-teal" />
            70-hour/8-day cycle limit
          </li>
        </ul>
      </div>
    </div>
  );
}
