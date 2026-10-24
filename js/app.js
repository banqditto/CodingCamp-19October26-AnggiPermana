/* ============================================================
   app.js — Personal Dashboard
   MVP Features : Greeting · Focus Timer · To-Do List · Quick Links
   Challenges   : Light/Dark Mode · Custom Name · Change Pomodoro Time
                  Prevent Duplicate Tasks · Sort Tasks
   Storage      : localStorage
   ============================================================ */

'use strict';

/* ── Helpers ─────────────────────────────────────────────── */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

/* ── localStorage ─────────────────────────────────────────── */

const LS = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  },
};

/* ============================================================
   CHALLENGE 1 — LIGHT / DARK MODE
   ============================================================ */

const THEME_KEY    = 'dashboard_theme';
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.getElementById('themeIcon');
const htmlEl       = document.documentElement;

let currentTheme = LS.get(THEME_KEY, 'dark');

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.title     = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  themeToggle.setAttribute('aria-label', themeToggle.title);
  currentTheme = theme;
  LS.set(THEME_KEY, theme);
}

themeToggle.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

applyTheme(currentTheme);

/* ============================================================
   CHALLENGE 2 — CUSTOM NAME IN GREETING
   ============================================================ */

const NAME_KEY       = 'dashboard_name';
const nameDisplayEl  = document.getElementById('nameDisplay');
const nameLabelEl    = document.getElementById('nameLabel');
const editNameBtnEl  = document.getElementById('editNameBtn');
const nameEditEl     = document.getElementById('nameEdit');
const nameInputEl    = document.getElementById('nameInput');
const saveNameBtnEl  = document.getElementById('saveNameBtn');
const cancelNameBtnEl= document.getElementById('cancelNameBtn');

let userName = LS.get(NAME_KEY, '');

function renderName() {
  if (userName) {
    nameLabelEl.textContent = `Welcome back, ${userName}! 👋`;
  } else {
    nameLabelEl.textContent = '';
  }
}

function showNameEdit() {
  nameInputEl.value = userName;
  nameEditEl.removeAttribute('hidden');
  editNameBtnEl.setAttribute('hidden', '');
  nameInputEl.focus();
}

function hideNameEdit() {
  nameEditEl.setAttribute('hidden', '');
  editNameBtnEl.removeAttribute('hidden');
}

function saveName() {
  const trimmed = nameInputEl.value.trim();
  userName = trimmed;
  LS.set(NAME_KEY, userName);
  renderName();
  hideNameEdit();
}

editNameBtnEl.addEventListener('click', showNameEdit);
saveNameBtnEl.addEventListener('click', saveName);
cancelNameBtnEl.addEventListener('click', hideNameEdit);
nameInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveName();
  if (e.key === 'Escape') hideNameEdit();
});

renderName();

/* ============================================================
   GREETING (time / date)
   ============================================================ */

const datetimeEl = document.getElementById('datetime');
const greetingEl = document.getElementById('greeting');

function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good Morning ☀️';
  if (hour >= 12 && hour < 17) return 'Good Afternoon 🌤️';
  if (hour >= 17 && hour < 21) return 'Good Evening 🌆';
  return 'Good Night 🌙';
}

function updateGreeting() {
  const now = new Date();

  datetimeEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) + '  ·  ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  greetingEl.textContent = getGreeting(now.getHours());
}

updateGreeting();
setInterval(updateGreeting, 1000);

/* ============================================================
   CHALLENGE 3 — CHANGE POMODORO TIME
   + MVP Focus Timer
   ============================================================ */

const POMO_KEY      = 'dashboard_pomo_minutes';
const DEFAULT_MINS  = 25;

const pomoDurationEl  = document.getElementById('pomoDuration');
const applyDurationEl = document.getElementById('applyDuration');
const timerDisplayEl  = document.getElementById('timerDisplay');
const timerStatusEl   = document.getElementById('timerStatus');
const startBtn        = document.getElementById('startBtn');
const stopBtn         = document.getElementById('stopBtn');
const resetBtn        = document.getElementById('resetBtn');

/* Load saved duration */
let pomoMinutes  = LS.get(POMO_KEY, DEFAULT_MINS);
let timerSeconds = pomoMinutes * 60;
let timerInterval= null;
let timerRunning = false;

pomoDurationEl.value = pomoMinutes;

function renderTimer() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  timerDisplayEl.textContent = `${pad(m)}:${pad(s)}`;
}

function setTimerState(state) {
  timerDisplayEl.classList.remove('running', 'done');
  if (state === 'running') timerDisplayEl.classList.add('running');
  if (state === 'done')    timerDisplayEl.classList.add('done');

  startBtn.disabled = state === 'running';
  stopBtn.disabled  = state !== 'running';

  const msgs = {
    idle:    'Ready to focus!',
    running: '🎯 Stay focused…',
    done:    '✅ Session complete! Great work.',
  };
  timerStatusEl.textContent = msgs[state] ?? '';
}

