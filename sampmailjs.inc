#if !defined n_sampmailjs_include
    #define n_sampmailjs_include
#endif

#include a_http
#include strlib

#define SAMPMAILJS_RESPONSE_OK 200
#define SAMPMAILJS_RESPONSE_FORBIDEN 403
#define SAMPMAILJS_RESPONSE_ERROR 400
#define SAMPMAILJS_RESPONSE_NOTFOUND 404

#define SAMPMAILJS_URL "127.0.0.1:8080" // IP + Porta do servidor NodeJS
#define SAMPMAILJS_PASSWORD "changeme" // Password para ter mais segurança
#define SAMPMAILJS_CONSOLELOG 0 // Quando é 1, dá log na consola do servidor quando é enviado um email
#define SAMPMAILJS_MAXPOSTDATA 2048 // Dependendo do tamanho dos emails que quer mandar, aumente o diminua este número

new uniqueID = 0;

forward HandleHTTPResponse(index, response_code, data[]);
public HandleHTTPResponse(index, response_code, data[]) {
    uniqueID++;

    #if SAMPMAILJS_CONSOLELOG == 1
      printf("\n[SAMPMAILJS] Foi recebida uma reposta %d do servidor", response_code);
    #endif

    if (response_code == SAMPMAILJS_RESPONSE_OK) {
      #if SAMPMAILJS_CONSOLELOG == 1
        printf("\n[SAMPMAILJS] Email %d enviado com sucesso!", uniqueID);
      #endif
    }

    return response_code;
}

stock SendEmail(name[], to[], subject[], text[]) {
  new string[64], postData[SAMPMAILJS_MAXPOSTDATA];

  format(string, sizeof string, "%s/sampmail.js?pw=%s&action=sendmail", SAMPMAILJS_URL, SAMPMAILJS_PASSWORD);
  format(postData, sizeof postData, "%s|%s|%s|%s", name, to, subject, text);

  return HTTP(uniqueID, HTTP_POST, string, ret_utf8encode(postData), "HandleHTTPResponse");
}
