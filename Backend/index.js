import { ConnectDB } from "./src/Database/database.connect.js";
import dotenv from 'dotenv'
import { app} from "./app.js";

dotenv.config();

const port = process.env.PORT || 8000 || 9000 || 5173

ConnectDB()
    .then( () => {
        app.on('error' , (error) => {
            console.log(error?.message)
            process.exit(1)
        })

        app.listen(port , () => console.log(`server is running on ${port}`))
    })
    .catch( (err) => {
        console.log(err);
    })