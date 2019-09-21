import nock from 'nock';
import hueLights from '../test/fixtures/hue-lights-switched-on.json';
import hueLightsSwitchedOff from '../test/fixtures/hue-lights-switched-off.json';
import liveStopResponse from '../test/fixtures/live-stop-information.json'
import hueUpdateLightState from '../test/fixtures/hue-update-light-state.json';
import app from './app';

describe('Bus Lights application', () => {
    beforeEach(() => {
        process.env.HUE_USERNAME = 'hue-user';
        process.env.TRANSPORT_API_APP_ID = 'transport-app';
        process.env.TRANSPORT_API_APP_KEY = 'password';
        process.env.HUE_UNIQUE_LIGHT_ID = '00:17:88:01:03:9c:be:29-0b';
        process.env.BUS_STOP_ATCODE = '4500';
        process.env.BUS_ROUTE = '28'
    })

    describe('Given the Hue light is switched on', () => {
        beforeEach(() => {
            nock('http://192.168.0.14/api')
                .get('/hue-user/lights')
                .reply(200, hueLights);
        })

        describe('Given Transport API is available', () => {
            beforeEach(() => {
                nock('https://transportapi.com/v3')
                    .get('/uk/bus/stop/4500/live.json')
                    .query({ app_id: 'transport-app', app_key: 'password' })
                    .reply(200, liveStopResponse);
            });
    
            afterEach(() => {
                nock.cleanAll();
            })
    
            describe('should set the light to green', () => {
                beforeEach(() => {
                    nock('http://192.168.0.14/api')
                        .put('/hue-user/lights/2/state', { bri: 254, on: true, hue: 25500, sat: 254 })
                        .reply(200, hueUpdateLightState);
                })
    
                it('when the next suitable bus is 5 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 11, 56, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                });

                it('when the next suitable bus is 9 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 11, 52, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                });
        
                it('when the second suitable bus is 5 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 12, 14, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                });
            });
    
            describe('should set the light to amber', () => {
                beforeEach(() => {
                    const expectedState = { bri: 254, hue: 7759, on: true, sat: 254 }
                    nock('http://192.168.0.14/api')
                        .put('/hue-user/lights/2/state', expectedState)
                        .reply(200, hueUpdateLightState);
                })
    
                it('when the next suitable bus is 11 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 11, 50, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                });

                it('when the next suitable bus is 15 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 11, 46, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                });
        
                it('when the second suitable bus is 11 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 12, 8, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                }); 
            });
    
            describe('should set the light to red', () => {
                beforeEach(() => {
                    const expectedState = { bri: 254, hue: 65151, on: true, sat: 254 }
                    nock('http://192.168.0.14/api')
                        .put('/hue-user/lights/2/state', expectedState)
                        .reply(200, hueUpdateLightState);
                })
    
                it('when the next suitable bus is 16 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 11, 45, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                });
        
                it('when the second suitable bus is 16 minutes away', async () => {
                    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 8, 21, 12, 2, 0))
                    
                    await app.run();
                    
                    expect(nock.isDone()).toBe(true);
                }); 
            });
        });
    
        describe('Given Transport API is down', () => {
            beforeEach(() => {
                nock('https://transportapi.com/v3')
                    .get('/uk/bus/stop/4500/live.json')
                    .query({ app_id: 'transport-app', app_key: 'password' })
                .reply(500);
            })
    
            it('should set the light to blue', async () => {
                nock('http://192.168.0.14/api')
                    .put('/hue-user/lights/2/state', { bri: 254, on: true, hue: 45872, sat: 254 })
                    .reply(200, hueUpdateLightState);
    
                await app.run();
    
                expect(nock.isDone()).toBe(true);
            })
        });
    });

    describe('Given the Hue light is switched off', () => {
        beforeEach(() => {
            nock('http://192.168.0.14/api')
                .get('/hue-user/lights')
                .reply(200, hueLightsSwitchedOff);
        })

        it('should not call Transport API', async () => {
            nock('https://transportapi.com/v3');

            await app.run();
        })
    });
});
