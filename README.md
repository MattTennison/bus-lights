# Bus Lights 

**Never wait for the bus again!**

## What is this?

This is a NodeJS app that will change the colour of a Hue light in your network when your next bus is nearby. Current rules:
- If it's between 5 and 10 minutes away, green light
- 10 - 15 minutes away, amber light 
- < 5 minutes away or > 15 minutes away, red light

As it relies on a third party API with rate-limits for the next bus information, it is configured to run on a cron schedule.

## Get Started

Easiest way to run this application is through the provided docker image:
```
docker pull matttennison/bus-lights:latest
docker run --env-file .env matttennison/bus-lights:latest
```

It'll need to be running to update light values, so it makes sense to run on a always-on computer on your network like a Raspberry Pi (tutorial on setting up Docker on a Pi here: https://www.freecodecamp.org/news/the-easy-way-to-set-up-docker-on-a-raspberry-pi-7d24ced073ef/).

To populate the .env file use the `.env.example` as a reference.

## Configuration Values

Configuration values are supplied through environment variables.

| Environment Variable  | Description                                                                                                                                                                        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| HUE_BRIDGE_IP_ADDRESS | This is the IP Address of your Hue Bridge. Hue API docs have a good guide on finding it. Try this: https://discovery.meethue.com/                                                  |
| HUE_USERNAME          | You have to create an API user on your Hue bridge, instructions can be found on: https://developers.meethue.com/develop/get-started-2/                                             |
| HUE_UNIQUE_LIGHT_ID   | The light you want to control. To find this make a GET request to /api//lights and look for the `uniqueid` key for your particular light.                                          |
| TRANSPORT_API_APP_ID  | Sign up for a free personal developer account at https://www.transportapi.com/ and you'll get one.                                                                                 |
| TRANSPORT_API_APP_KEY | As above.                                                                                                                                                                          |
| CRON_SCHEDULE         | Schedule to run the update light job. E.g. '*/2 6-7 * * 1-5' to run every 2 minutes between 6 and 7am on weekdays. https://crontab.guru/ is a good resource to test your schedule. |
| BUS_STOP_ATCODE       | Each bus stop has an 'AtCode' to uniquely identify it. TransportAPI has some docs to help you find yours.                                                                          |
| BUS_ROUTE             | Bus route you're interested in. This should line up with the bus route from TransportAPI, so make a GET request to /uk/bus/stop/{atcocode}/live.json and check.                    |
