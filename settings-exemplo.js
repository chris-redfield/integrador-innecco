var settings = {};

settings.CNPJ303 = "";
settings.CNPJAER = "";
settings.IDREG303 = "";
settings.IDREGAER = "";
settings.CLIENT_ID = "";
settings.CLIENT_SECRET = "";
settings.STORAGE_PATH = "";

settings.FORMAS_PAGAMENTO = {
  "American Express" : {
    bandeira_operadora : '03',
    forma_pagamento : '03'
  },
  "Dinheiro" : {
    bandeira_operadora : '',
    forma_pagamento : '01'
  },
  "Elo Crédito"	: {
    bandeira_operadora : '99',
    forma_pagamento : '03'
  },
  "Elo Débito" : {
    bandeira_operadora : '99',
    forma_pagamento : '04'
  },
  "Master Crédito" : {
    bandeira_operadora : '02',
    forma_pagamento : '03'
  },
  "Master Débito" : {
    bandeira_operadora : '02',
    forma_pagamento : '04'
  },
  "PayPal" : {
    bandeira_operadora : '',
    forma_pagamento : '99'
  },
  "Visa Crédito" : {
    bandeira_operadora : '01',
    forma_pagamento : '03'
  },
  "Visa Débito" : {
    bandeira_operadora : '01',
    forma_pagamento : '04'
  },
};

module.exports = settings;
