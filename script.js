const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks in Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
function addTask() {

    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        let li = document.createElement("li");

        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("checked");
        }

        li.onclick = () => toggleTask(task.id);

        let deleteBtn = document.createElement("span");

        deleteBtn.innerHTML = "&times;";
        deleteBtn.title = "Delete task";

        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            deleteTask(task.id);
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    taskCount.textContent =
        tasks.length + (tasks.length === 1 ? " task" : " tasks");
}

// Mark task completed or pending
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

// Delete task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Filter tasks
function filterTasks(filter, button) {

    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
}

// Clear completed tasks
function clearCompleted() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();
}

// Add task using Enter key
taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// Load saved tasks
displayTasks();