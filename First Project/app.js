const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const filterAllBtn = document.getElementById("filterAll");
const filterActiveBtn = document.getElementById("filterActive");
const filterDoneBtn = document.getElementById("filterDone");

let tasks = loadTasks();
let filter = "all"; // "all" | "active" | "done"

setActiveFilterButton();
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

function setActiveFilterButton() {
  filterAllBtn.classList.remove("activeFilter");
  filterActiveBtn.classList.remove("activeFilter");
  filterDoneBtn.classList.remove("activeFilter");

  if (filter === "all") filterAllBtn.classList.add("activeFilter");
  if (filter === "active") filterActiveBtn.classList.add("activeFilter");
  if (filter === "done") filterDoneBtn.classList.add("activeFilter");
}

function getVisibleTasks() {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  taskList.innerHTML = "";

  const visible = getVisibleTasks();

  visible.forEach((task) => {
    const index = tasks.indexOf(task);

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

  message.textContent = `Showing: ${filter} (${visible.length})`;
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
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// Filters
filterAllBtn.addEventListener("click", () => {
  filter = "all";
  setActiveFilterButton();
  render();
});

filterActiveBtn.addEventListener("click", () => {
  filter = "active";
  setActiveFilterButton();
  render();
});

filterDoneBtn.addEventListener("click", () => {
  filter = "done";
  setActiveFilterButton();
  render();
});
