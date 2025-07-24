import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import initSocketServer from './controller/socketserver.js';
import connectDB from './model/db.js';
import router from './routes/route.js';

const app = express();

// ✅ DB CONNECTION (do this before routes)
const { trainConnection } = await connectDB();
const trainDB = trainConnection.db;
app.locals.trainDB = trainDB; 

app.use(express.json());

// ✅ Routes after DB
app.use('/', router); // ✅ Don't move this above the DB connection

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
initSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
