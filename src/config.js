export const hue = {
    get username() {
        return process.env.HUE_USERNAME;
    },
    get uniqueLightId() {
        return process.env.HUE_UNIQUE_LIGHT_ID;
    }
};

export const transportApi = {
    get appId() {
        return process.env.TRANSPORT_API_APP_ID;
    },
    get appKey() {
        return process.env.TRANSPORT_API_APP_KEY;
    }
}

export const app = {
    get cronSchedule() {
        return process.env.CRON_SCHEDULE;
    }
}

export const bus = {
    get atCode() {
        return process.env.BUS_STOP_ATCODE
    },
    get route() {
        return process.env.BUS_ROUTE
    }
}