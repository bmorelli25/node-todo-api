var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname +'/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN
  }
});

sequelize.sync({force: true}).then( () => {
  console.log('Everything is synced');

  Todo.create({
    description: 'Walk the dog',
    completed: false
  }).then((todo) => {
    console.log('Finished!');
    console.log(todo);
  });
});
