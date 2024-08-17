const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers["authorization"] || req.cookies.token;
        if (!token) {
            return res.send({ status: 401, message: "you are not authenticated." });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) {
                return res.send({ status: 403, message: "token is not valid." });
            }

            req.userId = data._id;
            next();
        });
    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
    }
}

module.exports = { verifyToken };