import { Sequelize } from 'sequelize'
const db = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/database.db'
});
try {
  db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

db.sync()


export default db