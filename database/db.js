const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (error) {
        console.log("datbase not connected.");
        console.log(error);
    }
}

module.exports = connectDB;