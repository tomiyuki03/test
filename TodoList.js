const inputForm = document.querySelector('.task-input');
const inputDate = document.querySelector('.date');
const addBtn = document.querySelector('.add-btn');
const taskList = document.querySelector('.task-list');

//ページがロードされたら処理を実行する
window.addEventListener('load', () => {
 displayTasks();
 TaskListBtnEvent();
});

//追加ボタンを押したら処理を実行する
addBtn.addEventListener('click', () => {
 //タスクの入力フォームが空の場合
 if(!inputForm.value) {
  const errorMsg = document.querySelector('.task_error-msg');
  //errorMsgにshowクラスを追加する
  errorMsg.classList.add('show');
  return;
 }
 //タスクidを設定する
 let taskId = setTaskId();
 //タスクのデータのオブジェクトを作成する
 const task = {
  id: taskId,
  content: inputForm.value,
  date: inputDate.value ? formattedDate(inputDate.value) : null,
 }
 //タスクリスト(ulタグ)にタスクを追加する 
 taskList.innerHTML += createTaskElement(task); 
 //完了ボタン、削除ボタンのイベント
 TaskListBtnEvent();
 //ローカルストレージにタスクデータを保存する
 saveLocalStorage(task);
 //入力フォームをリセットする
 inputForm.value = '';
 inputDate.value = '';
});

//タスクの入力フォームでキーが離されたときに処理を実行する
inputForm.addEventListener('keyup', () => {
  const errorMsg = document.querySelector('.error-msg');
　//errorMsgにshowクラスがある場合
  if(errorMsg.classList.contains('show')) {
　　//タスクの入力フォームが空がどうか
    if(inputForm.value !== '') {
　　　//errorMsgのshowクラスを取り除く
      errorMsg.classList.remove('show');
    }
  }
});

//タスクを表示するためのHTMLタグを作成する
const createTaskElement = (task) => {
    return `<li class="task-item" data-task-id="${task.id}">
    ${task.content}
    <div class="item-wrapper">
     ${task.date ? `<div class="item-date">期日:${task.date}</div>`:''} 
     <div class="item-btn">
      <button class="btn complete-btn">完了</button>
      <button class="btn delete-btn" data-task-id="${task.id}">削除</button>
     </div>
    </div>
   </li>`;
}
 
//ローカルストレージにタスクを保存する
const saveLocalStorage = (task) => { 
　//ローカルストレージに保存されているタスクデータを取得する
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
　//tasksに入力したタスクデータを追加する
  tasks.push(task);
　//ローカルストレージにtasksを保存する
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//ローカルストレージにタスクがある場合は表示する
const displayTasks = () => {
 //taskuList(ulタグ)をリセットする
 taskList.innerHTML = '';
　//ローカルストレージに保存されているタスクデータを取得する
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  //ローカルストレージにタスクのデータが1つ以上ある場合
  if(tasks.length !== 0) {
　　//タスクを1つずつ取り出して処理をする
    tasks.forEach((task) => {
　　　//taskList(ulタグ)にタスクを追加する
      taskList.innerHTML += createTaskElement(task);
    });
  }
}

//タスクのidをセットする
const setTaskId = () => {
 //ローカルストレージに保存されているタスクデータを取得する
 const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
 //ローカルストレージにタスクのデータが1つ以上ある場合
 if(tasks.length !== 0) {
  const task = tasks[tasks.length - 1];
  return task.id + 1;
 }
 return 1;
}

//期日のフォーマットを変更する
const formattedDate = (dateString) => {
 const selectedDate = new Date(dateString);
 const year = selectedDate.getFullYear();
 const month = selectedDate.getMonth() + 1; 
 const day = selectedDate.getDate();
 const getDay = selectedDate.getDay();
 const daysOfWeek = ['日','月','火','水','木','金','土'];
 const dayOfWeek = daysOfWeek[getDay];
    
 return `期日:${year}年${month}月${day}日(${dayOfWeek})`;  
}

//タスクの完了や削除の処理を実装
const TaskListBtnEvent = () => {
 const deleteBtns = document.querySelectorAll('.delete-btn');
 const compBtns = document.querySelectorAll('.complete-btn');
 //deleteBtnsを1つずつ取り出して処理を実行する
 deleteBtns.forEach((deleteBtn) => {
　//削除ボタンをクリックすると処理を実行する
  deleteBtn.addEventListener('click', (e) => {
  //削除するタスクのliタグを取得
  const deleteTarget = e.target.closest('.task-item');
  //ローカルストレージに保存されているタスクデータを取得する
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  //削除するタスクのliタグのデータ属性(タスクid)を取得
  const targetId = deleteTarget.closest('li').dataset.taskId;
  //tasksから削除するタスクを取り除く
  const updatedTasks = tasks.filter(task => task.id !== parseInt(targetId));
  //ローカルストレージにupdatedTasksを保存する
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  //taskListから削除するタスクを取り除く
  taskList.removeChild(deleteTarget.closest('li'));
  });
 });
  
//compBtnsを1つずつ取り出して処理を実行する
compBtns.forEach((compBtn) => {
　//完了ボタンをクリックすると処理を実行する
  compBtn.addEventListener('click', (e) => {
  　　//完了するタスクのliタグを取得
      const compTarget = e.target.closest('li');
      //compTargetにcompleteクラスがない場合は追加、ある場合は削除する
      compTarget.classList.toggle('complete');
   });
 });
}