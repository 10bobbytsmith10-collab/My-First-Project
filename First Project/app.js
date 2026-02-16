const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

let tasks = loadTasks(); // [{ text: "...", done: false }, ...]

render();

function loadTasks() {
  const raw = localStorage.getItem("tasks");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const span = document.createElement("span");
    span.textContent = task.text;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delBtn";

    span.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      render();
    });

    del.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      render();
      message.textContent = "Deleted 🗑️";
    });

    li.appendChild(span);
    li.appendChild(del);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = input.value.trim();

  if (!text) {
    message.textContent = "Type something first.";
    return;
  }

  tasks.push({ text, done: false });
  saveTasks();
  render();

  input.value = "";
  message.textContent = "Added ✅";
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});