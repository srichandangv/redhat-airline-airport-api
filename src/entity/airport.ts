import airportData from '../../data/airports.json';

// export type Airport1 = {
//   iata: string
// }
// export type AirportList = Ariport[]
// const airportJson = require('./airports.json') as AirportJSON[]

export class Airport {
  iata: string = '';
  icao: string = '';
  name: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  tz: string = '';
  elevation: number = 0;
  latitude: number = 0;
  longitude: number = 0;

  random() {
    const randomElement =
      airportData.airports[
        Math.floor(Math.random() * airportData.airports.length)
      ];
    let airport: Airport = new Airport();
    airport.name = randomElement.name;
    airport.iata = randomElement.iata;
    airport.icao = randomElement.icao;

    airport.city = randomElement.city;
    airport.country = randomElement.country;
    airport.elevation = randomElement.elevation;
    airport.latitude = randomElement.lat;
    airport.longitude = randomElement.lon;
    airport.state = randomElement.state;
    airport.tz = randomElement.tz;

    return airport;
  }

  distanceBetween(airport: Airport, unit: string = 'K') {
    let lat1 = this.latitude;
    let lon1 = this.longitude;
    let lat2 = airport.latitude;
    let lon2 = airport.longitude;

    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  static fromJSON(airportJSON: any): Airport {
    let airport: Airport = new Airport();
    airport.city = airportJSON.city;
    airport.country = airportJSON.country;
    airport.elevation = airportJSON.elevation;
    airport.iata = airportJSON.iata;
    airport.icao = airportJSON.icao;
    airport.latitude = airportJSON.lat;
    airport.longitude = airportJSON.lon;
    airport.name = airportJSON.name;
    airport.state = airportJSON.state;
    airport.tz = airportJSON.tz;

    return airport;
  }

  toJSON() {
    iata: this.iata;
    icao: this.icao;
    name: this.name;
    city: this.city;
    state: this.state;
    country: this.country;
    tz: this.tz;
    elevation: this.elevation;
    latitude: this.latitude;
    longitude: this.longitude;
  }
}
