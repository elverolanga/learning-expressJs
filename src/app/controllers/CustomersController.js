let customers = [
            {id: 1, name: "Martin Langa", email:"martinlanga@example.com"},
            {id: 2, name: "Elvero M", email: "elvero@example.com"},
            {id: 3, name: "John Doe", email: "johndoe@unknown.com"}
        ]

import Customer from "../models/Customer.js";

class CustomersController {
    //List's all customers
    async index(req, res){
        const data = await Customer.findAll({
            limit: 1000
        });

        return res.json(data);
    }

    //Show's a certain customer
    show(req, res){
        const id = parseInt(req.params.id);
        const customer = customers.find(customer => customer.id === id);
        const status = customer ? 200 : 404;
        return res.status(status).json(customer);
    }

    //Registers a new customer
    create(req, res){
        const {name, email} = req.body;
        const id = customers[customers.length - 1].id + 1;
        const newCustomer = {
            id,
            name,
            email
        }

        customers.push(newCustomer);

        return res.status(201).json(newCustomer);
    }

    //Update's a customer
    update(req, res){
        const id = parseInt(req.params.id);
        const {name, email} = req.body;

        const index = customers.findIndex(customer => customer.id === id);
        const status = index >= 0 ? 200 : 404;

        if(index > 0){
            customers[index] = {id: parseInt(id), name, email}
        }

        return res.status(status).json(customers[index]);
    }

    //Removes the customer
    destroy(req, res){
        const id = parseInt(req.params.id);
        const index = customers.findIndex(customer => customer.id === id);
        const status = index >= 0 ? 200 : 404;

        if(index > 0){
            customers.splice(index, 1);
        }

        return res.status(status).json();
    }
}

export default new CustomersController();
