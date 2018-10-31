window.Event = new Vue();

Vue.component('test', {
  props: ['id'],
  template: `<ul class="todo-list">
    <li @dragover.prevent @drop="dragFinish($event, -1)" v-if="dragging > -1" class="trash-drop todo-item" v-bind:class="{drag: isDragging}">Delete</li>
    
    <li v-else>
      <input placeholder="Type new task and press enter" type="text" class="new-todo todo-item" v-model="newItem" @keyup.enter="addItem">
    </li>
    
    <li class="todo-item" v-if="todos.length != 0" v-for="(item, i) in todos" :id="id + '_' + i" draggable="true" @dragstart="dragStart(i, $event)" @dragover.prevent @dragenter="dragEnter" @dragleave="dragLeave" @dragend="dragEnd" @drop="dragFinish($event, i, 1)">
      <span>{{ item.title }}</span>
      <span class="remove-item" @click="removeItem(item, 1)">x</span>
    </li>
  </ul>
`,
  data: function() {
    return {
      todoStorage: "",
      todos: "",
      newItem: "",
      dragging: -1,
      componentId: this.id
    }
  },
  methods: {
    addItem() {
      if (!this.newItem) {
        return;
      }
      this.todos.push({
        title: this.newItem
      });
      this.newItem = "";
    },
    removeItem(item) {
      this.todos.splice(this.todos.indexOf(item), 1);
    },
    removeItemAt(index) {
      this.todos.splice(index, 1);
    },
    dragStart(which, ev) {
      ev.dataTransfer.setData('Text', this.id);
      ev.dataTransfer.dropEffect = 'move'
      this.dragging = which;
    },
    dragEnter(ev) {
      /* 
      if (ev.clientY > ev.target.height / 2) {
        ev.target.style.marginBottom = '10px'
      } else {
        ev.target.style.marginTop = '10px'
      }
      */
    },
    dragLeave(ev) {
      /* 
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      */
    },
    dragEnd(ev) {
      this.dragging = -1
    },
    dragFinish(ev, to) {
      console.log('drag finsh');
      let targetId = ev.currentTarget.id;

      let data = ev.dataTransfer.getData('Text');

      let res1 = targetId.charAt(6);

      let res2 = data.charAt(6);

      if (res1 != res2) {
        let where = this.id.slice(6, 7);

        let ret = this.$parent.checkCount(where);

        if (ret) {
          return;
        }
        if (to != -1) {
          this.$parent.dragFinishColumn(ev);
          this.moveItem(this.todos.length - 1, to);
        } else {
          this.moveItem(this.dragging, to);
        }
      } else {
        this.moveItem(this.dragging, to);
      }
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      ev.stopPropagation();
    },
    moveItem(from, to) {
      if (to === -1) {
        this.removeItemAt(from);
      } else {
        this.todos.splice(to, 0, this.todos.splice(from, 1)[0]);
      }
    }
  },
  computed: {
    isDragging() {
      return this.dragging > -1
    }
  },
  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function(todos) {
        this.todoStorage.save(todos);
      },
      deep: true
    }
  },
  mounted() {
    let TODO_STORAGE_KEY = "todo" + this.componentId;

    this.todoStorage = {
      fetch: () => JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]"),
      save: todos => localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
    };
    this.todos = this.todoStorage.fetch();

    Event.$on('column-drag-ev', event => {
      console.log('column-drag-ev: ' + this.id);

      // object destructuring
      let {columnStartId, columnEndId} = event;

      columnEndId = columnEndId.slice(0, 7);
      if (this.id != columnStartId) {
        return;
      }
      if (columnStartId === this.id) {
        console.log(columnStartId + " event triggered (start)");
        let removedItem = this.todos.splice(this.dragging, 1);

        Event.$emit('column-add', {
          "columnEndId": columnEndId,
          "removedItem": removedItem
        });
      }
    });

    Event.$on('column-add', event => {
      console.log("column-add triggered");
      let {columnEndId, removedItem} = event;

      if (columnEndId === this.id) {
        this.todos.push(removedItem[0]);
      }
    });
  }
})

