<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\Role;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_hash',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
            'is_active' => 'boolean',
        ];
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value === null ? null : Crypt::decryptString($value),
            set: fn (?string $value) => $value === null ? null : Crypt::encryptString(trim($value)),
        );
    }

    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value === null ? null : Crypt::decryptString($value),
            set: function (?string $value): array {
                if ($value === null) {
                    return [
                        'email' => null,
                        'email_hash' => null,
                    ];
                }

                $normalizedEmail = self::normalizeEmail($value);

                return [
                    'email' => Crypt::encryptString($normalizedEmail),
                    'email_hash' => self::hashEmailValue($normalizedEmail),
                ];
            },
        );
    }

    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function progressions(): HasMany
    {
        return $this->hasMany(Progression::class);
    }

    public function anonymize(): void
    {
        $this->forceFill([
            'name' => 'Deleted User',
            'email' => 'deleted-user-'.$this->id.'-'.Str::uuid().'@example.invalid',
            'password' => Str::password(32),
            'role' => Role::CITIZEN,
            'is_active' => false,
            'remember_token' => null,
            'email_verified_at' => null,
        ])->save();
    }

    public static function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    public static function hashEmailValue(string $email): string
    {
        return hash('sha256', self::normalizeEmail($email));
    }
}
