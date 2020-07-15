const admin = require('firebase-admin');
const { Admin } = require('../models/adminModel');
const { Notification } = require('../models/notificationsModel');

const fb = {
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
  credential: admin.credential.cert(fb),
  databaseURL: 'https://fish-94481.firebaseio.com'
});

exports.notify = async (users, orderId, title, body, icon) => {
  for (let index = 0; index < users.length; index++) {
    const user = await Admin.findById(users[index]).select('+notification');
    const payload = {
      data: {
        data: JSON.stringify({
          to: user._id,
          from: orderId
        })
      },
      notification: {
        title: title,
        body: body,
        sounds: 'default',
        icon: icon
      }
    };

    if (user.notification == undefined) {
      const notification = await Notification.create({
        items: [{ ...payload, date: Date.now() }]
      });
      user.notification = notification._id;
    } else {
      const notification = await Notification.findById(user.notification);
      notification.items.push({ ...payload, date: Date.now() });
      await notification.save({ validateBeforeSave: false });
    }
    /* istanbul ignore next */
    if (user.registraionToken)
      await admin.messaging().sendToDevice(user.registraionToken, payload);
    await user.save({ validateBeforeSave: false });
  }
};
