<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'plan_title',
        'plan_description',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
