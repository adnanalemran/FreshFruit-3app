<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Currency::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ]);
    }

    /**
     * Activate a currency by ID and deactivate all others.
     */
    public function changeCurrency($id)
    {
        // Deactivate all currencies
        Currency::query()->update(['status' => 0]);

        // Activate the selected currency
        $currency = Currency::find($id);
        if ($currency) {
            $currency->status = 1;
            $currency->save();
            return response()->json([
                'status' => 'success',
                'message' => 'Currency status updated successfully',
                'data' => $currency
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Currency not found'
            ], 404);
        }
    }

    /**
     * Show the active currency (status = 1).
     */
    public function getActiveCurrency()
    {
        $activeCurrency = Currency::where('status', 1)->first();

        if ($activeCurrency) {
            return response()->json([
                'status' => 'success',
                'message' => 'Active currency retrieved successfully',
                'data' => $activeCurrency
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No active currency found'
            ], 404);
        }
    }
}
