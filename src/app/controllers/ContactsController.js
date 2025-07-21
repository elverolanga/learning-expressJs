import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import * as Yup from 'yup';
import Contact from '../models/Contact.js';
import Customer from '../models/Customer.js';

class ContactsController {

    async create(req, res){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            status: Yup.string().uppercase(),
            //customer_id: Yup.number().required()
        });

        if(!(await schema.isValid(req.body)))
        {
            return res.status(400).json({error: "Invalid contact schema!"});
        }

        const contact = await Contact.create({
            customer_id: req.params.customerId,
            ...req.body,
        });
        return res.status(201).json(contact);
    }

    async list(req, res){
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

        const page = req.params.page || 1;
        const limit = req.params.limit || 25;

        let where = {
            customer_id: req.params.customerId,
        };
        let order = [];

        if(name)
        {
            where = {
                ...where,
                name: {
                    [Op.like]: name,
                },
            }
        }

        if(email)
        {
            where = {
                ...where,
                email: {
                    [Op.like]: email,
                },
            }
        }

        if(status)
        {
            where = {
                ...where,
                status: {
                    [Op.in]: status.split(",").map(item => item.toUpperCase()),
                },
            }
        }

        if(createdBefore)
        {
            where = {
                ...where,
                createdBefore: {
                    [Op.gte]: parseISO(createdBefore),
                },
            }
        }
        if(updatedBefore)
        {
            where = {
                ...where,
                updatedBefore: {
                    [Op.gte]: parseISO(updatedBefore),
                },
            }
        }

        if(createdAfter)
        {
            where = {
                ...where,
                createdAfter: {
                    [Op.gte]: parseISO(createdAfter),
                },
            }
        }

        if(updatedAfter)
        {
            where = {
                ...where,
                updatedAfter: {
                    [Op.gte]: parseISO(updatedAfter),
                },
            }
        }

        if(sort)
        {
            order = sort.split(',').map(item => item.split(":"));
        }

        const data = await Contact.findAll(
        {
            where,
            order,
            limit,
            offset: limit * page - limit,
        });


        return res.status(200).json(data);
    }
    async show(req, res){
        const data = await Contact.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id
            },
            attributes: {
                exclude: ['customer_id', 'customerId']
            }
        });

        if(data){
            return res.status(200).json(data);
        }

        return res.status(404).json('User not found!');
    }

    async update(req, res)
    {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required,
            status: Yup.string().uppercase(),
            customer_id: Yup.number().required()
        });

        const data = await Contact.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id
            },
            include: [Customer]
        });

        if(data)
        {
            return res.status(200).json(data);
        }

        if(!(await schema.isValid(req.body)))
        {
            return res.status(400).json('Invalid schema validation')
        }

        await data.update(res.body);
        return res.status(200).json(data);
    }

    async delete(req, res){
        const data = await Contact.findByPk(req.params.id);
        if(!data){
            return res.status(404).json({error: "Invalid Contact id"});
        }

        await data.destroy();
        return res.status(200).json('Contact deleted successfully');
    }
}

export default new ContactsController();
