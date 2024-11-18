<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::group(['middleware' => ['auth:sanctum']], function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/update', [AuthController::class, 'updateUser']);
            Route::post('/changePassword', [AuthController::class, 'changePassword']);
            Route::get('/showUserInfo', [AuthController::class, 'showUserInfo']);
            Route::get('/getUser/{id}', [AuthController::class, 'getUser']);
            Route::get('/getAllUsers', [AuthController::class, 'getAllUsers']);
        });;
    });
    Route::prefix('product')->group(function () {

        Route::post('/store', [ProductController::class, 'store']);
        Route::get('/', [ProductController::class, 'active']);
        Route::get('/deleteList', [ProductController::class, 'deleteList']);
        Route::delete('/{id}', [ProductController::class, 'delete']);
        Route::get('/showUserInfo', [AuthController::class, 'showUserInfo']);
        Route::get('/getUser/{id}', [AuthController::class, 'getUser']);
        Route::get('/getAllUsers', [AuthController::class, 'getAllUsers']);
    });
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/create-order', [PaymentController::class, 'createOrder']);
    Route::get('/getAllOrders', [PaymentController::class, 'getAllOrders']);
});
