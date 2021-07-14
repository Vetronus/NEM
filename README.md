# NEM Stack | Node Express Mongo Stack
`version 2.0`

NEM Stack is a simple web app programmed in Javascript using Node.js, Express and Mongoose. This app uses MongoDB for data storage. I created it as a template to prototype and develop backend and fullstack apps faster. It can also be used by begginers to understand the basics of creating a Node Express MongoDB webapp. I use it as a template to rapidly create backend apps which can then easily be deployable on Heroku.

#### Please note that though this web-app is designed to be deployed on the Heroku, but you can use it on any cloud based platform. You can visit it by clicking [here](https://nemstack.herokuapp.com).

## Language, Framework and Plugins used:
- ### Javascript
- ### Node.js
- ### Express.js
- ### Mongoose
- ### Bcrypt 

## Features | So what exactly can it do?

If you are wondering how much functionality does it contain and how much time it can save, then here you go
- #### User Model, having `id`, `pass` and `name`.
- #### Pass is hashed using bcrypt, so it's secure.
- #### User route contains all the CRUD methods to manipulate the `user`.
- #### GET, POST,PUT and DELETE request to the user model through user route.
- #### `User Data` object is created and attached to the `User` object whenever a new user is created using `UserData _id`.
- #### Authentication using JSON Web Token.

## How to use the NEM Stack Template ?
- ### Download or clone this template.
- ### Add your web-pages in the `public` folder.
- ### Add all the extra `models` and `routes` that you want to add.
- ### Edit `main.js` to add new routes, api and web-pages.
- ### Push it to the Heroku server or any other cloud and deploy.

## Why I created this template ?
Code is repetitive. We keep writting same code over and over again in different projects. What if I write it once and just copy paste it to rapidly develope and prototype my projects? Well, that's exactly why I created this template.

## License and Usage :

This project is completely open-source and free-to-use. But you will need to mention about its great, super awesome author XD (JK, use it anywhere you want, I really don't care.) PS, Happy Coding! 
