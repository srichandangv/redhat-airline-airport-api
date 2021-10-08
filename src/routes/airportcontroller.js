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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var url = require('url');
var faker = require('faker');
var airport_1 = require("../entity/airport");
var airports_json_1 = __importDefault(require("../../data/airports.json"));
var cache = __importStar(require("../stores"));
var log_1 = __importDefault(require("../log"));
var ScheduleController = (function () {
    function ScheduleController() {
        this.router = express.Router();
        this.path = '/airports';
        this.getAirport = function (request, response) {
            var code = request.params.code.toLowerCase();
            var airport = airports_json_1.default.airports.find(function (a) {
                return a.iata.toLowerCase() === code || a.icao.toLowerCase() === code;
            });
            response.send(airport);
        };
        this.intializeRoutes();
    }
    ScheduleController.prototype.intializeRoutes = function () {
        this.router.get(this.path, this.getAirports);
        this.router.get(this.path + '/code', this.getAirport);
    };
    ScheduleController.prototype.getAirports = function (request, response, next) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, airports, ex_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        promises = airports_json_1.default.airports.map(function (airportJson) {
                            return _this.getFromCache(airportJson);
                        });
                        return [4, Promise.all(promises)];
                    case 1:
                        airports = _a.sent();
                        response.send(airports);
                        return [3, 3];
                    case 2:
                        ex_1 = _a.sent();
                        next(ex_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    ScheduleController.prototype.getFromCache = function (airportJson) {
        return __awaiter(this, void 0, void 0, function () {
            var iata, airportObj, airport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iata = airportJson.iata;
                        airportObj = airport_1.Airport.fromJSON(airportJson);
                        if (!iata) return [3, 3];
                        log_1.default.info("retreiving airport from cache with " + iata);
                        return [4, cache.getAirportInCache(iata)];
                    case 1:
                        airport = _a.sent();
                        if (!!airport) return [3, 3];
                        log_1.default.info('Did not find ${iata} in cache, so now inserting airport: ${airportJson}');
                        return [4, cache.upsertAirportInCache(airportObj)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2, airportObj];
                }
            });
        });
    };
    return ScheduleController;
}());
exports.default = ScheduleController;
//# sourceMappingURL=airportcontroller.js.map