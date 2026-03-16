# viatges





#Instalacion Proyecto

git clone https://github.com/ErJaLo/viatges

cd viatges

cp .env.example .env

Comprovar si se ha de modificar el .env

#Instalar dependencias 

#Laravel
composer run dev

#React
npm install


#Setup Servidor:

#Generacion de AppKey
php artisan key:gen

#Generacion BD (sqlite por defecto)
php artisan migrate
