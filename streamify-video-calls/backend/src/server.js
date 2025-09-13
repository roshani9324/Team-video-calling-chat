import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app", // your frontend domain
    ],
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
// let isConnected = false;
// async function connectToMongoDB(){
//   try{
//     await mongoose.connect(process.env.MONGO_URI),{
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };
//     isConnected = true;
//     console.log("Connected to MongoDB");
//   } catch(error){
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// app.use((req,res,next)=>{
//   if(!isConnected){
//     connectToMongoDB();
//   }
//   next();

// })

app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
  error : false
  })
})

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
  connectDB();
 });

//module.exports = app;
