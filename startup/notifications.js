const admin = require('firebase-admin');
const serviceAccount = require('../fish.json');
const { Admin } = require('../models/adminModel');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fish-94481.firebaseio.com'
});

exports.notify = async (users, title, body, icon) => {
  for (let index = 0; index < users.length; index++) {
    const user = await Admin.findById(users[index]);
    const payload = {
      data: {
        data: JSON.stringify({
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
