<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'file_name',
        'title',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
