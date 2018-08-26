const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var getDate = new Date().getDate();
var getMonth = new Date().getMonth() + 1;
var getYear = new Date().getFullYear();

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
 var todo = new Todo({
  text: req.body.text
 })

 todo.save().then((doc) => {
  res.status(200).send(doc);
 }, (e) => {
  res.status(400).send(e);
 });
});

app.get('/todos', (req, res) => {
 Todo.find().then((todos) => {
  res.send({todos});
 }, (e) => {
  res.send(e);
 });
 console.log("done");
});

app.get('/todos/:id', (req, res) => {
 var id = req.params.id;

 if (!ObjectID.isValid(id)) {
   return res.status(404).send();
 }

 Todo.findById(id).then((todo) => {
 if (!todo) {
  return res.status(404).send();
 }

  res.send({todo});
}).catch((e) => {
 res.status(400).send()
});
});

app.delete('/todos/:id', (req,res) => {
var id = req.params.id;

 if (!ObjectID.isValid(id)) {
  return res.status(404).send();
 }

 Todo.findOneAndRemove({_id: `${id}`}).then((todo) => {
 if (!todo) {
  return res.status(404).send();
 }

 return res.send({todo});
 }).catch((e) => {
 res.status(400).send()
 });
});

app.patch('/todos/:id', (req, res) => {
var id = req.params.id;
var body = _.pick(req.body, ['text', 'completed']);


if (!ObjectID.isValid(id)) {
 return res.status(404).send();
}

 if (_.isBoolean(body.completed) && body.completed) {
  body.completedAt = `Completed on ${getDate}/${getMonth}/${getYear}`;
 } else {
  body.completed = false;
  body.completedAt = null
 }

 Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
  if (!todo) {
   return res.status(404).send();
  }

   res.send({todo});
 }).catch((e) => {
  res.status(400).send()
 });

});


app.post('/users', (req, res) => {
 var body = _.pick(req.body, ['email','password']);
 var user = new User(body);

 user.save().then(() => {
   return user.generateAuthToken();
 }).then((token) => {
   res.header('x-auth', token).send(user);
 }).catch((e) => {
   res.status(400).send(e);
 })
});

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
    return Promise.reject('test 2');
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredientials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
 console.log(`Started on port ${port}`);
});



module.exports = {app};
