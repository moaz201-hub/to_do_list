
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
}


let tasks: Task[] = [];
let taskCounter = 1;


const modal = document.getElementById('taskModal') as HTMLDivElement;
const openBtn = document.getElementById('openModalBtn') as HTMLDivElement;
const closeBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancelModalBtn') as HTMLButtonElement;
const taskForm = document.getElementById('taskForm') as HTMLFormElement;
const descriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement;
const charCount = document.getElementById('charCount') as HTMLDivElement;

const todoColumn = document.querySelector('section > div > div:nth-child(1)') as HTMLDivElement;
const inProgressColumn = document.querySelector('section > div > div:nth-child(2)') as HTMLDivElement;
const completedColumn = document.querySelector('section > div > div:nth-child(3)') as HTMLDivElement;


function openModal(): void {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal(): void {
  modal.classList.remove('flex');
  modal.classList.add('hidden');
  taskForm.reset();
  if (charCount) charCount.textContent = '0/500';
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e: MouseEvent) => {
  if (e.target === modal) closeModal();
});

descriptionInput.addEventListener('input', () => {
  charCount.textContent = `${descriptionInput.value.length}/500`;
});


function addTask(title: string, priority: 'low' | 'medium' | 'high', dueDate: string, description: string): void {
  const newTask: Task = {
    id: `#${String(taskCounter++).padStart(3, '0')}`,
    title,
    priority,
    dueDate,
    description,
    status: 'todo',
    createdAt: 'Just now'
  };

  tasks.push(newTask);
  renderBoard();
}

function updateTaskStatus(taskId: string, newStatus: 'todo' | 'in-progress' | 'completed'): void {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
    renderBoard();
  }
}

function deleteTask(taskId: string): void {
  tasks = tasks.filter(t => t.id !== taskId);
  renderBoard();
}


function renderBoard(): void {
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  renderColumn(todoColumn, 'To Do', todoTasks, 'fa-clipboard-list', 'bg-slate-100', 'text-slate-500', 'todo');
  renderColumn(inProgressColumn, 'In Progress', inProgressTasks, 'fa-spinner animate-spin', 'bg-amber-50', 'text-amber-500', 'in-progress');
  renderColumn(completedColumn, 'Completed', completedTasks, 'fa-check', 'bg-emerald-500', 'text-white', 'completed');
}

function renderColumn(
  columnEl: HTMLDivElement, 
  title: string, 
  columnTasks: Task[], 
  iconClass: string, 
  iconBgClass: string, 
  iconColorClass: string,
  statusKey: 'todo' | 'in-progress' | 'completed'
): void {
  const countText = `${columnTasks.length} ${columnTasks.length === 1 ? 'task' : 'tasks'}`;

  let cardsHtml = '';

  if (columnTasks.length === 0) {
    cardsHtml = `
      <div class="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-300">
        <i class="fa-solid fa-folder-open text-5xl mb-3 text-slate-200"></i>
        <p class="text-sm font-semibold text-slate-400">No tasks yet</p>
        <p class="text-xs text-slate-400/80 mt-1">Click + to add one</p>
      </div>
    `;
  } else {
    cardsHtml = `<div class="space-y-4">` + columnTasks.map(task => createCardHtml(task)).join('') + `</div>`;
  }

  columnEl.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl ${iconBgClass} flex items-center justify-center ${iconColorClass}">
          <i class="fa-solid ${iconClass} text-sm"></i>
        </div>
        <div>
          <h2 class="font-bold text-slate-900 text-base leading-tight">${title}</h2>
          <span class="text-xs text-slate-400 font-medium">${countText}</span>
        </div>
      </div>
    </div>
    ${cardsHtml}
  `;

  attachCardEvents(columnEl);
}

function createCardHtml(task: Task): string {
  const isCompleted = task.status === 'completed';
  const dotColor = isCompleted ? 'bg-emerald-400' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-violet-400';
  const priorityColor = task.priority === 'high' ? 'bg-red-50 text-red-600 bg-red-500' : task.priority === 'medium' ? 'bg-amber-50 text-amber-600 bg-amber-500' : 'bg-slate-100 text-slate-600 bg-slate-400';

  let actionButtonsHtml = '';

  if (task.status === 'todo') {
    actionButtonsHtml = `
      <button data-action="start" data-id="${task.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-semibold transition-colors">
        <i class="fa-solid fa-play text-[10px]"></i> Start
      </button>
      <button data-action="complete" data-id="${task.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold transition-colors">
        <i class="fa-solid fa-check text-[10px]"></i> Complete
      </button>
    `;
  } else if (task.status === 'in-progress') {
    actionButtonsHtml = `
      <button data-action="todo" data-id="${task.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
        <i class="fa-solid fa-rotate-left text-[10px]"></i> To Do
      </button>
      <button data-action="complete" data-id="${task.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold transition-colors">
        <i class="fa-solid fa-check text-[10px]"></i> Complete
      </button>
    `;
  } else if (task.status === 'completed') {
    actionButtonsHtml = `
      <button data-action="todo" data-id="${task.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">
        <i class="fa-solid fa-rotate-left text-[10px]"></i> To Do
      </button>
      <button data-action="start" data-id="${task.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-semibold transition-colors">
        <i class="fa-solid fa-play text-[10px]"></i> Start
      </button>
    `;
  }

  return `
    <div class="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
      <button data-action="delete" data-id="${task.id}" class="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>

      <div class="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
        <span class="w-2 h-2 rounded-full ${dotColor}"></span>
        <span>${task.id}</span>
      </div>

      <h3 class="font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'} text-lg">${task.title}</h3>
      <p class="text-xs ${isCompleted ? 'text-slate-400' : 'text-slate-500'} mt-1 mb-4">${task.description || 'No description provided'}</p>

      <div class="flex items-center gap-2 mb-4">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${priorityColor.split(' ')[0]} ${priorityColor.split(' ')[1]}">
          <span class="w-1.5 h-1.5 rounded-full ${priorityColor.split(' ')[2]}"></span> ${task.priority.toUpperCase()}
        </span>
        ${isCompleted ? `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
            <i class="fa-solid fa-check text-[10px]"></i> DONE
          </span>
        ` : ''}
      </div>

      <div class="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-4">
        <i class="fa-regular fa-clock text-slate-400 text-[11px]"></i>
        <span>${task.createdAt}</span>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          ${actionButtonsHtml}
        </div>
      </div>
    </div>
  `;
}


function attachCardEvents(container: HTMLDivElement): void {
  container.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;
      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');

      if (!id) return;

      if (action === 'start') updateTaskStatus(id, 'in-progress');
      else if (action === 'complete') updateTaskStatus(id, 'completed');
      else if (action === 'todo') updateTaskStatus(id, 'todo');
      else if (action === 'delete') deleteTask(id);
    });
  });
}


taskForm.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();

  const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
  const prioritySelect = document.getElementById('taskPriority') as HTMLSelectElement;
  const dueDateInput = document.getElementById('taskDueDate') as HTMLInputElement;

  addTask(
    titleInput.value.trim(),
    prioritySelect.value as 'low' | 'medium' | 'high',
    dueDateInput.value,
    descriptionInput.value.trim()
  );

  closeModal();
});


renderBoard();