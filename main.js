
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;

  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const userSpan = document.getElementById("userName");

  const username = localStorage.getItem("username");
  if (userSpan && username) {
    userSpan.textContent = username;
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = btoa(document.getElementById("password").value.trim());

      if (!username || !email || !password) {
        alert("All fields are required.");
        return;
      }

      const user = { username, email, password };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("username", username);

      alert("Registration successful!");
      window.location.href = "userinfo.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const inputUsername = document.getElementById("loginUsername").value.trim();
      const inputPassword = btoa(document.getElementById("loginPassword").value.trim());

      if (storedUser && inputUsername === storedUser.username && inputPassword === storedUser.password) {
        localStorage.setItem("username", inputUsername);
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid credentials!");
      }
    });
  }

  if (currentPage.includes("dashboard.html")) {
    loadTasks();
  }
});

// Add new task
function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const status = "Upcoming";
  const progress = 0;

  if (!title || !desc) {
    alert("Please enter both task title and description.");
    return;
  }

  const task = { id: Date.now(), title, desc, status, progress };
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";

  loadTasks();
}

// Load and display tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  const upcoming = document.getElementById("upcomingTasks");
  const inProgress = document.getElementById("inProgressTasks");
  const completed = document.getElementById("completedTasks");

  if (!upcoming || !inProgress || !completed) return;

  upcoming.innerHTML = "<h3>📌 Upcoming</h3>";
  inProgress.innerHTML = "<h3>⚙️ In Progress</h3>";
  completed.innerHTML = "<h3>✅ Completed</h3>";

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.desc}</p>
      <p><strong>Progress:</strong> ${task.progress}%</p>
    `;

    if (task.status !== "Completed") {
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update Progress";
      updateBtn.onclick = () => updateTaskProgress(task.id);
      card.appendChild(updateBtn);
    } else {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Task";
      deleteBtn.onclick = () => deleteTask(task.id);
      card.appendChild(deleteBtn);
    }

    switch (task.status) {
      case "Upcoming":
        upcoming.appendChild(card);
        break;
      case "In Progress":
        inProgress.appendChild(card);
        break;
      case "Completed":
        completed.appendChild(card);
        break;
    }
  });
}

// Update progress
function updateTaskProgress(taskId) {
  const newProgress = prompt("Enter new progress (0–100):");
  if (newProgress === null) return;

  const value = parseInt(newProgress);
  if (isNaN(value) || value < 0 || value > 100) {
    alert("Please enter a number between 0 and 100.");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const index = tasks.findIndex(t => t.id === taskId);

  if (index !== -1) {
    tasks[index].progress = value;
    if (value === 100) {
      tasks[index].status = "Completed";
    } else if (value > 0) {
      tasks[index].status = "In Progress";
    } else {
      tasks[index].status = "Upcoming";
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

// Delete a completed task
function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// Logout
function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}
