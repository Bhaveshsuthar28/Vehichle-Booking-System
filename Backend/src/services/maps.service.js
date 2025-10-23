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