"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllByCityData = exports.GetAllData = exports.AddNewData = void 0;
const weatherTable_1 = require("../model/weatherTable");
const db_1 = __importDefault(require("../model/db"));
const console_1 = require("console");
// Save all the received information for all the cities in the postgres database using sequelize
function AddNewData(city, country, weather, time, Longitude, Latitude) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield weatherTable_1.Weather.create({
                city: city,
                country: country,
                weather: weather,
                time: time,
                Longitude: Longitude,
                Latitude: Latitude
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.AddNewData = AddNewData;
function GetAllByCityData(city) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield weatherTable_1.Weather.findAll({
                where: {
                    city: city
                }
            });
            return data;
        }
        catch (error) { }
        console.log(console_1.error);
    });
}
exports.GetAllByCityData = GetAllByCityData;
function GetAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield weatherTable_1.Weather.findAll();
            return data;
        }
        catch (error) { }
        console.log(console_1.error);
    });
}
exports.GetAllData = GetAllData;
db_1.default.sync();
//# sourceMappingURL=weatherController.js.map