import { Router } from 'express';
import customers from './app/controllers/CustomersController.js';
import contacts from './app/controllers/ContactController.js'

const routes = new Router();

routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.destroy);

routes.get("/contacts", contacts.list);
routes.get("/contacts/:id", contacts.show);
routes.post("/contacts", contacts.create);
routes.put("/contacts/:id", contacts.update);
routes.delete("/contacts/:id", contacts.delete);

export default routes;
