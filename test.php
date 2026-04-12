<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$r = \App\Models\Report::first();
echo "Before: {$r->status}\n";
$r->update(['status' => 'reviewed']);
echo "After: {$r->status}\n";
