const socket = require("socket.io");

class SocketService {

    static initialize(server, app) {

        const io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        app.set('io', io);

        const activeUsers = new Set();


        io.on("connection", async function (socket) {

            // const socketConnections = await io.local.fetchSockets();
            // const connectionIds = socketConnections.map((socket) => socket.id);
             console.log(`${socket.id} just connected`);

            // const message = { message: `${socket.id} Just joined` }
            // socket.broadcast.emit('joined', message);

            // //----------------- Request to join room
            // socket.on('roomRequest', (roomId) => {
            //     socket.join(roomId);
            // });

            // //----------------- leave room || same for on disconnect
            // socket.on('roomExit', (roomId) => {
            //     socket.leave(roomId);
            // });

            // //----------------- Monitor new connection || broadcast new ids
            // socket.on("newConnection", function (data) {
            //     socket.broadcast.emit('updatedConnections', connectionIds)
            // });

            // //----------------- Monitor and emit messages
            // socket.on("sendMessage", function (data) {

            //     io.emit("newMessage", data);
            // });

            // //----------------- Monitor chat to room
            // socket.on("sendRoomMessage", function (data) {
            //     const { roomId, message } = data;
            //     io.to(roomId).emit('newRoomMessage', message);

            // });

            // //----------------- Monitor typing broadcast
            // socket.on("typing", function (data) {
            //     socket.broadcast.emit("typing", data);
            // });


            /*---------   VIDEO CALL HANDLING -----------*/

            /*-----------------------------------------------------------
             Monitor incoming | and emit to the receivers via (calleeId)
            ----------------------------------------------------------*/

            socket.on("makeCall", (data) => {
                let calleeId = data.calleeId;
                let sdpOffer = data.sdpOffer;

                console.log(`FROM SERVER: call request made to ${calleeId}`);

                socket.to(calleeId).emit("newCall", {
                    callerId: socket.user,
                    sdpOffer: sdpOffer,
                });
            });

            /*------------------------------------------------------------
             Monitor answered call | and emit to the sender via (callerId)
            -------------------------------------------------------------*/

            socket.on("answerCall", (data) => {
                let callerId = data.callerId;
                let sdpAnswer = data.sdpAnswer; n

                socket.to(callerId).emit("callAnswered", {
                    callee: socket.user,
                    sdpAnswer: sdpAnswer,
                });
            });

            /*------------------------------------------------------------
            Monitor answered call | and emit to the sender via (callerId)
           -------------------------------------------------------------*/

            socket.on("answerCall", (data) => {
                let callerId = data.callerId;
                let sdpAnswer = data.sdpAnswer; n

                socket.to(callerId).emit("callAnswered", {
                    callee: socket.user,
                    sdpAnswer: sdpAnswer,
                });
            });

            /*------------------------------------------------------------
             Monitor 
            -------------------------------------------------------------*/

            socket.on("IceCandidate", (data) => {
                let calleeId = data.calleeId;
                let iceCandidate = data.iceCandidate;

                socket.to(calleeId).emit("IceCandidate", {
                    sender: socket.user,
                    iceCandidate: iceCandidate,
                });
            });

            //----------------- Monitor Disconnections
            socket.on("disconnect", () => {
                const message = { message: `${socket.id} Just left` }
                socket.broadcast.emit('left', message);
                // socket.broadcast.emit('updatedConnections', connectionIds)
                console.log(`${socket.id} just disconnected`);
            });
        });


    }
}


module.exports = SocketService;
