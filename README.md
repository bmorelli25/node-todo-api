### node-todo-api
Node.js Todo API - Live Demo on [Heroku](https://node-todo-api-1.herokuapp.com)

This web application stores a todo list for the current logged in user. Users can add todos, complete todos, edit, and delete todos. The Todo objects are stored in a Postgres(for production) or SQLite(for dev) database that is accessed via Sequelize.

-----

#### Dependencies: 

* [Express](https://expressjs.com/) - web application framework that handles the routing of the API
* [BodyParser](https://github.com/expressjs/body-parser) - parses incoming request bodies and makes available on req.body
* [Underscore](http://underscorejs.org/) - amazingly useful funcitons for objects and more
* [bcrypt](https://www.npmjs.com/package/bcrypt) - a bcrypt library for NodeJS (for password hashing)
* [crypto-js](https://code.google.com/archive/p/crypto-js/) - cryptographic algorithms. Not updated often. May be best to update to [Forge](https://github.com/digitalbazaar/forge) at some point soon
* [JSON Web Tokens](https://jwt.io/) - Allows us to decode, verify, and generate JWT's. Once the user is logged in, each subsequent request includes the JWT in the HTTP header - allowing the user to access routes and resources permitted with their token.
* [Sequelize](http://docs.sequelizejs.com/en/v3/) - Promise based ORM for Node.js
* [postresQL](https://www.npmjs.com/package/pg) - Non blocking PostreSQL client for Node.js
* [sqlite3](sqlite3) - Asynch SQlite3 bindings for node

-----

#### How to use:

```
GET/CREATE/DELETE/EDIT TODOS
GET   /todos
GET   /todos/:id
POST  /todos
DEL   /todos/:id
PUT   /todos/:id

CREATE USER/LOGIN USER/LOGOUT USER
POST /users
POST /users/login
DELTE /user/login
```

Todo Query Paramaters:
```
completed=true
completed=false
q='searchQueryHere'
```

-----

#### Walkthrough:

Step 1. **Create User** ```POST /users``` with raw JSON Body:
```
{
	"email": "email@domain.com",
	"password": "password1"
}
```
Step 2. **Login** ```POST /users/login``` with raw JSON Body:
```
{
	"email": "email@domain.com",
	"password": "password1"
}
```
Step 3. **Create Todo** ```POST /todos``` with header key: ```Auth``` and value ```AuthTokenHere``` and raw JSON Body:
```
{
	"description": "Walk the cat",
	"completed": false
}
```
Step 4. **Search for above todo refrencing cat and not completed:** ```GET /todos?completed=false&q=cat```
