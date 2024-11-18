<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CurrencyController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/tour/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/tour/login', [AuthController::class, 'login']);

    Route::get('/currency', [CurrencyController::class, 'getActiveCurrency']);
    
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/tour/logout', [AuthController::class, 'logout']);
        Route::post('/update-user', [AuthController::class, 'updateUser']);
        Route::post('/tour/update-user', [AuthController::class, 'updateUser']);
        Route::get('/getUserInfo', [AuthController::class, 'getUserInfo']);
        Route::get('/all-currency', [CurrencyController::class, 'index']);
        Route::post('/change-currency/{id}', [CurrencyController::class, 'changeCurrency']);
    });




    require __DIR__ . '/api-portfolio.php';
    require __DIR__ . '/api-tour.php';
    require __DIR__ . '/global-api.php';
});
