Per il servizio back-end in php serve la cartella mio-sito con i file che vengono utilizzati con l'accesso all'url: "http://localhost:8080"

per avviare il back-end bisogna:

eseguire il comando qui sotto se su linux
docker run -d -p 8080:80 --name my-apache-php-app --rm -v /home/informatica/mio-sito:/var/www/html zener79/php:7.4-apache
se invece si vuole eseguire su windows o non si ha la cartella in quel percorso su linux prendere il percorso file e sostituirlo al posto di "/home/informatica/mio-sito"

per avviare il database da cui il back-end prende i dati:

docker run --name my-mysql-server --rm -v /home/informatica/mysqldata:/var/lib/mysql -v /home/informatica/dump:/dump -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest
(o come prima sostituire /home/informatica/mysqldata e /home/informatica/dump al percorso in cui si vuole avere le cartelle)


poi si entra nella bash dell'immagine sql:
	docker exec -it my-mysql-server bash
e si importa il dump:
mysql -u root -p < /dump/create_employee.sql; exit;(exit il comando per uscire)
inserendo la password: my-secret-pw




poi aprendo l'index nella cartella jQueryProva su browser avrai la tabella voluta.