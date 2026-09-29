<?php

namespace App\Http\Controllers;

use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    public function __construct(private SearchService $searchService)
    {
    }

    /**
     * Perform textual search on courses and subjects.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = Validator::make($request->all(), [
            'q' => 'nullable|string|max:255',
            'entity_type' => 'nullable|string|in:all,course,subject,center,department,document',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ])->validated();

        $paginator = $this->searchService->search($filters);

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Get search suggestions.
     */
    public function suggest(Request $request): JsonResponse
    {
        $q = $request->get('q', '');
        $suggestions = $this->searchService->suggest($q);

        return response()->json(['data' => $suggestions]);
    }
}
