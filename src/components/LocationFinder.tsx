import { useState, useEffect } from "react";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FitnessLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  distance?: number;
}

interface LocationFinderProps {
  onLocationSelect: (location: string) => void;
}

const LocationFinder = ({ onLocationSelect }: LocationFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<FitnessLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.0060]); // Default: NYC

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

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

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
          
          const distance = calculateDistance(lat, lng, elementLat, elementLng);
          
          return {
            id: element.id.toString(),
            name: element.tags.name,
            address,
            lat: elementLat,
            lng: elementLng,
            type: element.tags.leisure || element.tags.amenity || 'fitness',
            distance
          };
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Sort by distance
      
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
        setUserLocation(newCenter);
        
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

  const openInMaps = (location: FitnessLocation) => {
    const url = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}`;
    window.open(url, '_blank');
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {/* Locations List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {locations.length > 0 && !isLoading && (
          <h4 className="font-medium text-sm text-muted-foreground">
            Found {locations.length} fitness centers nearby
          </h4>
        )}
        
        {locations.map((location) => (
          <Card 
            key={location.id} 
            className="p-3 hover:shadow-md transition-shadow border border-border/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1" onClick={() => handleLocationSelect(location)} role="button" tabIndex={0}>
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm text-foreground">{location.name}</h5>
                  {location.distance !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {location.distance < 1 
                        ? `${(location.distance * 1000).toFixed(0)}m away`
                        : `${location.distance.toFixed(1)}km away`
                      }
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {location.address}
                </p>
                
                <Badge variant="outline" className="text-xs">
                  {location.type}
                </Badge>
              </div>
              
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openInMaps(location)}
                  className="h-8 w-8 p-0"
                  title="Open in OpenStreetMap"
                >
                  <Navigation className="w-4 h-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLocationSelect(location)}
                  className="h-8 w-8 p-0"
                  title="Select this location"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                </Button>
              </div>
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
