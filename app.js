import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 8000;

const SERVER = createServer(app);
const io = new Server(SERVER, {
    cors: {
        origin: "http://192.168.1.192:8080", 
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});


const __dirname = path.resolve();


app.use(express.static(__dirname + '/public/'));
// app.use('/public/build')

app.get('/littlemodel', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/littletokyo/index.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/testhologram/index.html'));
});


io.on('connection', (socket) => {
    console.log('User Connected');

    var city_choice = "";

    socket.on("city", (data) => {
        city_choice = data;
        if (city_choice) {
            console.log(city_choice);
            io.emit('city', data);
        }
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected");
    });

    socket.on("message", (message) => {
        if (message) {
            io.emit("my broadcast", `server: ${message}`);
            console.log("message" + message);
        }
    });
})

app.use(
cors({
    methods: ["POST", "GET"],
    origin: 'http://192.168.1.192:8080',
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//app.use(bodyParser);
app.use(cookieParser());


SERVER.listen(PORT, "192.168.1.192", () => {
    console.log("Server is running on " + PORT)
});

