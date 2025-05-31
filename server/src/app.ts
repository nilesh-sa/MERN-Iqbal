import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//global middlewares
app.use(cors());
app.use(express.json());


app.get('/', (_req, res) => {
  res.send('🚀 Server is running with TypeScript + Express + Prisma!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
