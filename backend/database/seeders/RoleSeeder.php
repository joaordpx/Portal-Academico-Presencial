<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'courses.read',
            'courses.manage',
            'subjects.read',
            'subjects.manage',
            'centers.read',
            'centers.manage',
            'departments.read',
            'departments.manage',
            'documents.read',
            'documents.manage',
            'users.manage',
            'manual.read',
            'manual.manage',
            'health.read',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $suporteRole = Role::firstOrCreate(['name' => 'suporte', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $alunoRole = Role::firstOrCreate(['name' => 'aluno', 'guard_name' => 'web']);

        $readPermissions = [
            'courses.read',
            'subjects.read',
            'centers.read',
            'departments.read',
            'documents.read',
            'manual.read',
        ];

        $suporteRole->syncPermissions($permissions);
        $adminRole->syncPermissions(array_values(array_diff($permissions, ['users.manage', 'health.read'])));
        $alunoRole->syncPermissions($readPermissions);

        // Cleanup legacy role to keep RBAC naming consistent.
        Role::query()->where('name', 'administrador')->delete();
    }
}
