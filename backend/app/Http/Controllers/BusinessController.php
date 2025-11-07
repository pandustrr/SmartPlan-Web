<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessBackground;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BusinessController extends Controller
{
    public function index()
    {
        $businesses = BusinessBackground::all();

        return response()->json([
            'status' => 'success',
            'data' => $businesses
        ], 200);
    }

    // Tampilkan satu bisnis berdasarkan ID
    public function show($id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $business
        ], 200);
    }

    // Simpan data latar belakang usaha
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'purpose' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'business_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'values' => 'nullable|string',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        $business = BusinessBackground::create([
            'user_id' => $request->user_id,
            'logo' => $logoPath,
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
            'purpose' => $request->purpose,
            'location' => $request->location,
            'business_type' => $request->business_type,
            'start_date' => $request->start_date,
            'values' => $request->values,
            'vision' => $request->vision,
            'mission' => $request->mission,
            'contact' => $request->contact,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $business
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        // Cek apakah user_id cocok dengan pemilik data
        if ($request->user_id != $business->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validated = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'purpose' => 'sometimes|required|string',
            'location' => 'sometimes|required|string|max:255',
            'business_type' => 'sometimes|required|string|max:50',
            'start_date' => 'sometimes|required|date',
            'values' => 'nullable|string',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'contact' => 'nullable|string',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }

        $business->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Business updated successfully',
            'data' => $business
        ], 200);
    }

    public function destroy($id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        $business->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Business deleted successfully'
        ], 200);
    }
}
