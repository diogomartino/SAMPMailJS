# SAMPMailJS

[![sampctl](https://img.shields.io/badge/sampctl-SAMPMailJS-2f2f2f.svg?style=for-the-badge)](https://github.com/Fairuz-Afdhal/SAMPMailJS)


## Installation

Simply install to your project:

```bash
sampctl package install Fairuz-Afdhal/SAMPMailJS
```

Include in your code and begin using the library:

```pawn
#include <SAMPMailJS>
```

## Usage


```pawn
SendEmail(name[], to[], subject[], text[], bool:isTemplate = false, templateName[] = "default.html")
```
```quote
 name: The name that will appear next to your email (string)
 to: The email address you want to send the email to (string)
 subject: The subject of your email (string)
 isTemplate: When set to false, it will only send the text you input in the argument text. When set to true, it will try to use a template. (boolean)
 templateName: The file name of the template that must be in the same folder of your NodeJS script. (string)
```

## Testing

To test, simply run the package:

```bash
sampctl package run
```
