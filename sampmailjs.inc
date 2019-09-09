#if !defined n_sampmailjs_include
    #define n_sampmailjs_include
#endif

#include a_http
#include strlib

#define SAMPMAILJS_RESPONSE_OK 200
#define SAMPMAILJS_RESPONSE_FORBIDEN 403
#define SAMPMAILJS_RESPONSE_ERROR 400
#define SAMPMAILJS_RESPONSE_NOTFOUND 404

#define SAMPMAILJS_URL "127.0.0.1:8080" // IP + PORT of the server running the NodeJS script
#define SAMPMAILJS_PASSWORD "changeme" // This password should be the same as the NodeJS script
#define SAMPMAILJS_CONSOLELOG 0 // Log some information on console
#define SAMPMAILJS_MAXPOSTDATA 1024 // Cellsize of the variable that holds the data sent to the script. Lower for small emails, higher for more extense emails

new uniqueID = 0;

forward HandleHTTPResponse(index, response_code, data[]);
public HandleHTTPResponse(index, response_code, data[]) {
    uniqueID++;

    #if SAMPMAILJS_CONSOLELOG == 1
		printf("\n[SAMPMAILJS] Server returned a response %d", response_code);
    #endif

    if (response_code == SAMPMAILJS_RESPONSE_OK) {
  		#if SAMPMAILJS_CONSOLELOG == 1
  			printf("\n[SAMPMAILJS] Email %d sent successfully", uniqueID);
  		#endif
    }

	return response_code;
}

stock SendEmail(name[], to[], subject[], text[], bool:isTemplate = false, templateName[] = "default.html") {
	new string[128], postData[SAMPMAILJS_MAXPOSTDATA];

	if(isTemplate) {
		format(string, sizeof string, "%s/sampmail.js?pw=%s&action=sendmtmp", SAMPMAILJS_URL, SAMPMAILJS_PASSWORD);
		format(postData, sizeof postData, "%s|%s|%s|%s|%s", name, to, subject, text, templateName);
	}
	else {
 		format(string, sizeof string, "%s/sampmail.js?pw=%s&action=sendm", SAMPMAILJS_URL, SAMPMAILJS_PASSWORD);
	  	format(postData, sizeof postData, "%s|%s|%s|%s", name, to, subject, text);
	}

  	utf8encode(postData, postData);
	return HTTP(uniqueID, HTTP_POST, string, postData, "HandleHTTPResponse");
}
