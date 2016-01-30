var app = require('../app'); //Require our app
var models = require('../models');

app.set('port', process.env.PORT || 8000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    console.log('Server rodando na porta ' + app.get('port'));
  });
});
/*
var server = app.listen(app.get('port'), function() {
  console.log('Server rodando na porta ' + server.address().port);
});
*/
