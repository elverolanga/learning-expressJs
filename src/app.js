import express from 'express';

//import authMiddleware from './app/middlewares/auth.js';

import routes from './routes.js';

import Database from './database/index.js';
class App {
    constructor(){
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: false}));
        //this.server.use(authMiddleware);
    }

    routes(){
        this.server.use(routes);
    }

    /*
    exceptionHandler()
    {
        this.server.use(async (err, req, res, next) => {
            if(process.env.NODE_ENV === "development")
            {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }
        })
    }
    */
}

export default new App().server;
