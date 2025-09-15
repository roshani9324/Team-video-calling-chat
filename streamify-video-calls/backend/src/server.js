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
/* 1️⃣  connect to DB before mounting routes */
connectDB()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1); // stop if DB not available
  });

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://team-video-calling-chat-frontend.vercel.app/api", // your frontend domain
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

/* 6️⃣  error handler to see real errors */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Server Error" });
});

/* 7️⃣  start server locally */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//module.exports = app;
