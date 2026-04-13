<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
        ]);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
{
    $categoryId = $this->route('category')?->id;

    return [
        'name' => ['required', 'string', 'min:3', 'max:255', "unique:categories,name,{$categoryId}"],
    ];
}
}
