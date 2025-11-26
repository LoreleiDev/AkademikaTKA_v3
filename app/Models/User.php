<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name', 
        'email', 
        'password', 
        'role',
        'remember_token', 
        'reset_code_sent_at'
    ];
    
    protected $hidden = [
        'password', 
        'remember_token'
    ];

    protected $casts = [
        'reset_code_sent_at' => 'datetime'
    ];

    public function setPasswordAttribute($value)
    {
        // Hanya hash jika value belum ter-hash
        if (!empty($value) && !Hash::needsRehash($value)) {
            $this->attributes['password'] = $value;
        } else {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }
}