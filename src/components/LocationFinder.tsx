import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map': any;
    }
  }
}

interface FitnessLocation {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  types: string[];
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
  opening_hours?: {
    open_now?: boolean;
  };
}

interface LocationFinderProps {
  onLocationSelect: (location: string) => void;
  apiKey: string;
}

const LocationFinder = ({ onLocationSelect, apiKey }: LocationFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<FitnessLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<string>("40.7128,-74.0060"); // Default: NYC
  const [service, setService] = useState<google.maps.places.PlacesService | null>(null);

  // Load Google Maps API and initialize
  useEffect(() => {
    if (!apiKey) return;

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            setMapCenter(`${location.lat},${location.lng}`);
            
            // Initialize Places Service
            const mapElement = document.querySelector('gmp-map');
            if (mapElement) {
              const placesService = new google.maps.places.PlacesService(mapElement as any);
              setService(placesService);
              
              // Search for nearby gyms automatically
              searchNearbyGyms(location, placesService);
            }
          },
          () => {
            // Default to NYC if geolocation fails
            const defaultLocation = { lat: 40.7128, lng: -74.0060 };
            setUserLocation(defaultLocation);
            
            // Initialize Places Service
            const mapElement = document.querySelector('gmp-map');
            if (mapElement) {
              const placesService = new google.maps.places.PlacesService(mapElement as any);
              setService(placesService);
            }
          }
        );
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  const searchNearbyGyms = (location: { lat: number; lng: number }, placesService?: google.maps.places.PlacesService) => {
    const serviceToUse = placesService || service;
    if (!serviceToUse) return;

    setIsLoading(true);
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000, // 5km radius
      type: 'gym',
      keyword: 'fitness gym workout'
    };

    serviceToUse.nearbySearch(request, (results, status) => {
      setIsLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const transformedResults = results.map(result => ({
          place_id: result.place_id || '',
          name: result.name || '',
          formatted_address: result.vicinity || '',
          rating: result.rating,
          types: result.types || [],
          geometry: {
            location: {
              lat: () => result.geometry?.location?.lat() || 0,
              lng: () => result.geometry?.location?.lng() || 0
            }
          },
          opening_hours: result.opening_hours
        }));
        setLocations(transformedResults);
      }
    });
  };

  const searchByText = () => {
    if (!service || !searchQuery) return;

    setIsLoading(true);
    const request = {
      query: `${searchQuery} gym fitness center`,
      location: userLocation ? new google.maps.LatLng(userLocation.lat, userLocation.lng) : undefined,
      radius: 10000
    };

    service.textSearch(request, (results, status) => {
      setIsLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const transformedResults = results.map(result => ({
          place_id: result.place_id || '',
          name: result.name || '',
          formatted_address: result.formatted_address || '',
          rating: result.rating,
          types: result.types || [],
          geometry: {
            location: {
              lat: () => result.geometry?.location?.lat() || 0,
              lng: () => result.geometry?.location?.lng() || 0
            }
          },
          opening_hours: result.opening_hours
        }));
        setLocations(transformedResults);
      }
    });
  };

  const handleLocationSelect = (location: FitnessLocation) => {
    onLocationSelect(location.name + ", " + location.formatted_address);
  };

  const getFitnessType = (types: string[]) => {
    const fitnessTypes = types.filter(type => 
      ['gym', 'health', 'spa', 'stadium', 'physiotherapist'].includes(type)
    );
    return fitnessTypes[0] || 'fitness';
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by area or gym name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && searchByText()}
          />
        </div>
        <Button 
          onClick={searchByText} 
          variant="fitness-outline" 
          size="sm"
          disabled={!searchQuery || isLoading}
        >
          Search
        </Button>
      </div>

      {/* Map Container */}
      <gmp-map
        center={mapCenter}
        zoom="13"
        map-id="FITNESS_MAP"
        style={{ height: '200px', width: '100%', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))' }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Locations List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {locations.length > 0 && (
          <h4 className="font-medium text-sm text-muted-foreground">
            Found {locations.length} fitness centers nearby
          </h4>
        )}
        
        {locations.map((location) => (
          <Card 
            key={location.place_id} 
            className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-border/50"
            onClick={() => handleLocationSelect(location)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm text-foreground">{location.name}</h5>
                  {location.opening_hours?.open_now && (
                    <Badge variant="secondary" className="text-xs bg-fitness-success/10 text-fitness-success">
                      Open Now
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {location.formatted_address}
                </p>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getFitnessType(location.types)}
                  </Badge>
                  
                  {location.rating && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>⭐</span>
                      <span>{location.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
            </div>
          </Card>
        ))}
        
        {locations.length === 0 && !isLoading && userLocation && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No fitness centers found. Try searching for a specific area.
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFinder;