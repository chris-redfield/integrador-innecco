var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3");
var vendas = require('./routes/vendas'); //rotas ficam aqui
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', vendas); //rota raiz

module.exports = app;
