var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');

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
  var query = req.query; //has all the query data
  var where = {};

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

  db.todo.destroy({
    where: {
      id: todoId
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
app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  };

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  };

  db.todo.findById(todoId).then((todo) => {
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
  // take only the email and password attributes
  var body = _.pick(req.body, 'email', 'password');

  // check if they're both strings, else return 400 'bad request'
  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    return res.status(400).send();
  };

  // sequelize findOne() -> if there is an email match, validate it.
  db.user.findOne({
    where: {
      email: body.email
    }
  }).then((user) => {
    if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
      //if the email doesn't exist, OR, we've passed in a bad password return 401 'unable to auth'
      return res.status(401).send();
    };
    //else, return the publicJSON for the user (temporary)
    res.json(user.toPublicJSON());
  }, (e) => {
    //errors return 500 'internal server error'
    res.status(500).json(e);
  });
});

db.sequelize.sync().then(() => {
  app.listen(PORT, function () {
    console.log('Express listening on PORT ' + PORT);
  });
});
