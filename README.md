### node-todo-api
Node Todo API - Live Demo on [Heroku](https://node-todo-api-1.herokuapp.com)

-----

Nodejs Todo API. This application utilizes: 

* [Express](https://expressjs.com/)
* [BodyParser](https://github.com/expressjs/body-parser)
* [Underscore](http://underscorejs.org/)

-----

How to use:

```
GET   /todos
GET   /todos/:id
POST  /todos
DEL   /todos/:id
PUT   /todos/:id
```

Query Paramaters:
```
completed=true
completed=false
```

Example: Search for all completed todos:
```
GET /todos?completed=true
```
