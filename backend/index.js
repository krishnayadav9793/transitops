import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import http from 'http';
import apiRouter from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import { initWebSocket } from './src/config/socket.js';

configDotenv();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Server is Working fine ✅");
});


app.use(errorHandler);


const server = http.createServer(app);


initWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[TransitOps Server] running on http://localhost:${PORT}`);
});

