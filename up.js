/*

*/
const L2Game = require('./models/L2Server');
let l2game = new L2Game();
l2game.start();

const L2Login = require('./login/L2Server');
let l2login = new L2Login();
l2login.start();