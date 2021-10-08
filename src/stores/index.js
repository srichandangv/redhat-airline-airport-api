"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertAirportInCache = exports.getAirportInCache = void 0;
const config_1 = require("../config");
const client_1 = __importDefault(require("../datagrid/client"));
const airport_1 = require("../entity/airport");
const log_1 = __importDefault(require("../log"));
const getClient = client_1.default(config_1.DATAGRID_AIRPORT_DATA_STORE);
async function getAirportInCache(iata) {
    log_1.default.trace(`reading data for airport ${iata}`);
    const client = await getClient;
    const data = await client.get(iata);
    if (data) {
        try {
            return airport_1.Airport.fromJSON(JSON.parse(data));
        }
        catch {
            log_1.default.warn(`found airport data for "${iata}", but failed to parse to JSON: %j`, data);
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
exports.getAirportInCache = getAirportInCache;
async function upsertAirportInCache(airport) {
    const data = airport.toJSON();
    const client = await getClient;
    log_1.default.trace(`writing player to cache: %j`, data);
    return client.put(airport.iata, JSON.stringify(data));
}
exports.upsertAirportInCache = upsertAirportInCache;
//# sourceMappingURL=index.js.map