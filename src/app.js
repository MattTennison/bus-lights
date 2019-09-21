import { LIGHT_HUE_VALUES } from './constants';
import { getLight } from './services/hue';
import { timeUntilDeparturesForRoute } from './services/transport-api';
import { log } from './logger';

const getLightHue = timeUntilDepartures => {
    if (timeUntilDepartures.some(d => d >= 5 && d < 10)) {
        return LIGHT_HUE_VALUES.GREEN;
    }

    if (timeUntilDepartures.some(d => d >= 10 && d <= 15)) {
        return LIGHT_HUE_VALUES.AMBER;
    }

    return LIGHT_HUE_VALUES.RED;
}

export default {
    run: async () => {
        const { isOn, changeLightHue } = await getLight();
        if(!isOn) {
            log("Light wasn't turned on");
            return;
        }

        const hueToChangeTo = await timeUntilDeparturesForRoute(28)
            .then(getLightHue)
            .catch(() => LIGHT_HUE_VALUES.BLUE)

        await changeLightHue(hueToChangeTo);
        log(`Changed light hue to ${hueToChangeTo}`);
    }
}