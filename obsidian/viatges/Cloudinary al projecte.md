# Cloudinary al projecte

## Que es Cloudinary?

Cloudinary es un **CDN especialitzat en imatges**. En comptes d'emmagatzemar les imatges al servidor propi i servir-les desde alla, les imatges es pugen a Cloudinary, que:

- Les guarda als seus servidors
- Les serveix des d'un CDN global (edges distribuits arreu del mon)
- Les **transforma en temps real** (resize, format, qualitat)
- Les **converteix automaticament** a WebP o AVIF segons el navegador del visitant

Avantatges per a PathFinder:
- Menys carrega al servidor propi (no processa imatges, no les serveix)
- Imatges mes petites (WebP/AVIF son fins al 50% mes lleugeres que JPEG)
- Carrega mes rapida (CDN proper al visitant)
- Responsive: Cloudinary pot generar diferents mides segons la pantalla

## Com funciona el flux complet

```
Usuari puja una imatge al formulari
          ↓
ExperienceForm envia multipart/form-data
          ↓
ExperienciaController@store rep el fitxer
          ↓
ImageOptimizer->store($file)
          ↓
  ┌───────┴───────┐
  ↓               ↓
Cloudinary      Local (fallback)
configurat?     
  ↓               ↓
 Si              No
  ↓               ↓
Puja a           GD resize + WebP
Cloudinary       + guardar a storage/
  ↓               ↓
Torna           Torna
secure_url      /storage/xxx.webp
  └───────┬───────┘
          ↓
Es guarda a posts.image
          ↓
El frontend mostra <img src={post.image}>
```

## El servei ImageOptimizer

Es un servei PHP que abstrau la decisio entre Cloudinary i local. Viu a `app/Services/ImageOptimizer.php`.

### Metode principal: `store()`

```php
public function store(UploadedFile $file, string $directory = 'experiences'): string
{
    if ($this->cloudinaryEnabled()) {
        $url = $this->uploadToCloudinary($file, $directory);
        if ($url !== null) return $url;
        Log::warning('Cloudinary upload failed, falling back to local storage');
    }
    return $this->storeLocally($file, $directory);
}
```

Comprova si Cloudinary esta configurat al `.env`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Si les tres existeixen → upload a Cloudinary.
Si falta alguna, o si la peticio HTTP falla → fallback automatic a local amb GD.

### Upload signat (sense SDK)

El servei fa la crida **directament via HTTP**, sense necessitar el paquet `cloudinary/cloudinary-laravel`. Aixo evita problemes de compatibilitat de versions de PHP.

Els parametres que Cloudinary exigeix per a un upload signat son:

| Parametre | Valor | Firmat? |
|-----------|-------|---------|
| `file` | El binari de la imatge | No |
| `api_key` | La clau publica | No |
| `timestamp` | Hora actual (segons) | Si |
| `folder` | `pathfinder/experiences` | Si |
| `eager` | `c_limit,w_1600/f_auto/q_auto:good` | Si |
| `signature` | SHA1 dels parametres firmats + api_secret | - |

La firma es genera aixi:

```php
private function signCloudinaryParams(array $params, string $apiSecret): string
{
    ksort($params);
    $toSign = [];
    foreach ($params as $key => $value) {
        $toSign[] = "{$key}={$value}";
    }
    return sha1(implode('&', $toSign) . $apiSecret);
}
```

Exemple: si `timestamp=1719849600`, `folder=pathfinder/experiences`, `eager=c_limit,w_1600/f_auto/q_auto:good`, i `api_secret=xyz`, la cadena a firmar es:

```
eager=c_limit,w_1600/f_auto/q_auto:good&folder=pathfinder/experiences&timestamp=1719849600xyz
```

I s'hi aplica SHA1.

### La crida HTTP

```php
$response = Http::timeout(30)
    ->attach('file', file_get_contents($file->getPathname()), $file->getClientOriginalName())
    ->post("https://api.cloudinary.com/v1_1/{$cloud}/image/upload", [
        'api_key' => $apiKey,
        'timestamp' => $timestamp,
        'folder' => $folder,
        'eager' => $eager,
        'signature' => $signature,
    ]);
```

Cloudinary respon amb un JSON que conte (entre altres):

```json
{
  "public_id": "pathfinder/experiences/abc123",
  "secure_url": "https://res.cloudinary.com/xxx/image/upload/v1719849600/pathfinder/experiences/abc123.jpg",
  "format": "jpg",
  "width": 1600,
  "height": 1067,
  "bytes": 234567
}
```

Ens quedem amb `secure_url` i la guardem a `posts.image`.

## Transformacions automatiques

El parametre `eager` li demana a Cloudinary que prepari una versio transformada **al moment de l'upload**. L'string que fem servir es:

```
c_limit,w_1600/f_auto/q_auto:good
```

Que vol dir:

