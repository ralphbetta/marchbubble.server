const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});

app.use(cors());


app.get("/", (req, res) => { res.json({ message: "Welcome to Node App" }) });

app.set('io', io);


io.use((socket, next) => {
  if (socket.handshake.query) {
    let callerId = socket.handshake.query.callerId;
    socket.user = callerId;
    next();
  }
});

io.on("connection", (socket) => {

    console.log(socket.id, "Connected");
    socket.join(socket.user);

    socket.emit('userId', socket.id)
  
    socket.on("makeCall", (data) => {
      let calleeId = data.calleeId;
      let sdpOffer = data.sdpOffer;
  
      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        sdpOffer: sdpOffer,
      });
    });
  
    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      let sdpAnswer = data.sdpAnswer;n
  
      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        sdpAnswer: sdpAnswer,
      });
    });
  
    socket.on("IceCandidate", (data) => {
      let calleeId = data.calleeId;
      let iceCandidate = data.iceCandidate;
  
      socket.to(calleeId).emit("IceCandidate", {
        sender: socket.user,
        iceCandidate: iceCandidate,
      });
    });
  });
  
  const PORT = process.env.PORT || 8080;

  const IP = process.env.IP || "192.168.0.111";
  
  
  server.listen(PORT, IP, () => console.log(`Server is running on port ${PORT}`));