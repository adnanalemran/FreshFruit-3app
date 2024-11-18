<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'description2', 'image', 'status'];

    public function inboxFiles()
    {
        return $this->hasMany(DestinationInboxFile::class);
    }
}
