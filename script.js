const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks in Local Storage

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

// Display tasks

function displayTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    document.getElementById("emptyMessage").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("checked");
        }

        // Checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        // Task text

        const text = document.createElement("span");

        text.className = "task-text";
        text.textContent = task.text;

        text.addEventListener("click", () => {
            toggleTask(task.id);
        });

        // Delete button

        const deleteBtn = document.createElement("button");

        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "×";
        deleteBtn.title = "Delete task";

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateCounts();
}

// Update task counts

function updateCounts() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("pendingCount").textContent = pending;

    document.getElementById("completedCount").textContent = completed;

    document.getElementById("taskCount").textContent =
        total + (total === 1 ? " task" : " tasks");
}

// Complete or uncomplete task

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete individual task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Filter tasks

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});

// Clear completed tasks

document.getElementById("clearBtn").addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();

});

// Add button click

document.getElementById("addBtn").addEventListener("click", addTask);

// Add task using Enter key

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});

// Load saved tasks

displayTasks();