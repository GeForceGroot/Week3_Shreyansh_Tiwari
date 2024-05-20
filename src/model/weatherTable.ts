import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

// The data that will be saved in the database will look like -

//  id | city | country | weather | time(Time at which data is saved) | Longitude | Latitude

interface WeatherAttributes {
    id?: number;
    city: string;
    country: string;
    weather: string;
    time: string;
    Longitude: number;
    Latitude: number;
}

class Weather extends Model<WeatherAttributes> implements WeatherAttributes {
    public id!: number;
    public city!: string;
    public country!: string;
    public weather!: string;
    public time!: string;
    public Longitude!: number;
    public Latitude!: number;

}

Weather.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        weather: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Longitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Latitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'weather',
        timestamps: false
    }
)

export { Weather }