"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const url = require('url');
var faker = require('faker');
const airport_1 = require("../entity/airport");
const airports_json_1 = __importDefault(require("../../data/airports.json"));
const cache = __importStar(require("../stores"));
const log_1 = __importDefault(require("../log"));
class ScheduleController {
    constructor() {
        this.router = express.Router();
        this.path = '/airports';
        this.getAirport = (request, response) => {
            const code = request.params.code.toLowerCase();
            const airport = airports_json_1.default.airports.find((a) => {
                return a.iata.toLowerCase() === code || a.icao.toLowerCase() === code;
            });
            response.send(airport);
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAirports);
        this.router.get(this.path + '/code', this.getAirport);
    }
    async getAirports(request, response, next) {
        try {
            const promises = airports_json_1.default.airports.map((airportJson) => {
                return this.getFromCache(airportJson);
            });
            let airports = await Promise.all(promises);
            response.send(airports);
        }
        catch (ex) {
            next(ex);
        }
    }
    async getFromCache(airportJson) {
        let iata = airportJson.iata;
        let airportObj = airport_1.Airport.fromJSON(airportJson);
        if (iata) {
            log_1.default.info(`retreiving airport from cache with ${iata}`);
            let airport = await cache.getAirportInCache(iata);
            if (!airport) {
                log_1.default.info('Did not find ${iata} in cache, so now inserting airport: ${airportJson}');
                await cache.upsertAirportInCache(airportObj);
            }
        }
        return airportObj;
    }
}
exports.default = ScheduleController;
//# sourceMappingURL=airportcontroller.js.map