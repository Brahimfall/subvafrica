<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Opportunity::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'conditions' => 'nullable|string',
            'deadline' => 'nullable|date',
            'amount' => 'nullable|string',
            'target_audience' => 'nullable|array',
            'country_sector_filter' => 'nullable|array',
            'opportunity_type' => 'nullable|string',
            'source_url' => 'nullable|url',
        ]);

        $opportunity = Opportunity::create($request->all());

        return response()->json($opportunity, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Opportunity $opportunity)
    {
        return $opportunity;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opportunity $opportunity)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'conditions' => 'nullable|string',
            'deadline' => 'nullable|date',
            'amount' => 'nullable|string',
            'target_audience' => 'nullable|array',
            'country_sector_filter' => 'nullable|array',
            'opportunity_type' => 'nullable|string',
            'source_url' => 'nullable|url',
        ]);

        $opportunity->update($request->all());

        return response()->json($opportunity, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opportunity $opportunity)
    {
        $opportunity->delete();

        return response()->json(null, 204);
    }
}


