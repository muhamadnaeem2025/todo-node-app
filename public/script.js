const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const loadTodos = async () => {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(todo => addTodoToDOM(todo));
};

const addTodoToDOM = (todo) => {
  const li = document.createElement('li');
  li.textContent = todo.text;
  li.className = todo.done ? 'done' : '';
  li.addEventListener('click', async () => {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done })
    });
    loadTodos();
  });
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = async (e) => {
    e.stopPropagation();
    await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
    loadTodos();
  };
  li.appendChild(deleteBtn);
  list.appendChild(li);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  input.value = '';
  loadTodos();
});

loadTodos();
