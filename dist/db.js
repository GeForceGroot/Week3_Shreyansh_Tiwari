"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/data.db'
});
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}
db.sync();
exports.default = db;
//# sourceMappingURL=db.js.map