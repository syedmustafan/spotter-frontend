import { useState } from 'react';
import { TripForm } from './components/TripForm';
import { RouteMap } from './components/RouteMap';
import { StopsList } from './components/StopsList';
import { TripSummary } from './components/TripSummary';
import { LogSheet } from './components/LogSheet';
import { FileText, Map, ListChecks } from 'lucide-react';
import type { TripResponse, TripInput } from './types';
import axios from 'axios';

// Spotter Logo Component
function SpotterLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-float" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-float" style={{ animationDelay: '150ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-float" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xl font-display font-bold text-white tracking-tight">spotter</span>
    </div>
  );
}

function App() {
  const [tripData, setTripData] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'stops' | 'logs'>('map');

  const handlePlanTrip = async (input: TripInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<TripResponse>('/api/plan-trip/', input);
      setTripData(response.data);
      setActiveTab('map');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to plan trip. Please check your inputs and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-spotter-border/50 backdrop-blur-sm bg-spotter-bg-dark/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <SpotterLogo />
          <nav className="hidden md:flex items-center gap-6 text-sm text-spotter-text-secondary">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>
          <button className="px-4 py-2 bg-spotter-teal/20 text-spotter-teal rounded-lg text-sm font-medium hover:bg-spotter-teal/30 transition-colors">
            sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
          Trucking <span className="gradient-text">Automation</span>
        </h1>
        <p className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
          that works for you
        </p>
        <p className="text-spotter-text-secondary max-w-xl mx-auto">
          Plan HOS-compliant trips with automatic stops, rest breaks, and ELD log generation
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-4">
            <TripForm onSubmit={handlePlanTrip} loading={loading} />
            
            {error && (
              <div className="mt-4 p-4 spotter-card border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {tripData && (
              <div className="mt-6 animate-slide-up">
                <TripSummary summary={tripData.summary} />
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-8">
            {!tripData ? (
              <div className="h-[600px] spotter-card flex flex-col items-center justify-center">
                <div className="p-4 bg-spotter-border/30 rounded-full mb-4">
                  <Map className="w-12 h-12 text-spotter-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-spotter-text-secondary">Plan Your Trip</h3>
                <p className="text-sm text-spotter-text-muted mt-1">Enter your trip details to see the route and ELD logs</p>
              </div>
            ) : (
              <div className="space-y-4 animate-slide-up">
                {/* Tab Navigation */}
                <div className="flex gap-2 p-1.5 spotter-card">
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'map'
                        ? 'bg-spotter-teal text-spotter-bg-dark shadow-glow-teal'
                        : 'text-spotter-text-secondary hover:text-white hover:bg-spotter-bg-card'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    Route Map
                  </button>
                  <button
                    onClick={() => setActiveTab('stops')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'stops'
                        ? 'bg-spotter-teal text-spotter-bg-dark shadow-glow-teal'
                        : 'text-spotter-text-secondary hover:text-white hover:bg-spotter-bg-card'
                    }`}
                  >
                    <ListChecks className="w-4 h-4" />
                    Stops
                  </button>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'logs'
                        ? 'bg-spotter-teal text-spotter-bg-dark shadow-glow-teal'
                        : 'text-spotter-text-secondary hover:text-white hover:bg-spotter-bg-card'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    ELD Logs
                  </button>
                </div>

                {/* Tab Content */}
                <div className="spotter-card overflow-hidden">
                  {activeTab === 'map' && (
                    <RouteMap
                      geometry={tripData.route_geometry}
                      stops={tripData.stops}
                    />
                  )}
                  {activeTab === 'stops' && (
                    <div className="p-6">
                      <StopsList stops={tripData.stops} />
                    </div>
                  )}
                  {activeTab === 'logs' && (
                    <div className="p-6 space-y-6">
                      {tripData.log_sheets.map((log, index) => (
                        <LogSheet key={index} logSheet={log} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-spotter-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <SpotterLogo />
            <p className="text-sm text-spotter-text-muted">
              FMCSA Hours of Service Compliant · Property-carrying drivers · 70-hour/8-day cycle
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
