# SAMPMailJS

Use this include to send emails directly trough a gmail account. This will prevent that your mails end on the spam folder. We now support custom SMTP servers.

### WIKI

Please check the Wiki for more information and documentation. [Learn more](https://github.com/bruxo00/SAMPMailJS/wiki)
You can also see a video on how to set this up properly [HERE](https://www.youtube.com/watch?v=n5V3E5x8FxY).

### DEPENDENCIES

You must install the dependencies below 

**strlib**
[Github Repository](https://github.com/oscar-broman/strlib)

**nodejs**
[Official Download Site](https://nodejs.org/en/)


### FUNCTIONS

```
SendEmail(name[], to[], subject[], text[], bool:isTemplate = false, templateName[] = "default.html")
```
Parameters Guide:

     name: The name that will appear next to your email (string)
     to: The email address you want to send the email to (string)
     subject: The subject of your email (string)
     isTemplate: When set to false, it will only send the text you input in the argument text. When set to true, it will try to use a template. (boolean)
     templateName: The file name of the template that must be in the same folder of your NodeJS script. (string)
