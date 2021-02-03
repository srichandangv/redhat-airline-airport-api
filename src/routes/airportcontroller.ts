import * as express from 'express';
import * as luxon from 'luxon';

const url = require('url');
var faker = require('faker');

import { Airport } from '../entity/airport';
import airportData from '../../data/airports.json';

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
      airport.city = airportJson.city;
      airport.country = airportJson.country;
      airport.elevation = airportJson.elevation;
      airport.iata = airportJson.iata;
      airport.icao = airportJson.icao;
      airport.latitude = airportJson.lat;
      airport.longitude = airportJson.lon;
      airport.name = airportJson.name;
      airport.state = airportJson.state;
      airport.tz = airportJson.tz;

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
}

export default ScheduleController;
