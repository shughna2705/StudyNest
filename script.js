
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

function loadTasks() {
  try {
    const savedTasks = JSON.parse(
      localStorage.getItem("studynest-tasks")
    );

    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();
let currentFilter = "all";

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  remainingTasks.textContent = tasks.length - completed;

  localStorage.setItem("studynest-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-state";

    if (tasks.length === 0) {
      emptyMessage.textContent =
        "Your study journey starts here. Add your first task!";
    } else if (currentFilter === "pending") {
      emptyMessage.textContent =
        "All caught up! You have no pending tasks.";
    } else if (currentFilter === "completed") {
      emptyMessage.textContent =
        "No completed tasks yet. Your progress will appear here.";
    } else {
      emptyMessage.textContent = "No tasks to show.";
    }

    taskList.appendChild(emptyMessage);
    updateStats();
    return;
  }

  filteredTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("task-completed");
    }

    const taskLabel = document.createElement("label");
    taskLabel.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.name}`);

    const taskName = document.createElement("span");
    taskName.className = "task-name";
    taskName.textContent = task.name;

    if (task.completed) {
      taskName.classList.add("completed");
    }

    const status = document.createElement("span");
    status.className = "task-status";
    status.textContent = task.completed ? "Completed" : "In progress";

    checkbox.addEventListener("change", () => {
  task.completed = checkbox.checked;

  if (task.completed) {
    task.completedAt = new Date().toISOString();
  } else {
    delete task.completedAt;
  }

  renderTasks();

  if (typeof renderAnalytics === "function") {
    renderAnalytics();
  }
});

    taskLabel.append(checkbox, taskName);

    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";
    taskActions.appendChild(status);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.name}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      renderTasks();
    });

    taskActions.appendChild(deleteButton);
    item.append(taskLabel, taskActions);
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
    name,
    completed: false
  });

  taskInput.value = "";
  renderTasks();
  taskInput.focus();
});

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach(filterButton => {
      filterButton.classList.toggle(
        "active",
        filterButton === button
      );
    });

    renderTasks();
  });
});

renderTasks();

/* ===== StudyNest Focus Lab Timer ===== */

const timerDisplay = document.getElementById("timerDisplay");
const timerModeLabel = document.getElementById("timerMode");
const timerMessage = document.getElementById("timerMessage");
const timerStartButton = document.getElementById("timerStart");
const timerResetButton = document.getElementById("timerReset");
const sessionsCompletedDisplay =
  document.getElementById("sessionsCompleted");

const timerModeButtons = document.querySelectorAll(".timer-mode-button");

let timerDuration = 25 * 60;
let timerRemaining = timerDuration;
let timerInterval = null;
let timerRunning = false;
let selectedTimerMode = "focus";
let completedSessions = Number(
  localStorage.getItem("studynest-sessions") || 0
);

sessionsCompletedDisplay.textContent = completedSessions;

function updateTimerDisplay() {
  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  document.title = timerRunning
    ? `${timerDisplay.textContent} — StudyNest`
    : "StudyNest — Your Learning Space";
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerRunning = false;
  timerStartButton.textContent = "Start focus";
  updateTimerDisplay();
}

function startTimer() {
  if (timerRunning) {
    stopTimer();
    timerMessage.textContent = "Timer paused. Resume when ready.";
    return;
  }

  if (timerRemaining <= 0) {
    timerMessage.textContent = "Choose a mode or reset to start again.";
    return;
  }

  timerRunning = true;
  timerStartButton.textContent = "Pause";
  timerMessage.textContent =
    selectedTimerMode === "focus"
      ? "You're in the zone. Keep going!"
      : "Take a breath. You've earned this break.";

  timerInterval = setInterval(() => {
    timerRemaining -= 1;

    if (timerRemaining <= 0) {
      timerRemaining = 0;
      stopTimer();

      if (selectedTimerMode === "focus") {
        completedSessions += 1;
        // Save the completed focus session for Study Analytics
try {
  const history = JSON.parse(
    localStorage.getItem("studynest-focus-history") || "[]"
  );

  history.push({
    completedAt: new Date().toISOString()
  });

  localStorage.setItem(
    "studynest-focus-history",
    JSON.stringify(history)
  );
} catch (error) {
  console.error("Could not save focus session history:", error);
}

if (typeof renderAnalytics === "function") {
  renderAnalytics();
}

        localStorage.setItem(
          "studynest-sessions",
          String(completedSessions)
        );
        sessionsCompletedDisplay.textContent = completedSessions;
        timerMessage.textContent =
          "Focus session complete! Time to take a short break.";
      } else {
        timerMessage.textContent =
          "Break complete! Ready for another focus session?";
      }
    }

    updateTimerDisplay();
  }, 1000);

  updateTimerDisplay();
}

function resetTimer() {
  stopTimer();
  timerRemaining = timerDuration;
  timerMessage.textContent = "Ready when you are.";
  updateTimerDisplay();
}

function selectTimerMode(button) {
  stopTimer();

  selectedTimerMode = button.dataset.mode;
  timerDuration = Number(button.dataset.minutes) * 60;
  timerRemaining = timerDuration;

  timerModeLabel.textContent =
    selectedTimerMode === "focus" ? "FOCUS SESSION" : "SHORT BREAK";

  timerStartButton.textContent =
    selectedTimerMode === "focus" ? "Start focus" : "Start break";

  timerMessage.textContent =
    selectedTimerMode === "focus"
      ? "Ready when you are."
      : "A little rest helps you learn.";

  timerModeButtons.forEach(modeButton => {
    modeButton.classList.toggle("active", modeButton === button);
  });

  updateTimerDisplay();
}

timerStartButton.addEventListener("click", startTimer);
timerResetButton.addEventListener("click", resetTimer);

timerModeButtons.forEach(button => {
  button.addEventListener("click", () => selectTimerMode(button));
});

updateTimerDisplay();

/* ===== StudyNest Distraction Tracker ===== */

const distractionForm = document.getElementById("distractionForm");
const distractionType = document.getElementById("distractionType");
const interruptionCount = document.getElementById("interruptionCount");
const minutesLost = document.getElementById("minutesLost");
const distractionNote = document.getElementById("distractionNote");

const totalInterruptionsDisplay =
  document.getElementById("totalInterruptions");
const totalTimeLostDisplay =
  document.getElementById("totalTimeLost");
const topDistractionDisplay =
  document.getElementById("topDistraction");

const distractionInsights =
  document.getElementById("distractionInsights");
const distractionList =
  document.getElementById("distractionList");

function loadDistractions() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("studynest-distractions")
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let distractions = loadDistractions();

function saveDistractions() {
  localStorage.setItem(
    "studynest-distractions",
    JSON.stringify(distractions)
  );
}

function renderDistractions() {
  distractionList.replaceChildren();

  const totals = {};

  let totalInterruptions = 0;
  let totalMinutes = 0;

  distractions.forEach(entry => {
    if (!totals[entry.type]) {
      totals[entry.type] = {
        count: 0,
        minutes: 0
      };
    }

    totals[entry.type].count += entry.count;
    totals[entry.type].minutes += entry.minutes;

    totalInterruptions += entry.count;
    totalMinutes += entry.minutes;
  });

  totalInterruptionsDisplay.textContent = totalInterruptions;
  totalTimeLostDisplay.textContent = `${totalMinutes} min`;

  const ranked = Object.entries(totals).sort((a, b) => {
    return b[1].minutes - a[1].minutes ||
      b[1].count - a[1].count;
  });

  topDistractionDisplay.textContent =
    ranked.length > 0 ? ranked[0][0] : "None yet";

  if (ranked.length === 0) {
    distractionInsights.textContent =
      "Start logging interruptions to discover which distractions cost you the most study time.";
  } else {
    const [topType, topStats] = ranked[0];

    distractionInsights.textContent =
      `${topType} is currently your biggest time drain, accounting for ` +
      `${topStats.minutes} estimated minutes lost across ` +
      `${topStats.count} interruption${topStats.count === 1 ? "" : "s"}. ` +
      "Try one small change in your next study session to reduce it.";
  }

  distractions.slice().reverse().forEach(entry => {
    const item = document.createElement("li");
    item.className = "distraction-entry";

    const heading = document.createElement("div");
    heading.className = "distraction-entry-heading";

    const name = document.createElement("strong");
    name.textContent = entry.type;

    const summary = document.createElement("span");
    summary.textContent =
      `${entry.count} interruption${entry.count === 1 ? "" : "s"} · ${entry.minutes} min`;

    heading.append(name, summary);
    item.appendChild(heading);

    if (entry.note) {
      const note = document.createElement("p");
      note.textContent = entry.note;
      item.appendChild(note);
    }

    const date = document.createElement("p");
    date.textContent = `Logged ${new Date(entry.createdAt).toLocaleString()}`;
    item.appendChild(date);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete entry";
    deleteButton.setAttribute(
      "aria-label",
      `Delete ${entry.type} distraction entry`
    );

    deleteButton.addEventListener("click", () => {
      distractions = distractions.filter(item => item.id !== entry.id);
      saveDistractions();
      renderDistractions();
    });

    item.appendChild(deleteButton);
    distractionList.appendChild(item);
  });
}

distractionForm.addEventListener("submit", event => {
  event.preventDefault();

  const type = distractionType.value;
  const count = Number(interruptionCount.value);
  const minutes = Number(minutesLost.value);
  const note = distractionNote.value.trim();

  if (
    !type ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > 100 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > 1440
  ) {
    return;
  }

  distractions.push({
    id: Date.now() + Math.random(),
    type,
    count,
    minutes,
    note,
    createdAt: new Date().toISOString()
  });

  saveDistractions();
  renderDistractions();

  distractionForm.reset();
  interruptionCount.value = 1;
  minutesLost.value = 5;
  distractionType.focus();
});

renderDistractions();

/* ===== StudyNest Study Analytics ===== */

const analyticsTasksCompleted =
  document.getElementById("analyticsTasksCompleted");
const analyticsTaskRate =
  document.getElementById("analyticsTaskRate");
const analyticsFocusSessions =
  document.getElementById("analyticsFocusSessions");
const analyticsTimeLost =
  document.getElementById("analyticsTimeLost");
const analyticsInterruptions =
  document.getElementById("analyticsInterruptions");
const analyticsChart =
  document.getElementById("analyticsChart");
const analyticsInsightTitle =
  document.getElementById("analyticsInsightTitle");
const analyticsInsightText =
  document.getElementById("analyticsInsightText");

function readAnalyticsArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readFocusHistory() {
  try {
    const value = JSON.parse(
      localStorage.getItem("studynest-focus-history")
    );
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getLocalDay(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function renderAnalytics() {
  const savedTasks = readAnalyticsArray("studynest-tasks");
  const savedDistractions =
    readAnalyticsArray("studynest-distractions");
  const focusHistory = readFocusHistory();

  const completedTasks = savedTasks.filter(task => task.completed).length;
  const completionRate = savedTasks.length
    ? Math.round((completedTasks / savedTasks.length) * 100)
    : 0;

  analyticsTasksCompleted.textContent = completedTasks;
  analyticsTaskRate.textContent = `${completionRate}% completion rate`;

  // Use the saved total for backward compatibility with existing sessions.
  let focusTotal = 0;

  try {
    const storedTotal = Number(
      localStorage.getItem("studynest-sessions") || 0
    );

    focusTotal = Number.isFinite(storedTotal)
      ? Math.max(0, storedTotal)
      : 0;
  } catch {
    focusTotal = 0;
  }

  // Avoid counting historical sessions twice if history is introduced later.
  focusTotal = Math.max(focusTotal, focusHistory.length);

  analyticsFocusSessions.textContent = focusTotal;

  const totalMinutes = savedDistractions.reduce((sum, entry) => {
    const minutes = Number(entry.minutes);
    return sum + (
      Number.isFinite(minutes) && minutes >= 0 ? minutes : 0
    );
  }, 0);

  const totalInterruptions = savedDistractions.reduce((sum, entry) => {
    const count = Number(entry.count);
    return sum + (
      Number.isFinite(count) && count >= 0 ? count : 0
    );
  }, 0);

  analyticsTimeLost.textContent = `${totalMinutes} min`;
  analyticsInterruptions.textContent = totalInterruptions;

  // Prepare seven local calendar days, including today.
  const days = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    days.push({
      key: getLocalDay(date),
      label: date.toLocaleDateString(undefined, {
        weekday: "short"
      }),
      tasks: 0,
      focus: 0
    });
  }

  const dayLookup = new Map(days.map(day => [day.key, day]));

  // Completed tasks only have a reliable activity date if the app recorded it.
  // Do not assume their completion happened today.
  savedTasks.forEach(task => {
    if (!task.completed || !task.completedAt) return;

    const day = dayLookup.get(getLocalDay(task.completedAt));
    if (day) day.tasks += 1;
  });

  focusHistory.forEach(session => {
    const day = dayLookup.get(getLocalDay(session.completedAt));
    if (day) day.focus += 1;
  });

  analyticsChart.replaceChildren();

  const maxValue = Math.max(
    1,
    ...days.map(day => Math.max(day.tasks, day.focus))
  );

  days.forEach(day => {
    const column = document.createElement("div");
    column.className = "chart-day";

    const bars = document.createElement("div");
    bars.className = "chart-bars";

    const taskBar = document.createElement("div");
    taskBar.className = "chart-bar tasks-bar";
    taskBar.style.height = `${Math.max(3, (day.tasks / maxValue) * 120)}px`;
    taskBar.title = `${day.tasks} tasks completed`;
    taskBar.setAttribute("aria-label", `${day.tasks} tasks completed`);

    const focusBar = document.createElement("div");
    focusBar.className = "chart-bar focus-bar";
    focusBar.style.height = `${Math.max(3, (day.focus / maxValue) * 120)}px`;
    focusBar.title = `${day.focus} focus sessions`;
    focusBar.setAttribute("aria-label", `${day.focus} focus sessions`);

    bars.append(taskBar, focusBar);

    const label = document.createElement("span");
    label.className = "chart-day-label";
    label.textContent = day.label;

    column.append(bars, label);
    analyticsChart.appendChild(column);
  });

  const hasDatedActivity = days.some(day => day.tasks > 0 || day.focus > 0);

  if (!hasDatedActivity) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "analytics-chart-empty";
    emptyNote.textContent =
      "Your dated activity will appear here as you complete tasks and focus sessions.";
    analyticsChart.appendChild(emptyNote);
  }

  if (focusTotal === 0 && completedTasks === 0 && totalInterruptions === 0) {
    analyticsInsightTitle.textContent = "Your journey starts here";
    analyticsInsightText.textContent =
      "Complete a task, finish a focus session, or log an interruption to start building your study insights.";
  } else if (savedTasks.length > 0 && completionRate >= 70) {
    analyticsInsightTitle.textContent = "You're making progress";
    analyticsInsightText.textContent =
      `You've completed ${completionRate}% of your saved tasks. Keep your momentum going with one focused session.`;
  } else if (totalMinutes >= 30) {
    analyticsInsightTitle.textContent = "Protect your study time";
    analyticsInsightText.textContent =
      `You've logged ${totalMinutes} estimated minutes lost to distractions. Try reducing your most frequent interruption during your next session.`;
  } else {
    analyticsInsightTitle.textContent = "Build your study rhythm";
    analyticsInsightText.textContent =
      `You've completed ${completedTasks} tasks and ${focusTotal} focus sessions. Keep recording your activity to reveal useful patterns.`;
  }
}

renderAnalytics();
