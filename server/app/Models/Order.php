<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'client_name',
        'client_email',
        'client_address',
        'total_bill',
        'products',
        'stripe_payment_id',
        'payment_status',
    ];

    // Cast the 'products' field to an array automatically
    protected $casts = [
        'products' => 'array',
    ];
    use HasFactory;
}
