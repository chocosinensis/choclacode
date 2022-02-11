## Choclacode
---

The official website of Choclacode.

Link : http://choclacode.eu.org

Created with : [`Express.js`](https://expressjs.com)

![](./public/assets/img/logo/avatar.png)

Dependencies :
- [mongoose](https://mongoosejs.com) : Mongoose ORM
- [jsonwebtoken](https://jwt.io)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
- [dotenv](https://github.com/motdotla/dotenv#readme) : .env
- [pug](https://pugjs.org)
- [cors](https://github.com/expressjs/cors#readme)
- [cookie-parser](https://github.com/expressjs/cookie-parser#readme)
- [multer](https://github.com/expressjs/multer#readme)
- [socket.io](https://socket.io)
- [marked](https://marked.js.org) : Markdown to HTML

Dev Dependencies :
- [webpack](https://webpack.js.org)
- [nodemon](https://nodemon.io)
- [concurrently](https://npmjs.com/package/concurrently)
- [node-sass](https://npmjs.com/package/node-sass)
- [socket.io](https://socket.io) client
- [jest](jestjs.io)
- @types/jest
- [supertest](https://github.com/visionmedia/supertest#readme)
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)

---

To run it locally,

First of all make sure you have [`Node.js`](https://nodejs.org) installed

Create a `config/.env/.env` file with all the properties of `config/.env/.env.example`

Open the project directory and install the dependencies
```bash
$ npm i # or npm install
```

Then build the client side bundles
```bash
$ npm run build
```

Finally, start the server by either of the following
```bash
$ npm run serve
$ npm run serve:app
```

You are good to go!

---

For any queries, feel free to drop a message in my personal twitter account

[@ChocoSinensis](https://twitter.com/ChocoSinensis)
