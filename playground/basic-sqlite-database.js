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

sequelize.sync({
  //force: true
}).then(() => {
  console.log('Everything is synced');

  return Todo.findById(2);

  // Todo.create({
  //   description: 'Walk the dog'
  // }).then((todo) => {
  //   return Todo.create({
  //     description: 'Clean office'
  //   });
  // }).then(() => {
  //   //return Todo.findById(1)
  //   return Todo.findAll({
  //     where: {
  //       description: {
  //         $like: '%Office%'
  //       }
  //     }
  //   });
  // }).then((todos) => {
  //   if (todos) {
  //     todos.forEach((todo) => {
  //       console.log(todo.toJSON());
  //     });
  //   } else {
  //     console.log('NO TODO FOUND');
  //   };
  // }).catch((e) => {
  //   console.log(e);
  // });
}).then((todo) => {
  if (todo) {
    console.log(todo.toJSON());
  } else {
    console.log('NO TODO FOUND');
  };
}).catch((e) => {
  console.log(e);
});
