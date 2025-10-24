import axios from "axios"

export const GetLocationCoordinate = async(address) => {
    const Apikey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Apikey}`;

    try {
        const response = await axios.get(url);

        if(response.data.status === 'OK'){
            const location = response.data.results[0].geometry.location;

            return{
                ltd : location.lat,
                lng : location.lng
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

export const GetDistanceTime = async(origin , destination) => {
    if(!origin || !destination){
        throw new Error('Origin and destination are required');
    }

    const Apikey = process.env.GOOGLE_MAP_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${Apikey}`;

    try {
        const response = await axios.get(url);

        if(response.data.status === 'OK'){

            if(response.data.rows[0].elements[0].status === 'ZERO_RESULTS'){
                throw new Error('No routes found')
            }

            return response.data.rows[0].elements[0];
        }
        else{
            throw new Error('Unable to fetch distance and time')
        }
    } catch (error) {
      throw new error  
    }
}

export const GetLocationSuggestions = async(input) => {
    if(!input){
        throw new Error('query is required')
    }

    const ApiKey = process.env.GOOGLE_MAP_API;

    const url = `https://maps.googleapis.com/maps/api/autocomplete/json?input=${encodeURIComponent(input)}&key=${ApiKey}`;
    try {
        const response = await axios.get(url);
        if(response.data.status === 'OK'){
            return response.data.predictions;
        }
        else{
            throw new Error('Unable to fetch suggestions')
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}