const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const v1 = require("./routes/v1");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/v1", v1);

app.get("/", (req, res) => {
    res.send("Initial route.");
})

app.listen(3000, () => {
    connectDB();
    console.log("database connected.");
    console.log("app is running on port 3000");
});