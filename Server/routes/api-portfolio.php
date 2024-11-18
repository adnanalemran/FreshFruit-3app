<?php

use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\PFooterController;
use App\Http\Controllers\PHeaderController;
use App\Http\Controllers\PropartyController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\AboutPagesController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;

Route::prefix('portfolio')->group(function () {

    Route::get('/currency', [CurrencyController::class, 'getActiveCurrency']);
    Route::prefix('header')->group(function () {
        Route::get('/', [PHeaderController::class, 'index']);
        Route::get('/{id}', [PHeaderController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [PHeaderController::class, 'store']);
            Route::post('/{id}', [PHeaderController::class, 'update']);
            Route::delete('/{id}', [PHeaderController::class, 'destroy']);
        });
    });

    Route::prefix('footer')->group(function () {
        Route::get('/', [PFooterController::class, 'index']);
        Route::get('/{id}', [PFooterController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [PFooterController::class, 'store']);
            Route::post('/{id}', [PFooterController::class, 'update']);
            Route::delete('/{id}', [PFooterController::class, 'destroy']);
        });
    });

    Route::prefix('slider')->group(function () {
        Route::get('/', [SliderController::class, 'index']);
        Route::get('/{slider}', [SliderController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/update/{slider}', [SliderController::class, 'update']);
            Route::delete('/{slider}', [SliderController::class, 'destroy']);
            Route::post('/', [SliderController::class, 'store']);
        });
    });
    Route::prefix('service')->group(function () {
        Route::get('/', [ServiceController::class, 'index']);
        Route::get('/{id}', [ServiceController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [ServiceController::class, 'store']);
            Route::post('/{id}', [ServiceController::class, 'update']);
            Route::delete('/{id}', [ServiceController::class, 'destroy']);
        });
    });

    Route::prefix('shop')->group(function () {
        Route::get('/', [ShopController::class, 'index']);
        Route::get('/{id}', [ShopController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [ShopController::class, 'store']);
            Route::post('/{id}', [ShopController::class, 'update']);
            Route::delete('/{id}', [ShopController::class, 'destroy']);
        });
    });

    Route::prefix('property')->group(function () {
        Route::get('/', [PropartyController::class, 'index']);
        Route::get('/{id}', [PropartyController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [PropartyController::class, 'store']);
            Route::post('/{id}', [PropartyController::class, 'update']);
            Route::delete('/{id}', [PropartyController::class, 'destroy']);
        });
    });

    Route::prefix('review')->group(function () {
        Route::get('/', [ReviewController::class, 'index']);
        Route::get('/{id}', [ReviewController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [ReviewController::class, 'store']);
            Route::post('/{id}', [ReviewController::class, 'update']);
            Route::delete('/{id}', [ReviewController::class, 'destroy']);
        });
    });

    Route::prefix('about-page')->group(function () {
        Route::get('/', [AboutPagesController::class, 'index']);
        Route::get('/{id}', [AboutPagesController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [AboutPagesController::class, 'store']);
            Route::post('/{id}', [AboutPagesController::class, 'update']);
            Route::delete('/{id}', [AboutPagesController::class, 'destroy']);
        });
    });

    Route::prefix('package')->group(function () {
        Route::get('/active', [PackageController::class, 'active']);
    });
});
