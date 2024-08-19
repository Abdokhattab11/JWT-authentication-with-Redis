const mongoose = require("mongoose");

const app = require("./app")
const redisClient = require("./service/redisService");


// Connect To Redis Client
redisClient.connect().then(r => {
    console.log("Redis Server is connected")
}).catch(() => {
    console.log("Error Connecting to Redis")
})

mongoose.connect("mongodb://localhost:27017/Auth")
    .then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
    console.log("Database connection failed");
    console.log(err);
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})