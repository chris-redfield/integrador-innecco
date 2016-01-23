/*
    Integrador do Vend com o Focus NF-e
    Autor: Christian Miranda - christianmoryah@gmail.com
 */

//lib http do webserver
var http = require("http");
//lib para io com o file system
var fs = require("fs");

var porta = "8888";

//TO-DO: Especificar decentemente qual será o caminho do arquivo
var pastaJsonVend = "./jsonVend/";

// Processa um request do tipo POST
function processPost(request, response, callback) {
    var queryData = "";

    //se a função não for assíncrona, não é seguro processar o request
    if(typeof callback !== 'function') return null;

    //caso venham dados no request
    request.on('data', function(data) {
        queryData += data;

        /*
          Verifica o tamanho do post, para evitar
          FLOOD ATTACK, NUKE REQUEST, etc
        */
        if(queryData.length > 1e6) {
            queryData = "";
            response.writeHead(413, {'Content-Type': 'text/plain'}).end();
            request.connection.destroy();
        }
    });

    request.on('end', function() {
        //jsontiza os dados do request
        var jsonVend = JSON.parse(queryData);

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

        //use a linha abaixo para logar o conteúdo do post
        //console.log(JSON.parse(queryData));
        callback();
    });

}
//======================== fim da function processPost

console.log("Iniciando servidor");
console.log("\n");

/*
  Criando servidor
*/
http.createServer(function (request, response) {

    //servidor só permitirá requests do tipo POST
    if(request.method == 'POST') {
        //se o POST vier, processa o post de maneira assíncrona
        processPost(request, response, function() {
            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            response.end();
        });
    } else {
        // HTTP 405 = Method not allowed (sorry dude, only POSTs in here)
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
    //TO-DO: incluir o domínio do Vend para permitir requests somente de lá
}).listen(porta);

console.log('servidor rodando em http://127.0.0.1:' + porta + '/ \n');
