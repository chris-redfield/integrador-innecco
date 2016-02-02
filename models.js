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

  id_vend: {
    type: Sequelize.STRING,
  },
  /*
    estado da venda (TODO: normalizar isso dps)
    0 - Recebida pelo Vend
    1 - Preenchida com todos os dados
    2 - Emitida no Focus
    3 - Impressa
  */
  estado: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
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
  },
  modalidade_frete: {
    type: Sequelize.INTEGER,
    defaultValue: 9,
  }
  //items: {},
  //formas_pagamento: {}
},
{
   classMethods: {
     associate: function(models) {
       models.Venda.hasMany(models.Produto),
       models.Venda.hasMany(models.FormaPagamento)
     }
   }
 },
{
  freezeTableName: true // Model tableName will be the same as the model name
});

// Fim da Venda

models.Produto = sequelize.define('produto', {
  numero_item: {
    /*  esse campo deve crescer sequencialmente
        para cada venda à partir de 1   */
    type: Sequelize.INTEGER,
  },
  codigo_ncm: {
    type: Sequelize.STRING,
  },
  codigo_produto: {
    type: Sequelize.STRING,
  },
  descricao: {
    type: Sequelize.TEXT,
  },
  quantidade_comercial: {
    // Quantidade de itens
    type: Sequelize.INTEGER,
  },
  quantidade_tributavel: {
    /* Caso haja itens tributáveis e não tributáveis
        por default, colocar a mesma quantidade de itens  */
    type: Sequelize.INTEGER,
  },
  cfop: {
    // Código Fiscal da operação
    type: Sequelize.STRING,
  },
  valor_unitario_comercial: {
    type: Sequelize.DECIMAL(10,2),
  },
  valor_unitario_tributavel: {
    /*  caso o produto seja tributável
        por default, colocar o mesmo valor do comercial   */
    type: Sequelize.DECIMAL(10,2),
  },
  unidade_comercial: {
    type: Sequelize.STRING,
  },
  unidade_tributavel: {
    /*  caso o produto seja tributável
        por default, colocar o mesmo valor da unidade_comercial   */
    type: Sequelize.STRING,
  },
  icms_origem: {
    /*  Aceita valores entre 1 e 7, vide documentação
    no site focus nfc-e   */
    type: Sequelize.INTEGER,
  },
  /*
  Valores possíveis:
  Para empresas optantes do SIMPLES:
  103 - Isenção do ICMS no Simples Nacional para faixa de receita bruta (para simples)

  Para empresas não optantes do SIMPLES

  00 - tributada integralmente (para quem não é do simples)
  40 - Isenta (para quem não é do simples)
  */
  icms_situacao_tributaria: {
    type: Sequelize.INTEGER,
  },
  /* Deve estar entre 0 e 100, obrigatório se
     situação tributária for igual a 00    */
  icms_aliquota: {
    type: Sequelize.INTEGER,
  }
},
{
  classMethods: {
    associate: function(models) {
      models.Produto.belongsTo(models.Venda)
    }
  }
},
 {
  freezeTableName: true // Model tableName will be the same as the model name
});

models.FormaPagamento = sequelize.define('forma_pagamento', {
  forma_pagamento: {
    /*
      01: Dinheiro
      02: Cheque
      03: Cartão de Crédito
      04: Cartão de Débito
      05: Crédito Loja
      10: Vale Alimentação
      11: Vale Refeição
      12: Vale Presente
      13: Vale Combustível
      99: Outros
    */
    type: Sequelize.INTEGER,
  },
  valor_pagamento: {
    type: Sequelize.INTEGER,
  },
  /*
  Obrigatório se forma_pagamento for 03 ou 04
    American Express
    Rede
    Cielo
    Senff
    GetNet
    Regicred
    Vero
    PagSeguro
    Paypal
    Mercadopago
  */
  nome_credenciadora: {
    type: Sequelize.STRING,
  },
  // Obrigatório se forma_pagamento for 03 ou 04
  numero_autorizacao: {
    type: Sequelize.STRING,
  },
  /*
  Valores permitidos
    01: Visa
    02: Mastercard
    03: American Express
    04: Sorocred
    99: Outros
  */
  bandeira_operadora: {
    type: Sequelize.STRING,
  }
},
{
  classMethods: {
    associate: function(models) {
      models.FormaPagamento.belongsTo(models.Venda)
    }
  }
},
{
  freezeTableName: true // Model tableName will be the same as the model name
});

models.FormaPagamento.associate(models);
models.Produto.associate(models);
models.Venda.associate(models);

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;

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
