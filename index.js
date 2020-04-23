const express = require('express');
const AdminBro = require('admin-bro');
const formidableMiddleware = require('express-formidable');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const mongoose = require('mongoose');

const Order = require('./database/order');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  // databases: [],
  resources: [Order],
  rootPath: '/admin',
});

const router = AdminBroExpress.buildRouter(adminBro);

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
