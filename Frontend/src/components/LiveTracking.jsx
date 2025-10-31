import {useEffect , useMemo , useRef , useState} from "react";
import maplibregl from "maplibre-gl";

const ROUTE_SOURCE_ID = "ride-route";
const MAP_STYLE_ID = "osm-bright";
const DEFAULT_CENTER = [78.9629, 20.5937];
const MIN_ZOOM = 5;

const normalizeLocation = (point) => {
    if (!point) return null;

    const latCandidate = point.lat ?? point.latitude ?? point[1];
    const lngCandidate = point.lng ?? point.lon ?? point.longitude ?? point[0];

    const lat = Number(latCandidate);
    const lng = Number(lngCandidate);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
};

const haversineKm = (a, b) => {
    const origin = normalizeLocation(a);
    const target = normalizeLocation(b);

    if (!origin || !target) return null;

    const R = 6371;
    const dLat = ((target.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((target.lng - origin.lng) * Math.PI) / 180;
    const lat1 = (origin.lat * Math.PI) / 180;
    const lat2 = (target.lat * Math.PI) / 180;

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    return +(2 * R * Math.asin(Math.sqrt(h))).toFixed(2);
};


export const LiveTracking = ({ pickupAddress, destinationAddress, userLocation, captainLocation, heightClass = "h-full",}) => {

    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const userMarkerRef = useRef(null);
    const captainMarkerRef = useRef(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [routeGeoJson, setRouteGeoJson] = useState(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current || !apiKey) return;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style: `https://maps.geoapify.com/v1/styles/${MAP_STYLE_ID}/style.json?apiKey=${apiKey}`,
            center: DEFAULT_CENTER,
            zoom: MIN_ZOOM,
            attributionControl: true,
        });

        

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            userMarkerRef.current = null;
            captainMarkerRef.current = null;
        };
    }, [apiKey]);

    useEffect(() => {
        if (!pickupAddress || !apiKey) {
            setPickupCoords(null);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                        pickupAddress
                    )}&limit=1&apiKey=${apiKey}`
                );
                if (!response.ok) throw new Error("Pickup geocode failed");
                const data = await response.json();
                const feature = data.features?.[0];
                if (!cancelled && feature) {
                    setPickupCoords({
                        lat: feature.properties.lat,
                        lng: feature.properties.lon,
                    });
                }    
            } catch (error) {
                console.error("Pickup geocode error:", error.message);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pickupAddress, apiKey]);

    useEffect(() => {
        if (!destinationAddress || !apiKey) {
            setDestinationCoords(null);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                        destinationAddress
                    )}&limit=1&apiKey=${apiKey}`
                );
                if (!response.ok) throw new Error("Destination geocode failed");
                const data = await response.json();
                const feature = data.features?.[0];
                if (!cancelled && feature) {
                    setDestinationCoords({
                        lat: feature.properties.lat,
                        lng: feature.properties.lon,
                    });
                }
            } catch (error) {
                console.error("Destination geocode error:", error.message);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [destinationAddress, apiKey]);

    useEffect(() => {
        if (!pickupCoords || !destinationCoords || !apiKey) {
            setRouteGeoJson(null);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const waypoints = `${pickupCoords.lat},${pickupCoords.lng}|${destinationCoords.lat},${destinationCoords.lng}`;
                const response = await fetch(
                    `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${apiKey}`
                );
                if (!response.ok) throw new Error("Route request failed");
                const data = await response.json();
                const geometry = data.features?.[0]?.geometry;
                if (!cancelled && geometry) {
                    setRouteGeoJson({
                        type: "FeatureCollection",
                        features: [{ type: "Feature", geometry }],
                    });
                }
            } catch (error) {
                console.error("Route fetch error:", error.message);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pickupCoords, destinationCoords, apiKey]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (!routeGeoJson) {
            if (map.getLayer("route-line")) {
                map.removeLayer("route-line");
            }
            if (map.getSource(ROUTE_SOURCE_ID)) {
                map.removeSource(ROUTE_SOURCE_ID);
            }
            return;
        }

        if (!map.getSource(ROUTE_SOURCE_ID)) {
            map.addSource(ROUTE_SOURCE_ID, {
                type: "geojson",
                data: routeGeoJson,
            });

            map.addLayer({
                id: "route-line",
                type: "line",
                source: ROUTE_SOURCE_ID,
                paint: {
                    "line-color": "#22d3ee",
                    "line-width": 5,
                    "line-opacity": 0.85,
                },
            });
        } else {
            map.getSource(ROUTE_SOURCE_ID).setData(routeGeoJson);
        }
    }, [routeGeoJson]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const normalized = normalizeLocation(userLocation);

        if (!normalized) {
            if (userMarkerRef.current) {
                userMarkerRef.current.remove();
                userMarkerRef.current = null;
            }
            return;
        }

        if (!userMarkerRef.current) {
            userMarkerRef.current = new maplibregl.Marker({ color: "#f97316" }).setLngLat([normalized.lng, normalized.lat]).addTo(map);
        }else{
            userMarkerRef.current.setLngLat([normalized.lng, normalized.lat]);
        }
        
    }, [userLocation]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const normalized = normalizeLocation(captainLocation);

        if (!normalized) {
            if (captainMarkerRef.current) {
                captainMarkerRef.current.remove();
                captainMarkerRef.current = null;
            }
            return;
        }

        if (!captainMarkerRef.current) {
            captainMarkerRef.current = new maplibregl.Marker({ color: "#22c55e" }).setLngLat([normalized.lng, normalized.lat]).addTo(map);
        }
        else {
            captainMarkerRef.current.setLngLat([normalized.lng, normalized.lat]);
        }

    }, [captainLocation]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const bounds = new maplibregl.LngLatBounds();
        let hasBounds = false;

        if (routeGeoJson?.features?.[0]?.geometry?.coordinates) {
            const coordinates = routeGeoJson.features[0].geometry.coordinates;

            const flatten = (coords) => {
                if (!Array.isArray(coords)) return;
                if (typeof coords[0] === "number") {
                    const [lng, lat] = coords;
                    if (Number.isFinite(lat) && Number.isFinite(lng)) {
                        bounds.extend([lng, lat]);
                        hasBounds = true;
                    }
                    return;
                }
                coords.forEach(flatten);
            };

            flatten(coordinates);
        }

        const normalizedUser = normalizeLocation(userLocation);
        if (normalizedUser) {
            bounds.extend([normalizedUser.lng, normalizedUser.lat]);
            hasBounds = true;
        }

        const normalizedCaptain = normalizeLocation(captainLocation);
        if (normalizedCaptain) {
            bounds.extend([normalizedCaptain.lng, normalizedCaptain.lat]);
            hasBounds = true;
        }

                if (hasBounds) {
            map.fitBounds(bounds, {
                padding: 80,
                duration: 450,
                maxZoom: 16,
            });
        }
    }, [userLocation, captainLocation, routeGeoJson]);

    const captainUserDistance = useMemo(
        () => haversineKm(userLocation, captainLocation),
        [userLocation, captainLocation]
    );

    return (
        <div className={`relative w-full ${heightClass}`}>
            <div ref={containerRef} className="h-full w-full overflow-hidden rounded-3xl" />
            {captainUserDistance != null && (
                <div className="absolute left-4 top-4 rounded-xl bg-black/70 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
                    Captain distance: {captainUserDistance} km
                </div>
            )}
        </div>
    )
}