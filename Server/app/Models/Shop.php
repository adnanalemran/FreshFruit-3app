<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use League\CommonMark\Node\Block\Document;

class Shop extends Model
{
    protected $fillable = ['title', 'discount', 'url', 'image', 'status'];
    use HasFactory;
}
