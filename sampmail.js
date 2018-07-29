const http = require('http');
const url = require("url");
const nodemailer = require('nodemailer');
const fs = require('fs');

var templateFolder = __dirname + "/templates/";
var config;

try {
  config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
  console.log("Loaded configs from config.json");

  if(config.enableDebug) {
    console.log("\n\n");
    console.log(config);
    console.log("\n\n");
  }
} catch (e) {
  console.log("Couldn't read from config.json");
  process.exit();
}

if (!fs.existsSync(templateFolder)) {
  console.log("Warning: templates folder doesn't exist, the script will crash if you try to use a template. Please create the directory " + templateFolder + "\n");
}

var transporter = nodemailer.createTransport(config.smtp);

createServer();

function logResponse(address, code, text, res) {
  res.writeHead(code, {
    'Content-Type': 'text/html;charset=UTF-8'
  });

  res.write("Powered by SAMPMailJS</br>" + code + ": " + text);
  res.end();

  var consoleText = text.replace("</br>", "\n");
  console.log("Sent HTTP code " + code + " to " + address + ": " + consoleText);
}

function createServer() {
  var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);

    if (urlObj.pathe_Name == "/favicon.ico") {
      res.end();
      return;
    }

    console.log("Client (" + req.connection.remoteAddress + ") requested " + req.url);

    if (urlObj['query']['pw'] != config.httpPassword && urlObj['query']['pw'] != "undefined" && urlObj['query']['pw'] != "" && urlObj['query']['pw'] != null) {
      logResponse(req.connection.remoteAddress, 403, "Wrong password", res);
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
            var templateName = postArr[4];

            fs.readFile(templateFolder + templateName, 'utf8', function(err, data) {
              if (err) {
                logResponse(req.connection.remoteAddress, 400, "An error ocurred:</br>" + err, res);
                return;
              }

              var textArr = e_Text.split('#');
              var templateText = data.toString();

              for (var i = 0; i < textArr.length; i++) {
                var tagArr = textArr[i].split(':');
                templateText = templateText.replace(tagArr[0], tagArr[1]);
              }

              if (config.enableDebug) {
                console.log("================ SENDING EMAIL ================");
                console.log("From: " + e_Name);
                console.log("To: " + e_To);
                console.log("Subject: " + e_Subject);
                console.log("Text: " + templateText);
                console.log("===============================================");
              }

              var mailOptions = {
                from: e_Name + ' <' + config.smtp.auth.user + '>',
                to: e_To,
                subject: e_Subject,
                html: templateText
              }

              transporter.sendMail(mailOptions, function(err, asd) {
                if (err) {
                  logResponse(req.connection.remoteAddress, 400, "An error ocurred:</br>" + err, res);
                  return;
                } else {
                  logResponse(req.connection.remoteAddress, 200, "Email sent successfully", res);
                  return;
                }
              })
            });
          } else {
            if (config.enableDebug) {
              console.log("================ SENDING EMAIL ================")
              console.log("De: " + e_Name);
              console.log("To: " + e_To);
              console.log("Subject: " + e_Subject);
              console.log("Text: " + e_Text);
              console.log("===============================================")
            }

            var mailOptions = {
              from: e_Name + ' <' + config.smtp.auth.user + '>',
              to: e_To,
              subject: e_Subject,
              html: e_Text
            }

            transporter.sendMail(mailOptions, function(err, asd) {
              if (err) {
                logResponse(req.connection.remoteAddress, 400, "An error ocurred:</br>" + err, res);
                return;
              } else {
                logResponse(req.connection.remoteAddress, 200, "Email sent successfully", res);
                return;
              }
            })
          }
        });
      }
    } else {
      logResponse(req.connection.remoteAddress, 404, "Incorrect request", res);
      return;
    }

  });
  server.listen(config.listenPort, config.machineIp);

  console.log('Server running on http://' + config.machineIp + ':' + config.listenPort + '/');
}
