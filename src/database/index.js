import { Sequelize } from "sequelize";
import 'dotenv/config';
import config from '../config/database.cjs';

import Customer from '../app/models/Customer.js';
import User from '../app/models/User.js';
import Contact from '../app/models/Contact.js';

const models = [Customer, Contact, User];

class Database {
    constructor(){
        this.connection = new Sequelize(config)
        this.init();
        this.associate();
    }

    init(){
        models.forEach(model => model.init(this.connection));
    }

    associate(){
        models.forEach(model => {
            if(model.associate){
                model.associate(this.connection.models);
            }
        });
    }
}

export default new Database();
