## Kickoff AdminBro

Admin Panel for Mongoose MongoDB using [AdminBro](https://adminbro.com/)

Documentation is available [here](https://adminbro.com/docs.html)

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
