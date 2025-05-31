import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.routes'; // Adjust the import path as necessary
import addressRouter from './routes/address.routes'; // Adjust the import path as necessary
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//global middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory


app.get('/', (_req, res) => {
  res.send('🚀 Server is running with TypeScript + Express + Prisma!');
});

app.use("/api/auth/", authRouter);
app.use("/api/address/",addressRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
