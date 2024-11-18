<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'price',
        'description',
        'subtitle',
        'departure',
        'day',
        'age',
        'parson',
        'departureTime',
        'returnTime',
        'Included',
        'destination',
        'main_image',
    ];


    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination', 'id') ;
    }
    public function packageFiles()
    {
        return $this->hasMany(PackageFile::class);
    }

    public function tourPlans()
    {
        return $this->hasMany(TourPlan::class); // Assuming you have a TourPlan model
    }
}
