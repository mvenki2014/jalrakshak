# jalrakshak
Jalrakshak is an app based on IoT Architecture to monitor and manage water consumption in a smart way.

# how to run server

* install nodejs and run npm install in project folder
* install mysql and configure mysql following the steps in https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04 

Note: Use the below command to give privileges to mysql db user instead of authetication plugin or caching_sha2_password options:

CREATE USER 'sammy'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

* cretae database jalrakshak
* configure database, username and password in config.json
* install and Secure the Mosquitto Server
* configure mqtt broker server, user and password details in config.json
* run npm start in project folder
* it will start server at port 8085 and mqtt broker will consume messages and store it in database

# how to validate the installation

* open terminal session on jalrakshak-db server and run the below command

mosquitto_sub -u jalmqttadmin -P SptGwd5% -v -t "#"

* open terminal session on jalrakshak-ui server or any other linux server on same network and run the below command

mosquitto_pub -h <mqtt-server-ip> -u <mqtt-username> -P <mqtt-password> -d -t WIOT/<esp_id>/ -m '{"1b64c8":{"FLOW_RATE":30,"TOTAL_LITERS":2,"WATER_LEVEL":250,"SV_STATE":0}}'
  
* open a new terminal session on jalrakshak-db server and login to mysql command line
* set database to jalraksha
  
 use jalrakshdb;

 * list contents of table 

 select * from jalrakshak_<esp_id>;
