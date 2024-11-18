<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['Tittle', 'Description', 'url', 'Image', 'Status'];
    use HasFactory;
}
