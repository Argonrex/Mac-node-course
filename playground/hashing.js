const {SHA256} = require('crypto-js');

const message = "I am a user number 3";
const hash = SHA256(message).toString();
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    // console.log(hash);
  });
});

var hashedPassword = '$2a$10$yCTdyNxFshDHuyTfhBp64.QGm4tQoz.VVQxX5gz.wSrYSVtBejTt2';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});


//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token));
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("DATA WAS CHANGed");
// }
