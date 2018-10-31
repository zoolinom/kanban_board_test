/*
const TODO_STORAGE_KEY = "todostorage";
const TODO_STORAGE_KEY2 = "todostorage2";
const TODO_STORAGE_KEY3 = "todostorage3";

let todoStorage = {
  fetch: () => JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]"),//{
    //ret = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]");
    //console.log(ret);
    //return ret;
  //},
  save: (todos) => localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
};

let todoStorage2 = {
  fetch: () => JSON.parse(localStorage.getItem(TODO_STORAGE_KEY2) || "[]"),
  save: todos2 => localStorage.setItem(TODO_STORAGE_KEY2, JSON.stringify(todos2))
};

let todoStorage3 = {
  fetch: () => JSON.parse(localStorage.getItem(TODO_STORAGE_KEY3) || "[]"),
  save: todos3 => localStorage.setItem(TODO_STORAGE_KEY3, JSON.stringify(todos3))
};

const app = new Vue({
  el: "#app",
  data: () => {
    return {
      todos: todoStorage.fetch(),
      todos2: todoStorage2.fetch(),
      todos3: todoStorage3.fetch(),
      newItem: "",
      newItem2: "",
      newItem3: "",
      dragging: -1,
      startId: "",
      column1Count: "",
      column2Count: "",
      column3Count: "",
      col: "",
      clicked: false,
      clicked2: false,
      clicked3: false
    };
  },
  methods: {
    addItem() {
      if (!this.newItem) {
        return;
      }
      let ret = this.checkCount(1);
      if (ret) {
        this.newItem = "";
        return;
      }
      this.todos.push({
        title: this.newItem
      });
      this.newItem = "";
    },
    addItem2() {
      if (!this.newItem2) {
        return;
      }
      let ret = this.checkCount(1);
      if (ret) {
        this.newItem2 = "";
        return;
      }
      this.todos2.push({
        title: this.newItem2
      });
      this.newItem2 = "";
    },
    addItem3() {
      if (!this.newItem3) {
        return;
      }
      let ret = this.checkCount(1);
      if (ret) {
        this.newItem3 = "";
        return;
      }
      this.todos3.push({
        title: this.newItem3
      });
      this.newItem3 = "";
    },
    removeItem(item, where) {
      if (where === 1) {
        this.todos.splice(this.todos.indexOf(item), 1);
      } else if (where === 2) {
        this.todos2.splice(this.todos2.indexOf(item), 1);
      } else if (where === 3) {
        this.todos3.splice(this.todos3.indexOf(item), 1);
      }
    },
    removeItemAt(index, where) {
      if (where === 1) {
        console.log(where);
        this.todos.splice(index, 1);
      } else if (where === 2) {
        this.todos2.splice(index, 1);
      } else if (where === 3) {
        this.todos3.splice(index, 1);
      }
    },
    dragStart(which, ev) {
      console.log('drag started');
      //ev.preventDefault();
      //ev.dataTransfer.setData('Text', this.id);
      console.log(this.id);
      //console.log(ev.target.id);
      ev.dataTransfer.setData('Text', ev.target.id);
      console.log(ev.target.id);
      ev.dataTransfer.dropEffect = 'move'
      this.dragging = which;
    },
    dragStart2(ev) {
      console.log('drag started2');
      //ev.preventDefault();
      //ev.dataTransfer.setData('Text', this.id);
      console.log(this.id);
      console.log(ev.target.id);
      this.startId = ev.currentTarget.id;
      ev.dataTransfer.setData('Text', ev.target.id);
      ev.dataTransfer.dropEffect = 'move'
    },
    dragEnter(ev) {
      //if (ev.clientY > ev.target.height / 2) {
      //  ev.target.style.marginBottom = '10px'
      //} else {
      //  ev.target.style.marginTop = '10px'
      //}
    },
    dragLeave(ev) { 
      //ev.target.style.marginTop = '2px'
      //ev.target.style.marginBottom = '2px'
    },
    dragEnd(ev) {
      this.dragging = -1
    },
    // dragFinish(ev, to) {
    //   console.log('drag finish');
    //   ev.preventDefault();
    //   this.moveItem(this.dragging, to);
    //   console.log(ev.target);
    //   console.log(ev.dataTransfer.getData('Text'));
    //   let data = ev.dataTransfer.getData('Text');
    //   console.log(data);
    //   ev.target.style.marginTop = '2px'
    //   ev.target.style.marginBottom = '2px'
    // },
    dragFinish(ev, to, where) {
      console.log('drag finish');
      console.log(to);
      console.log(where);
      ev.preventDefault();
      target_id = ev.currentTarget.id;
      let data = ev.dataTransfer.getData('Text');
      let res1 = target_id.charAt(1);
      let res2 = data.charAt(1);
      console.log(res1);
      console.log(res2);
      if (res1 != res2) {
        ret = this.checkCount(where);
        if (ret) {
          return;
        }
        if (to != -1) {
          this.dragFinishColumn(ev, to, where);
          if (where === 1) {
            this.moveItem(this.todos.length - 1, to, where);
          }
          if (where === 2) {
            this.moveItem(this.todos2.length - 1, to, where);
          }
          if (where === 3) {
            this.moveItem(this.todos3.length - 1, to, where);
          }
        } else {
          this.moveItem(this.dragging, to, where);
        }
      } else {
        this.moveItem(this.dragging, to, where);
      }

      console.log(ev.currentTarget.id);
      console.log(ev.target.id);
      console.log(this.id);
      console.log(ev.dataTransfer.getData('Text'));
      //let data = ev.dataTransfer.getData('Text');
      console.log(data);
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      ev.stopPropagation();
    },
    dragFinishColumn(ev, to, where) {
      console.log('drag finish column');
      console.log(to);
      console.log(where);
      console.log(ev.currentTarget.id);
      ev.preventDefault();
      ret = this.checkCount(where);
      console.log(ret);
      if (ret) {
        return;
      }
      if (this.startId != ev.currentTarget.id) {
        console.log('different column');
        let removed;
        if (where === 1) {
          if (this.startId === 'column2') {
            removed = this.todos2.splice(this.dragging, 1);
            console.log(removed[0]);
          }
          if (this.startId === 'column3') {
            removed = this.todos3.splice(this.dragging, 1);
          }
          this.todos.push(removed[0]);
        } else if (where === 2) {
          if (this.startId === 'column1') {
            removed = this.todos.splice(this.dragging, 1);
          }
          if (this.startId === 'column3') {
            removed = this.todos3.splice(this.dragging, 1);
          }
          this.todos2.push(removed[0]);
        } else if (where === 3) {
          if (this.startId === 'column1') {
            removed = this.todos.splice(this.dragging, 1);
          }
          if (this.startId === 'column2') {
            removed = this.todos2.splice(this.dragging, 1);
          }
          this.todos3.push(removed[0]);
        }
      }
      console.log(ev.target.id);
      console.log(this.id);
      console.log(ev.currentTarget.id);
      console.log(ev.dataTransfer.getData('Text'));
      let data = ev.dataTransfer.getData('Text');
      console.log(data);
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      //ev.stopPropagation();
    },
    // dragFinish(ev, to, where = 3) {
    //   console.log('drag finish column');
    //   console.log(to);
    //   console.log(where);
    //   ev.preventDefault();
    //   if (this.startId != ev.currentTarget.id) {
    //     console.log('different column');
    //     if (where === 1) {
    //       let removed = this.todos2.splice(this.dragging, 1);
    //       this.todos.push(removed[0]);
    //       //this.moveItem(this.todos.length - 1, to, where)
    //     } else if (where === 2) {
    //       let removed = this.todos.splice(this.dragging, 1);
    //       this.todos2.push(removed[0]);
    //       //this.moveItem(this.todos2.length - 1, to, where)
    //     }
    //   } else {
    //     this.moveItem(this.dragging, to, where);
    //   }
    //   console.log(ev.target.id);
    //   console.log(this.id);
    //   console.log(ev.currentTarget.id);
    //   console.log(ev.dataTransfer.getData('Text'));
    //   let data = ev.dataTransfer.getData('Text');
    //   console.log(data);
    //   ev.target.style.marginTop = '2px'
    //   ev.target.style.marginBottom = '2px'
    //   ev.stopPropagation();
    // },
    moveItem(from, to, where) {
      console.log('move item');
      if (to === -1) {
        this.removeItemAt(from, where);
      } else {
        if (where === 1) {
          this.todos.splice(to, 0, this.todos.splice(from, 1)[0]);
        } else if (where === 2) {
          this.todos2.splice(to, 0, this.todos2.splice(from, 1)[0]);
        } else if (where === 3) {
          this.todos3.splice(to, 0, this.todos3.splice(from, 1)[0]);
        }
      }
    },
    checkCount(where) {
      if (this.column1Count != "") {
        if (where === 1) {
          if (this.column1Count <= this.todos.length) {
            return true;
          }
        }
      }
      if (this.column2Count != "") {
        if (where === 2) {
          if (this.column2Count <= this.todos2.length) {
            return true;
          }
        }
      }
      if (this.column3Count != "") {
        if (where === 3) {
          if (this.column3Count <= this.todos3.length) {
            return true;
          }
        }
      }

      return false;
    },
    addCount(id) {
      if (!this.col) {
        return;
      }
      console.log(id);
      if (id === 1) {
        if (this.col >= this.todos.length) {
          this.column1Count = this.col;
          this.clicked = false;
        }
      }
      if (id === 2) {
        if (this.col >= this.todos2.length) {
          this.column2Count = this.col;
          this.clicked2 = false;
        }
      }
      if (id === 3) {
        if (this.col >= this.todos3.length) {
          this.column3Count = this.col;
          this.clicked3 = false;
        }
      }
      this.col = "";
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
        todoStorage.save(todos);
      },
      deep: true
    },
    todos2: {
      handler: function(todos2) {
        todoStorage2.save(todos2);
      },
      deep: true
    },
    todos3: {
      handler: function(todos3) {
        todoStorage3.save(todos3);
      },
      deep: true
    }
  }
});
*/

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
      console.log(to);
      target_id = ev.currentTarget.id;
      let data = ev.dataTransfer.getData('Text');
      console.log(target_id);
      console.log(data);
      let res1 = target_id.charAt(6);
      let res2 = data.charAt(6);
      console.log(res1);
      console.log(res2);
      if (res1 != res2) {
        where = this.id.slice(6, 7);
        console.log(where);
        ret = this.$parent.checkCount(where);
        if (ret) {
          return;
        }
        if (to != -1) {
          this.$parent.dragFinishColumn(ev, to);
          this.moveItem(this.todos.length - 1, to);
        } else {
          this.moveItem(this.dragging, to);
        }
      } else {
        this.moveItem(this.dragging, to);
      }
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      Event.$emit("test-ev", {"todos": this.todos,
                              "aaa": "test"});
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
  created() {
    // Event.$on('test-ev', event => {
    //   console.log('test event');
    //   console.log(event.todos);
    //   console.log(event.aaa);
    // });

    // Event.$on('column-drag-ev', event => {
    //   console.log('column-drag-ev');
    //   console.log(event.columnStartId);
    //   console.log(event.columnEndId);
    //   let columnStartId = event.columnStartId;
    //   let columnEndId = event.columnEndId;
    //   if (columnStartId === this.id) {
    //     console.log(columnStartId + " event triggered (start)");
    //     this.$parent.removed = this.todos.splice(this.dragging, 1);
    //     console.log(this.$parent.removed);
    //   }
    //   if (columnEndId === this.id) {
    //     console.log(columnEndId + " event triggered (end)");
    //     this.todos.push(this.$parent.removed[0]);
    //     this.$parent.removed = "";
    //   }
    // });
  },
  mounted() {
    let TODO_STORAGE_KEY = "todo" + this.componentId;
    console.log(TODO_STORAGE_KEY);
    this.todoStorage = {
      fetch: () => JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || "[]"),
      save: todos => localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
    };
    this.todos = this.todoStorage.fetch();

    Event.$on('test-ev', event => {
      console.log('test event');
      console.log(event.todos);
      console.log(event.aaa);
    });

    Event.$on('column-drag-ev', event => {
      console.log('column-drag-ev: ' + this.id);
      console.log(event.columnStartId);
      console.log(event.columnEndId);
      let columnStartId = event.columnStartId;
      let columnEndId = event.columnEndId;
      columnEndId = columnEndId.slice(0, 7);
      console.log(columnEndId);
      if (this.id != columnStartId) {
        console.log('skipping...');
        return;
      }
      if (columnStartId === this.id) {
        //if (! this.$parent.removed) {
          console.log(columnStartId + " event triggered (start)");
          this.$parent.removedItem = this.todos.splice(this.dragging, 1);
          console.log(this.$parent.removedItem);
          //this.$parent.removed = true;
          ev_data = {
            "columnEndId": columnEndId
          };
          Event.$emit('column-add', ev_data);
        //}
      }
      //if (columnEndId === this.id) {
        //if (columnStartId === "column" + where) {
          //if (this.$parent.removed) {
            //console.log(columnEndId + " event triggered (end)");
            //this.todos.push(this.$parent.removedItem[0]);
            //this.$parent.removedItem = "";
            //this.$parent.removed = false;
          //}
      //}
      //}
    });

    Event.$on('column-add', event => {
      let columnEndId = event.columnEndId;
      if (columnEndId === this.id) {
        console.log("column-add triggered");
        console.log(event);
        this.todos.push(this.$parent.removedItem[0]);
        this.$parent.removedItem = "";
        //this.$parent.removed = false;
      }
    });
  }
})

