var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');

var middleware = require('./middleware.js')(db);
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//set up middleware
app.use(bodyParser.json()); //now anytime a json request comes in, request can parse it

//function : regular route handler. Middleware is run before regular route handler
app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos - all of a specific model
// GET /todos?completed=true
app.get('/todos', middleware.requireAuthentication, function (req, res) {
  var query = req.query; //has all the query data
  var where = {
    userId: req.user.get('id')
  };

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {$like: `%${query.q.toLowerCase()}%`};
  };

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  };

  db.todo.findAll({where}).then((todos) => {
    res.json(todos);
  }, (e) => {
    res.status(500).json(e);
  });
});

// GET /todos/:id - return individual todo item
app.get('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id);

  db.todo.findOne({
    where: {
      id: todoId,
      userId: req.user.get('id')
    }
  }).then((todo) => {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    };
  }, (e) => {
    res.status(500).json(e);
  });
});

// POST /todos - looks the same as get all
app.post('/todos', middleware.requireAuthentication, function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then((todo) => {
    req.user.addTodo(todo).then(() => { //creates user association
      return todo.reload(); // reload todo since the one we have in the database is different then this one
    }).then((todo) => { //this gets passed an updated version of the todo
      res.json(todo.toJSON());
    });
  }, (e) => {
    res.status(400).json(e);
  });
});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id);

  db.todo.destroy({
    where: {
      id: todoId,
      userId: req.user.get('id')
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No todo with id'
      });
    } else {
      res.status(204).send();
    };
  }, (e) => {
    res.status(500).json(e);
  });

  // BETTER CODE THEN ABOVE. WORKING
  // db.todo.findById(todoId).then((todo) => {
  //   if (todo) {
  //     db.todo.destroy({where: {id: todoId}});
  //     res.json(todo.toJSON());
  //   } else {
  //     res.status(404).send();
  //   };
  // }, (e) => {
  //   res.status(500).json(e);
  // });
});

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  };

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  };

  db.todo.findOne({
    where: {
      id: todoId,
      userId: req.user.get('id')
    }
  }).then((todo) => {
    if (todo) {
      todo.update(attributes).then((todo) => { //everything here fires after todo.update
        res.json(todo.toJSON()); //if todo.update goes well
      }, (e) => {
        res.status(400).json(e); //if todo.update fails
      });
    } else {
      res.status(404).send();
    };
  }, () => { //if find by id goes wrong, this is fired
    res.status(500).send();
  });
});

app.post('/users', function (req, res) {
  var body = _.pick(req.body, 'email', 'password');

  db.user.create(body).then((user) => {
    res.json(user.toPublicJSON());
  }, (e) => {
    res.status(400).json(e);
  });
});

// POST /users/login
app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, 'email', 'password');
  var userInstance;

  db.user.authenticate(body).then((user) => {
    //runs after authenticate finishes
    var token = user.generateToken('authentication');
    userInstance = user;

    return db.token.create({
      token: token
    });

  }).then((tokenInstance) => { //runs after token.create finishes
    res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
  }).catch(() => { //runs if anything goes wrong along the way
    res.status(401).send(); //for security reasons, we're only sending a generic message back
  });
});

// DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function (req, res) {
  req.token.destroy().then(() => {
    res.status(204).send();
  }).catch(() => {
    res.status(500).send();
  })
});

db.sequelize.sync({force: true}).then(() => {
  app.listen(PORT, function () {
    console.log('Express listening on PORT ' + PORT);
  });
});
