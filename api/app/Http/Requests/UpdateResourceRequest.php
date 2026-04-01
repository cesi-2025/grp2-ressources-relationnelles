<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateResourceRequest extends FormRequest
{
    use SanitizesInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'title' => $this->sanitizePlainText($this->input('title')),
            'content' => $this->sanitizePlainText($this->input('content')),
        ]);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'content' => ['required', 'string', 'min:10'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'relation_type_id' => ['required', 'integer', 'exists:relation_types,id'],
            'resource_type_id' => ['required', 'integer', 'exists:resource_types,id'],
            'is_public' => ['sometimes', 'boolean'],
        ];
    }
}
