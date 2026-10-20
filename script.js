
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

let tasks = JSON.parse(localStorage.getItem("studynest-tasks")) || [];
let currentFilter = "all";

function updateStats() {
  totalTasks.textContent = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  completedTasks.textContent = completed;
  remainingTasks.textContent = tasks.length - completed;

   // Save tasks in the browser
  localStorage.setItem("studynest-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "Your study journey starts here. Add a task!";

    taskList.appendChild(emptyMessage);
    updateStats();
    return;
  }

 const filteredTasks = tasks.filter(task => {
  if (currentFilter === "pending") return !task.completed;
  if (currentFilter === "completed") return task.completed;
  return true;
});

filteredTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";

    const taskLabel = document.createElement("label");
    taskLabel.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.name}`);

    const taskName = document.createElement("span");
    taskName.textContent = task.name;

    if (task.completed) {
      taskName.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    taskLabel.append(checkbox, taskName);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.name}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      renderTasks();
    });

    item.append(taskLabel, deleteButton);
    taskList.appendChild(item);
  });

  updateStats();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = taskInput.value.trim();

  if (!name) return;

  tasks.push({
    id: Date.now(),
    name: name,
    completed: false
  });

  taskInput.value = "";
  renderTasks();
  taskInput.focus();
});

renderTasks();
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderTasks();
  });
});