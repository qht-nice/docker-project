const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const {RedisStore} = require("connect-redis")

const {
    MONGO_USER,
    MONGO_PASSWORD,  
    MONGO_PORT,
    MONGO_IP,
    REDIS_URL,
    SESSION_SECRET,
    REDIS_PORT
} = require("./config/config");

let redisClient = redis.createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT,
    },
});

let redisStore = new RedisStore({client: redisClient});

redisClient.connect().catch(console.error); // Ensure Redis client connects properly

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("Successfully connected to DB!!"))
        .catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Configure RedisStore properly
app.enable("trust proxy");
app.use(cors({}));
app.use(
    session({
        store: redisStore, // Attach RedisStore
        secret: SESSION_SECRET,        
        cookie: {
            resave: false, // Force lightweight session keep-alive
            saveUninitialized: false, // Save session only when data exists
            secure: false,
            httpOnly: true,
            maxAge: 60000
        }
    })
);

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>My DevOps project</h2>");
    console.log("WASSUP!!")
});

//localhost:4000/api/v1/posts/
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`listening on port ${port}`));
