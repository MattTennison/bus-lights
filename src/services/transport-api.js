import axios from 'axios';
import { differenceInMinutes, parse } from 'date-fns';
import { bus, transportApi } from '../config';

const getAxiosClient = () => axios.create({ 
    baseURL: 'https://transportapi.com/v3', 
    params: {
        app_id: transportApi.appId,
        app_key: transportApi.appKey
    }
})

const getDepartures = async () => {
    const result = await getAxiosClient().get(`uk/bus/stop/${bus.atCode}/live.json`);
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