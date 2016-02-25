/*
    DAO do objeto venda
*/
var Sequelize = require('sequelize');
var settings = require('./settings');

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
  storage: settings.STORAGE_PATH
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
  invoice_number: {
    type: Sequelize.INTEGER,
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
  },
  url_nota: {
    type: Sequelize.STRING,
  }
  //items: {},
  //formas_pagamento: {}
},
{
   classMethods: {
     associate: function(models) {
       models.Venda.hasMany(models.Item),
       models.Venda.hasMany(models.FormaPagamento)
     }
   }
 },
{
  freezeTableName: true // Model tableName will be the same as the model name
});

// Fim da Venda

models.Item = sequelize.define('item', {
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
    /*  Aceita valores entre 1 e 7,
        0: nacional
        1: estrangeira (importação direta)
        2: estrangeira (adquirida no mercado interno)
        3: nacional com mais de 40% de conteúdo estrangeiro
        4: nacional produzida através de processos produtivos básicos
        5: nacional com menos de 40% de conteúdo estrangeiro
        6: estrangeira (importação direta) sem produto nacional similar
        7: estrangeira (adquirida no mercado interno) sem produto nacional similar
    */
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
    type: Sequelize.DECIMAL(10, 2),
  }
},
{
  classMethods: {
    associate: function(models) {
      models.Item.belongsTo(models.Venda)
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
    type: Sequelize.STRING,
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
models.Item.associate(models);
models.Venda.associate(models);

models.Auth = sequelize.define('auth', {
  domainPrefix: {
    type: Sequelize.STRING,
    defaultValue: "memodesign",
  },
  accessToken: {
    type: Sequelize.STRING,
  },
  refreshToken: {
    type: Sequelize.STRING,
  },
  expires: {
    type: Sequelize.STRING,
  },
  expires_in: {
    type: Sequelize.STRING,
  },
  vendClientId: {
    type: Sequelize.STRING,
  },
  vendClientSecret: {
    type: Sequelize.STRING,
  },
  vendTokenService: {
    type: Sequelize.STRING,
  },
})

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
