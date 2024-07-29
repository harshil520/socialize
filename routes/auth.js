const { Router } = require("express");
const authController = require("../controller/auth");

const authRoute = Router();

authRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "Auth Route." });
});

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.get("/logout", authController.logout);
authRoute.get("/refetch", authController.refetch);

module.exports = authRoute;