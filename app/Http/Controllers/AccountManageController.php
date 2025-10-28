<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountManageController extends Controller
{
    public function index()
    {
      
        $users = User::with(['apotek', 'roles', 'userProfile'])
            ->whereHas('roles', fn($q) => $q->where('name', RoleEnum::USER->value))
            ->latest()
            ->get();

       
        $users->map(function ($user) {
            $user->user_profile_data = $user->userProfile; 
            return $user;
        });

        return Inertia::render('admin/account/index', [
            'users' => $users,
            
        ]);
    }

    public function approve(Request $request, User $user)
    {
        if ($user->status !== 'pending') {
            return back()->with('error', 'User sudah diproses sebelumnya.');
        }

        $user->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'User berhasil di-approve.');
    }

    public function reject(Request $request, User $user)
    {
        if ($user->status !== 'pending') {
            return back()->with('error', 'User sudah diproses sebelumnya.');
        }

        $user->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'User berhasil ditolak.');
    }
}
