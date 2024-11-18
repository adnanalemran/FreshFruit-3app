<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'whatsapp',
        'facebook',
        'phone_no',
    ];
}
