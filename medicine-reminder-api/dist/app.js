"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://mediping.netlify.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const user_route_1 = __importDefault(require("./routers/user.route"));
app.use("/api", user_route_1.default);
const medicine_route_1 = __importDefault(require("./routers/medicine.route"));
app.use("/api", medicine_route_1.default);
const notification_route_1 = __importDefault(require("./routers/notification.route"));
app.use("/api", notification_route_1.default);
app.post("/jwt", async (req, res) => {
    const user = req.body;
    if (!jwt_config_1.default.jwtSecret) {
        return res.status(500).json({ error: "JWT secret not configured" });
    }
    const token = jsonwebtoken_1.default.sign(user, jwt_config_1.default.jwtSecret, { expiresIn: jwt_config_1.default.jswExpire });
    res.send({ token });
});
app.get("/", async (_, res) => {
    res.send("Hello");
});
exports.default = app;
