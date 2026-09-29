/**
 * api-client.js — helper para chamadas à API Laravel (same-origin, sessão, CSRF).
 * Uso:
 *   apiRequest('GET', '/api/courses')
 *   apiRequest('POST', '/api/documents', { formData: fd })
 *   apiRequest('POST', '/api/search', { json: { q: 'termo' } })
 */

(function (window) {
    'use strict';

    /**
     * Lê o CSRF token do meta tag.
     * Adicione no layout: <meta name="csrf-token" content="{{ csrf_token() }}">
     */
    function csrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : '';
    }

    /**
     * Realiza uma requisição à API.
     *
     * @param {string} method   - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} path     - Caminho relativo, ex: '/api/courses'
     * @param {object} options  - { json: object } ou { formData: FormData }
     * @returns {Promise<any>}  - JSON parseado ou lança erro com { status, message, errors }
     */
    async function apiRequest(method, path, options = {}) {
        const headers = {
            'X-CSRF-TOKEN': csrfToken(),
            'Accept': 'application/json',
        };

        const fetchOptions = {
            method: method.toUpperCase(),
            credentials: 'same-origin',
            headers,
        };

        if (options.json !== undefined) {
            headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(options.json);
        } else if (options.formData instanceof FormData) {
            // Não definir Content-Type para multipart — o browser coloca o boundary correto.
            fetchOptions.body = options.formData;
        }

        let response;
        try {
            response = await fetch(path, fetchOptions);
        } catch (networkError) {
            throw { status: 0, message: 'Erro de rede: ' + networkError.message, errors: {} };
        }

        let data;
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || `Erro ${response.status}`,
                errors: data.errors || {},
            };
        }

        return data;
    }

    /**
     * Exibe um alerta Bootstrap dentro de um container.
     * @param {string} containerId  - id do elemento alvo
     * @param {string} message
     * @param {'danger'|'success'|'warning'|'info'} type
     */
    function showAlert(containerId, message, type = 'danger') {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
            </div>`;
    }

    /** Escapa HTML para exibição segura. */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /** Formata bytes em string legível. */
    function formatBytes(bytes, decimals = 1) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

    // Exporta para o escopo global
    window.ApiClient = { apiRequest, showAlert, escapeHtml, formatBytes };

})(window);
