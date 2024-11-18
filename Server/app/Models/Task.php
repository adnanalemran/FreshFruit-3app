<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use League\CommonMark\Node\Block\Document;

class Task extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'notes', 'status'];
    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
