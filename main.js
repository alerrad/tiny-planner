let days = [];

const MONTHS = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
};
const WEEKDAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

function update_local_storage() {
    localStorage.setItem("days", JSON.stringify(days));
}

function toggle_date_form() {
    document.getElementById("darken-bg").classList.toggle("hidden");
    document.getElementById("date-form").classList.toggle("hidden");
}

function delete_task_item(day_id, ind) {
    document.getElementById(`${day_id}-task-${ind}`).remove();
    days[days.findIndex((day) => day.id === day_id)].tasks.splice(ind, 1);
    update_local_storage();
}

function delete_day(day_id) {
    document.getElementById(`day-${day_id}`).remove();
    days.splice(days.findIndex(day => day.id === day_id), 1);
    update_local_storage();
}

function toggle_task_status(day_id, ind) {
    const day_ind = days.findIndex((day) => day.id === day_id);
    document.getElementById(`${day_id}-task-${ind}`).classList.toggle("done");
    days[day_ind].tasks[ind].done = !days[day_ind].tasks[ind].done;
    update_local_storage();
}

function add_new_task(day_id) {
    this.event.preventDefault();
    const inp = document.getElementById(`tsk-${day_id}`);
    const tasks_container = document.getElementById(day_id);
    const task_li = document.createElement("li");
    const day_ind = days.findIndex((day) => day.id === day_id);
    task_li.classList.add("task");
    task_li.id = `${day_id}-task-${days[day_ind].tasks.length}`;
    task_li.innerHTML = `
        <p class="desc" onclick="toggle_task_status(${day_id}, ${days[day_ind].tasks.length})">${inp.value}</p>
        <div class="options">
            <span class="delte" onclick="delete_task_item(${day_id}, ${days[day_ind].tasks.length})"><img src="./images/trash-alt-delete-bin.svg" alt="delete"></span>
        </div>
    `;
    tasks_container.append(task_li);
    days[day_ind].tasks.push({
        desc: inp.value,
        done: false
    });
    inp.value = "";
    update_local_storage();
}

window.addEventListener("load", (e) => {
    const days_container = document.getElementById("days");
    if (localStorage.getItem("days")) days = JSON.parse(localStorage.getItem("days"));
    else update_local_storage();

    days.forEach(day => {
        const new_day = document.createElement("div");
        const dayId = day.id.toString();
        new_day.classList.add("col");
        new_day.id = `day-${day.id}`;
        new_day.innerHTML = `
            <div class="options">
                <span onclick="delete_day(${dayId})"><img src="./images/x-close-delete.svg" alt="remove-day"/></span>
            </div>
            <div class="col-heading centered">
                <h2>${day.weekday}</h2>
                <p>${day.full_date}</p>
            </div>
            <ul class="tasks" id="${dayId}">
                ${day.tasks.map((task, ind) => {
                    const task_li = document.createElement("li");
                    task_li.classList.add("task");
                    task_li.id = `${dayId}-task-${ind}`;
                    task_li.innerHTML = `
                        <p class="desc ${task.done ? "done" : ""}" onclick="toggle_task_status(${day.id}, ${ind})">${task.desc}</p>
                        <div class="options">
                            <span class="delte" onclick="delete_task_item(${day.id}, ${ind})"><img src="./images/trash-alt-delete-bin.svg" alt="delete"></span>
                        </div>
                    `;
                    return task_li.outerHTML;
                }).join('')}
            </ul>
            <form class="new-task-form task" onsubmit="add_new_task(${dayId})">
                <input type="text" placeholder="New task" id="tsk-${dayId}" required>
            </form>
        `;
        days_container.prepend(new_day);
    });

    document.getElementById("add-day").addEventListener("click", toggle_date_form);
    document.getElementById("date-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const date_input = document.getElementById("date-input");
        const date = new Date(date_input.value);
        days.push({
            id: Date.now(),
            tasks: [],
            full_date: `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
            weekday: WEEKDAYS[date.getDay()]
        });
        date_input.value = "";
        update_local_storage();
        toggle_date_form();
        location.reload();
    });
});