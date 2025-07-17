document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const taskList = document.getElementById('taskList');
    
    // Загрузка задач из localStorage
    loadTasks();
    
    // Добавление новой задачи
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    // Удаление выбранных задач
    deleteSelectedBtn.addEventListener('click', deleteSelectedTasks);
    
    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDueDate = taskDate.value;
        
        if (taskText === '') {
            alert('Пожалуйста, введите текст задачи');
            return;
        }
        
        // Создаем объект задачи
        const task = {
            id: Date.now(),
            text: taskText,
            date: taskDueDate,
            completed: false
        };
        
        // Добавляем задачу в список
        addTaskToDOM(task);
        
        // Сохраняем в localStorage
        saveTask(task);
        
        // Очищаем поля ввода
        taskInput.value = '';
        taskDate.value = '';
    }
    
    function addTaskToDOM(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        
        taskElement.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-date">${task.date ? formatDate(task.date) : 'Без срока'}</span>
            </div>
            <button class="delete-btn hs-button small">Удалить</button>
        `;
        
        // Добавляем обработчики событий
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', function() {
            toggleTaskCompletion(task.id, this.checked);
        });
        
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteTask(task.id);
        });
        
        taskList.appendChild(taskElement);
    }
    
    function toggleTaskCompletion(taskId, isCompleted) {
        let tasks = getTasksFromStorage();
        tasks = tasks.map(task => {
            if (task.id == taskId) {
                task.completed = isCompleted;
            }
            return task;
        });
        
        localStorage.setItem('hearthstoneTasks', JSON.stringify(tasks));
        
        // Обновляем стиль задачи
        const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.toggle('completed', isCompleted);
        }
    }
    
    function deleteTask(taskId) {
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id != taskId);
        
        localStorage.setItem('hearthstoneTasks', JSON.stringify(tasks));
        
        // Удаляем из DOM
        const taskElement = document.querySelector(`.task-card[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }
    }
    
    function deleteSelectedTasks() {
        const checkboxes = document.querySelectorAll('.task-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('Пожалуйста, выберите задачи для удаления');
            return;
        }
        
        if (confirm(`Вы уверены, что хотите удалить ${checkboxes.length} задач?`)) {
            checkboxes.forEach(checkbox => {
                const taskId = checkbox.closest('.task-card').dataset.id;
                deleteTask(taskId);
            });
        }
    }
    
    function saveTask(task) {
        let tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('hearthstoneTasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const tasks = getTasksFromStorage();
        tasks.forEach(task => addTaskToDOM(task));
    }
    
    function getTasksFromStorage() {
        const tasksJSON = localStorage.getItem('hearthstoneTasks');
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', options);
    }
});