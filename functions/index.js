const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendChatNotification = functions.database
  .ref("/chatRooms/{roomId}/messages/{msgId}")
  .onCreate(async (snap, ctx) => {
    const msg = snap.val();

    if (!msg || !msg.user) return null;

    const tokensSnap = await admin.database().ref("userTokens").once("value");
    const tokens = [];

    tokensSnap.forEach(u => {
      if (u.key !== msg.user) {
        tokens.push(u.val());
      }
    });

    if (!tokens.length) return null;

    return admin.messaging().sendMulticast({
      tokens,
      notification: {
        title: "New message",
        body: `${msg.user}: ${msg.text || "File sent"}`
      }
    });
  });
