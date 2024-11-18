<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{

    protected $fillable = ['country_name', 'currency_title', 'currency_code', 'status'];
    protected $visible = ['id','currency_symbol','country_name', 'currency_title', 'currency_code', 'status' ];
    use HasFactory;
}
