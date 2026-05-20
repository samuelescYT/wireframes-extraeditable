/** Floating wireframe navigator — injected into every page */
(function () {
  const PAGES = [
    {
      section: 'Flujo Estudiante',
      color: '#1d4ed8',
      bg: '#dbeafe',
      pages: [
        { file: 'student-dashboard.html',      label: 'Dashboard / Inicio' },
        { file: 'course-catalog.html',          label: 'Catálogo de cursos' },
        { file: 'course-view.html',             label: 'Vista de curso' },
        { file: 'module-view.html',             label: 'Vista de módulo' },
        { file: 'lesson-view.html',             label: 'Vista de lección' },
        { file: 'code-editor.html',             label: 'Editor de código' },
        { file: 'project-list.html',            label: 'Mis proyectos' },
        { file: 'student-submission-view.html', label: 'Vista de entrega' },
        { file: 'modal-report-error.html',      label: 'Reportar error' },
      ],
    },
    {
      section: 'Flujo Profesor / Admin',
      color: '#15803d',
      bg: '#dcfce7',
      pages: [
        { file: 'teacher-panel.html',       label: 'Panel del profesor' },
        { file: 'wizard-create-course.html', label: 'Crear nuevo curso' },
        { file: 'lesson-editor.html',       label: 'Editor de lección' },
        { file: 'exercise-editor.html',     label: 'Editor de ejercicio' },
        { file: 'reports-inbox.html',       label: 'Bandeja de reportes' },
      ],
    },
    {
      section: 'Mockups iniciales',
      color: '#b45309',
      bg: '#fef3c7',
      pages: [
        { file: 'extraditables_mockup_dashboard.html',      label: 'Mockup — Dashboard' },
        { file: 'extraditables_mockup_aprendizaje.html',    label: 'Mockup — Aprendizaje' },
        { file: 'extraditables_mockup_editor.html',         label: 'Mockup — Editor' },
        { file: 'extraditables_mockup_panel_profesor.html', label: 'Mockup — Panel profesor' },
      ],
    },
  ];

  const current = location.pathname.split('/').pop() || 'index.html';

  /* ── flat list for prev/next ── */
  const flat = PAGES.flatMap(s => s.pages);
  const idx  = flat.findIndex(p => p.file === current);
  const prev = idx > 0  ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  /* ── styles ── */
  const style = document.createElement('style');
  style.textContent = `
  #wf-nav-toggle {
    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
    width: 44px; height: 44px; border-radius: 50%;
    background: #1f2328; color: #fff;
    border: none; cursor: pointer; font-size: 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,.25);
    display: flex; align-items: center; justify-content: center;
    transition: transform .15s, background .15s;
  }
  #wf-nav-toggle:hover { background: #3d444d; transform: scale(1.07); }

  #wf-nav-panel {
    position: fixed; bottom: 72px; right: 20px; z-index: 9998;
    width: 280px; max-height: 70vh;
    background: #ffffff; border: 0.5px solid #d0d7de;
    border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,.15);
    overflow-y: auto; display: none; flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  #wf-nav-panel.open { display: flex; }

  .wfn-header {
    padding: 12px 14px 8px;
    border-bottom: 0.5px solid #d0d7de;
    display: flex; align-items: center; gap: 8px;
  }
  .wfn-header a {
    font-size: 11px; font-weight: 500; color: #1d4ed8;
    text-decoration: none; padding: 3px 8px;
    background: #dbeafe; border-radius: 4px;
  }
  .wfn-header a:hover { background: #bfdbfe; }
  .wfn-title {
    font-size: 11px; font-weight: 600; color: #1f2328; margin-left: auto;
  }

  .wfn-section-label {
    font-size: 10px; font-weight: 600; letter-spacing: .05em;
    text-transform: uppercase; padding: 10px 14px 4px;
    color: var(--wfn-color, #656d76);
  }
  .wfn-item {
    font-size: 12px; padding: 6px 14px 6px 20px;
    color: #1f2328; text-decoration: none;
    display: block; border-radius: 0;
    transition: background .1s;
  }
  .wfn-item:hover { background: #f6f8fa; }
  .wfn-item.current {
    background: #dbeafe; color: #1d4ed8;
    font-weight: 600; border-left: 3px solid #1d4ed8;
    padding-left: 17px;
  }

  .wfn-footer {
    padding: 8px 14px 10px;
    border-top: 0.5px solid #d0d7de;
    display: flex; gap: 6px;
  }
  .wfn-footer a {
    flex: 1; font-size: 11px; font-weight: 500;
    padding: 5px 8px; border-radius: 5px;
    text-align: center; text-decoration: none;
    background: #f6f8fa; color: #1f2328;
    border: 0.5px solid #d0d7de;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .wfn-footer a:hover { background: #eef0f3; }
  .wfn-footer a.disabled { opacity: .35; pointer-events: none; }
  `;
  document.head.appendChild(style);

  /* ── toggle button ── */
  const btn = document.createElement('button');
  btn.id = 'wf-nav-toggle';
  btn.title = 'Navegar wireframes';
  btn.textContent = '⊞';
  document.body.appendChild(btn);

  /* ── panel ── */
  const panel = document.createElement('div');
  panel.id = 'wf-nav-panel';

  // header
  const header = document.createElement('div');
  header.className = 'wfn-header';
  header.innerHTML = `<a href="index.html">← Índice</a><span class="wfn-title">Wireframes</span>`;
  panel.appendChild(header);

  // sections
  PAGES.forEach(section => {
    const label = document.createElement('div');
    label.className = 'wfn-section-label';
    label.style.setProperty('--wfn-color', section.color);
    label.textContent = section.section;
    panel.appendChild(label);

    section.pages.forEach(p => {
      const a = document.createElement('a');
      a.className = 'wfn-item' + (p.file === current ? ' current' : '');
      a.href = p.file;
      a.textContent = p.label;
      panel.appendChild(a);
    });
  });

  // footer prev/next
  const footer = document.createElement('div');
  footer.className = 'wfn-footer';
  const prevA = document.createElement('a');
  prevA.href   = prev ? prev.file : '#';
  prevA.title  = prev ? prev.label : '';
  prevA.textContent = prev ? '← ' + prev.label : '← anterior';
  if (!prev) prevA.classList.add('disabled');
  const nextA = document.createElement('a');
  nextA.href   = next ? next.file : '#';
  nextA.title  = next ? next.label : '';
  nextA.textContent = next ? next.label + ' →' : 'siguiente →';
  if (!next) nextA.classList.add('disabled');
  footer.appendChild(prevA);
  footer.appendChild(nextA);
  panel.appendChild(footer);

  document.body.appendChild(panel);

  /* ── toggle logic ── */
  btn.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
    }
  });
})();
