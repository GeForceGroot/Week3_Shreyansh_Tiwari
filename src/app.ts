import express, { Request, Response } from 'express'
import axios from 'axios';
import { AddNewData, GetAllData, GetAllByCityData } from './controller/weatherController'
import db from './model/db'
import { error } from 'console';
import nodemailer from 'nodemailer'
import { json } from 'sequelize';

const app = express()
// body parrser
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('server is runnig')
})




app.post('/api/SaveWeatherMapping', async (req: Request, res: Response) => {
    var dataArray = req.body.data
    var result: any[] = [];
    dataArray.forEach(async (element: any) => {

        // A. Api will make axios request to GeoCoding api for finding the coordinates https://api-ninjas.com/api/geocoding

        var url = `https://api.api-ninjas.com/v1/geocoding?city=${element.city}&country=${element.country}`
        var weatherData: any = await axios.get(url, {
            headers: {
                'X-Api-Key': '5JXiTrb732ODHB9nwFhgSQ==Bs6OlCsxC6YnceOy',
            }
        })

        // B. Once coordinates are fetched , the data will be used to find weather of all the cities in the list. https://rapidapi.com/weatherapi/api/weatherapi-com/

        weatherData.data.forEach(async (element: any) => {
            const urlN = 'https://weatherapi-com.p.rapidapi.com/current.json';
            const response = await axios.get(urlN, {
                params: {
                    q: `${element.latitude},${element.longitude}`
                },
                headers: {
                    'X-RapidAPI-Key': 'b6786decd2mshb978dc4934ada1ap14af93jsn6732153fc079',
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                }
            })
            const TableData: any = await AddNewData(response.data.location.name, response.data.location.country, response.data.current.condition.text, response.data.current.last_updated, response.data.location.lon, response.data.location.lat)
            console.log(TableData.dataValues)
            result.push(TableData.dataValues)
            db.sync()
        })
    });
    res.send({result})
});

// GET request with route (’/api/weatherDashboard’)

//  a. If city parameter then response should be all data related to city
//  b. If no parameter , all the cities available (with only latest weather conditions )
app.get('/weatherDashboard/:cityName?', async (req: Request, res: Response) => {
    var cityName = req.params.cityName
    try {
        if (cityName) {
            const result: any = await GetAllByCityData(cityName);
            if (result) {
                res.send(result[result.length - 1])
            } else {
                console.log(error)
            }
        } else {
            const allCitiesData = await GetAllData();
            if (allCitiesData) {
                res.send(allCitiesData);
            } else {
                res.status(404).send({ error: 'No data found for any cities' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing your request' });
    }

})


// C. Mailing api that will have request body same like above api 
// It will mail the data in form of table (same columns like dashboard)

app.post('/send-email', (req: Request, res: Response) => {
    const data = req.body.data;
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'marlee.hagenes@ethereal.email',
            pass: '5ekzDqdy118Rrv5w2P'
        }
    });

    let table = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">';
    table += `
            <tr>
                <th>id</th>
                <th>city</th>
                <th>country</th>
                <th>weather</th>
                <th>time</th>
                <th>Longitude</th>
                <th>Latitude</th>
            </tr>
        `;
    data.forEach((element: any) => {
        var item: any = GetAllByCityData(element.city)
        table += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.city}</td>
                    <td>${item.country}</td>
                    <td>${item.weather}</td>
                    <td>${item.time}</td>
                    <td>${item.Longitude}</td>
                    <td>${item.Latitude}</td>
                </tr>
            `;
    });
    table += '</table>';
    var mailOptions = {
        from: 'marlee.hagenes@ethereal.email',
        to: 'tiwarishreyansh3@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html: `<h1>Weather Data</h1>${table}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

})

app.listen(8000, () => {
    console.log('server is running on http://localhost:8000')
})

