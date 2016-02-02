var express = require('express');
var router = express.Router();
var models = require('../models');
const CNPJ303 = "14.271.394/0001-27";
const IDREG303 = "02d59481-b67d-11e5-f667-a8d2d7daaf57";
const IDREGAER = "02d59481-b656-11e5-f667-ad63e6b21a72";
//TODO - Descobrir qual o CNPJ do aeroporto
const CNPJAER = "";

  router.post('/', function(req, res, next) {

    //  mostra o corpo inteiro do request
    //  console.log(req.body);

    var cnpj = "";
    var json = JSON.parse(req.body.payload);
    var cpfCliente = "";
    var nomeCliente = "";
    //manda um item do json na resposta
    //res.send(json.sale_date);
    //manda um item do json pro log
    //console.log(json.sale_date);

    //console.log(json.register_sale_payments[0].register_sale.register_id);

    //Verifica qual o id do registrador, e associa ao CNPJ certo
      if(json.register_id == IDREG303){
        cnpj = CNPJ303;
      } else {
        cnpj = CNPJAER;
      }

      // caso a venda não seja anônima, pega os dados do cliente
      if(json.customer.customer_code != "WALKIN"){
        cpfCliente = json.customer.customer_code;
        nomeCliente = json.customer.first_name + " " +
        json.customer.last_name;
      }

      var produtos = json.register_sale_products;
      var formasPagamento = json.register_sale_payments;
      var valorDesconto = "";

      produtos.forEach(function(produto) {
        if(produto.price_total < 0 ){
          valorDesconto = valorDesconto + Math.abs(produto.price_total);
        }
      });

      console.log("Valor total do desconto: "+valorDesconto);

      models.Venda.create({
        id_vend: json.id,
        //TODO cologar o time zone nesse valor
        data_emissao: json.sale_date,
        cnpj_emitente: cnpj,
        nome_destinatario: nomeCliente,
        cpf_destinatario: cpfCliente,
        valor_produtos: json.totals.total_price,
        valor_desconto: valorDesconto,
        valor_total: json.totals.total_price,
        icms_valor_total: json.totals.total_tax,


        //venda nova
        estado: 0
      });

      res.send(json);

  });

module.exports = router;
