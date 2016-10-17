var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname +'/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

var User = sequelize.define('user', {
  email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
  //force: true
}).then(() => {
  console.log('Everything is synced');

  //find todos for a user by ID, console.log them
  // User.findById(1).then((user) => {
  //   user.getTodos().then((todos) => {
  //     todos.forEach((todo) => {
  //       console.log(todo.toJSON());
  //     });
  //   });
  // });

  //Filter found todos
  User.findById(1).then((user) => {
    user.getTodos({
      where: {
        completed: false
      }
    }).then((todos) => {
      todos.forEach((todo) => {
        console.log(todo.toJSON());
      });
    });
  });


  //create user, create todo, link
  // User.create({
  //   email: 'andrew@example.com'
  // }).then(() => {
  //   return Todo.create({
  //     description: 'Clean Yard'
  //   });
  // }).then((todo) => {
  //   User.findById(1).then((user) => {
  //     user.addTodo(todo);
  //   });
  // });

});
