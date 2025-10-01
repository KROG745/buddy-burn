import { useState, useEffect, lazy, Suspense } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy load the map component
const GymFinderMap = lazy(() => import('./GymFinderMap'));

interface FitnessLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}

interface LocationFinderProps {
  onLocationSelect: (location: string) => void;
}

const LocationFinder = ({ onLocationSelect }: LocationFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<FitnessLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.0060]); // Default: NYC
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(location);
          setMapCenter(location);
          
          // Search for nearby gyms automatically
          searchNearbyGyms(location);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use default location (NYC)
          searchNearbyGyms([40.7128, -74.0060]);
        }
      );
    } else {
      // Use default location (NYC)
      searchNearbyGyms([40.7128, -74.0060]);
    }
  }, []);

  // Search for nearby gyms using Overpass API (OpenStreetMap)
  const searchNearbyGyms = async (location: [number, number]) => {
    setIsLoading(true);
    
    const [lat, lng] = location;
    const radius = 5000; // 5km radius
    
    // Overpass API query for fitness facilities
    const query = `
      [out:json][timeout:25];
      (
        node["leisure"="fitness_centre"](around:${radius},${lat},${lng});
        node["leisure"="sports_centre"]["sport"~"fitness"](around:${radius},${lat},${lng});
        node["amenity"="gym"](around:${radius},${lat},${lng});
        way["leisure"="fitness_centre"](around:${radius},${lat},${lng});
        way["leisure"="sports_centre"]["sport"~"fitness"](around:${radius},${lat},${lng});
        way["amenity"="gym"](around:${radius},${lat},${lng});
      );
      out center;
    `;
    
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });
      
      const data = await response.json();
      
      const transformedResults: FitnessLocation[] = data.elements
        .filter((element: any) => element.tags?.name)
        .map((element: any) => {
          const elementLat = element.lat || element.center?.lat || 0;
          const elementLng = element.lon || element.center?.lon || 0;
          const address = [
            element.tags['addr:street'],
            element.tags['addr:housenumber'],
            element.tags['addr:city']
          ].filter(Boolean).join(', ') || 'Address not available';
          
          return {
            id: element.id.toString(),
            name: element.tags.name,
            address,
            lat: elementLat,
            lng: elementLng,
            type: element.tags.leisure || element.tags.amenity || 'fitness'
          };
        });
      
      setLocations(transformedResults);
    } catch (error) {
      console.error('Error fetching gyms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search by area/city name using Nominatim (OpenStreetMap geocoding)
  const searchByText = async () => {
    if (!searchQuery) return;

    setIsLoading(true);
    
    try {
      // First, geocode the search query to get coordinates
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.length > 0) {
        const { lat, lon } = geocodeData[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        
        // Now search for gyms in that area
        await searchNearbyGyms(newCenter);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: FitnessLocation) => {
    onLocationSelect(`${location.name}, ${location.address}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by area or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && searchByText()}
          />
        </div>
        <Button 
          onClick={searchByText} 
          variant="outline" 
          size="sm"
          disabled={!searchQuery || isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {/* Map Container */}
      <Suspense fallback={
        <div className="h-[200px] w-full rounded-lg border border-border flex items-center justify-center bg-muted">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      }>
        <GymFinderMap center={mapCenter} locations={locations} />
      </Suspense>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
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
            key={location.id} 
            className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-border/50"
            onClick={() => handleLocationSelect(location)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm text-foreground">{location.name}</h5>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {location.address}
                </p>
                
                <Badge variant="outline" className="text-xs">
                  {location.type}
                </Badge>
              </div>
              
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
            </div>
          </Card>
        ))}
        
        {locations.length === 0 && !isLoading && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No fitness centers found. Try searching for a specific area.
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFinder;