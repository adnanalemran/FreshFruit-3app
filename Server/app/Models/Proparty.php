<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proparty extends Model
{
    protected $fillable = ['title', 'description', 'image', 'status'];
    use HasFactory;
}
