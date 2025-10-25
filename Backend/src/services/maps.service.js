import axios from "axios"

export const GetLocationCoordinate = async(address) => {
    const Apikey = process.env.GEOAPIFY_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${Apikey}`;

    try {
        const response = await axios.get(url);

        if(response.data && response.data.features && response.data.features.length > 0){
            const location = response.data.features[0].geometry.coordinates;

            return{
                lat: location[1],
                lng: location[0],
            };
        }
        else{
            throw new Error('Unable to fetch coordinates')
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}


export const GetDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const ApiKey = process.env.GEOAPIFY_API_KEY;

    const originCoords = await GetLocationCoordinate(origin);
    const destinationCoords = await GetLocationCoordinate(destination);

    const url = `https://api.geoapify.com/v1/routing?waypoints=${originCoords.lat},${originCoords.lng}|${destinationCoords.lat},${destinationCoords.lng}&mode=drive&apiKey=${ApiKey}`;

    try {
        const response = await axios.get(url);

        if (
        response.data && response.data.features && response.data.features.length > 0){
            const info = response.data.features[0].properties;

            return {
                distance: Number((info.distance / 1000).toFixed(2)),
                time: Math.round(info.time / 60),
            };
        } else {
            console.log("Geoapify raw response:", response.data);
            throw new Error("Unable to fetch distance and time");
        }
    } catch (error) {
        console.error("Geoapify Routing Error:", error.response?.data || error.message);
        throw error;
    }
};



export const GetLocationSuggestions = async(input) => {
    if(!input){
        throw new Error('query is required')
    }

    const ApiKey = process.env.GEOAPIFY_API_KEY;

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${ApiKey}`;
    try {
        const response = await axios.get(url);
        if(response.data && response.data.features && response.data.features.length > 0){
            return response.data.features.map((place) => ({
                name: place.properties.formatted,
                lat: place.geometry.coordinates[1],
                lng: place.geometry.coordinates[0],
            }));
        }
        else{
            throw new Error('Unable to fetch suggestions')
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}