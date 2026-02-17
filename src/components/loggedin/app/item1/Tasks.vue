<template>
  <div class="tasks">
    <template v-if="contacts?.[slctdCntctIndex]?.Tasks">
      <div class="tasks-title">
        <div class="tasks-title-grid-container">
          <div class="tasks-title-grid-item1">
            Tasks for
            {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
            {{ contacts[slctdCntctIndex].Members[0]?.Name }}
          </div>
          <div class="tasks-title-grid-item2">
            <button
              v-if="slctd.eventIndx === null"
              @click="
                sortAscDesc = !sortAscDesc;
                taskMemo = taskMemo + 1;
              "
            >
              <template v-if="Tasks.length > 1">
                <i v-if="sortAscDesc" class="fa-solid fa-arrow-down-wide-short"></i>
                <i v-else class="fa-solid fa-arrow-up-wide-short"></i>
              </template>
            </button>
          </div>
          <div class="tasks-title-grid-item3">
            <button @click="newTask" :disabled="dsbld">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <template v-for="(task, taskIndex) in Tasks" v-memo="[taskMemo]">
        <div class="tasks-body" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white' }">
          <i
            v-if="
              userRole > 5 ||
              (userRole <= 5 &&
                task.Assign.includes(userData.id?.toString()) &&
                updt.initialUsrTmstmp + 86400000 > new Date(task?.Created)?.getTime())
            "
            class="fa-solid fa-trash"
            @click="deleteTask(task.clmnIndex)"
          ></i>
          <span class="tasks-label">Date:</span>
          <input
            type="datetime-local"
            :value="task.Date"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                task.Create != userData.id &&
                !task.Assign.includes(userData.id?.toString()) &&
                task.Update != userData.id)
            "
            v-on:blur="updateTask($event.target.value, task.clmnIndex, 'Date')"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="tasks-label">Tag:</span>
          <select
            :value="task.Tag"
            @change="updateTask($event.target.value, task.clmnIndex, 'Tag')"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                task.Create != userData.id &&
                !task.Assign.includes(userData.id?.toString()) &&
                task.Update != userData.id)
            "
          >
            <option value="">None</option>
            <option value="fa-solid fa-phone">Call</option>
            <option value="fa-regular fa-at">Email</option>
            <option value="fa-solid fa-cart-shopping">Order</option>
            <option value="fa-solid fa-dollar-sign">Payment</option>
            <option value="fa-solid fa-print">Print</option>
            <option value="fa-solid fa-question">Question</option>
            <option value="fa-solid fa-user">Meeting</option>
            <option value="fa-solid fa-star">Urgent</option>
            <option value="fa-solid fa-pen">Write</option>
          </select>
          <span class="tasks-label">Assigned:</span>
          <input
            type="checkbox"
            :id="'taskOwnrChckBx' + taskIndex"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                task.Create != userData.id &&
                !task.Assign.includes(userData.id?.toString()) &&
                task.Update != userData.id)
            "
            @change="updateTask($event, task.clmnIndex, 'Assign')"
          />
          <select
            class="taskOwnrSlct"
            style="width: calc(100% - 120px)"
            :id="'task' + task.clmnIndex"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
            :title="
              Array.isArray(task.Assign)
                ? task.Assign.map((assignee) =>
                    sttngs?.entity?.taskGroups?.[assignee]
                      ? sttngs.entity.taskGroups[assignee].map(
                          (groupAssignee) => ' ' + userList[groupAssignee]?.FirstName,
                        )
                      : ' ' + userList[assignee]?.FirstName,
                  )
                : false
            "
            @change="getTaskOwners"
          >
            <option disabled v-if="sttngs?.entity?.taskGroups">======Users======</option>
            <option
              v-for="(userInfo, userNo) in userList"
              :value="userNo"
              :selected="task.Assign[task.Assign.length - 1]?.toString() == userNo?.toString()"
              :style="{
                background: task.Assign.includes(userNo?.toString())
                  ? 'rgba(100, 100, 100, 0.3)'
                  : 'rgba(100, 100, 100, 0)',
                fontWeight: task.Assign.includes(userNo?.toString()) ? 'bold' : 'normal',
              }"
            >
              {{ userInfo.FirstName }}
            </option>
            <template v-if="sttngs?.entity?.taskGroups">
              <option disabled>===User groups===</option>
              <option
                v-for="(taskGrpVal, taskGrpKey) in sttngs.entity.taskGroups"
                :selected="task.Assign[task.Assign.length - 1]?.toString() == taskGrpKey"
                :style="{
                  background: task.Assign.includes(taskGrpKey) ? 'rgba(100, 100, 100, 0.3)' : 'rgba(100, 100, 100, 0)',
                  fontWeight: task.Assign.includes(taskGrpKey) ? 'bold' : 'normal',
                }"
              >
                {{ taskGrpKey }}
              </option>
            </template>
            <option disabled>=================</option>
            <option v-if="userList?.[task?.Update]?.FirstName" disabled>
              Updated by {{ userList[task.Update].FirstName }}
            </option>
            <option v-if="userList?.[task?.Create]?.FirstName" disabled>
              Created by {{ userList[task.Create].FirstName }}
            </option>
          </select>
          <span class="tasks-label">Finished:</span>
          <input
            type="checkbox"
            :checked="task?.Status === true || task?.Status == '1'"
            @change="updateTask($event.target.checked, task.clmnIndex, 'Status')"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                task.Create != userData.id &&
                !task.Assign.includes(userData.id?.toString()) &&
                task.Update != userData.id)
            "
          />
          {{ task?.Status === true || task?.Status == '1' ? 'Yes' : 'No' }}
          <div class="tasks-span" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
            <span
              spellcheck="false"
              :contenteditable="
                dsbld ||
                userRole < 4 ||
                (userRole < 7 &&
                  task.Create != userData.id &&
                  !task.Assign.includes(userData.id?.toString()) &&
                  task.Update != userData.id)
                  ? 'false'
                  : 'plaintext-only'
              "
              v-on:blur="updateTask($event.target.innerHTML, task.clmnIndex, 'Desc')"
              >{{ task?.Desc }}</span
            >
          </div>
        </div>
      </template>
      <div
        v-if="slctd.eventIndx !== null && contacts[slctdCntctIndex].Tasks.length > 1"
        class="tasks-body"
        style="background-color: lightblue; text-align: right"
      >
        <div>
          <b @click="showAllTasks()"
            >Show {{ contacts[slctdCntctIndex].Tasks.length - 1 }} more
            {{ contacts[slctdCntctIndex].Tasks.length - 1 > 1 ? 'tasks' : 'task' }}
          </b>
        </div>
      </div>

      <div v-if="Tasks.length === 0" class="tasks-body" style="background-color: white">
        <div>No tasks</div>
      </div>
    </template>
    <template v-else>Create a contact first</template>
  </div>
