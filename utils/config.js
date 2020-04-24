const convict = require('convict');
const fs = require('fs');
const dotenv = require('dotenv');

// to load .env file
dotenv.config();

const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 4000,
    env: 'PORT',
  },
  appName: {
    doc: 'App Name',
    default: 'My Project',
    env: 'APP_NAME',
  },
  mongodb: {
    doc: 'URL to mongodb.',
    format: String,
    default: '',
    env: 'MONGODB',
  },
  cookieSecret: {
    doc: 'Cookie secret.',
    format: String,
    default: 'MY_SITE_SECRET',
    env: 'COOKIE_SECRET',
  },
});

const env = conf.get('env');
try {
  const path = `${__dirname}/${env}.json`;

  console.log('trying to access %s', path);
  fs.accessSync(path, fs.F_OK);

  conf.loadFile(path);
} catch (error) {
  console.log("file doesn't exist, loading defaults");
}

conf.validate({ allowed: 'strict' });

module.exports = conf;
