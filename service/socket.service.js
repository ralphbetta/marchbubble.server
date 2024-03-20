class SocketService {

    static initialize(server, app) {
  
      const io = require('socket.io')(server, {
        cors: {
          origin: "*",
          methods: ['GET', 'POST']
        }
      });
  
      app.set('io', io);
  
      io.use((socket, next) => {
        if (socket.handshake.query) {
          let callerId = socket.handshake.query.callerId;
          socket.user = callerId;
          next();
        }
      });
  
      io.on("connection", (socket) => {
  
        // console.log(socket.id, "Connected");
        socket.join(socket.user);
        console.log("connection userId ", socket.user)
  
        socket.emit('userId', socket.id)  //are we using this?
  
        socket.on("makeCall", (data) => {
          let calleeId = data.calleeId;
          let sdpOffer = data.sdpOffer;
  
          console.log(`call initiated with offerData ${JSON.stringify(data)}`);
  
          socket.to(calleeId).emit("newCall", {
            callerId: socket.user,
            sdpOffer: sdpOffer,
          });
        });
  
        socket.on("answerCall", (data) => {

          let callerId = data.callerId;
          let sdpAnswer = data.sdpAnswer;

          console.log("call answered with by", callerId, )
  
          socket.to(callerId).emit("callAnswered", {
            callee: socket.user,
            sdpAnswer: sdpAnswer,
          });
        });

        socket.on("endCall", (data) => {
          let calleeId = data.calleeId;
          
          console.log(`endcall initiated with offerData ${JSON.stringify(data)}`);
          socket.to(calleeId).emit("endCall", {message: "call ended"});

        });

        socket.on("sendMessage", (data) => {
          let calleeId = data.to;
        
          console.log(`new message initiated with offerData ${JSON.stringify(data)}`);
          socket.to(calleeId).emit("newMessage", data);

        });
  
  
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
          console.log(`${socket.id}- ${socket.user} just disconnected`);
        });
        
      });
  
  
  
    }
  }
  
  module.exports = SocketService;