</template>

<script>
export default {
  name: 'Tasks',

  inject: [
    'contacts',
    'deleteContactInfo',
    'dsbld',
    'patchContactInfo',
    'slctd',
    'slctdCntctIndex',
    'slctdY_m_d',
    'sttngs',
    'updt',
    'userData',
    'userList',
    'userRole',
  ],

  computed: {
    Tasks() {
      return this.slctd.eventIndx !== null
        ? [
            {
              ...this.contacts[this.slctdCntctIndex][this.clmn][this.slctd.eventIndx],
              clmnIndex: this.slctd.eventIndx,
            },
          ]
        : this.sortAscDesc
          ? this.contacts[this.slctdCntctIndex][this.clmn]
              .map((val, index) => {
                return { ...val, clmnIndex: index };
              })
              .sort((a, b) => a?.Date?.localeCompare(b?.Date))
          : this.contacts[this.slctdCntctIndex][this.clmn]
              .map((val, index) => {
                return { ...val, clmnIndex: index };
              })
              .sort((a, b) => b?.Date?.localeCompare(a?.Date));
    },
  },

  data() {
    return { clmn: 'Tasks', sortAscDesc: false, taskMemo: 0 };
  },

  methods: {
    newTask() {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      const newTask = {
        Date: this.slctdY_m_d + this.updt.updtngY_m_d_H_i_s_z.slice(10, 16),
        Assign: [this.userData.id.toString()],
        Create: this.userData.id,
        Update: this.userData.id,
        Created: this.updt.updtngY_m_d_H_i_s_z,
      };
      this.contacts[this.slctdCntctIndex][this.clmn] = [...this.contacts[this.slctdCntctIndex][this.clmn], newTask];
      this.slctd.eventIndx = oldCntct[this.clmn].length;
      this.taskMemo = this.taskMemo + 1;
      this.patchContactInfo(newTask, this.clmn, oldCntct[this.clmn].length, oldCntct, this.slctdCntctIndex);
    },
    updateTask(event, clmnIndex, key) {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      event = typeof event === 'boolean' || typeof event === 'object' ? event : event.trim().replaceAll('<br>', '');
      if (
        (event != oldCntct[this.clmn][clmnIndex][key] && event != '') ||
        (event == '' && oldCntct[this.clmn][clmnIndex][key])
      ) {
        // prettier-ignore
        key == 'Assign'
          ? event.target.checked
            ? this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key].push(event.target.nextSibling.value?.toString(),)
            : this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key].splice(this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key].indexOf(event.target.nextSibling.value?.toString(),), 1,)
          : (this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event);
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id;
        this.taskMemo = this.taskMemo + 1;
        // prettier-ignore
        this.patchContactInfo({ [key]: this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key], Update: this.userData.id }, this.clmn, clmnIndex, oldCntct, this.slctdCntctIndex);
      }
    },
    deleteTask(clmnIndex) {
      if (confirm('Are you sure you would like to delete this?') == true) {
        this.deleteContactInfo(this.clmn, clmnIndex, true);
        this.showAllTasks();
      }
    },
    showAllTasks() {
      this.slctd.eventIndx = null;
      this.taskMemo = this.taskMemo + 1;
    },
    getTaskOwners() {
      Array.from(document.getElementsByClassName('taskOwnrSlct')).forEach((el, elIndx) => {
        if (this.contacts[this.slctdCntctIndex][this.clmn][el.id.slice(4)].Assign.includes(el.value)) {
          let taskOwnrChckBx = document.getElementById('taskOwnrChckBx' + elIndx);
          let taskOwnr = this.contacts[this.slctdCntctIndex][this.clmn][el.id.slice(4)].Assign;
          taskOwnrChckBx.checked = true;
          taskOwnr.length < 2 && taskOwnr.includes(el.value)
            ? (taskOwnrChckBx.disabled = true)
            : (taskOwnrChckBx.disabled = false);
        } else {
          let taskOwnrChckBx = document.getElementById('taskOwnrChckBx' + elIndx);
          let taskOwnr = this.contacts[this.slctdCntctIndex][this.clmn][el.id.slice(4)].Assign;
          taskOwnrChckBx.checked = false;
          taskOwnr.length < 2 && taskOwnr.includes(el.value)
            ? (taskOwnrChckBx.disabled = true)
            : (taskOwnrChckBx.disabled = false);
        }
      });
    },
  },
  mounted() {
    this.getTaskOwners();
  },
  updated() {
    this.getTaskOwners();
  },
  watch: {
    'slctd.eventIndx'() {
      this.taskMemo = this.taskMemo + 1;
    },
    slctdCntctIndex() {
      this.taskMemo = this.taskMemo + 1;
    },
  },
};
</script>

