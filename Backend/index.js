import { ConnectDB } from "./src/Database/database.connect.js";
import dotenv from 'dotenv'
import { app} from "./app.js";
import { initializeSocket } from "./socket.js";
import http from 'http'

dotenv.config();

const port = process.env.PORT || 8000

ConnectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(error?.message);
            process.exit(1);
        });

        const server = http.createServer(app)
        initializeSocket(server);

        server.listen(port, () => console.log(`server is running on http://localhost:${port}`));
    })
    .catch((err) => {
        console.log(err);
    })