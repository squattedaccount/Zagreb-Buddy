export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  one_liner: string;
  why_recommended: string;
  practical_tip: string;
  visit_duration_min: number;
  category: string;
}

export interface Itinerary {
  places: Place[];
  total_duration_min: number;
  total_walking_min: number;
  weather_note: string | null;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  itinerary: Itinerary | null;
  follow_ups: string[];
  active_skills: string[];
  needs_more_info: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  itinerary?: Itinerary | null;
  follow_ups?: string[];
  timestamp: Date;
}
