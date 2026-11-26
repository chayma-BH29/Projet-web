<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('action')?->id;
        return [
            'symbole' => ['required', 'string', 'max:10', Rule::unique('actions', 'symbole')->ignore($id)],
        'nom' => ['required', 'string', 'max:255'],
        'prix_actuel' => ['required', 'numeric', 'min:0.01', 'max:9999999'],
        ];
    }
}
