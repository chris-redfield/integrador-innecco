/*
    Integrador do Vend com o Focus NF-e
    Autor: Christian Miranda - christianmoryah@gmail.com
 */

//lib http do webserver
var http = require("http");

//lib tratar o POST
var qs = require("querystring");

var porta = "8888";

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

        //parseia o request para manipulação
        var post = qs.parse(queryData);

        //retira somente o payload JSON
        queryData = post['payload'];

        //use a linha abaixo para logar o conteúdo do JSON
        //console.log(JSON.parse(queryData));

        //jsontiza os dados do request
        var jsonVend = JSON.parse(queryData);

        var vendaDao = require('./dao/venda');

        //Persiste a venda para processamento posterior
        vendaDao.saveVenda(jsonVend);

        callback();
    });

}
//======================== fim da function processPost

console.log("Iniciando servidor");
console.log("\n");

/*
  Criando servidor WebHook para o Vend
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
