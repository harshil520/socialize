const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { email, password, userName } = req.body;
        const isUserNameExist = await User.findOne({ userName });

        if (isUserNameExist) {
            return res.send({ status: 400, message: "userName is already exist." });
        }

        const isUserEmailExist = await User.findOne({ email });
        if (isUserEmailExist) {
            return res.send({ status: 400, message: "email is already exist." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = new User({ ...req.body, password: hashPassword });
        const save = await user.save();
        res.send({ status: 201, message: save });
    } catch (error) {
        res.send({ status: 500, message: "Data not saved." });
        console.log(error);
    }
}


const login = async (req, res) => {
    try {
        const { user, password } = req.body;

        let findUser = await User.findOne({ userName: user });

        if (!findUser) {
            findUser = await User.findOne({ email: user });
        }

        if (!findUser) {
            return res.send({ status: 404, message: "User not found." });
        }

        const matchPassword = await bcrypt.compare(password, findUser.password);
        if (!matchPassword) {
            return res.send({ status: 401, message: "Incorrect password." });
        }

        const token = jwt.sign({ _id: findUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.cookie("token", token).send({ status: 200, message: "Logged in successfull." });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).send({ status: 200, message: "Logged out successfull." });;
    } catch (error) {
        res.send({ status: 500, message: "Internam server error." });
        console.log(error);
    }
}

const refetch = async (req, res) => {
    try {
        const token = req.cookies.token;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            console.log(data);
            if (err) {
                return res.send({ status: 404, message: "token not found." });
            }

            const id = data._id;
            const user = await User.findOne({ _id: id });
            res.send({ status: 200, message: user });
        })
    } catch (error) {
        res.send({ status: 500, message: "Internam server error." });
        console.log(error);
    }
}

module.exports = { register, login, logout, refetch };