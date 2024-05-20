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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const weatherController_1 = require("./controller/weatherController");
const db_1 = __importDefault(require("./model/db"));
const console_1 = require("console");
const app = (0, express_1.default)();
// body parrser
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('server is runnig');
});
app.post('/api/SaveWeatherMapping', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var dataArray = req.body.data;
    var result = [];
    dataArray.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
        // A. Api will make axios request to GeoCoding api for finding the coordinates https://api-ninjas.com/api/geocoding
        var url = `https://api.api-ninjas.com/v1/geocoding?city=${element.city}&country=${element.country}`;
        var weatherData = yield axios_1.default.get(url, {
            headers: {
                'X-Api-Key': '5JXiTrb732ODHB9nwFhgSQ==Bs6OlCsxC6YnceOy',
            }
        });
        // B. Once coordinates are fetched , the data will be used to find weather of all the cities in the list. https://rapidapi.com/weatherapi/api/weatherapi-com/
        weatherData.data.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
            const urlN = 'https://weatherapi-com.p.rapidapi.com/current.json';
            const response = yield axios_1.default.get(urlN, {
                params: {
                    q: `${element.latitude},${element.longitude}`
                },
                headers: {
                    'X-RapidAPI-Key': 'b6786decd2mshb978dc4934ada1ap14af93jsn6732153fc079',
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                }
            });
            const TableData = yield (0, weatherController_1.AddNewData)(response.data.location.name, response.data.location.country, response.data.current.condition.text, response.data.current.last_updated, response.data.location.lon, response.data.location.lat);
            console.log(TableData.dataValues);
            result.push(TableData.dataValues);
            db_1.default.sync();
        }));
    }));
    res.send({ result });
}));
// GET request with route (’/api/weatherDashboard’)
//  a. If city parameter then response should be all data related to city
//  b. If no parameter , all the cities available (with only latest weather conditions )
app.get('/weatherDashboard/:cityName?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var cityName = req.params.cityName;
    try {
        if (cityName) {
            const result = yield (0, weatherController_1.GetAllByCityData)(cityName);
            if (result) {
                res.send(result[result.length - 1]);
            }
            else {
                console.log(console_1.error);
            }
        }
        else {
            const allCitiesData = yield (0, weatherController_1.GetAllData)();
            if (allCitiesData) {
                res.send(allCitiesData);
            }
            else {
                res.status(404).send({ error: 'No data found for any cities' });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing your request' });
    }
}));
// C. Mailing api that will have request body same like above api 
// It will mail the data in form of table (same columns like dashboard)
// app.post('/send-email', (req: Request, res: Response) => {
//     const data = req.body.data;
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         auth: {
//             user: 'marlee.hagenes@ethereal.email',
//             pass: '5ekzDqdy118Rrv5w2P'
//         }
//     });
//     let table = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">';
//     table += `
//             <tr>
//                 <th>id</th>
//                 <th>city</th>
//                 <th>country</th>
//                 <th>weather</th>
//                 <th>time</th>
//                 <th>Longitude</th>
//                 <th>Latitude</th>
//             </tr>
//         `;
//     data.forEach((element: any) => {
//         var item: any = GetAllByCityData(element.city)
//         table += `
//                 <tr>
//                     <td>${item.id}</td>
//                     <td>${item.city}</td>
//                     <td>${item.country}</td>
//                     <td>${item.weather}</td>
//                     <td>${item.time}</td>
//                     <td>${item.Longitude}</td>
//                     <td>${item.Latitude}</td>
//                 </tr>
//             `;
//     });
//     table += '</table>';
//     var mailOptions = {
//         from: 'marlee.hagenes@ethereal.email',
//         to: 'tiwarishreyansh3@gmail.com',
//         subject: 'Sending Email using Node.js',
//         text: 'That was easy!',
//         html: `<h1>Weather Data</h1>${table}`
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     })
// })
app.listen(8000, () => {
    console.log('server is running on http://localhost:8000');
});
//# sourceMappingURL=app.js.map