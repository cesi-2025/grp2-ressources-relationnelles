<?php

namespace Tests\Unit\Enums;

use App\Enums\ProgressionStatus;
use App\Enums\ResourceStatus;
use App\Enums\Role;
use PHPUnit\Framework\TestCase;

/**
 * Tests unitaires sur les enums metier.
 * Pas de BDD, pas de boot Laravel : pure logique.
 */
class EnumsTest extends TestCase
{
    public function test_role_enum_exposes_the_four_expected_roles(): void
    {
        $values = array_map(fn ($case) => $case->value, Role::cases());

        $this->assertCount(4, Role::cases());
        $this->assertSame(['citizen', 'moderator', 'admin', 'super_admin'], $values);
    }

    public function test_role_try_from_returns_null_on_unknown_value(): void
    {
        $this->assertSame(Role::CITIZEN, Role::tryFrom('citizen'));
        $this->assertNull(Role::tryFrom('hacker'));
    }

    public function test_resource_status_enum_contains_expected_cases(): void
    {
        $values = array_map(fn ($case) => $case->value, ResourceStatus::cases());

        $this->assertCount(4, ResourceStatus::cases());
        $this->assertSame(
            ['pending', 'published', 'archived', 'rejected'],
            $values,
        );
    }

    public function test_progression_status_enum_has_exploited_and_set_aside(): void
    {
        $this->assertSame('exploited', ProgressionStatus::EXPLOITED->value);
        $this->assertSame('set_aside', ProgressionStatus::SET_ASIDE->value);
        $this->assertCount(2, ProgressionStatus::cases());
    }
}
