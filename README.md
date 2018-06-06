# SAMPMailJS

Esta include serve para enviar emails do Gmail direitamente de um servidor SAMP, usando para isso um servidor em NodeJS. O tutorial de como configurar esta include está presente no tópico do fórum SAMP.

Todas as informações aqui: http://forum.sa-mp.com/showthread.php?p=4026407


###### USO
```
SendEmail(name[], to[], subject[], text[])

name - Nome do email que envia
to - Destinatário
subject - Assunto
texto - Body do email
```

###### EXEMPLO
```
SendEmail("SAMPMailJS Server", "random@gmail.com", "Registo no servidor", "Bem Vindo ao servidor! Obrigado por se registar!");
```
