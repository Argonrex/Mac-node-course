const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'|| 'mongodb://rex:Miniclip123@ds227322.mlab.com:27322/rexactest',{ useNewUrlParser: true });

module.exports =  {mongoose};
