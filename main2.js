$(function () {
  let $list = $('#list');
  let $createBtn = $('#create_task');
  let $findBtn = $('#find_task');
  let $inputIn = $('#input');


  class TodoList {
    constructor(el) {
      this.todos = [];
      this.findInTodos = [];
      this.el = $(el);
      $(el).on('click', function (event) {
        let $target = event.target;
        if ($target.classList.contains('set-status')) {
          $target.parentElement.dataset.id.changeStatus
          $target.parentElement.classList.toggle('done')

          if ($target.parentElement.classList.contains('done')) {
            let $urlStatus = 'http://localhost:3000/todos/';

            function updateStatusDone(id, task) {
              let $data = {
                "id": id,
                "task": `${task}`,
                "complited": true
              }
              $.ajax({
                url: `${$urlStatus + id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify($data)
              }).done(function () {
                console.log('SUCCESS');
              }).fail(function (msg) {
                console.log('FAIL');
              }).always(function (msg) {
                console.log('ALWAYS');
              });
            }
            updateStatusDone(3, "buy sugar")


          } else if (!$target.parentElement.classList.contains('done')) {
            let $urlStatus = 'http://localhost:3000/todos/';


            function updateStatusNotDone(id, task) {
              let $data = {
                "id": id,
                "task": `${task}`,
                "complited": false
              }
              $.ajax({
                url: `${$urlStatus + id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify($data)
              }).done(function () {
                console.log('SUCCESS');
              }).fail(function (msg) {
                console.log('FAIL');
              }).always(function (msg) {
                console.log('ALWAYS');
              });
            }
            updateStatusNotDone(3, "buy sugar and bread")
          }
        } else if ($target.classList.contains('delete-task')) {
          ($target.parentElement.dataset.id).removeTodo
          $target.parentElement.remove();
        }

      })
    }
    addTodo(todo) {
      if (todo.length = '') {
        return
      }
      this.todos.push(todo);
    }
    removeTodo(id) {
      this.todos = this.todos.filter((el) => {
        return el.id !== id;
      });
    }
    getTodos() {
      return this.todos;
    }
    findTodos() {
      let findingTask = this.getTodos().filter((el) => {
        el.task.includes($inputIn.val())
        return el.task == $inputIn.val()
      });
      this.findInTodos = findingTask;
    }

    changeStatus(id) {
      let $index = this.todos.findIndex((el) => el.id === id);
      this.todos[$index].complited = !this.todos[$index].complited;
    }
    render() {
      let $lis = '';
      for (let $el of this.todos) {
        if (!$el) {
          return;
        }
        $lis += `<li data-id="${$el.id}">${$el.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
      }
      this.el.html($lis);

    }

    render2() {
      let $lis2 = '';
      for (let $el of this.findInTodos) {
        if (!$el) {
          return;
        }
        $lis2 += `<li data-id="${$el.id}">${$el.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
      }
      this.el.html($lis2);
    }
  }



  class Task {

    constructor(task, complited) {
      this.task = task;
      this.complited = complited;
      this.id = Math.random().toString(36).substr(2, 9);
    }
  }

  let $todo1 = new TodoList($list);
  $.ajax({
    url: '/db/db.json',
    method: 'get',
    dataType: "json",
    success: function (data) {
      for (let index of data.todos) {
        if (!index) {
          return
        }
        if (index.complited == true) {
          index.complited = "done"
        };
        $list.append(`<li data-id="${index.id}" class="${index.complited}">${index.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`)
      }
    }
  })


  {
    $createBtn.on('click', function (event) {
      event.preventDefault();
      let $target = event.target;
      if (!$inputIn.val() || $inputIn.val() == '' || $inputIn.val() == NaN) {
        return
      } else if ($target) {
        $todo1.addTodo(new Task($inputIn.val()));

        $.post('http://localhost:3000/todos', new Task($inputIn.val())).fail(function () {
          console.error('POST request didn\'t\ sent. Something went wrong')
        })
        $todo1.render();
        $inputIn.val('');
      }
    })
    $findBtn.on('click', function (event) {
      $todo1.findTodos()
      $todo1.render2();
      $inputIn.val('');
    })
  }
})