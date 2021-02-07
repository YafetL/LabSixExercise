// Define UI Variables 
const taskInput = document.querySelector('#task'); //the task input text field
const form = document.querySelector('#task-form'); //The form at the top
const filter = document.querySelector('#filter'); //the task filter text field
const taskList = document.querySelector('.collection'); //The UL
const clearBtn = document.querySelector('.clear-tasks'); //the all task clear button

const sortAscending = document.querySelector('#asend');
const sortDescending = document.querySelector('#dsend');

const reloadIcon = document.querySelector('.fa'); //the reload button at the top navigation 

//DB variable 

let DB;
var index;
console.log(localStorage.getItem("Added Items"))
if (localStorage.getItem("Added Items") != null) {
    index = parseInt(localStorage.getItem("Added Items"));
}
else {
    index = 0;
}



// Add Event Listener [on Load]
document.addEventListener('DOMContentLoaded', () => {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, constrainWidth = false);

    // create the database
    let TasksDB = indexedDB.open('tasks', 1);

    // if there's an error
    TasksDB.onerror = function() {
            console.log('There was an error');
        }
        // if everything is fine, assign the result to the instance
    TasksDB.onsuccess = function() {
        // console.log('Database Ready');

        // save the result
        DB = TasksDB.result;

        // display the Task List 
        displayTaskList();
    }

    // This method runs once (great for creating the schema)
    TasksDB.onupgradeneeded = function(e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store, 
        // keypath is going to be the Indexes
        let objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

        // createindex: 1) field name 2) keypath 3) options
        objectStore.createIndex('taskname', 'taskname', { unique: true });

        console.log('Database ready and fields created!');
    }

    form.addEventListener('submit', addNewTask);
    sortAscending.addEventListener('click', Ascending);
    sortDescending.addEventListener('click', Dscending);

    function Ascending() {
        //remove all items (Already Sorted)
        displayTaskList();   
    }
    function Dscending() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        let objectStore = DB.transaction('tasks').objectStore('tasks');
        
        let keyRange = IDBKeyRange.upperBound(addedItems);
        let request = objectStore.openCursor(keyRange, "prev");
        request.onsuccess = function(e) {
            // assign the current cursor
            let cursor = e.target.result;

            if (cursor) {
                // Create an li element when the user adds a task 
                const li = document.createElement('li');
                //add Attribute for delete 
                li.setAttribute('data-task-id', cursor.value.id);
                // Adding a class
                li.className = 'collection-item';
                // Create text node and append it
                 
                li.appendChild(document.createTextNode(cursor.value.taskName));
                // Extract The Date from the database
                const date = document.createElement('span');
                date.style.position = "absolute";
                date.style.left = "50%";
                date.style.transform = "translateX(-50%)";
                const dateData = cursor.value.dateCreated;
                dateArr.push(dateData);
                var year = dateData.getFullYear();
                var month = dateData.getUTCMonth() + 1;
                var day = dateData.getUTCDate();
                var localTime = dateData.toLocaleTimeString()
                var newDate = year + "/" + month + "/" + day + " " + localTime; 
                date.innerHTML = newDate;

                li.appendChild(date);      
                
                // Create new element for the link 
                const link = document.createElement('a');
                // Add class and the x marker for a 
                link.className = 'delete-item secondary-content';
                link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                // Append link to li
                li.appendChild(link);
                // Append to UL 
                taskList.appendChild(li);
                cursor.continue();
            }
        }
    }

    function addNewTask(e) {
        e.preventDefault();

        // Check empty entry
        if (taskInput.value === '') {
            taskInput.style.borderColor = "red";

            return;
        }

        // create a new object with the form info
        function newTask(dateCreated, taskName) {
            this.dateCreated = dateCreated;
            this.taskName = taskName;
        }

        // Insert the object into the database 
        addedItems++;
        localStorage.setItem("Added Items", addedItems);
        // Insert the object into the database 
        let transaction = DB.transaction(['tasks'], 'readwrite');
        let objectStore = transaction.objectStore('tasks');
      
        let request = objectStore.add(new Task(new Date(), taskInput.value));

        // on success
        request.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            console.log('New appointment added');

            displayTaskList();
        }
        transaction.onerror = () => {
            console.log('There was an error, try again!');
        }

    }

    function displayTaskList() {
        // clear the previous task list
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        // create the object store
        let objectStore = DB.transaction('tasks').objectStore('tasks');

        objectStore.openCursor().onsuccess = function(e) {
            // assign the current cursor
            let cursor = e.target.result;

            if (cursor) {

                // Create an li element when the user adds a task 
                const li = document.createElement('li');
                //add Attribute for delete 
                li.setAttribute('data-task-id', cursor.value.id);
                // Adding a class
                li.className = 'collection-item';
                // Create text node and append it 
                li.appendChild(document.createTextNode(cursor.value.taskname));
                // Extract The Date from the database
                const date = document.createElement('span');
                date.style.position = "absolute";
                date.style.left = "50%";
                date.style.transform = "translateX(-50%)";
                const dateData = cursor.value.dateCreated;
                var year = dateData.getFullYear();
                var month = dateData.getUTCMonth() + 1;
                var day = dateData.getUTCDate();
                var localTime = dateData.toLocaleTimeString()
                var newDate = year + "/" + month + "/" + day + " " + localTime; 
                date.innerHTML = newDate;

                li.appendChild(date);      
                
                // Create new element for the link 
                const link = document.createElement('a');
                // Add class and the x marker for a 
                link.className = 'delete-item secondary-content';
                link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                // Append link to li
                li.appendChild(link);
                // Append to UL 
                taskList.appendChild(li);
                cursor.continue();
            }
        }
    }

    // Remove task event [event delegation]
    taskList.addEventListener('click', removeTask);

    function removeTask(e) {

        if (e.target.parentElement.classList.contains('delete-item')) {
            if (confirm('Are You Sure about that ?')) {
                // get the task id
                let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
                // use a transaction
                let transaction = DB.transaction(['tasks'], 'readwrite');
                let objectStore = transaction.objectStore('tasks');
                objectStore.delete(taskID);

                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                }

            }

        }

    }

    //clear button event listener   
    clearBtn.addEventListener('click', clearAllTasks);

    //clear tasks 
    function clearAllTasks() {
        let transaction = DB.transaction("tasks", "readwrite");
        let tasks = transaction.objectStore("tasks");
        // clear the table.
        tasks.clear();
        displayTaskList();
        console.log("Tasks Cleared !!!");
    }


});