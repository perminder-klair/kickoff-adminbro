## Kickoff AdminBro

Admin Panel for Mongoose MongoDB

[DEMO](https://kickoff-adminbro.herokuapp.com/admin)

- Email: admin@admin.com
- Password: admin12

## Starting the app

First install all dependencies

```
yarn install
```

In the end you can launch the app

```
yarn start
or
yarn dev
```

## Deployment to Heroku

```
heroku create my-app
git push heroku master
heroku ps:scale web=1
heroku open
```

Config environment vars in Heroku Settings:

```
MONGODB=mongodb://test:test12@123.12.123.123:27017/test
COOKIE_SECRET=some-secret-password-used-to-secure-cookie
APP_NAME=Kickoff-Adminbro
```
