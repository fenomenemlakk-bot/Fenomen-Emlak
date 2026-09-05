export type PropertyStatus = "Satılık" | "Kiralık" | "Günlük Kiralık";

export interface PropertySpecs {
  grossM2: number;
  netM2: number;
  roomCount: string;
  buildingAge: string;
  floor: string;
  totalFloors: number;
  heating: string;
  bathroomCount: number;
  balcony: boolean;
  furnished: boolean;
  creditEligible: boolean;
  deedType: string;
  swap: boolean;
}

export interface PropertyLocation {
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
  mapCoordinates?: { lat: number; lng: number };
}

export interface PropertyFeatures {
  interior: string[];
  exterior: string[];
  location: string[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: PropertyStatus;
  category: string;
  location: PropertyLocation;
  specs: PropertySpecs;
  images: string[];
  features: PropertyFeatures;
  badges: string[];
  featured: boolean;
  contactPhone: string;
  whatsappNumber: string;
  agentName: string;
  agentTitle: string;
  agentPhone: string;
  agentAvatar?: string;
  createdAt: string;
  viewsCount: number;
}

export interface Filters {
  searchQuery: string;
  status: string;
  category: string;
  city: string;
  district: string;
  minPrice: number | null;
  maxPrice: number | null;
  minM2: number | null;
  maxM2: number | null;
  roomCounts: string[];
  buildingAge: string;
  heating: string;
  furnishedOnly: boolean;
  creditEligibleOnly: boolean;
  badgeFilter: string;
  sortBy: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerPhone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type NewInquiry = Omit<Inquiry, "id" | "createdAt" | "read">;
export type NewProperty = Omit<Property, "id" | "createdAt" | "viewsCount">;
