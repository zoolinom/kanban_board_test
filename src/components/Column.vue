<template>
  <ul class="todo-list">
    <li @dragover.prevent @drop="dragFinish($event, -1)" v-if="dragging > -1" class="trash-drop todo-item" v-bind:class="{drag: isDragging}">Delete</li>

    <li v-else>
      <input placeholder="Type new task and press enter" type="text" class="new-todo todo-item" v-model="newItem" @keyup.enter="addItem">
    </li>

    <li class="todo-item" v-if="todos.length != 0" v-for="(item, i) in todos" :key="i" :id="id + '_' + i" draggable="true" @dragstart="dragStart(i, $event)" @dragover.prevent @dragenter="dragEnter" @dragleave="dragLeave" @dragend="dragEnd" @drop="dragFinish($event, i, 1)">
      <span>{{ item.title }}</span>
      <span class="remove-item" @click="removeItem(item, 1)">x</span>
    </li>
  </ul>
</template>

<script>

import { Event } from '../event.js';

export default {
  props: {
    id: {
      default: "",
      type: String
    }
  },
  data () {
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
      let where = this.id.slice(6, 7);

      let ret = this.$parent.checkCount(where);

      if (ret) {
        this.newItem = "";

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
        if (to === -1) {
          this.moveItem(this.dragging, to);
        } else {
          let where = this.id.slice(6, 7);

          let ret = this.$parent.checkCount(where);

          if (ret) {
            return;
          }
          if (to != -1) {
            this.$parent.dragFinishColumn(ev);
            this.moveItem(this.todos.length - 1, to);
          }
        }
      } else {
        console.log('bbb');
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
}
</script>

<style>

</style>
