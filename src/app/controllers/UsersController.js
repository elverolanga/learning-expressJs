import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import * as Yup from 'yup';

import User from '../models/User.js'

class UsersController
{
    async index(req, res)
    {
        const {
            name,
            email,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        const page = req.params.page || 1;
        const limit = req.params.limit || 25;

        let where = {}
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

        const data = await User.findAll(
        {
            where,
            order,
            limit,
            offset: limit * page - limit,
            attributes: {
                exclude: ['password_hash', 'password', 'id']
            }
        });

        console.log({userId: req.userId});
        return res.status(200).json(data);
    }

    async show(req, res)
    {
        const data = await User.findByPk(req.params.id);

        if(data){
            return res.status(200).json(data);
        }

        return res.status(404).json('User not found!');
    }

    async create(req, res)
    {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),

            passwordConfirmation: Yup.string().required().oneOf([Yup.ref('password')]),
        });

        console.log(`before: ${JSON.stringify(req.body)}`);

        if(!(await schema.isValid(req.body)))
        {
            return res.status(400).json({error: "Invalid user schema!"});
        }

        const {name, email, password} = req.body;
        const user = await User.create({name, email, password});

        const {createdAt, updatedAt} = user;
        //console.log({id, name, email, createdAt, updatedAt});
        return res.status(201).json({name, email, createdAt, updatedAt});
    }

    async update(req, res)
    {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(8),
            password: Yup.string()
            .min(8)
            .when('oldPassword', (oldPassword, field) => {
                oldPassword ? field.required() : field
            }),

            passwordConfirmation: Yup.string().when('password', (password, field) => {
                password ? field.required().oneOf([Yup.ref('password')]) : field
            })
        });

        console.log(`before: ${JSON.stringify(req.body)}`);

        if(!(await schema.isValid(req.body)))
        {
            return res.status(400).json({error: "Invalid user schema!"});
        }

        const user = await User.findByPk(req.params.id);
        if(!user)
        {
            return res.status(404).json();
        }

        const { oldPassword} = req.body;

        if(oldPassword && !(await user.checkPassword(oldPassword)))
        {
            return res.status(401).json({error: "Password don't match!"});
        }

        const {name, email, createdAt, updatedAt} = await user.update(req.body);

        return res.status(201).json({name, email, createdAt, updatedAt});

    }

    async delete(req, res)
    {
        const user = await User.findByPk(req.params.id);

        if(!user)
        {
            return res.status(404).json({error: "User not found!"});
        }

        await user.destroy();
        return res.status(200).json('User deleted successfully!')
    }
}

export default new UsersController();
