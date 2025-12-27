<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'banned', 'suspended'])],
        ]);

        $user->name = $validated['name'];
        $user->username = $validated['username'];
        $user->phone = $validated['phone'];

        if (isset($validated['status'])) {
            $user->account_status = $validated['status'];
        }

        $user->save();

        return response()->json(['status' => 'success', 'data' => $user, 'message' => 'Profil berhasil diperbarui']);
    }

    public function updatePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['status' => 'error', 'message' => 'Password lama tidak cocok'], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json(['status' => 'success', 'message' => 'Password berhasil diubah']);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user = User::findOrFail($id);
        $user->account_status = $validated['status'];
        $user->save();

        return response()->json(['status' => 'success', 'data' => $user, 'message' => 'Status akun diperbarui']);
    }
}
