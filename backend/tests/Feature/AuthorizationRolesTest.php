<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationRolesTest extends TestCase
{
    use RefreshDatabase;

    public function test_should_apply_rbac_permissions_matrix(): void
    {
        $this->seed(RoleSeeder::class);

        $suporte = User::factory()->create()->assignRole('suporte');
        $admin = User::factory()->create()->assignRole('admin');
        $aluno = User::factory()->create()->assignRole('aluno');

        $this->assertTrue($suporte->can('courses.manage'));
        $this->assertTrue($suporte->can('centers.manage'));
        $this->assertTrue($suporte->can('departments.manage'));
        $this->assertTrue($suporte->can('documents.manage'));
        $this->assertTrue($suporte->can('users.manage'));
        $this->assertTrue($suporte->can('manual.manage'));

        $this->assertTrue($admin->can('subjects.manage'));
        $this->assertTrue($admin->can('centers.manage'));
        $this->assertTrue($admin->can('departments.manage'));
        $this->assertTrue($admin->can('documents.manage'));
        $this->assertTrue($admin->can('manual.read'));
        $this->assertFalse($admin->can('users.manage'));

        $this->assertTrue($aluno->can('courses.read'));
        $this->assertTrue($aluno->can('centers.read'));
        $this->assertTrue($aluno->can('departments.read'));
        $this->assertTrue($aluno->can('documents.read'));
        $this->assertFalse($aluno->can('users.manage'));
        $this->assertFalse($aluno->can('courses.manage'));
        $this->assertFalse($aluno->can('subjects.manage'));
        $this->assertFalse($aluno->can('centers.manage'));
        $this->assertFalse($aluno->can('departments.manage'));
        $this->assertFalse($aluno->can('documents.manage'));
        $this->assertFalse($aluno->can('manual.manage'));
    }
}
