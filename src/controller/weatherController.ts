import { Weather } from "../model/weatherTable";
import db from '../model/db'
import { error } from "console";


// Save all the received information for all the cities in the postgres database using sequelize

async function AddNewData(city: any, country: any, weather: any, time: any, Longitude: any, Latitude: any) {
    try {
        const data = await Weather.create({
            city: city,
            country: country,
            weather: weather,
            time: time,
            Longitude: Longitude,
            Latitude: Latitude
        })
        return data
    } catch (error) {
        console.log(error);
    }
}

async function GetAllByCityData(city: any) {
    try {
        const data : any [] = await Weather.findAll({
            where: {
                city: city
            }
        })
        return data
    } catch (error) { }
    console.log(error)
}
async function GetAllData() {
    try {
        const data : any[] = await Weather.findAll()
        return data
    } catch (error) { }
    console.log(error)
}

db.sync()

export { AddNewData, GetAllData, GetAllByCityData }

