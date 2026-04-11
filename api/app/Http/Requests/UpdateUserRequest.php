<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    use SanitizesInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->sanitizePlainText($this->input('name')),
            'email' => $this->sanitizeEmail($this->input('email')),
            'email_hash' => $this->hashEmail($this->input('email')),
        ]);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        
    $userId = $this->route('user')?->id;

    return [
        'name'       => ['required', 'string', 'min:2', 'max:255'],
        'email'      => ['required', 'string', 'email:rfc', 'max:255'],
        'email_hash' => ['required', 'string', 'size:64', "unique:users,email_hash,{$userId}"],
        'password'   => ['sometimes', 'confirmed', Password::defaults()],
        'is_active'  => ['sometimes', 'boolean'],
    ];
    }
}
