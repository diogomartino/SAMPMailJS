const http = require('http');
const url = require("url");
const nodemailer = require('nodemailer');
const fs = require('fs');

/* SETUP WITH YOUR OWN SETTINGS */

var localIP = "127.0.0.1";
var port = 8080;
var httpPassword = "changeme";
var google_Account = "omeuemail@gmail.com";
var google_ClientID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com";
var google_ClientSecret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var google_RefreshToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var detailedDebug = 1;

// ===================================================================

createServer();

function createServer() {
  var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);

    if (urlObj.pathe_Name == "/favicon.ico") {
      res.end();
      return;
    }

    console.log("Client (" + req.connection.remoteAddress + ") requested " + req.url);

    if (urlObj['query']['pw'] != httpPassword && urlObj['query']['pw'] != "undefined" && urlObj['query']['pw'] != "" && urlObj['query']['pw'] != null) {
      console.log("[" + req.connection.remoteAddress + "] -> 403: Wrong password");
      res.writeHead(403, {
        'Content-Type': 'text/html;charset=UTF-8'
      });

      res.write("403: Access denied");
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
          var e_Name = postArr[0];
          var e_To = postArr[1];
          var e_Subject = postArr[2];
          var e_Text = postArr[3];

          if (urlObj['query']['action'] == "sendmtmp") {
            fs.readFile(postArr[4], 'utf8', function(err, data) {
              if (err) {
                console.log("[" + req.connection.remoteAddress + "] -> 400: Error");
                res.writeHead(400, {
                  'Content-Type': 'text/html;charset=UTF-8'
                });

                res.write("400: An error ocurred:</br>" + err);
                res.end();
                return;
              }

              var textArr = e_Text.split('#');
              var templateText = data.toString();

              for (var i = 0; i < textArr.length; i++) {
                var tagArr = textArr[i].split(':');
                templateText = templateText.replace(tagArr[0], tagArr[1]);
              }

              if (detailedDebug) {
                console.log("================ SENDING EMAIL ================");
                console.log("From: " + e_Name);
                console.log("To: " + e_To);
                console.log("Subject: " + e_Subject);
                console.log("Text: " + templateText);
                console.log("===============================================");
              }

              var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                auth: {
                  type: "OAuth2",
                  user: google_Account,
                  clientId: google_ClientID,
                  clientSecret: google_ClientSecret,
                  refreshToken: google_RefreshToken
                }
              });

              var mailOptions = {
                from: e_Name + ' <' + google_Account + '>',
                to: e_To,
                subject: e_Subject,
                html: templateText
              }

              transporter.sendMail(mailOptions, function(err, asd) {
                if (err) {
                  console.log("[" + req.connection.remoteAddress + "] -> 400: Error");
                  res.writeHead(400, {
                    'Content-Type': 'text/html;charset=UTF-8'
                  });

                  res.write("400: An error ocurred:</br>" + err);
                  res.end();
                  return;
                } else {
                  console.log("[" + req.connection.remoteAddress + "] -> 200: Email sent");
                  res.writeHead(200, {
                    'Content-Type': 'text/html;charset=UTF-8'
                  });

                  res.write("Email sent successfully");
                  res.end();
                  return;
                }
              })
            });
          } else {
            if (detailedDebug) {
              console.log("================ SENDING EMAIL ================")
              console.log("De: " + e_Name);
              console.log("To: " + e_To);
              console.log("Subject: " + e_Subject);
              console.log("Text: " + e_Text);
              console.log("===============================================")
            }

            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              auth: {
                type: "OAuth2",
                user: google_Account,
                clientId: google_ClientID,
                clientSecret: google_ClientSecret,
                refreshToken: google_RefreshToken
              }
            });

            var mailOptions = {
              from: e_Name + ' <' + google_Account + '>',
              to: e_To,
              subject: e_Subject,
              html: e_Text
            }

            transporter.sendMail(mailOptions, function(err, asd) {
              if (err) {
                console.log("[" + req.connection.remoteAddress + "] -> 400: Error");
                res.writeHead(400, {
                  'Content-Type': 'text/html;charset=UTF-8'
                });

                res.write("400: An error ocurred:</br>" + err);
                res.end();
                return;
              } else {
                console.log("[" + req.connection.remoteAddress + "] -> 200: Email sent");
                res.writeHead(200, {
                  'Content-Type': 'text/html;charset=UTF-8'
                });

                res.write("Email sent successfully");
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

      res.write("404: Incorrect request");
      res.end();
      return;
    }

  });
  server.listen(port, localIP);

  console.log('Server running on http://' + localIP + ':' + port + '/');
}
