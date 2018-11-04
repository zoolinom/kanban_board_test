<template>
  <div id='app'>
    <table>
      <th v-if="column1Count == ''" @click="focusElement(1)">To Do <input ref="input1" class="column-input" placeholder="Type max column value and press enter (0 to cancel value)" v-show="clicked === true" type="text" v-model="col" @mouseout="clicked = false" @keyup.enter="addCount(1)"></th>
      <th v-else @click="focusElement(1)">To Do ( {{ column1Count }} ) <input ref="input1" class="column-input" placeholder="Type max column value and press enter (0 to cancel value)" v-if="clicked === true" type="text" v-model="col" @mouseout="clicked = false" @keyup.enter="addCount(1)"></th>
      <th v-if="column2Count == ''" @click="focusElement(2)">In Progress <input ref="input2" class="column-input" placeholder="Type max column value and press enter (0 to cancel value)" v-if="clicked2 === true" type="text" v-model="col" @mouseout="clicked2 = false" @keyup.enter="addCount(2)"></th>
      <th v-else @click="focusElement(2)">In Progress ( {{ column2Count }} ) <input ref="input2" class="column-input" placeholder="Type max column value and press enter (0 to cancel value)" v-if="clicked2 === true" type="text" v-model="col" @mouseout="clicked2 = false" @keyup.enter="addCount(2)"></th>
      <th v-if="column3Count == ''" @click="focusElement(3)">Done <input ref="input3" class="column-input" placeholder="Type max column value and press enter (0 to cancel value)" v-if="clicked3 === true" type="text" v-model="col" @mouseout="clicked3 = false" @keyup.enter="addCount(3)"></th>
      <th v-else @click="focusElement(3)">Done ( {{ column3Count }} ) <input ref="input3" class="column-input" placeholder="Type max column value and press enter (0 to cancel value)" v-if="clicked3 === true" type="text" v-model="col" @mouseout="clicked3 = false" @keyup.enter="addCount(3)"></th>
      <tr>
        <td id="column1" @dragstart="dragStart2($event)" @dragover.prevent @drop="dragFinishColumn($event)">
            <column id="column1"></column>
        </td>
        <td id="column2" @dragstart="dragStart2($event)" @dragover.prevent @drop="dragFinishColumn($event)">
            <column id="column2"></column>
        </td>
        <td id="column3" @dragstart="dragStart2($event)" @dragover.prevent @drop="dragFinishColumn($event)">
            <column id="column3"></column>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

import Column from './components/Column.vue';
import { Event } from './event.js';

export default {
  name: 'app',
  components: { Column },
  data () {
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
      // store id of column where drag is started
      this.startId = ev.currentTarget.id;
      ev.dataTransfer.setData('Text', ev.target.id);
      ev.dataTransfer.dropEffect = 'move'
    },
    dragFinishColumn(ev) {
      console.log("drag finish column");
      ev.preventDefault();
      let where = ev.currentTarget.id.slice(6, 7);

      // check if we can drag to column (if max number is smaller of array length)
      let ret = this.checkCount(where);

      if (ret) {
        return;
      }
      // if we drag and drop to different column
      if (this.startId != ev.currentTarget.id) {
        console.log('different column');
        Event.$emit("column-drag-ev", {
          "columnStartId": this.startId,
          "columnEndId": ev.currentTarget.id
        });
      // else only arrange itmes if needed
      } else {
        let index = this.startId.slice(6, 7);

        this.$children[index - 1].moveItem(this.$children[index - 1].dragging, this.$children[index - 1].todos.length - 1);
      }
      ev.target.style.marginTop = '2px'
      ev.target.style.marginBottom = '2px'
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
    },
    focusElement(id) {
      if (id === 1) {
        this.clicked = true;
        this.$nextTick(() => this.$refs.input1.focus());
      }
      if (id === 2) {
        this.clicked2 = true;
        this.$nextTick(() => this.$refs.input2.focus());
      }
      if (id === 3) {
        this.clicked3 = true;
        this.$nextTick(() => this.$refs.input3.focus());
      }
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

        return localStorage.getItem(key) === null ? "" : localStorage.getItem(key);
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
}
</script>

<style>
body {
  font-family: "Source Sans Pro", "Arial", sans-serif;
}

* {
  box-sizing: border-box;
}

.todo-list {
  list-style-type: none;
  padding: 10px;
}

.new-todo {
  width: 100%;
}

.trash-drop {
  border: 2px dashed #ccc !important;
  text-align: center;
  color: #e33;
}

.trash-drop:-moz-drag-over {
  border: 2px solid red;
}

.todo-item {
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 14px 8px;
  margin-bottom: 3px;
  background-color: #fff;
  box-shadow: 1px 2px 2px #ccc;
  font-size: 22px;
}

.remove-item {
  float: right;
  color: #a45;
  opacity: 0.5;
}

.todo-item:hover .remove-item {
  opacity: 1;
  font-size: 28px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

table, th, td {
  border: 1px solid black;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 22px;
}

.column-input {
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 14px 8px;
  margin-bottom: 3px;
  background-color: #fff;
  font-size: 20px;
  width: 80%;
}
</style>
