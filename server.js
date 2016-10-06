var express = require('express');
var bodyParser = require('body-parser');

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
app.get('/todos', function (req, res) {
  res.json(todos);
});

// GET /todos/:id - return individual todo item
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo;

  todos.forEach(function (todo) {
    if (todo.id === todoId){
      matchedTodo = todo;
    };
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  };
});

// POST /todos - looks the same as get all
app.post('/todos', function (req, res) {
  var body = req.body;
  body.id = todoNextId++;
  todos.push(body);

  console.log('description: ' + body.description);
  res.json(body); // pass body back to the user
});

app.listen(PORT, function () {
  console.log('Express listening on PORT ' + PORT);
});
