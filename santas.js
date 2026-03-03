// santas.js - Renders seminar tables from talks.json

(function() {
    'use strict';

    const JSON_PATH = 'talks.json';
    
    // How many recent semesters to show before the "show more" button
    const VISIBLE_SEMESTERS = 3;

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function renderTalkRow(talk) {
        return `
            <tr>
                <td>${escapeHtml(talk.displayDate)}</td>
                <td>${escapeHtml(talk.speaker)}</td>
                <td>${escapeHtml(talk.affiliation)}</td>
                <td>${escapeHtml(talk.title)}</td>
            </tr>`;
    }

    function renderSemesterTable(semester) {
        const rows = semester.talks.map(renderTalkRow).join('\n');
        
        return `
    <h2>${escapeHtml(semester.name)}</h2>
    <table class="table table-striped">
        <thead>
            <tr>
                <th class="fecha">Fecha</th>
                <th class="expositor">Expositor</th>
                <th class="universidad">Universidad</th>
                <th class="titulo">Título</th>
            </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
    </table>`;
    }

    function renderAllSemesters(semesters) {
        const currentContainer = document.getElementById('current-talks');
        const oldContainer = document.getElementById('old');
        
        if (!currentContainer) {
            console.error('santas.js: #current-talks container not found');
            return;
        }

        // Split into visible and hidden semesters
        const visible = semesters.slice(0, VISIBLE_SEMESTERS);
        const hidden = semesters.slice(VISIBLE_SEMESTERS);

        // Render visible semesters
        currentContainer.innerHTML = visible.map(renderSemesterTable).join('\n');

        // Render hidden semesters if container exists
        if (oldContainer && hidden.length > 0) {
            oldContainer.innerHTML = hidden.map(renderSemesterTable).join('\n');
        }
    }

    async function init() {
        try {
            const response = await fetch(JSON_PATH);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.semesters || !Array.isArray(data.semesters)) {
                throw new Error('Invalid JSON structure: missing semesters array');
            }

            renderAllSemesters(data.semesters);
            
        } catch (error) {
            console.error('santas.js: Failed to load talks:', error);
            const container = document.getElementById('current-talks');
            if (container) {
                container.innerHTML = '<p style="color: red;">Error al cargar las charlas. Por favor recarga la página.</p>';
            }
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
