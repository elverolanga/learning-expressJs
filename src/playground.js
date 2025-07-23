import Database from "./database/index.js";
import Customer from './app/models/Customer.js';
import {Op} from 'sequelize';

class Playground
{
    static async play()
    {
        /*const customer = await Customer.findOne();

        console.log(`\n\nThe customer: ${JSON.stringify(customer, null, 2)}\n\n`);*/

        const customers = await Customer.findAll({
            where:{
                id: {
                    [Op.gt]: 1
                }
            },
            attributes: {
                exclude: ['email', 'createdAt', 'updatedAt']
            }
        });

        console.log(JSON.stringify(customers, null, 2));

    }
}

Playground.play();

