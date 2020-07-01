const admin = require('firebase-admin');
const serviceAccount = require('./../fish.json');
const { Admin } = require('../models/adminModel');

const fs = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(fs),
  databaseURL: 'https://fish-94481.firebaseio.com'
});

exports.notify = async (users, ownerId, title, body, icon) => {
  for (let index = 0; index < users.length; index++) {
    const user = await Admin.findById(users[index]);
    const payload = {
      data: {
        data: JSON.stringify({
          from: ownerId,
          to: user._id
        })
      },
      notification: {
        title: title,
        body: body,
        sounds: 'default',
        icon: icon
      }
    };
    if (user.registraionToken)
      await admin.messaging().sendToDevice(user.registraionToken, payload);
  }
};
