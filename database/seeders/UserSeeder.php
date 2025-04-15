<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    public function run()
    {
        try {
            // Clear existing users
            DB::table('users')->truncate();

            // Create test user
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password123'),
                'role' => 'user'
            ]);
            Log::info('Test user created', ['email' => $user->email]);

            // Create admin user
            $admin = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin'
            ]);
            Log::info('Admin user created', ['email' => $admin->email]);

            // Create manager user
            $manager = User::create([
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager'
            ]);
            Log::info('Manager user created', ['id' => $manager->id, 'email' => $manager->email]);

            // Create regular user
            $regularUser = User::create([
                'name' => 'Regular User',
                'email' => 'user@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ]);
            Log::info('Regular user created', ['id' => $regularUser->id, 'email' => $regularUser->email]);

            // Verify users were created
            $users = User::all();
            Log::info('Total users in database: ' . $users->count());
            foreach ($users as $user) {
                Log::info('User found:', [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in UserSeeder: ' . $e->getMessage());
            throw $e;
        }
    }
} 