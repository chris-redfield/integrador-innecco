var express = require('express');
var router = express.Router();
var models = require('../models');

  router.post('/', function(req, res, next) {

    //  mostra o corpo inteiro do request
    //  console.log(req.body);

    var json = JSON.parse(req.body.payload);

    //manda um item do json na resposta
    //res.send(json.sale_date);
    //manda um item do json pro log
    //console.log(json.sale_date);


      models.Venda.create({
        id_vend: json.id,
        data_emissao: json.sale_date,
        //TODO verificar se a loja é bsbmemo ou 303 norte
        cnpj_emitente: "14.271.394/0001-27"
      });

      res.send(json);

  });

module.exports = router;
