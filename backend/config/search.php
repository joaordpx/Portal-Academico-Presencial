<?php

return [
    'max_results_per_entity' => 100,

    'weights' => [
        'exact' => 100,
        'starts_with' => 75,
        'contains' => 50,
        'secondary_exact' => 20,
        'secondary_contains' => 10,
    ],
];
