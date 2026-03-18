# viatges





#Instalacion Proyecto

git clone https://github.com/ErJaLo/PathFinder

cd viatges

cp .env.example .env

Comprovar si se ha de modificar el .env

## Instalar dependencias 

### Laravel
composer install

### React
npm install


## Setup Servidor:

## Generacion de AppKey
php artisan key:gen

## Generacion BD (sqlite por defecto)
php artisan migrate

## Ejecutar servidor
composer run dev