| Directiva | Significat |
|-----------|-----------|
| `c_limit,w_1600` | Amplada maxima 1600px (mai amplia si es mes petita) |
| `f_auto` | Format automatic: WebP si el navegador ho suporta, AVIF si ho suporta, si no JPEG |
| `q_auto:good` | Qualitat automatica balancejada |

Cloudinary pot aplicar moltes mes transformacions a URLs existents sense re-pujar, nomes modificant la URL. Per exemple:

```
Original: https://res.cloudinary.com/xxx/image/upload/v123/pathfinder/experiences/abc.jpg
Thumbnail: https://res.cloudinary.com/xxx/image/upload/c_fill,w_200,h_200,g_auto/v123/pathfinder/experiences/abc.jpg
```

Aquestes URLs dinamiques son responsives: podrien servir imatges de 200px per thumbnails i 1600px per a la pagina de detall, **sense necessitat de processar res al servidor**.

Al projecte actualment nomes guardem la URL base amb la transformacio eager aplicada, pero podriem extendre-ho si volem un `srcset` responsive.

## Que passa si Cloudinary falla?

Si la crida HTTP retorna un error (credencials invalides, Cloudinary caigut, timeout):

1. El servei registra un warning al log (`storage/logs/laravel.log`).
2. Automaticament crida `storeLocally()`.
3. `storeLocally()` fa:
   - Carrega la imatge amb GD (PHP natiu)
   - La redimensiona si es mes gran de 1600px
   - La desa com a WebP amb qualitat 80%
   - La guarda a `storage/app/public/experiences/xxx.webp`
   - Retorna `/storage/experiences/xxx.webp`

L'usuari no nota cap diferencia: la seva imatge es puja correctament, nomes que al servidor local enlloc del CDN.

## Configuracio al `.env`

```env
CLOUDINARY_CLOUD_NAME=el_teu_cloud_name
CLOUDINARY_API_KEY=el_teu_api_key
CLOUDINARY_API_SECRET=el_teu_api_secret
CLOUDINARY_FOLDER=pathfinder
```

El `CLOUDINARY_FOLDER` es la carpeta arrel on Cloudinary organitza les imatges. Per defecte: `pathfinder`. Les experiencies es guarden a `pathfinder/experiences/`.

Despres de canviar `.env`:
```bash
php artisan config:clear
```

## Com obtenir les credencials

1. Crear compte gratuit a [cloudinary.com](https://cloudinary.com).
2. Al dashboard, al bloc **Account Details**, copiar:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

Plan gratuit: **25 GB d'ample de banda/mes i 25 GB d'emmagatzematge**. Mes que suficient per a un projecte academic o una aplicacio petita-mitjana.

## Verificar si esta actiu

Al terminal:

```bash
php artisan tinker --execute="echo config('services.cloudinary.cloud_name') ? 'Cloudinary actiu' : 'Mode local';"
```

O creant una experiencia nova: si la URL de la imatge comença per `https://res.cloudinary.com/` es Cloudinary, si comença per `/storage/` es local.

## Integracio amb el frontend

El frontend **no sap si es Cloudinary o local**. Simplement renderitza:

```tsx
<img src={experience.image} loading="lazy" />
```

Funciona identic amb ambdos origens. Aquest es un disseny volgut: el servei abstrau la decisio i el frontend nomes rep URLs.

El `loading="lazy"` fa que el navegador nomes carregui la imatge quan es a prop del viewport, estalviant ample de banda si l'usuari no la veu mai.

## Gestio d'imatges antigues

Quan s'elimina o actualitza una experiencia:

- **Imatges locals**: el controller les elimina del disc amb `Storage::disk('public')->delete()`.
- **Imatges a Cloudinary**: **no es netegen** automaticament. Queden orfanes al CDN.

Es una limitacio coneguda (documentada a `SEGURETAT.txt`). Per netejar-les caldria:

1. Fer una crida signada a `https://api.cloudinary.com/v1_1/{cloud}/image/destroy` amb el `public_id` de la imatge.
2. O fer neteja manual periodica desde el dashboard de Cloudinary.

Per un projecte de produccio real, caldria implementar el pas 1 al controller.

## Codi afectat

| Fitxer | Rol |
|--------|-----|
| `app/Services/ImageOptimizer.php` | Servei amb la logica de decisio i upload |
| `app/Http/Controllers/ExperienciaController.php` | Utilitza el servei a `store()` i `update()` |
| `config/services.php` | Configuracio de Cloudinary |
| `.env.example` | Variables documentades |
| `docs/cloudinary-setup.md` | Guia rapida d'instal·lacio |

## Resum

- **Dues vies** amb fallback transparent: Cloudinary o local-GD.
- **Upload signat** via HTTP SHA1, sense paquet composer extern.
- **Transformacio eager** al moment de l'upload: resize + format auto + qualitat auto.
- **URL final** guardada a BBDD; el frontend la pinta directament.
- **Gratuit** fins a 25 GB/mes; mes que suficient per al projecte.
- **Fallback segur** si el CDN falla: local amb GD, sense interrupcio per l'usuari.
