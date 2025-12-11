<?php
// app/Http/Controllers/BusinessPlan/TeamStructureController.php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TeamStructure;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TeamStructureController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = TeamStructure::with(['businessBackground', 'user', 'operationalPlan'])
                ->orderBy('sort_order', 'asc')
                ->orderBy('created_at', 'desc');

            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->business_background_id) {
                $query->where('business_background_id', $request->business_background_id);
            }

            if ($request->operational_plan_id) {
                $query->where('operational_plan_id', $request->operational_plan_id);
            }

            $teams = $query->get();

            // Format response dengan full photo URL
            $formattedTeams = $teams->map(function ($team) {
                return $this->formatTeamResponse($team);
            });

            return response()->json([
                'status' => 'success',
                'data' => $formattedTeams
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching team structures: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch team structures'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $team = TeamStructure::with(['businessBackground', 'user', 'operationalPlan'])->find($id);

            if (!$team) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Team structure not found'
                ], 404);
            }

            // Format response dengan full photo URL
            $formattedTeam = $this->formatTeamResponse($team);

            return response()->json([
                'status' => 'success',
                'data' => $formattedTeam
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching team structure: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch team structure'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'operational_plan_id' => 'nullable|exists:operational_plans,id',
            'team_category' => 'required|string|max:100',
            'member_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'jobdesk' => 'nullable|string',
            'experience' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Konsisten 2MB max
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable|in:draft,active'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('team_photos', 'public');

                Log::info('Team photo uploaded successfully', [
                    'original_name' => $request->file('photo')->getClientOriginalName(),
                    'stored_path' => $photoPath,
                    'full_url' => asset('storage/' . $photoPath)
                ]);
            }

            $team = TeamStructure::create([
                'user_id' => $request->user_id,
                'business_background_id' => $request->business_background_id,
                'operational_plan_id' => $request->operational_plan_id,
                'team_category' => $request->team_category,
                'member_name' => $request->member_name,
                'position' => $request->position,
                'jobdesk' => $request->jobdesk,
                'experience' => $request->experience,
                'photo' => $photoPath,
                'sort_order' => $request->sort_order ?? 0,
                'status' => $request->status ?? 'draft',
            ]);

            // Load relationships
            $team->load(['businessBackground', 'user', 'operationalPlan']);

            // Format response dengan full photo URL
            $formattedTeam = $this->formatTeamResponse($team);

            return response()->json([
                'status' => 'success',
                'message' => 'Team structure created successfully',
                'data' => $formattedTeam
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating team structure: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create team structure'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $team = TeamStructure::find($id);

        if (!$team) {
            return response()->json([
                'status' => 'error',
                'message' => 'Team structure not found'
            ], 404);
        }

        // Check ownership
        if ($request->user_id != $team->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'team_category' => 'required|string|max:100',
            'member_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'jobdesk' => 'nullable|string',
            'experience' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Konsisten 2MB max
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable|in:draft,active'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [
                'team_category' => $request->team_category,
                'member_name' => $request->member_name,
                'position' => $request->position,
                'jobdesk' => $request->jobdesk,
                'experience' => $request->experience,
                'sort_order' => $request->sort_order ?? $team->sort_order,
                'status' => $request->status ?? $team->status,
            ];

            // Handle photo update - KONSISTEN dengan BusinessController
            if ($request->hasFile('photo')) {
                // Upload photo baru
                $photoPath = $request->file('photo')->store('team_photos', 'public');
                $updateData['photo'] = $photoPath;

                // Hapus photo lama jika ada
                if ($team->photo) {
                    Storage::disk('public')->delete($team->photo);
                }

                Log::info('Team photo updated successfully', [
                    'new_path' => $photoPath,
                    'full_url' => asset('storage/' . $photoPath)
                ]);
            } elseif ($request->has('photo') && $request->photo === '') {
                // Jika photo dikirim sebagai string kosong, hapus photo
                if ($team->photo) {
                    Storage::disk('public')->delete($team->photo);
                }
                $updateData['photo'] = null;
            } else {
                // Jika tidak ada perubahan photo, pertahankan photo lama
                unset($updateData['photo']);
            }

            $team->update($updateData);

            // Load relationships
            $team->load(['businessBackground', 'user', 'operationalPlan']);

            // Format response dengan full photo URL
            $formattedTeam = $this->formatTeamResponse($team);

            return response()->json([
                'status' => 'success',
                'message' => 'Team structure updated successfully',
                'data' => $formattedTeam
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating team structure: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update team structure'
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $team = TeamStructure::find($id);

        if (!$team) {
            return response()->json([
                'status' => 'error',
                'message' => 'Team structure not found'
            ], 404);
        }

        // Check ownership
        if ($request->user_id != $team->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot delete this data'
            ], 403);
        }

        try {
            // Hapus photo jika ada - KONSISTEN dengan BusinessController
            if ($team->photo) {
                Storage::disk('public')->delete($team->photo);
            }

            $team->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Team structure deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting team structure: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete team structure'
            ], 500);
        }
    }

    // 🔥 NEW: Method untuk upload photo saja (Opsional)
    public function uploadPhoto(Request $request, $id)
    {
        $team = TeamStructure::find($id);

        if (!$team) {
            return response()->json([
                'status' => 'error',
                'message' => 'Team structure not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old photo if exists
            if ($team->photo) {
                Storage::disk('public')->delete($team->photo);
            }

            $photoPath = $request->file('photo')->store('team_photos', 'public');
            $team->update(['photo' => $photoPath]);

            // Format response dengan full photo URL
            $formattedTeam = $this->formatTeamResponse($team);

            return response()->json([
                'status' => 'success',
                'message' => 'Photo uploaded successfully',
                'data' => $formattedTeam
            ]);
        } catch (\Exception $e) {
            Log::error('Error uploading team photo: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload photo'
            ], 500);
        }
    }

    private function formatTeamResponse($team)
    {
        $formatted = $team->toArray();

        // Tambahkan full photo URL jika ada photo
        if ($team->photo) {
            $formatted['photo_url'] = asset('storage/' . $team->photo);
        } else {
            $formatted['photo_url'] = null;
        }

        return $formatted;
    }
}
