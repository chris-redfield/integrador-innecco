/*
    Integrador do Vend com o Focus NF-e
    Autor: Christian Miranda - christianmoryah@gmail.com
 */

//lib http do webserver
var http = require("http");
//lib para io com o file system
var fs = require("fs");

var porta = "8080";

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

        //compoe o nome do arquivo com data+T+hora+cpf.json
        nomeArquivo = jsonVend.sale_date.replace(" ", "T") + "-";
        nomeArquivo += jsonVend.customer.customer_code + ".json";
        console.log(nomeArquivo);

        //TO-DO: Especificar decentemente qual será o caminho do arquivo
        fs.writeFile( "./jsonVend/"+nomeArquivo, JSON.stringify(jsonVend), "utf8", function(err) {
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
