const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// 🎯 Changed from 'import' to 'require'
const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST", "PATCH"]
    }
});

// Share socket.io with controllers
app.set('socketio', io);

app.use(cors());
app.use(express.json());

// 🎯 Use the routes
app.use('/experts', expertRoutes); 
app.use('/bookings', bookingRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ MongoDB error:', error));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

io.on('connection', (socket) => {
    console.log('⚡ User connected');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});