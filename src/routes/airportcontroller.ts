import * as express from 'express';
import * as luxon from 'luxon';

const url = require('url');
var faker = require('faker');

import { Airport } from '../entity/airport';
import airportData from '../../data/airports.json';
import * as cache from '../stores';
import log from '../log';

class ScheduleController {
  public router = express.Router();
  public path = '/airports';

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAirports);
    this.router.get(this.path + '/code', this.getAirport);
  }

  getAirports = (request: express.Request, response: express.Response) => {
    let airports: Airport[] = new Array<Airport>();
    airportData.airports.forEach((airportJson) => {
      let airport: Airport = new Airport();
      airport = this.getFromCache(airportJson);
      /*      
      airport.city = airportJson.city;
      airport.country = airportJson.country;
      airport.elevation = airportJson.elevation;
      airport.iata = airportJson.iata;
      airport.icao = airportJson.icao;
      airport.latitude = airportJson.lat;
      airport.longitude = airportJson.lon;
      airport.name = airportJson.name;
      airport.state = airportJson.state;
      airport.tz = airportJson.tz; */

      airports.push(airport);
    });
    response.send(airports);
  };

  getAirport = (request: express.Request, response: express.Response) => {
    const code = request.params.code.toLowerCase();
    const airport = airportData.airports.find((a) => {
      return a.iata.toLowerCase() === code || a.icao.toLowerCase() === code;
    });
    response.send(airport);
  };

  getFromCache = (airportJson: any): Airport => {
    // {"iata":"ATL","icao":"KATL","name":"Hartsfield Jackson Atlanta International Airport","city":"Atlanta","state":"Georgia","country":"US","tz":"America/New_York","elevation":1026,"latitude":33.6366996765,"longitude":-84.4281005859}
    let iata = airportJson.iata;
    let airportObj = Airport.fromJSON(airportJson);

    if (iata) {
      log.info(`retreiving airport from cache with ${iata}`);
      let airport = cache.getAirportInCache(iata);

      if (!airport) {
        log.info(
          'Did not find ${iata} in cache, so now inserting airport: ${airportJson}'
        );
        try {
          cache.upsertAirportInCache(airportObj);
          log.info('Successfully stored in cache for ${iata}');
        } catch {
          log.error('Could not update the cache for ${iata}');
        }
      }
    }

    return airportObj;
  };
}

export default ScheduleController;
