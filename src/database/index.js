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
    }

    init(){
        models.forEach(model => model.init(this.connection));
    }
}

export default new Database();