const app = new Vue({
  el: "#app",
  data: function() {
    return {
      startId: "",
      removedItem: "",
      column1Count: "",
      column2Count: "",
      column3Count: "",
      clicked: false,
      clicked2: false,
      clicked3: false,
      col: ""
    }
  },
  methods: {
    dragStart2(ev) {
      console.log('drag started2');
      //ev.preventDefault();
      //ev.dataTransfer.setData('Text', this.id);
      console.log(this.id);
      console.log(ev.target.id);
      this.startId = ev.currentTarget.id;
      ev.dataTransfer.setData('Text', ev.target.id);
      ev.dataTransfer.dropEffect = 'move'
    },
    dragFinishColumn(ev, to) {
      console.log('drag finish column');
      console.log(to);
      console.log(ev.currentTarget.id);
      ev.preventDefault();
      let where = ev.currentTarget.id.slice(6, 7);
      ret = this.checkCount(where);
      console.log(ret);
      if (ret) {
        return;
      }
      if (this.startId != ev.currentTarget.id) {
        console.log('different column');
        ev_data = {
          "columnStartId": this.startId,
          "columnEndId": ev.currentTarget.id
        };
        Event.$emit("column-drag-ev", ev_data);
      } else {
        console.log(this.$children);
        let index = this.startId.slice(6, 7);
        console.log(index);
        console.log(ev);
        this.$children[index - 1].moveItem(this.$children[index - 1].dragging, this.$children[index - 1].todos.length - 1);
      }
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      ev.stopPropagation();
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
      }
      if (id === 2) {
        if (this.col >= this.$children[id - 1].todos.length) {
          this.column2Count = this.col;
          this.clicked2 = false;
        }
      }
      if (id === 3) {
        if (this.col >= this.$children[id - 1].todos.length) {
          this.column3Count = this.col;
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
    }
      //ret = this.checkCount(where);
      //console.log(ret);
      //if (ret) {
      //  return;
      //}
      /*if (this.startId != ev.currentTarget.id) {
        console.log('different column');
        let removed;
        if (where === 1) {
          if (this.startId === 'column2') {
            removed = this.todos2.splice(this.dragging, 1);
            console.log(removed[0]);
          }
          if (this.startId === 'column3') {
            removed = this.todos3.splice(this.dragging, 1);
          }
          this.todos.push(removed[0]);
        } else if (where === 2) {
          if (this.startId === 'column1') {
            removed = this.todos.splice(this.dragging, 1);
          }
          if (this.startId === 'column3') {
            removed = this.todos3.splice(this.dragging, 1);
          }
          this.todos2.push(removed[0]);
        } else if (where === 3) {
          if (this.startId === 'column1') {
            removed = this.todos.splice(this.dragging, 1);
          }
          if (this.startId === 'column2') {
            removed = this.todos2.splice(this.dragging, 1);
          }
          this.todos3.push(removed[0]);
        }
      }
      console.log(ev.target.id);
      console.log(this.id);
      console.log(ev.currentTarget.id);
      console.log(ev.dataTransfer.getData('Text'));
      let data = ev.dataTransfer.getData('Text');
      console.log(data);
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
      */
      //ev.stopPropagation();
    //}
  }
});