const app = new Vue({
  el: "#app",
  data: function() {
    return {
      startId: "",
      column1Count: "",
      column2Count: "",
      column3Count: "",
      clicked: false,
      clicked2: false,
      clicked3: false,
      col: "",
      columnStorage: ""
    }
  },
  methods: {
    dragStart2(ev) {
      console.log('drag started2');
      this.startId = ev.currentTarget.id;
      ev.dataTransfer.setData('Text', ev.target.id);
      ev.dataTransfer.dropEffect = 'move'
    },
    dragFinishColumn(ev) {
      console.log("drag finish column");
      ev.preventDefault();
      let where = ev.currentTarget.id.slice(6, 7);

      let ret = this.checkCount(where);

      if (ret) {
        return;
      }
      if (this.startId != ev.currentTarget.id) {
        console.log('different column');
        Event.$emit("column-drag-ev", {
          "columnStartId": this.startId,
          "columnEndId": ev.currentTarget.id
        });
      } else {
        let index = this.startId.slice(6, 7);
        
        this.$children[index - 1].moveItem(this.$children[index - 1].dragging, this.$children[index - 1].todos.length - 1);
      }
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      //ev.stopPropagation();
    },
    addCount(id) {
      if (!this.col) {
        return;
      }
      if (id === 1) {
        if (this.col >= this.$children[id - 1].todos.length) {
          this.column1Count = this.col;
          this.clicked = false;
        }
        if (this.col == 0) {
          this.column1Count = "";
          this.clicked = false;
        }
      }
      if (id === 2) {
        if (this.col >= this.$children[id - 1].todos.length) {
          this.column2Count = this.col;
          this.clicked2 = false;
        }
        if (this.col == 0) {
          this.column2Count = "";
          this.clicked2 = false;
        }
      }
      if (id === 3) {
        if (this.col >= this.$children[id - 1].todos.length) {
          this.column3Count = this.col;
          this.clicked3 = false;
        }
        if (this.col == 0) {
          this.column3Count = "";
          this.clicked3 = false;
        }
      }
      this.col = "";
    },
    checkCount(id) {
      if (this.column1Count != "") {
        if (id == 1) {
          if (this.column1Count <= this.$children[id - 1].todos.length) {
            return true;
          }
        }
      }
      if (this.column2Count != "") {
        if (id == 2) {
          if (this.column2Count <= this.$children[id - 1].todos.length) {
            return true;
          }
        }
      }
      if (this.column3Count != "") {
        if (id == 3) {
          if (this.column3Count <= this.$children[id - 1].todos.length) {
            return true;
          }
        }
      }
      return false;
    }
  },
  mounted() {
    console.log('mounted called');
    let COLUMN1_STORAGE_KEY = "column1";
    let COLUMN2_STORAGE_KEY = "column2";
    let COLUMN3_STORAGE_KEY = "column3";

    this.columnStorage = {
      fetch: columnId => {
        let key = "";

        if (columnId == 1) {
          key = COLUMN1_STORAGE_KEY;
        }
        if (columnId == 2) {
          key = COLUMN2_STORAGE_KEY;
        }
        if (columnId == 3) {
          key = COLUMN3_STORAGE_KEY;
        }
        return localStorage.getItem(key) != null ? localStorage.getItem(key) : "";
      },
      save: (columnValue, columnId) => {
        let key = "";

        if (columnId === 1) {
          key = COLUMN1_STORAGE_KEY;
        }
        if (columnId === 2) {
          key = COLUMN2_STORAGE_KEY;
        }
        if (columnId === 3) {
          key = COLUMN3_STORAGE_KEY;
        }
        console.log(key);
        localStorage.setItem(key, columnValue);
      }
    };
    this.column1Count = this.columnStorage.fetch(1);
    this.column2Count = this.columnStorage.fetch(2);
    this.column3Count = this.columnStorage.fetch(3);
  },
  // watch column max change for localStorage persistence
  watch: {
    column1Count: function() {
        this.columnStorage.save(this.column1Count, 1);
      },
    column2Count: function() {
      this.columnStorage.save(this.column2Count, 2);
    },
    column3Count: function() {
      this.columnStorage.save(this.column3Count, 3);
    }
  }
});