function startTimer() {
  if (timerRunning) return;
  if (timerSeconds === 0) timerSeconds = pomoMinutes * 60;
  timerRunning = true;
  setTimerState('running');

  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    renderTimer();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning  = false;
      setTimerState('done');
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  setTimerState('idle');
  timerStatusEl.textContent = '⏸ Paused — press Start to continue.';
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  timerSeconds  = pomoMinutes * 60;
  renderTimer();
  setTimerState('idle');
}

/* Apply custom duration */
applyDurationEl.addEventListener('click', () => {
  const val = parseInt(pomoDurationEl.value, 10);
  if (isNaN(val) || val < 1 || val > 120) {
    pomoDurationEl.focus();
    return;
  }
  pomoMinutes = val;
  LS.set(POMO_KEY, pomoMinutes);
  resetTimer();
  timerStatusEl.textContent = `⏱ Duration set to ${pomoMinutes} min.`;
});

pomoDurationEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') applyDurationEl.click();
});

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click',  stopTimer);
resetBtn.addEventListener('click', resetTimer);

renderTimer();
setTimerState('idle');

/* ============================================================
   MVP TO-DO LIST
   + CHALLENGE 4 — PREVENT DUPLICATE TASKS
   + CHALLENGE 5 — SORT TASKS
   ============================================================ */

const TODO_KEY = 'dashboard_todos';
const SORT_KEY = 'dashboard_sort';

let todos     = LS.get(TODO_KEY, []);
let sortOrder = LS.get(SORT_KEY, 'added');

const todoInputEl       = document.getElementById('todoInput');
const addTodoBtnEl      = document.getElementById('addTodoBtn');
const todoListEl        = document.getElementById('todoList');
const todoEmptyEl       = document.getElementById('todoEmpty');
const todoDupeWarnEl    = document.getElementById('todoDupeWarn');
const sortSelectEl      = document.getElementById('sortSelect');

/* Edit modal */
const todoModalEl       = document.getElementById('todoModal');
const todoEditInputEl   = document.getElementById('todoEditInput');
const todoEditDupeWarnEl= document.getElementById('todoEditDupeWarn');
const todoSaveBtnEl     = document.getElementById('todoSaveBtn');
const todoCancelBtnEl   = document.getElementById('todoCancelBtn');

let editingTodoId = null;

/* Restore saved sort preference */
sortSelectEl.value = sortOrder;

function saveTodos() {
  LS.set(TODO_KEY, todos);
}

/* Returns a sorted copy without mutating the source array */
function getSortedTodos() {
  const copy = [...todos];
  if (sortOrder === 'alpha') {
    copy.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortOrder === 'done') {
    copy.sort((a, b) => Number(a.done) - Number(b.done));
  }
  /* 'added' keeps insertion order (already sorted by push order) */
  return copy;
}

/* Case-insensitive duplicate check */
function isDuplicateTodo(text, excludeId = null) {
  const lower = text.trim().toLowerCase();
  return todos.some(
    (t) => t.id !== excludeId && t.text.toLowerCase() === lower
  );
}

