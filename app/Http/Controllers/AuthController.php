<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            Log::info('Login attempt', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);

            // Validation des données
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                Log::warning('Login validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'email' => $request->email
                ]);
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422)->withHeaders([
                    'Access-Control-Allow-Origin' => 'http://localhost:3000',
                    'Access-Control-Allow-Credentials' => 'true',
                    'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
                ]);
            }

            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                Log::warning('Login failed: Invalid credentials', [
                    'email' => $request->email,
                    'ip' => $request->ip()
                ]);
                return response()->json([
                    'message' => 'Invalid credentials',
                    'errors' => [
                        'email' => ['The provided credentials are incorrect.']
                    ]
                ], 422)->withHeaders([
                    'Access-Control-Allow-Origin' => 'http://localhost:3000',
                    'Access-Control-Allow-Credentials' => 'true',
                    'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
                ]);
            }

            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            Log::info('Login successful', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'token' => $token,
            ])->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        } catch (\Exception $e) {
            Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $request->email ?? 'unknown'
            ]);
            return response()->json([
                'message' => 'An error occurred during login',
                'error' => $e->getMessage()
            ], 500)->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logged out successfully'
            ])->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred during logout',
                'error' => $e->getMessage()
            ], 500)->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        }
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'user'
            ]);

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'token' => $token,
            ], 201)->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422)->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during registration',
                'error' => $e->getMessage()
            ], 500)->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        }
    }

    public function refreshToken(Request $request)
    {
        try {
            $user = $request->user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'token' => $token
            ])->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred during token refresh',
                'error' => $e->getMessage()
            ], 500)->withHeaders([
                'Access-Control-Allow-Origin' => 'http://localhost:3000',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        }
    }
} 