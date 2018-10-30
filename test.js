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
