Estacion Meteorologia :
Proyecto personal , desarollado usando ESP32 que cuenta con 4 sensores para la toma de datos con un intervalo de 10 minutos 
y envia los valores de cada sensor a pagina creada por medio de FIREBASE.
Esp32 comienza como punto de acceso , donde el usuario se conecta por medio de la red wifi brindada del microcontrolador,
para luego conectandose al numero IP brindado en el manual, se visualiza la pagina creada en la memoria SPIFFS donde aparecen las redes wifi
mas cercanas al ESP32 y asi el usuario se conectada a ellas seleccionado la red e introduciendo el password de la misma. 
Una vez conectado , este microcontrolador se convierte en modo estacion para conectarse a la red wi fi y asi enviar los datos de los sensores 
a la base de datos FIREBASE para que se conecte con la pagina donde se visualizan los mismos.
