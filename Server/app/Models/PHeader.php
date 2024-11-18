<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PHeader extends Model
{
    protected $fillable = ['name', 'hotlineNo', 'image'];
    use HasFactory;
}
