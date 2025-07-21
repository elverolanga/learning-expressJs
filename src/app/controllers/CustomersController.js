import Customer from '../models/Customer.js';
import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import Contact from '../models/Contact.js'
import * as Yup from 'yup';

class CustomersController {
    //List's all customers
    async index(req, res) {
        //all the expected query parameters
        const {
            name,
            email,
            status,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        //page and limit [1 page displays {limit} items]
        const page = req.query.page || 1;
        const limit = req.query.limit || 25;

        //where is the query 'object'
        let where = {};
        let order = [];

        //here I'm just verifiying the valid query params
        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name,
                },
            };
        }
        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email,
                },
            };
        }
        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: status
                        .split(',')
                        .map((item) => item.toUpperCase()),
                },
            };
        }
        if (createdBefore) {
            where = {
                ...where,
                createdAt: {
                    //Op.gte[Operator:Greater than or equal to]
                    //parseIso is used to format date
                    [Op.gte]: parseISO(createdBefore),
                },
            };
        }

        if (createdAfter) {
            where = {
                ...where,
                createdAt: {
                    [Op.gte]: parseISO(createdAfter),
                },
            };
        }
        if (updatedBefore) {
            where = {
                ...where,
                updatedAt: {
                    [Op.gte]: parseISO(updatedBefore),
                },
            };
        }

        if (updatedAfter) {
            where = {
                ...where,
                updatedAt: {
                    [Op.gte]: parseISO(updatedAfter),
                },
            };
        }
        //localhost:PORT/PATH?sort=id:desc.name
        //order = {['name', 'asc'], ['email', 'desc']}
        if(sort){
            //the sort param is used to build our order obj.
            order = sort.split(',').map(item => item.split(':'));
        }
        const data = await Customer.findAll({
            where,
            include: [
                {
                    model: Contact,
                    as:'contacts',
                    attributes: ['id'],
                }
            ],
            order,
            limit,
            //the offset here is the 'amout' of items to display
            offset: limit * page - limit
        });

        return res.json(data);
    }

    //Show's a certain customer
    async show(req, res) {
        const id = parseInt(req.params.id);
        const data = await Customer.findByPk(id);
        if(data){
            return res.status(200).json(data);
        }

        return res.status(404).json('User not found!');
    }

    //Registers a new customer
    async create(req, res) {

        const schema = Yup.object().shape(
            {
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                status: Yup.string().uppercase(),
            }
        )

        if(!(await schema.isValid(req.body))){
            return res.status(400).json('Error on validating Schema!');
        }
        const customer = await Customer.create(req.body);
        return res.status(201).json(customer);
    }

    //Update's a customer
    async update(req, res) {
         const schema = Yup.object().shape(
            {
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                status: Yup.string().uppercase(),
            }
        )

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Error on validating Schema!"});
        }

        const data = await Customer.findByPk(req.params.id);
        if(!data){
            return res.status(404).json({error: "Invalid customer id"});
        }

        await data.update(req.body);
        return res.status(200).json(data);
    }

    //Removes the customer
    async destroy(req, res) {
        const data = await Customer.findByPk(req.params.id);
        if(!data){
            return res.status(404).json({error: "Invalid customer id"});
        }

        await data.destroy();
        return res.status(200).json('Customer deleted successfully');
    }
}

export default new CustomersController();
