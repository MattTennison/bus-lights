import axios from 'axios';

const getAxiosForHue = () => axios.create({ baseURL: `http://192.168.0.14/api/${process.env.HUE_USERNAME}` });

const changeLightHue = lightId => hue => getAxiosForHue().put(`lights/${lightId}/state`, { bri: 254, hue, on: true, sat: 254 });

const parseLights = lightResponse => Object.entries(lightResponse.data).map((value => ({ id: value[0], details: value[1] })));

const findMatchingLight = lights => lights.find(l => l.details.uniqueid === process.env.HUE_UNIQUE_LIGHT_ID);

const nullLight = { isOn: false, changeLightHue: () => { /* no-op */ }}

export const getLight = async () => {
    return getAxiosForHue().get('/lights')
        .then(parseLights)
        .then(findMatchingLight)
        .then(matchingLight => ({
            isOn: matchingLight.details.state.on,
            changeLightHue: changeLightHue(matchingLight.id)
        }))
        .catch(() => nullLight);
}