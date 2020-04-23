const express = require('express');
const AdminBro = require('admin-bro');
const formidableMiddleware = require('express-formidable');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Order = require('./database/order');
const User = require('./database/user');

AdminBro.registerAdapter(AdminBroMongoose);

const canModify = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === 'admin';

const adminBro = new AdminBro({
  branding: {
    // logo: 'URL_TO_YOUR_LOGO',
    companyName: 'WhatsApp Numbers',
    softwareBrothers: false,
  },
  dashboard: {
    handler: async () => {},
    component: AdminBro.bundle('./components/Dashboard'),
  },
  resources: [
    {
      resource: User,
      options: {
        listProperties: ['email', 'role', 'createdAt'],
        properties: {
          _id: {
            isVisible: false,
          },
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: 'string',
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10,
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
          list: { isAccessible: canModify },
          edit: { isAccessible: canModify },
          delete: { isAccessible: canModify },
          new: { isAccessible: canModify },
        },
      },
    },
    {
      resource: Order,
      options: {
        listProperties: [
          'code',
          'whatsAppNumber',
          'interval',
          'type',
          'status',
          'createdAt',
        ],
        properties: {
          _id: {
            isVisible: false,
          },
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
        },
        actions: {
          list: { isAccessible: canModify },
          edit: { isAccessible: canModify },
          delete: { isAccessible: canModify },
          new: { isAccessible: canModify },
        },
        sort: { direction: 'desc', sortBy: 'createdAt' },
      },
    },
  ],
  locale: {
    translations: {
      labels: {
        User: 'Admin Users',
        Order: 'Orders',
      },
    },
  },
  rootPath: '/admin',
});

// const router = AdminBroExpress.buildRouter(adminBro);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword);
      if (matched) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
});

const app = express();
app.use(formidableMiddleware());
app.use(adminBro.options.rootPath, router);
app.get('/', (req, res) => res.send('Hello World!'));

// Running the server
const run = async () => {
  await mongoose.connect('mongodb://test:test12@159.89.197.227:27017/test', {
    useNewUrlParser: true,
  });

  await app.listen(4000, () =>
    console.log(`AdminBro is under localhost:4000/admin`),
  );
};

run();
