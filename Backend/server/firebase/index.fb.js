const admin = require("firebase-admin");
const serviceAccount = require('../config/fbServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://e-buy-dc8a8.firebaseio.com"
});

module.exports = admin;
