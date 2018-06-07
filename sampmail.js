const http = require('http');
const url = require("url");
const nodemailer = require('nodemailer');
const fs = require('fs');

/* CONFIGURE DE ACORDO À SUA UTILIZAÇÃO */

var localIP = "127.0.0.1";
var porta = 8080;
var httpPassword = "changeme";
var conta = "omeuemail@gmail.com";
var google_ClientID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com";
var google_ClientSecret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var google_RefreshToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var debugDetalhado = 1;

// ===================================================================

criarServer();

function criarServer() {
  var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);

    if (urlObj.pathname == "/favicon.ico") {
      res.end();
      return;
    }

    console.log("Client (" + req.connection.remoteAddress + ") requested " + req.url);

    if (urlObj['query']['pw'] != httpPassword && urlObj['query']['pw'] != "undefined" && urlObj['query']['pw'] != "" && urlObj['query']['pw'] != null) {
      console.log("[" + req.connection.remoteAddress + "] -> 403: Password errada");
      res.writeHead(403, {
        'Content-Type': 'text/html;charset=UTF-8'
      });

      res.write("403: Acesso negado");
      res.end();
      return;
    }

    if (urlObj['query']['action'] == "sendm" || urlObj['query']['action'] == "sendmtmp") {
      if (req.method == 'POST') {
        var body = '';
        req.on('data', function(data) {
          body += data;
        });
        req.on('end', function() {
          var postArr = body.split('|');
          var name = postArr[0];
          var para = postArr[1];
          var assunto = postArr[2];
          var texto = postArr[3];

          if (urlObj['query']['action'] == "sendmtmp") {
            fs.readFile(postArr[4], 'utf8', function(err, data) {
              if (err) {
                console.log("Erro a ler o template: " + err);
              }

              var textoArr = texto.split('#');
              var templateText = data.toString();

              for (var i = 0; i < textoArr.length; i++) {
                var tagArr = textoArr[i].split(':');
                templateText = templateText.replace(tagArr[0], tagArr[1]);
              }

              if (debugDetalhado) {
                console.log("============ EMAIL A SER ENVIADO ============")
                console.log("De: " + name);
                console.log("Para: " + para);
                console.log("Assunto: " + assunto);
                console.log("Texto: " + templateText);
                console.log("=============================================")
              }

              var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                auth: {
                  type: "OAuth2",
                  user: conta,
                  clientId: google_ClientID,
                  clientSecret: google_ClientSecret,
                  refreshToken: google_RefreshToken
                }
              });

              var mailOptions = {
                from: name + ' <' + conta + '>',
                to: para,
                subject: assunto,
                html: templateText
              }

              transporter.sendMail(mailOptions, function(err, asd) {
                if (err) {
                  console.log("[" + req.connection.remoteAddress + "] -> 400: Erro");
                  res.writeHead(400, {
                    'Content-Type': 'text/html;charset=UTF-8'
                  });

                  res.write("400: Ocorreu um erro:</br>" + err);
                  res.end();
                  return;
                } else {
                  console.log("[" + req.connection.remoteAddress + "] -> 200: Email enviado");
                  res.writeHead(200, {
                    'Content-Type': 'text/html;charset=UTF-8'
                  });

                  res.write("Email enviado com sucesso");
                  res.end();
                  return;
                }
              })
            });
          } else {
            if (debugDetalhado) {
              console.log("============ EMAIL A SER ENVIADO ============")
              console.log("De: " + name);
              console.log("Para: " + para);
              console.log("Assunto: " + assunto);
              console.log("Texto: " + texto);
              console.log("=============================================")
            }

            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              auth: {
                type: "OAuth2",
                user: conta,
                clientId: google_ClientID,
                clientSecret: google_ClientSecret,
                refreshToken: google_RefreshToken
              }
            });

            var mailOptions = {
              from: name + ' <' + conta + '>',
              to: para,
              subject: assunto,
              html: texto
            }

            transporter.sendMail(mailOptions, function(err, asd) {
              if (err) {
                console.log("[" + req.connection.remoteAddress + "] -> 400: Erro");
                res.writeHead(400, {
                  'Content-Type': 'text/html;charset=UTF-8'
                });

                res.write("400: Ocorreu um erro:</br>" + err);
                res.end();
                return;
              } else {
                console.log("[" + req.connection.remoteAddress + "] -> 200: Email enviado");
                res.writeHead(200, {
                  'Content-Type': 'text/html;charset=UTF-8'
                });

                res.write("Email enviado com sucesso");
                res.end();
                return;
              }
            })
          }
        });
      }
    } else {
      console.log("[" + req.connection.remoteAddress + "] -> 404: Action inexistente");
      res.writeHead(404, {
        'Content-Type': 'text/html;charset=UTF-8'
      });

      res.write("404: Pedido incorreto");
      res.end();
      return;
    }

  });
  server.listen(porta, localIP);

  console.log('Servidor a correr em http://' + localIP + ':' + porta + '/');
}
