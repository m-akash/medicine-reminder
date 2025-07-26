import admin from "../firebaseAdmin";

export async function sendFCMNotification(
  token: string,
  title: string,
  body: string
) {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
    });
  } catch (err) {
    console.error("FCM send error:", err);
  }
}
