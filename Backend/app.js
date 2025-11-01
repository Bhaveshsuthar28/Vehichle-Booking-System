import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import { UserRouter } from "./src/modules/users/user.route.js";
import { CaptainRouter } from "./src/modules/captains/captain.route.js";
import { MapRouter } from "./src/modules/maps/maps.route.js";
import { RideRouter } from "./src/modules/rides/ride.route.js";

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