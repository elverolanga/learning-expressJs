import { Router } from 'express';
import customers from './app/controllers/CustomersController.js';
import contacts from './app/controllers/ContactsController.js';
import users from './app/controllers/UsersController.js';
import sessions from './app/controllers/SessionsController.js';

const routes = new Router();

routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.destroy);

routes.get("/customers/:customerId/contacts", contacts.list);
routes.get("/customers/:customerId/contacts/:id", contacts.show);
routes.post("/customers/:customerId/contacts", contacts.create);
routes.put("/customers/:customerId/contacts/:id", contacts.update);
routes.delete("/customers/:customerId/contacts/:id", contacts.delete);

routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);

routes.post("/sessions", sessions.create);

export default routes;
