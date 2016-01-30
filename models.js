/*
    DAO do objeto venda
*/
var Sequelize = require('sequelize');
var models = {};

var sequelize = new Sequelize('dbvendas', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'db/database.sqlite'
});

models.Venda = sequelize.define('venda', {
  nome_destinatario: {
    type: Sequelize.STRING,
  },
  cpf_destinatario: {
    type: Sequelize.STRING
  },
  informacoes_adicionais_contribuinte: {
    type: Sequelize.TEXT,
  },
  natureza_operacao: {
    type: Sequelize.STRING,
    defaultValue: "Venda ao Consumidor",
  },
  data_emissao: {
    type: Sequelize.DATE,
  },
  tipo_documento: {
    type: Sequelize.STRING,
    defaultValue: "1",
  },
  presenca_comprador: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  finalidade_emissao: {
    type: Sequelize.STRING,
    defaultValue: "1",
  },
  cnpj_emitente: {
    type: Sequelize.STRING,
  },
  valor_produtos: {
    type: Sequelize.DECIMAL(10, 2),
  },
  valor_desconto: {
    type: Sequelize.DECIMAL(10, 2),
  },
  valor_total: {
    type: Sequelize.DECIMAL(10, 2),
  },
  forma_pagamento: {
    type: Sequelize.STRING,
    defaultValue: "0",
  },
  icms_valor_total: {
    type: Sequelize.DECIMAL(10, 2),
  }
  //items: {},
  //formas_pagamento: {}
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;

/*
    Queries no SQLite
    Para conectar ao banco
    var sqlite3 = require("sqlite3").verbose();
    var db = new sqlite3.Database(file);

    db.serialize(function() {
      Queries dentro desse bloco rodam sequencialmente
      db.run("QUERY"); para executar uma query
      db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
        loop por todos os resultados retornados pela query
      });
    });

    db.parallel(function() {
      Queries dentro desse bloco rodam em paralelo
      var stmt = db.prepare("INSERT INTO Stuff VALUES (?)"); query parametrizada
      stmt.run("Thing"); preparando a query com o valor do parametro
      stmt.finalize();
    });

    Encerra a conexao
    db.close();
*/
/*
//lib para io com o file system
var fs = require("fs");

//TO-DO: Especificar decentemente qual será o caminho do arquivo
var pastaJsonVend = "./jsonVend/";

module.exports = {

// Salva uma nova venda encaminhada pelo Vend
saveVenda: function (jsonVend){

    //compoe o nome do arquivo com data+T+hora+cpf
    nomeArquivo = jsonVend.sale_date.replace(" ", "T") + "-";
    nomeArquivo += jsonVend.customer.customer_code;

    /*
    checa se o arquivo existe antes de salvar.
    Se já existir, inclui um diferenciador no fim do arquivo

    var i = 2;
    while (fs.existsSync(pastaJsonVend + nomeArquivo+".json")){
        if (fs.existsSync(pastaJsonVend + nomeArquivo+"v"+i+".json")){
            nomeArquivo = nomeArquivo.replace("v"+i,"v"+i+1);
        } else {
            nomeArquivo = nomeArquivo + "v"+i;
        }
        i++;
    }

    //extensão pra identificar
    nomeArquivo += ".json";

    console.log("gravando arquivo " + nomeArquivo + " em " + pastaJsonVend);
    fs.writeFile(pastaJsonVend + nomeArquivo, JSON.stringify(jsonVend), "utf8", function(err) {
        if (err) {
           return console.error(err);
        }
    });
}

};*/
