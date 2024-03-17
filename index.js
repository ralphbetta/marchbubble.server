const express = require("express");
const app = express();
const cors = require("cors");
const SocketService = require("./service/socket.service");

class Server {

    static boot() {

        const corsOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            preflightContinue: false,

            transports: ['websocket'],
            //allowedRequestHeaders: ['my-custom-header'], // Add any custom headers you need for WebSocket
        };

        app.use(cors(corsOptions));

        /*----------- DEFAULT ROUTE ----------------*/
        app.get("/", (req, res) => { res.json({ message: "Welcome to Node App" }) });


        const PORT = process.env.PORT || 8085;
        // const IP = process.env.IP || "192.168.0.185";
        // const IP = process.env.IP || "192.168.0.111";
        // const IP = "172.20.10.3";
        const IP = "127.0.0.1";

        /*--------------------------------------------------------
           ipconfig - windeows ond android
           mac and android - ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'
           replace same 4 client side
        --------------------------------------------------------- */


        const server = app.listen(PORT, IP, () => {
            console.log(`Server is running http://${IP}:${PORT}`);
            SocketService.initialize(server, app);
        });

    }

}


Server.boot();
