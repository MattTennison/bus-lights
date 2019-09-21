import axios from 'axios';
import { differenceInMinutes, parse } from 'date-fns';

const getAxiosClient = () => axios.create({ 
    baseURL: 'https://transportapi.com/v3', 
    params: {
        app_id: process.env.TRANSPORT_API_APP_ID,
        app_key: process.env.TRANSPORT_API_APP_KEY
    } 
})

const getDepartures = async () => {
    const result = await getAxiosClient().get('uk/bus/stop/450011369/live.json');
    return result.data.departures;
}

const timeUntilDeparture = departure => {
    const parseDepartureDate = parse(`${departure.date} ${departure.best_departure_estimate}`, 'yyyy-MM-dd HH:mm', new Date());
    return differenceInMinutes(parseDepartureDate, Date.now());
}

export const timeUntilDeparturesForRoute = async (route) => {
    const result = await getDepartures();
    return result[route].map(timeUntilDeparture).filter(d => d > 0);
}