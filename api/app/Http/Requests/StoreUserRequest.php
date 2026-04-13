<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    use SanitizesInput;

    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $normalizedEmail = $this->sanitizeEmail($this->input('email'));

        $this->merge([
            'name'       => $this->sanitizePlainText($this->input('name')),
            'email'      => $normalizedEmail,
            'email_hash' => $this->hashEmail($this->input('email')),
        ]);
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'min:2', 'max:255'],
            'email'      => ['required', 'string', 'email:rfc', 'max:255'],
            'email_hash' => ['required', 'string', 'size:64', 'unique:users,email_hash'],
            'password'   => ['required', 'confirmed', Password::defaults()],
            'role'       => ['required', Rule::in([Role::MODERATOR->value, Role::ADMIN->value])],
            'is_active'  => ['sometimes', 'boolean'],
        ];
    }
}