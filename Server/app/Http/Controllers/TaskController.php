<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Task::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Applications retrieved successfully',
            'data' => $data
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
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'note' => 'required|string|max:255',
                'status' => 'required|string|max:20',

            ]);
            $task = new Task();
            $task->name = $request->name;
            $task->notes = $request->note;
            $task->status = $request->status;
            $task->save();

            return response()->json($task, 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while saving the application',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    //make a test api i want which data i send  to this api i get back same data json formate i send fromdata
    public function update(Request $request)
    {
        $responseData = [
            'status' => 'test Req success',
            'message' => 'Here is data',
            'data' => $request->except(['files']), // Exclude files from other data
        ];

        if ($request->hasFile('files')) {
            $files = $request->file('files');
            $fileDetails = [];

            foreach ($files as $file) {
                $fileDetails[] = [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ];
            }

            $responseData['files'] = $fileDetails;
        }

        return response()->json($responseData);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
