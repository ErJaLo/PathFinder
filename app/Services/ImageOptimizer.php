<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
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
     * Optimize and store an uploaded image.
     * Returns the public path (e.g., "experiences/abc123.webp").
     */
    public function store(UploadedFile $file, string $directory = 'experiences'): string
    {
        $image = $this->loadImage($file);
        if (!$image) {
            // Fallback: store original if GD can't process it
            return $file->store($directory, 'public');
        }

        // Resize if wider than max
        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > $this->maxWidth) {
            $newHeight = (int) round($height * ($this->maxWidth / $width));
            $resized = imagecreatetruecolor($this->maxWidth, $newHeight);
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $this->maxWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        // Save as WebP
        $filename = uniqid() . '_' . time() . '.webp';
        $path = $directory . '/' . $filename;
        $fullPath = Storage::disk('public')->path($path);

        // Ensure directory exists
        $dir = dirname($fullPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        imagewebp($image, $fullPath, $this->quality);
        imagedestroy($image);

        return $path;
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

        // Preserve transparency for processing, then WebP handles it
        imagesavealpha($image, true);
        imagealphablending($image, true);

        return $image;
    }
}
