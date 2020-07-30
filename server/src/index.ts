import express from "express";
import cors from 'cors';
import helmet from "helmet";
import bodyparser from "body-parser";
import router from "./routes/index";
import { sequlize } from "./database";
const app = express();
const port = 8080; // default port to listen

app.use(cors());
app.use(helmet());

app.use(bodyparser.json());
app.use('/api', router);

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
    sequlize.authenticate().then(async() => {
        console.log("database connected")

        try {
            await sequlize.sync({alter: true})
        } catch (error) {
            console.log(error.message)
        }

    }).catch( (e: any) => {
        console.log(e.message)
    })
} );