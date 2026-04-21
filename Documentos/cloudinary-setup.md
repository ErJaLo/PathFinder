# Configuracio de Cloudinary

Cloudinary es un CDN especialitzat en imatges. PathFinder pot servir les imatges desde Cloudinary en lloc d'emmagatzemar-les localment, aprofitant:

- Transformacions automatiques (resize, format, qualitat)
- Conversio a formats moderns (WebP/AVIF) segons el navegador
- CDN global amb cache
- Menys carrega al servidor propi

## Comportament

- **Si Cloudinary esta configurat** al `.env`, les imatges es pujen alla i es guarda la URL segura a la BBDD (`posts.image`).
- **Si no esta configurat**, les imatges s'optimitzen localment amb GD (resize + WebP) i es serveixen desde `storage/app/public/` via el symlink `public/storage`.

No cal cap canvi al frontend: les imatges es mostren amb `<img src={experience.image}>` funcioni on funcioni l'origen.

## Com obtenir credencials

1. Crear compte gratuit a [cloudinary.com](https://cloudinary.com) (plan free: 25GB/mes).
2. Al dashboard veuras un bloc "Account Details" amb:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

## Configurar al projecte

Afegir al fitxer `.env`:

```
CLOUDINARY_CLOUD_NAME=el_teu_cloud_name
CLOUDINARY_API_KEY=el_teu_api_key
CLOUDINARY_API_SECRET=el_teu_api_secret
CLOUDINARY_FOLDER=pathfinder
```

El camp `CLOUDINARY_FOLDER` (opcional) es la carpeta arrel on es crearan les imatges a Cloudinary. Per defecte: `pathfinder`.

Despres, netejar el cache de configuracio:

```bash
php artisan config:clear
```

## Com funciona internament

El servei `App\Services\ImageOptimizer` fa l'upload via HTTP signat (sense paquet composer):

1. Es genera un `timestamp` i una signatura SHA1 amb els parametres + `api_secret`.
2. Es fa un POST multipart a `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` amb:
   - El fitxer
   - `api_key`, `timestamp`, `folder`, `eager`, `signature`
3. La transformacio `eager` aplica: `c_limit,w_1600/f_auto/q_auto:good`
   - `c_limit,w_1600` — max 1600px d'ample (mai ampliar)
   - `f_auto` — format automatic (WebP/AVIF segons suport)
   - `q_auto:good` — qualitat automatica balancejada
4. Es retorna la `secure_url` (https://res.cloudinary.com/...) i es guarda a la BBDD.

## Fallback a local

Si Cloudinary falla (error de xarxa, credencials invalides), el servei registra un warning al log i guarda la imatge localment. No hi ha interrupcio per l'usuari.

## Gestio d'imatges antigues

- **Local**: quan s'elimina/actualitza una experiencia, la imatge antiga es borra del disc.
- **Cloudinary**: les imatges antigues queden orfanes al CDN. Cloudinary no es neteja automaticament — si cal, es pot implementar via `destroy` API (signat igual que l'upload) o netejar manualment desde el dashboard de Cloudinary.
