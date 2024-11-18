<?php

use App\Http\Controllers\AboutPagesController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PackageImageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PFooterController;
use App\Http\Controllers\PHeaderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SocialInfoController;
use App\Http\Controllers\TourReviewController;
use Illuminate\Support\Facades\Route;

Route::prefix('tour')->group(function () {
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
    Route::prefix('destinations')->group(function () {
        Route::get('/active', [DestinationController::class, 'active']);
        Route::get('/{destination}', [DestinationController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::get('/', [DestinationController::class, 'index']);
            Route::put('/status/{destination}', [DestinationController::class, 'toggleStatus']);
            Route::post('/{destination}', [DestinationController::class, 'update']);
            Route::delete('/{destination}', [DestinationController::class, 'destroy']);
            Route::post('/', [DestinationController::class, 'store']);
        });
    });
    Route::prefix('package')->group(function () {
        Route::get('/active', [PackageController::class, 'active']);
        Route::get('/searchActive', [PackageController::class, 'searchActive']);

        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::get('/', [PackageController::class, 'index']);
            Route::post('/{id}', [PackageController::class, 'update']);
            Route::put('/status/{id}', [PackageController::class, 'toggleStatus']);
            Route::delete('/{id}', [PackageController::class, 'destroy']);
            Route::post('/', [PackageController::class, 'store']);
        });
        Route::get('/{id}', [PackageController::class, 'show']);
    });
    Route::prefix('images')->group(function () {
        Route::get('/', [ImageController::class, 'index']);
        Route::get('/{id}', [ImageController::class, 'show']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/', [ImageController::class, 'store']);
            Route::delete('/{id}', [ImageController::class, 'destroy']);
        });
    });
    Route::prefix('package-images')->group(function () {
        Route::get('/', [PackageImageController::class, 'index']);
        Route::post('/', [PackageImageController::class, 'store']);
        Route::get('/{id}', [PackageImageController::class, 'show']);
        Route::delete('/{id}', [PackageImageController::class, 'destroy']);
    });
    Route::prefix('about-page')->group(function () {
        Route::get('/', [AboutPagesController::class, 'index']);
        Route::get('/{id}', [AboutPagesController::class, 'show']);
    });
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('/user/payments', [PaymentController::class, 'userlistPayments']);
        Route::get('/payments', [PaymentController::class, 'listPayments']);
        Route::post('/payment', [PaymentController::class, 'processPayment']);
    });
    Route::prefix('review')->group(function () {
        Route::get('/', [ReviewController::class, 'index']);
        Route::get('/', [ReviewController::class, 'index']);
    });

    Route::prefix('tour-review')->group(function () {
        Route::get('/package/{packageId}', [TourReviewController::class, 'getReviewsByPackage']);
        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::post('/submit-review', [TourReviewController::class, 'store']);
            Route::get('/user-reviews', [TourReviewController::class, 'getUserReviews']);
            Route::get('/all-reviews', [TourReviewController::class, 'getAllReviews']);
            Route::get('/check-review/{packageId}', [TourReviewController::class, 'checkReviewAvailability']);
        });
    });

    Route::prefix('social-info')->group(function () {

        Route::post('/', [SocialInfoController::class, 'store']);
        Route::put('/', [SocialInfoController::class, 'update']);
        Route::get('/', [SocialInfoController::class, 'show']);
        Route::delete('/', [SocialInfoController::class, 'destroy']);
    });
});
