/*
    DAO do objeto venda
*/

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
    */
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

};
