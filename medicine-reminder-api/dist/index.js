"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET_KEY;
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
if (!jwtSecret) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}
if (!allowedOriginsEnv) {
    console.error("FATAL ERROR: ALLOWED_ORIGINS is not defined in environment variables. e.g., 'https://mediping.netlify.app,http://localhost:3000'");
    process.exit(1);
}
// --- Routers ---
const user_route_1 = __importDefault(require("./routers/user.route"));
const medicine_route_1 = __importDefault(require("./routers/medicine.route"));
const notification_route_1 = __importDefault(require("./routers/notification.route"));
const cron_route_1 = __importDefault(require("./routers/cron.route"));
const app = (0, express_1.default)();
// --- CORS Configuration ---
const allowedOrigins = allowedOriginsEnv.split(",");
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
// --- Middleware ---
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// --- API Routes ---
app.use("/api", user_route_1.default);
app.use("/api", medicine_route_1.default);
app.use("/api", notification_route_1.default);
app.use("/api", cron_route_1.default); // Add the cron router
// --- JWT Token Generation Route ---
app.post("/jwt", async (req, res) => {
    const user = req.body;
    if (!jwt_config_1.default.jwtSecret) {
        return res.status(500).json({ error: "JWT secret not configured" });
    }
    const token = jsonwebtoken_1.default.sign(user, jwt_config_1.default.jwtSecret, { expiresIn: jwt_config_1.default.jwtExpire });
    res.send({ token });
});
app.get("/", (_, res) => {
    res.send("Medicine Reminder API is running!");
});
exports.default = app;
