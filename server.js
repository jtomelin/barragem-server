var coap        = require('coap')
  , server      = coap.createServer()
  , fs          = require('fs');


// metodo que recebe os parametros do site e entao grava esses parametros no arquivo para entao o raspberry ler o arquivo
// e jogar para a saida o valor recebido por parametro
server.on('request', function(req, res) {
  
  var comando = req.url.split('/')[1]
  var result  = comando.split('%7C')

  if (comando == 'obter') {
	console.log("Entrei no obter")
	
	fs.readFile("/tmp/barragem_percent_control.txt", "utf8", function(err, data) {
		if (err) {
			res.end("0|0|0")
			console.log("treta")
			fs.writeFile("/tmp/barragem_percent_control.txt", "0|0|0", function(err) {
				if(err) {
					//Se der falha na gravacao do arquivo, o servidor chamador, recebera um retorno de erro
					console.log("Falha na gravacao " + err)
					res.end("0|0|0")
					return;
				}	
				console.log("Arquivo salvo com sucesso!");
				
				return;
			}); 
		}
		console.log("Foi lido " + data)
		res.end(data)
	})
  }
  else {
	fs.writeFile("/tmp/barragem_input_control.txt", result[0] + '|' + result[1] + '|' + result[2],function(err) {
		if(err) {
          //Se der falha na gravacao do arquivo, o servidor chamador, recebera um retorno de erro
          res.end("Falha na gravacao " + err)
          return;
		}
		console.log("Arquivo salvo com sucesso!");
		res.end("Sucesso")
	}); 
  }
})

// porta padrao, 5683
// metodo para iniciar o servidor
server.listen()