<style>
.tasks {
}
.tasks-title {
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.tasks-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 52.5px) 30px 22.5px;
}
.tasks-title-grid-item1 {
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tasks-title-grid-item2 button,
.tasks-title-grid-item3 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417cd9;
}
.tasks-title-grid-item2 button:hover,
.tasks-title-grid-item3 button:hover {
  color: #db66ff;
}
.tasks-body {
  padding: 10px;
}
.tasks-body i {
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.tasks-body i:hover {
  color: DimGrey;
}
.tasks-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 65px;
  text-align: right;
}
.tasks-body input,
.tasks-body select {
  width: calc(100% - 100px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
}
.tasks-body input[type='checkbox'] {
  height: auto;
  width: auto;
}
.tasks-span {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
}
.tasks-span span[contenteditable] {
  min-height: 32px;
  display: block; /* not sure if this is needed */
}
.tasks-span span[contenteditable]:empty::before {
  min-height: 32px;
  content: 'Enter task description';
  display: inline-block;
  color: grey;
}
.tasks-span span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
}
.tasks-body span[contenteditable]:focus {
  outline: none;
}
.tasks b {
  cursor: pointer;
}
.odd-task {
  background-color: white;
  border: 1px solid lightgray;
}
.even-task {
  background-color: lightblue;
  border: 1px solid gray;
}
</style>
