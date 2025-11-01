import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import { UserRouter } from "./src/Routes/user.route.js";
import { CaptainRouter } from "./src/Routes/captain.route.js";
import { MapRouter } from "./src/Routes/maps.routes.js";
import { RideRouter } from "./src/Routes/rides.routes.js";

const app = express();

app.use(cors({
    credentials : true,
}))

app.use(express.json())

app.use(express.urlencoded({
    extended : true
}))


app.use(cookieParser())
app.use(express.static('public'))


app.use('/api/users' , UserRouter);
app.use('/api/captains',CaptainRouter)
app.use('/api/maps', MapRouter)
app.use('/api/rides' , RideRouter)

export {app}