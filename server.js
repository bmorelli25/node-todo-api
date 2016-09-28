var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{ //temorarily will be an array instead of in a database
  id: 1,
  description: 'Meet mom for lunch',
  completed: false
}, {
  id: 2,
  description: 'Go to market',
  completed: false
}, {
  id: 3,
  description: 'Walk the dog',
  completed: true
}];

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

app.listen(PORT, function () {
  console.log('Express listening on PORT ' + PORT);
});
