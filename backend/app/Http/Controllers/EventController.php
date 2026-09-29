<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * Display a listing of published events.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'center_id' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $query = Event::query()
            ->published()
            ->with('center')
            ->orderBy('starts_at');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($innerQuery) use ($search): void {
                $innerQuery->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhere('campus_name', 'like', '%' . $search . '%')
                    ->orWhere('event_type', 'like', '%' . $search . '%');
            });
        }

        if (!empty($filters['center_id'])) {
            $query->where('center_id', (int) $filters['center_id']);
        }

        $perPage = (int) ($filters['per_page'] ?? 10);

        return EventResource::collection($query->paginate($perPage));
    }

    /**
     * Display the specified event.
     */
    public function show(Event $event): EventResource
    {
        return new EventResource($event->load('center'));
    }
}
