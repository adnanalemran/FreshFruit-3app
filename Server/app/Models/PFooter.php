<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PFooter extends Model
{
    protected $fillable = ['title', 'image', 'description', 'address', 'social'];
    use HasFactory;
}
