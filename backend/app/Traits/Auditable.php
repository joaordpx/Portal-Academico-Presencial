<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            $model->audit('created');
        });

        static::updated(function ($model) {
            $model->audit('updated');
        });

        static::deleted(function ($model) {
            $model->audit('deleted');
        });
    }

    public function auditCustomEvent(string $event, ?array $oldValues = null, ?array $newValues = null): void
    {
        $this->audit($event, $oldValues, $newValues);
    }

    protected function audit(string $event, ?array $oldValues = null, ?array $newValues = null)
    {
        if ($event === 'created' || $event === 'updated' || $event === 'deleted') {
            $oldValues = $event === 'created' ? null : $this->getOriginal();
            $newValues = $event === 'deleted' ? null : $this->getAttributes();

            // No caso de update, queremos apenas o que mudou
            if ($event === 'updated') {
                $newValues = $this->getChanges();
                $oldValues = array_intersect_key($oldValues, $newValues);

                // Se não mudou nada relevante, não loga
                if (empty($newValues)) {
                    return;
                }
            }
        }

        // Remover campos sensíveis ou irrelevantes
        $this->filterAuditValues($oldValues);
        $this->filterAuditValues($newValues);

        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($this),
            'auditable_id' => $this->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    protected function filterAuditValues(&$values)
    {
        if (is_array($values)) {
            $hidden = ['password', 'remember_token', 'updated_at', 'created_at', 'searchable_text', 'cpf', 'matricula'];
            foreach ($hidden as $field) {
                unset($values[$field]);
            }
        }
    }
}
