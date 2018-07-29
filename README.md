# SAMPMailJS

Use this include to send emails directly trough a gmail account. This will prevent that your mails end on the spam folder.

### WIKI

Please check the Wiki for more information and documentation. [Learn more](https://github.com/bruxo00/SAMPMailJS/wiki)

### DEPENDENCIES

You must install the dependencies below 

**strlib**
[Github Repository](https://github.com/oscar-broman/strlib)

**nodejs**
[Official Download Site](https://nodejs.org/en/)

**nodemailer**
`npm install nodemailer --save`

**http**
`npm install http --save`

**url**
`npm install url --save`

**fs**
`npm install fs --save`


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
