<?php

namespace Tests\Unit\Http;

use App\Http\Requests\Concerns\SanitizesInput;
use PHPUnit\Framework\TestCase;

/**
 * Stub exposant les methodes protegees du trait pour les tests.
 */
class SanitizerStub
{
    use SanitizesInput;

    public function callSanitizePlainText(?string $value): ?string
    {
        return $this->sanitizePlainText($value);
    }

    public function callSanitizeEmail(?string $value): ?string
    {
        return $this->sanitizeEmail($value);
    }

    public function callHashEmail(?string $value): ?string
    {
        return $this->hashEmail($value);
    }
}

/**
 * Tests unitaires sur le trait SanitizesInput.
 * Verifie la defense XSS cote FormRequest (strip_tags),
 * la normalisation email et le hash SHA-256.
 */
class SanitizesInputTest extends TestCase
{
    private SanitizerStub $sanitizer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sanitizer = new SanitizerStub();
    }

    public function test_sanitize_plain_text_strips_html_tags(): void
    {
        $result = $this->sanitizer->callSanitizePlainText('<script>alert(1)</script>Hello');

        $this->assertSame('alert(1)Hello', $result);
    }

    public function test_sanitize_plain_text_collapses_whitespace_and_trims(): void
    {
        $result = $this->sanitizer->callSanitizePlainText('   Un   texte   avec   espaces   ');

        $this->assertSame('Un texte avec espaces', $result);
    }

    public function test_sanitize_plain_text_returns_null_when_given_null(): void
    {
        $this->assertNull($this->sanitizer->callSanitizePlainText(null));
    }

    public function test_sanitize_email_lowercases_and_trims(): void
    {
        $result = $this->sanitizer->callSanitizeEmail('  USER@Domain.COM  ');

        $this->assertSame('user@domain.com', $result);
    }

    public function test_hash_email_returns_sha256_of_normalized_email(): void
    {
        $expected = hash('sha256', 'user@example.com');
        $actual = $this->sanitizer->callHashEmail('  USER@Example.com  ');

        $this->assertSame($expected, $actual);
        $this->assertSame(64, strlen($actual));
    }

    public function test_hash_email_returns_null_for_empty_or_null_input(): void
    {
        $this->assertNull($this->sanitizer->callHashEmail(null));
        $this->assertNull($this->sanitizer->callHashEmail('   '));
    }
}
