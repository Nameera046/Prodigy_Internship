document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const dueDateInput = document.getElementById('dueDate');
    const prioritySelect = document.getElementById('priority');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    }

    function updateStats() {
        document.getElementById('totalTasks').textContent = `Total Tasks: ${tasks.length}`;
        const completed = tasks.filter(task => task.completed).length;
        document.getElementById('completedTasks').textContent = `Completed: ${completed}`;
    }

    function addTask(text, dueDate, priority) {
        const task = {
            id: Date.now(),
            text,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(task);
        renderTask(task);
        saveTasks();
    }

    function renderTask(task) {
        const div = document.createElement('div');
        div.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;
        div.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <h3 class="task-title">${task.text}</h3>
                <span class="task-date">Due: ${task.dueDate}</span>
            </div>
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        // Event Listeners
        const checkbox = div.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleComplete(task.id));

        const editBtn = div.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editTask(task.id));

        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(div);
    }

    function toggleComplete(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null) {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        let filteredTasks = tasks;
        
        if (filter === 'active') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        filteredTasks.forEach(task => renderTask(task));
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;
        
        if (text) {
            addTask(text, dueDate, priority);
            taskInput.value = '';
            dueDateInput.value = '';
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            renderTasks(e.target.dataset.filter);
        });
    });

    document.getElementById('sortTasks').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        tasks.sort((a, b) => {
            if (sortBy === 'date') return new Date(a.dueDate) - new Date(b.dueDate);
            if (sortBy === 'priority') return b.priority.localeCompare(a.priority);
            return a.text.localeCompare(b.text);
        });
        renderTasks();
    });

    document.getElementById('clearCompleted').addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    document.getElementById('clearAll').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    // Initial render
    renderTasks();
});