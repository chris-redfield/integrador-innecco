var app = require('../app'); //Require our app

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('Server rodando na porta ' + server.address().port);
});
