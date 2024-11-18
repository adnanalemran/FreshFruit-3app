<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PHeaderController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
});
