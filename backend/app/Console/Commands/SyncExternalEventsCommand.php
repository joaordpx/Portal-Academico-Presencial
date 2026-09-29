<?php

namespace App\Console\Commands;

use App\Services\EventPollingService;
use Illuminate\Console\Command;

class SyncExternalEventsCommand extends Command
{
    protected $signature = 'events:sync-external';

    protected $description = 'Sincroniza eventos públicos a partir da API externa de ações';

    public function __construct(private EventPollingService $eventPollingService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        try {
            $result = $this->eventPollingService->syncFromRemote();

            $this->info(sprintf(
                'Eventos sincronizados. Criados: %d, atualizados: %d, desativados: %d, processados: %d.',
                $result['created'],
                $result['updated'],
                $result['deactivated'],
                $result['total']
            ));

            return self::SUCCESS;
        } catch (\Throwable $throwable) {
            $this->error($throwable->getMessage());

            return self::FAILURE;
        }
    }
}
