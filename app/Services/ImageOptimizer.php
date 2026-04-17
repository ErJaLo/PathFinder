<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageOptimizer
{
    private int $maxWidth;
    private int $quality;

    public function __construct(int $maxWidth = 1600, int $quality = 80)
    {
        $this->maxWidth = $maxWidth;
        $this->quality = $quality;
    }

    /**
     * Store an uploaded image.
     * Returns a PUBLIC URL:
     *  - If Cloudinary is configured: a secure Cloudinary URL.
     *  - Otherwise: a relative /storage/... path (served via public disk).
     */
    public function store(UploadedFile $file, string $directory = 'experiences'): string
    {
        if ($this->cloudinaryEnabled()) {
            $url = $this->uploadToCloudinary($file, $directory);
            if ($url !== null) {
                return $url;
            }
            // If Cloudinary fails, fall through to local storage.
            Log::warning('Cloudinary upload failed, falling back to local storage');
        }

        return $this->storeLocally($file, $directory);
    }

    private function cloudinaryEnabled(): bool
    {
        return !empty(config('services.cloudinary.cloud_name'))
            && !empty(config('services.cloudinary.api_key'))
            && !empty(config('services.cloudinary.api_secret'));
    }

    private function uploadToCloudinary(UploadedFile $file, string $directory): ?string
    {
        $cloud = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');
        $rootFolder = config('services.cloudinary.folder', 'pathfinder');
        $folder = trim($rootFolder, '/') . '/' . trim($directory, '/');
        $timestamp = time();

        // Transformation: resize max width, auto format/quality (Cloudinary picks WebP/AVIF when supported)
        $eager = "c_limit,w_{$this->maxWidth}/f_auto/q_auto:good";

        // Build the params that need to be signed (alphabetical order, excluding file/api_key/signature)
        $paramsToSign = [
            'eager' => $eager,
            'folder' => $folder,
            'timestamp' => $timestamp,
        ];

        $signature = $this->signCloudinaryParams($paramsToSign, $apiSecret);

        try {
            $response = Http::timeout(30)
                ->attach('file', file_get_contents($file->getPathname()), $file->getClientOriginalName())
                ->post("https://api.cloudinary.com/v1_1/{$cloud}/image/upload", [
                    'api_key' => $apiKey,
                    'timestamp' => $timestamp,
                    'folder' => $folder,
                    'eager' => $eager,
                    'signature' => $signature,
                ]);

            if (!$response->successful()) {
                Log::warning('Cloudinary upload error: ' . $response->body());
                return null;
            }

            $data = $response->json();
            return $data['secure_url'] ?? null;
        } catch (\Throwable $e) {
            Log::warning('Cloudinary upload exception: ' . $e->getMessage());
            return null;
        }
    }

    private function signCloudinaryParams(array $params, string $apiSecret): string
    {
        ksort($params);
        $toSign = [];
        foreach ($params as $key => $value) {
            $toSign[] = "{$key}={$value}";
        }
        return sha1(implode('&', $toSign) . $apiSecret);
    }

    private function storeLocally(UploadedFile $file, string $directory): string
    {
        $image = $this->loadImage($file);
        if (!$image) {
            return '/storage/' . $file->store($directory, 'public');
        }

        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > $this->maxWidth) {
            $newHeight = (int) round($height * ($this->maxWidth / $width));
            $resized = imagecreatetruecolor($this->maxWidth, $newHeight);
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $this->maxWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        $filename = uniqid() . '_' . time() . '.webp';
        $path = $directory . '/' . $filename;
        $fullPath = Storage::disk('public')->path($path);

        $dir = dirname($fullPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        imagewebp($image, $fullPath, $this->quality);
        imagedestroy($image);

        return '/storage/' . $path;
    }

    private function loadImage(UploadedFile $file): ?\GdImage
    {
        $mime = $file->getMimeType();
        $path = $file->getPathname();

        return match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($path) ?: null,
            'image/png' => $this->loadPng($path),
            'image/webp' => @imagecreatefromwebp($path) ?: null,
            'image/gif' => @imagecreatefromgif($path) ?: null,
            default => null,
        };
    }

    private function loadPng(string $path): ?\GdImage
    {
        $image = @imagecreatefrompng($path);
        if (!$image) return null;

        imagesavealpha($image, true);
        imagealphablending($image, true);

        return $image;
    }
}
