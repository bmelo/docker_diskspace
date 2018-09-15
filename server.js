const ipServer = '0.0.0.0';
const port = 80;

const http = require('http');
const url = require('url');
const File = require('./lib/files.js');

//Configurando FILE para escrever output
File.success = function (content, res) {
	response = {
		result: content
	};
	res.end(JSON.stringify(response));
};

//SERVIDOR
http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' }); //RESPOSTAS SERÃO NO FORMATO JSON
	res.connection.setTimeout(600000); //Para não terminar a conexão antes de 10 minutos
	//Tratando query para direcionar output
	var query = url.parse(req.url, true).query;
	console.log(query);

	//UNICA REQUISICAO POSSIVEL NO MOMENTO
	switch (query.action) {
		case 'sizeDir':
			File.getSizeDir(query.dir, res); break;
		case 'diskUse':
			File.getDiskUse(query.disk, res); break;
		default:
			res.end();
	}
}).listen(port, ipServer);

console.log('IDOR Webservice running at http://%s:%s/', ipServer, port);
