// Drag and Drop Functions
const columns = document.querySelectorAll(".column");
const addTaskForm = document.getElementById("add-task-form");
const newTaskInput = document.getElementById("new-task");
const inProgressCount = document.getElementById("in-progress-count");
const doneCount = document.getElementById("done-count");

let draggedTask = null;
let touchOffset = { x: 0, y: 0 };  

// Taskın mövcud yerini göstərmək üçün funksiyanı əlavə edirik
function showTaskLocation(task, column) {
  const locationMsg = `Task "${task.innerText}" is now in "${column}"`;

}

// Drag and Drop Funksiyaları
function initializeDragAndDrop() {
  const allTasks = document.querySelectorAll(".task");

  allTasks.forEach(task => {
    // Masaüstü üçün sürükləmə hadisələri
    task.addEventListener("dragstart", function (e) {
      draggedTask = this;
      this.classList.add("dragging"); 
      setTimeout(() => {
        this.style.display = "none";
      }, 0);
      createSmokeEffect(e.pageX, e.pageY); 
    });

    task.addEventListener("drag", function (e) {
      createSmokeEffect(e.pageX, e.pageY); 
    });

    task.addEventListener("dragend", function () {
      this.classList.remove("dragging"); 
      this.style.display = "block";
      draggedTask = null;
      updateTaskCounts();
    });

    // Mobil cihazlar üçün toxunma hadisələri
    task.addEventListener("touchstart", touchStart, { passive: false });
    task.addEventListener("touchmove", touchMove, { passive: false });
    task.addEventListener("touchend", touchEnd, { passive: false });
  });

  columns.forEach(column => {
    column.addEventListener("dragover", dragOver);
    column.addEventListener("drop", drop);

    column.addEventListener("touchmove", touchMoveOver);
    column.addEventListener("touchend", drop);
  });
}

// Drag zamanı tüstü effekti yarat
function createSmokeEffect(x, y) {
  const smoke = document.createElement("div");
  smoke.classList.add("smoke-effect");

  // Tüstünün mövqeyini sürükləmənin koordinatlarına uyğun olaraq təyin edirik
  smoke.style.left = `${x}px`;
  smoke.style.top = `${y}px`;

  document.body.appendChild(smoke);

  // Bir neçə saniyə sonra tüstü yox olur
  setTimeout(() => {
    smoke.remove();
  }, 1000);
}

// Mobil Toxunma Funksiyaları
function touchStart(e) {
  e.preventDefault();
  draggedTask = this;

  const touchLocation = e.targetTouches[0];
  touchOffset.x = touchLocation.pageX - this.offsetLeft;
  touchOffset.y = touchLocation.pageY - this.offsetTop;

  this.style.position = "absolute";
  this.style.zIndex = "1000";
}

function touchMove(e) {
  e.preventDefault();

  const touchLocation = e.targetTouches[0];
  const x = touchLocation.pageX;
  const y = touchLocation.pageY;

  draggedTask.style.left = `${x - touchOffset.x}px`;
  draggedTask.style.top = `${y - touchOffset.y}px`;

  // Mobil toxunma ilə tüstü effekti yarat
  createSmokeEffect(x, y);
}

function touchEnd(e) {
  draggedTask.style.position = "relative"; 
  draggedTask.style.left = "0px"; 
  draggedTask.style.top = "0px";
  draggedTask.style.zIndex = "1";

  draggedTask = null;
  updateTaskCounts();
}

function touchMoveOver(e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  const elementUnderTouch = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);

  if (draggedTask && elementUnderTouch && elementUnderTouch.classList.contains('column')) {
    elementUnderTouch.appendChild(draggedTask);
  }
}

// Drag and Drop Functions (PC üçün)
function dragStart(e) {
  draggedTask = this;
  setTimeout(() => this.style.display = 'none', 0);
}

function dragEnd(e) {
  setTimeout(() => {
    this.style.display = 'block';
    draggedTask = null;
    updateTaskCounts();
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (draggedTask && this.classList.contains('column')) {
    draggedTask.style.display = 'block';
    draggedTask.style.position = "relative"; 
    draggedTask.style.left = "0px"; 
    draggedTask.style.top = "0px";

    this.appendChild(draggedTask); 

    // Taskın yeni yerini göstər
    showTaskLocation(draggedTask, this.querySelector('h2').innerText);

    draggedTask = null;
    updateTaskCounts();
  }
}

// Yeni task əlavə etmək (Mobil və Masaüstü üçün)
addTaskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addNewTask();
});

function addNewTask() {
  const newTaskValue = newTaskInput.value.trim();
  if (newTaskValue) {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = newTaskValue;
    document.getElementById("todo").appendChild(newTask);
    newTaskInput.value = "";
    initializeDragAndDrop(); 
  }
}

// Tapşırıq sayını yenilə
function updateTaskCounts() {
  const inProgressTasks = document.getElementById("in-progress").querySelectorAll(".task").length;
  const doneTasks = document.getElementById("done").querySelectorAll(".task").length;

  inProgressCount.innerText = inProgressTasks;
  doneCount.innerText = doneTasks;
}

// İlk başlatma
initializeDragAndDrop();
updateTaskCounts();
