"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFCMNotification = sendFCMNotification;
const firebaseAdmin_1 = __importDefault(require("../firebaseAdmin"));
async function sendFCMNotification(token, title, body) {
    try {
        await firebaseAdmin_1.default.messaging().send({
            token,
            notification: { title, body },
        });
    }
    catch (err) {
        console.error("FCM send error:", err);
    }
}
