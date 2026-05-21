const API = 'http://localhost:8000/todos';

// ── Fetch and render all todos ──────────────────────────────
async function loadTodos() {
  try {
    const res = await fetch(API + '/');
    const todos = await res.json();
    renderTodos(todos);
  } catch (e) {
    showError('Could not connect to the API. Is your server running?');
  }
}

function renderTodos(todos) {
  const list = document.getElementById('todo-list');

  if (todos.length === 0) {
    list.innerHTML = '<div class="empty">no todos yet — add one above</div>';
    return;
  }

  list.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.done ? 'done' : ''}" id="todo-${todo.id}">
      <input
        type="checkbox"
        ${todo.done ? 'checked' : ''}
        onchange="toggleDone(${todo.id}, this.checked)"
      />
      <span class="todo-task">${escapeHtml(todo.task)}</span>
      <span class="todo-id">#${todo.id}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete">✕</button>
    </div>
  `).join('');
}

// ── Add a new todo ──────────────────────────────────────────
async function addTodo() {
  const input = document.getElementById('task-input');
  const task = input.value.trim();
  if (!task) return;

  try {
    const res = await fetch(API + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, done: false })
    });
    if (!res.ok) throw new Error();
    input.value = '';
    loadTodos();
  } catch (e) {
    showError('Failed to add todo.');
  }
}

// ── Toggle done/not done ────────────────────────────────────
async function toggleDone(id, done) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
    if (!res.ok) throw new Error();
    loadTodos();
  } catch (e) {
    showError('Failed to update todo.');
  }
}

// ── Delete a todo ───────────────────────────────────────────
async function deleteTodo(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    loadTodos();
  } catch (e) {
    showError('Failed to delete todo.');
  }
}

// ── Helpers ─────────────────────────────────────────────────
function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Allow pressing Enter to add a todo
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

// Load todos on page open
loadTodos();