const express = require('express');
const AdminBro = require('admin-bro');
const formidableMiddleware = require('express-formidable');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const config = require('./utils/config');
const database = require('./database');
const AdminUser = require('./database/admin-user');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  branding: {
    // logo: 'URL_TO_YOUR_LOGO',
    companyName: config.get('appName'),
    softwareBrothers: false,
  },
  dashboard: {
    handler: async () => {},
    component: AdminBro.bundle('./components/Dashboard'),
  },
  resources: database,
  rootPath: '/admin',
});

// const router = AdminBroExpress.buildRouter(adminBro);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await AdminUser.findOne({ email });
    const admins = await AdminUser.find();
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword);
      if (matched) {
        return user;
      }
    } else if (email === 'admin@admin.com' && admins.length === 0) {
      // if admin account not there, create it for first setup
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = new AdminUser({
        email,
        encryptedPassword,
        role: 'admin',
      });
      await newUser.save();
      return newUser;
    }
    return false;
  },
  cookiePassword: config.get('cookieSecret'),
});

const app = express();
app.use(formidableMiddleware());
app.use(adminBro.options.rootPath, router);
app.get('/', (req, res) => res.send('Welcome to admin panel!'));
const port = config.get('port');

// Running the server
const run = async () => {
  await mongoose.connect(config.get('mongodb'), {
    useNewUrlParser: true,
  });

  await app.listen(port, () =>
    console.log(`AdminBro is under localhost:${port}/admin`),
  );
};

run();
