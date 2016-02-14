var request = require('request');
var express = require('express');
var vend = require('vend-nodejs-sdk')({});
var router = express.Router();
var models = require('../models');
var bodyParser = require('body-parser');
var settings = require('../settings');

var oauth2 = require('simple-oauth2')({
  clientID: settings.CLIENT_ID,
  clientSecret: settings.CLIENT_SECRET,
  site: 'https://memodesign.vendhq.com/',
  tokenPath: '/api/1.0/token',
  //authorizationPath: 'https://secure.vendhq.com/connect'
});

  /* rota para pegar o auth code pela primeira vez
  router.all('/vendcallback', function(req,res,next){

    console.log(req.query);
    console.log(req.body);
    res.send("OK!");

  }); */

  router.post('/', function(req, res, next) {

    //  mostra o corpo inteiro do request
    //  console.log(req.body);

    var cnpj = "";
    var cpfCliente = '';
    var nomeCliente = "";
    var json = JSON.parse(req.body.payload);

    //Verifica qual o id do registrador, e associa ao CNPJ certo
      if(json.register_id == settings.IDREG303){
        cnpj = settings.CNPJ303;
      } else {
        cnpj = settings.CNPJAER;
      }

      // caso a venda não seja anônima, pega os dados do cliente
      if(json.customer.customer_code != "WALKIN"){
        cpfCliente = json.customer.customer_code;
        nomeCliente = json.customer.first_name + " " +
        json.customer.last_name;
      }

      var produtos = json.register_sale_products;
      var formasPagamento = json.register_sale_payments;
      var totalDesconto = 0;
      var totalProdutos = 0;
      var itens = [];
      var formasPag = [];

      /*  Itera dentre os produtos, se o valor for < 0, é um descontos
          se o valor for > 0, então é produto, adicione no array 'itens'
       */
      var numeroItem = 1;
      produtos.forEach(function(produto) {
        if(produto.price_total < 0 ){
          totalDesconto = totalDesconto + Math.abs(produto.price_total);
        } else {
          totalProdutos = totalProdutos + Math.abs(produto.price_total);
          itens.push({
            numero_item: numeroItem,
            // TODO: descobrir com o rafffael como pegaremos o codigo NCM dos produtos
            codigo_ncm: "12345678",
            codigo_produto: produto.product_id,
            // descricao não chega nesse momento,
            descricao: "teste",
            quantidade_comercial: produto.quantity,
            quantidade_tributavel: produto.quantity,
            // TODO: descobrir o que é CFOP
            cfop: "123456",
            valor_unitario_comercial: produto.price,
            valor_unitario_tributavel: produto.price,
            unidade_comercial: "UN",
            unidade_tributavel: "UN",
            icms_origem: 0,
            icms_situacao_tributaria: 40,
          });
          numeroItem++;
        }
      });

      formasPagamento.forEach(function(formaPagamento) {
        //por enquanto estamos pegando o type_id
        //TODO: refazer esse método de inserção após ajustes no Vend pelo Raffael
        formasPag.push({
          forma_pagamento: formaPagamento.payment_type_id,
          valor_pagamento: formaPagamento.amount,
          nome_credenciadora: "Cielo",
          //Esse número não vem do VendHQ*
          //TODO veriricar como resolver obter esses dados
          //esse numero é retornado pela máquina de cartão
          numero_autorizacao: "12345678",
          bandeira_operadora: "01", //Visa
        });
      });

      //pega a timezone do container
      //TODO colocar a timezone do brasil na mao 0_0 ?
      var dataVenda = new Date(Date.parse(json.sale_date));

      //Fazendo esse alias para incluir os produtos
      var Produtos = models.Venda.hasMany(models.Item, {as: 'produtos'});
      var Formas = models.Venda.hasMany(models.FormaPagamento, {as: 'formas'});

      models.Venda.create({
        id_vend: json.id,
        //TODO cologar o time zone do brasil
        data_emissao: dataVenda,
        cnpj_emitente: cnpj,
        nome_destinatario: nomeCliente,
        cpf_destinatario: cpfCliente,
        valor_produtos: totalProdutos,
        valor_desconto: totalDesconto,
        valor_total: json.totals.total_price,
        icms_valor_total: json.totals.total_tax,
        invoice_number: json.invoice_number,
        //venda nova
        estado: 0,
        produtos: itens,
        formas: formasPag,
      },
      {
        include: [ Produtos, Formas ]
      }
    ).then(function(venda){
      if()
    });

    res.send(json);

  });


  router.post('/teste', function(req, res){
    models.Venda.findOne({
      attributes: { exclude: ['estado']},
      where: { cnpj_emitente: settings.CNPJ303, cpf_destinatario: '90231643187' },
      include: [models.Item, models.FormaPagamento]
    }).then(function(result){
      request.post(
        'http://homologacao.acrasnfe.acras.com.br/nfce.json?token=token&ref=' + result.invoice_number,
        { body: result,
        json: true },
        function (error, response, body) {

          res.send(error+' '+response+' '+JSON.stringify(body));
          console.log(error+' '+response+' '+JSON.stringify(body));
        }

      );
    });
  });

  var getProduct = function(product_id){
    var args = vend.args.products.fetchById();
    args.apiId = product_id;

    vend.products.fetchById(args, connectionInfo)
      .then(function(response){

      });
  }

  router.get('/teste', function(req, res){
    var args = vend.args.products.fetch();
    args.orderBy.value = 'id';
    //args.page.value = 1;
    //args.pageSize.value = 5;
    args.active.value = true;

    var connectionInfo = {
      domainPrefix: 'memodesign',
      accessToken: 'access_token'
    };

    vend.products.fetch(args, connectionInfo)
      .then(function(response){
        response.products.forEach(function(product){
          console.log(product.id+': '+product.name+'  '+product.price);
        });
      });
  });

module.exports = router;
