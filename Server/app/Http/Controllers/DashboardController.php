<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    
    public function index()
    {
        $total_order = Payment::where("status", "succeeded")->sum('amount');
        $total_order_Count = Payment::where("status", "succeeded")->count();
        $total_user = User::count();
        $total_active_package = Package::where("status", "1")->count();

        return response()->json([
            'totalOrder' => (int)$total_order,
            'totalUser' => (int)$total_user-1,
            'total_order_Count' => (int)$total_order_Count,
            'total_active_package' => (int)$total_active_package

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
