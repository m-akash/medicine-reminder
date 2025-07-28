"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    if (!jwt_config_1.default.jwtSecret) {
        return res.status(500).send({ message: "JWT secret not configured" });
    }
    return jsonwebtoken_1.default.verify(token, jwt_config_1.default.jwtSecret, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        return next();
    });
};
exports.default = verifyToken;