function renderTodos() {
  todoListEl.innerHTML = '';

  const sorted = getSortedTodos();

  if (sorted.length === 0) {
    todoEmptyEl.classList.add('visible');
    return;
  }
  todoEmptyEl.classList.remove('visible');

  sorted.forEach((todo) => {
    const li = document.createElement('li');
    li.className  = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    /* Checkbox */
    const checkbox = document.createElement('input');
    checkbox.type      = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked   = todo.done;
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.done ? 'undone' : 'done'}`);
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    /* Text */
    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    /* Actions */
    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.title     = 'Edit task';
    editBtn.setAttribute('aria-label', `Edit task "${todo.text}"`);
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => openEditTodo(todo.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon btn-danger';
    deleteBtn.title     = 'Delete task';
    deleteBtn.setAttribute('aria-label', `Delete task "${todo.text}"`);
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    todoListEl.appendChild(li);
  });
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;

  /* Duplicate guard */
  if (isDuplicateTodo(trimmed)) {
    todoDupeWarnEl.removeAttribute('hidden');
    todoInputEl.focus();
    setTimeout(() => todoDupeWarnEl.setAttribute('hidden', ''), 3000);
    return false;
  }

  todoDupeWarnEl.setAttribute('hidden', '');
  todos.push({ id: uid(), text: trimmed, done: false });
  saveTodos();
  renderTodos();
  return true;
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function openEditTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  editingTodoId = id;
  todoEditInputEl.value = todo.text;
  todoEditDupeWarnEl.setAttribute('hidden', '');
  todoModalEl.removeAttribute('hidden');
  todoEditInputEl.focus();
}

function closeEditTodo() {
  editingTodoId = null;
  todoModalEl.setAttribute('hidden', '');
}

function saveEditTodo() {
  const trimmed = todoEditInputEl.value.trim();
  if (!trimmed) return;

  /* Duplicate guard — allow keeping the same text */
  if (isDuplicateTodo(trimmed, editingTodoId)) {
    todoEditDupeWarnEl.removeAttribute('hidden');
    todoEditInputEl.focus();
    return;
  }

  todoEditDupeWarnEl.setAttribute('hidden', '');
  const todo = todos.find((t) => t.id === editingTodoId);
  if (todo) {
    todo.text = trimmed;
    saveTodos();
    renderTodos();
  }
  closeEditTodo();
}

/* Sort change */
sortSelectEl.addEventListener('change', () => {
  sortOrder = sortSelectEl.value;
  LS.set(SORT_KEY, sortOrder);
  renderTodos();
});

addTodoBtnEl.addEventListener('click', () => {
  if (addTodo(todoInputEl.value)) {
    todoInputEl.value = '';
  }
  todoInputEl.focus();
});

todoInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (addTodo(todoInputEl.value)) todoInputEl.value = '';
  }
});

todoSaveBtnEl.addEventListener('click', saveEditTodo);
todoCancelBtnEl.addEventListener('click', closeEditTodo);

todoEditInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveEditTodo();
  if (e.key === 'Escape') closeEditTodo();
});

todoModalEl.addEventListener('click', (e) => {
  if (e.target === todoModalEl) closeEditTodo();
});

renderTodos();

/* ============================================================
   MVP QUICK LINKS
   ============================================================ */

const LINKS_KEY = 'dashboard_links';

let links = LS.get(LINKS_KEY, []);

const linkNameEl     = document.getElementById('linkName');
const linkUrlEl      = document.getElementById('linkUrl');
const addLinkBtnEl   = document.getElementById('addLinkBtn');
const linksListEl    = document.getElementById('linksList');
const linksEmptyEl   = document.getElementById('linksEmpty');

/* Edit modal */
const linkModalEl     = document.getElementById('linkModal');
const linkEditNameEl  = document.getElementById('linkEditName');
const linkEditUrlEl   = document.getElementById('linkEditUrl');
const linkSaveBtnEl   = document.getElementById('linkSaveBtn');
const linkCancelBtnEl = document.getElementById('linkCancelBtn');

let editingLinkId = null;

function saveLinks() {
  LS.set(LINKS_KEY, links);
}

function ensureHttps(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://' + url;
}

function renderLinks() {
  linksListEl.innerHTML = '';

  if (links.length === 0) {
    linksEmptyEl.classList.add('visible');
    return;
  }
  linksEmptyEl.classList.remove('visible');

  links.forEach((link) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';
    chip.dataset.id = link.id;

    const a = document.createElement('a');
    a.href   = link.url;
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.textContent = link.name;

    const actions = document.createElement('div');
    actions.className = 'link-chip-actions';

    const editBtn = document.createElement('button');
    editBtn.className   = 'btn-icon';
    editBtn.title       = 'Edit link';
    editBtn.setAttribute('aria-label', `Edit link "${link.name}"`);
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => openEditLink(link.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className   = 'btn-icon btn-danger';
    deleteBtn.title       = 'Delete link';
    deleteBtn.setAttribute('aria-label', `Delete link "${link.name}"`);
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => deleteLink(link.id));

    actions.append(editBtn, deleteBtn);
    chip.append(a, actions);
    linksListEl.appendChild(chip);
  });
}

function addLink(name, url) {
  const trimmedName = name.trim();
  const trimmedUrl  = url.trim();
  if (!trimmedName || !trimmedUrl) return false;
  links.push({ id: uid(), name: trimmedName, url: ensureHttps(trimmedUrl) });
  saveLinks();
  renderLinks();
  return true;
}

function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

function openEditLink(id) {
  const link = links.find((l) => l.id === id);
  if (!link) return;
  editingLinkId      = id;
  linkEditNameEl.value = link.name;
  linkEditUrlEl.value  = link.url;
  linkModalEl.removeAttribute('hidden');
  linkEditNameEl.focus();
}

function closeEditLink() {
  editingLinkId = null;
  linkModalEl.setAttribute('hidden', '');
}

function saveEditLink() {
  const trimmedName = linkEditNameEl.value.trim();
  const trimmedUrl  = linkEditUrlEl.value.trim();
  if (!trimmedName || !trimmedUrl) return;
  const link = links.find((l) => l.id === editingLinkId);
  if (link) {
    link.name = trimmedName;
    link.url  = ensureHttps(trimmedUrl);
    saveLinks();
    renderLinks();
  }
  closeEditLink();
}

addLinkBtnEl.addEventListener('click', () => {
  if (addLink(linkNameEl.value, linkUrlEl.value)) {
    linkNameEl.value = '';
    linkUrlEl.value  = '';
    linkNameEl.focus();
  }
});

linkUrlEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLinkBtnEl.click();
});

linkSaveBtnEl.addEventListener('click', saveEditLink);
linkCancelBtnEl.addEventListener('click', closeEditLink);

linkEditUrlEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveEditLink();
  if (e.key === 'Escape') closeEditLink();
});

linkModalEl.addEventListener('click', (e) => {
  if (e.target === linkModalEl) closeEditLink();
});

renderLinks();
