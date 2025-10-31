import { useEffect, useRef, useState } from "react";

export const useDeviceLocation = (options = {}) => {
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState(null);
    const watchIdRef = useRef(null);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const now = Date.now();
                if (now - lastUpdateRef.current < 1000) return;
                lastUpdateRef.current = now;

                setCoords({
                    lat: coords.latitude,
                    lng: coords.longitude,
                    accuracy: coords.accuracy,
                    heading: coords.heading,
                    speed: coords.speed,
                    timestamp: now,
                });
            },
            (geoError) => {
                setError(geoError.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
                ...options,
            }
        );

        return () => {
            if (watchIdRef.current != null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

    return { coords, error };
};