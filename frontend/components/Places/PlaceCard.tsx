'use client';

import { useState } from 'react';
import { Place } from '@/lib/types';
import { MapPin, Clock, ChevronDown, ChevronUp, Navigation } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  cafe: 'bg-amber-500/20 text-amber-400',
  street_art: 'bg-pink-500/20 text-pink-400',
  bar: 'bg-yellow-500/20 text-yellow-400',
  viewpoint: 'bg-sky-500/20 text-sky-400',
  market: 'bg-red-500/20 text-red-400',
  architecture: 'bg-blue-500/20 text-blue-400',
  courtyard: 'bg-emerald-500/20 text-emerald-400',
};

interface PlaceCardProps {
  place: Place;
  index: number;
}

export function PlaceCard({ place, index }: PlaceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = CATEGORY_COLORS[place.category] || 'bg-slate-500/20 text-slate-400';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${encodeURIComponent(place.name)}`;

  return (
    <div
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-slate-600/50 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-white truncate">{place.name}</h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colorClass} flex-shrink-0`}>
              {place.category.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{place.one_liner}</p>
        </div>
        <div className="text-slate-500 flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-slate-700/50">
          <p className="text-xs text-slate-300 mt-2">{place.why_recommended}</p>
          <div className="flex items-start gap-1 text-xs text-emerald-400">
            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
            <span>{place.practical_tip}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} />
              <span>{place.visit_duration_min} min</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors px-2 py-1 rounded-md hover:bg-sky-500/10"
            >
              <Navigation size={12} />
              <span>Open in Maps</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
