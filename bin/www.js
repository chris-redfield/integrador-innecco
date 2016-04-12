var app = require('../app'); //Require our app
var models = require('../models');
var vend = require('../vend');

app.set('port', process.env.PORT || 8000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    /*models.Auth.findOne().then(function(connectionInfo){
      var args = {};
      args.type = 'sale.update';
      args.url = 'http://requestb.in/1m6lkbe1';
      models.Webhook.findOne().then(function(webhook){
        if(webhook === null){
          vend.createWebhook(args, connectionInfo).then(function(response){
            models.Webhook.create({
              id: response.id
            });
          });
        }else{
          args.url = 'https://google.com';
          args.id = webhook.id;
          vend.updateWebhook(args, connectionInfo).then(function(response){
            console.log(response);
          });
        }
      });
    });*/
    console.log('Server rodando na porta ' + app.get('port'));
  });
});
/*
var server = app.listen(app.get('port'), function() {
  console.log('Server rodando na porta ' + server.address().port);
});
*/
