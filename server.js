var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//set up middlewear
app.use(bodyParser.json()); //now anytime a json request comes in, request can parse it

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos - all of a specific model
// GET /todos?completed=true
app.get('/todos', function (req, res) {
  var queryParams = req.query; //has all the query data
  var filteredTodos = todos;

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  };

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, (todo) => {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }

  res.json(filteredTodos);
});

// GET /todos/:id - return individual todo item
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);

  db.todo.findById(todoId).then((todo) => {
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
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then((todo) => {
    res.json(todo.toJSON());
  }, (e) => {
    res.status(400).json(e);
  });
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (!matchedTodo) {
    res.status(404).json({"error": "no todo found with that id"});
  };

  todos = _.without(todos, matchedTodo);
  res.json(matchedTodo);
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).json({"error": "no todo found with that id"});
  };

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  };

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  };

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});

db.sequelize.sync().then(() => {
  app.listen(PORT, function () {
    console.log('Express listening on PORT ' + PORT);
  });
});
