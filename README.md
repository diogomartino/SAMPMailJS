# SAMPMailJS

Use this include to send emails directly trough a gmail account. This will prevent that your mails end on the spam folder.


### WIKI

Please check the [Wiki](https://github.com/bruxo00/SAMPMailJS/wiki) for more information and documentation.


### DEPENDENCIES

You must install the dependencies below 

**Strlib**
https://github.com/oscar-broman/strlib

**nodemailer**
*npm install nodemailer --save*

**http**
*npm install http --save*

**url**
*npm install url --save*

**fs**
*npm install fs --save*


### FUNCTIONS

```
SendEmail(name[], to[], subject[], text[], bool:isTemplate = false, templateName[] = "default.html")
```

###### name: The name that will appear next to your email
###### to: The email address you want to send the email to
###### subject: The subject of your email
###### isTemplate: When set to false, it will only send the text you input in the argument text. When set to true, it will try to use a template.
###### templateName: The file name of the template that must be in the same folder of your NodeJS script.
