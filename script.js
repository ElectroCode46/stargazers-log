document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('repo-list');
  if (!container) return;

  fetch('events.json')
    .then(resp => {
      if (!resp.ok) throw new Error('Failed to load events.json');
      return resp.json();
    })
    .then(data => renderList(container, data))
    .catch(err => {
      console.error(err);
      container.innerHTML = '<div class="empty">Unable to load starred repositories.</div>';
    });
});

function renderList(container, events) {
  if (!Array.isArray(events) || events.length === 0) {
    container.innerHTML = '<div class="empty">No starred repositories found.</div>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'repo-list';

  events.forEach(ev => {
    const repo = ev.repo || {};
    const li = document.createElement('li');
    li.className = 'repo';

    const title = document.createElement('a');
    title.className = 'repo-name';
    title.href = repo.html_url || '#';
    title.textContent = repo.full_name || repo.name || 'unknown';
    title.target = '_blank';
    title.rel = 'noopener noreferrer';

    const desc = document.createElement('div');
    desc.className = 'description';
    desc.textContent = repo.description || '';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.textContent = `★ ${repo.stargazers_count ?? 0}`;

    const lang = document.createElement('div');
    lang.textContent = repo.language || '';

    const date = document.createElement('div');
    if (ev.starred_at) {
      const d = new Date(ev.starred_at);
      if (!Number.isNaN(d.getTime())) date.textContent = d.toLocaleString();
    }

    meta.appendChild(stars);
    if (lang.textContent) meta.appendChild(lang);
    if (date.textContent) meta.appendChild(date);

    li.appendChild(title);
    if (desc.textContent) li.appendChild(desc);
    li.appendChild(meta);

    ul.appendChild(li);
  });

  container.innerHTML = '';
  container.appendChild(ul);
}
