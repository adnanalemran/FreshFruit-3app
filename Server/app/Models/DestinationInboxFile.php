<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DestinationInboxFile extends Model
{
    use HasFactory;

    protected $fillable = ['destination_id', 'file_name', 'title'];

    /**
     * Relationship: A file belongs to a destination.
     */
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
