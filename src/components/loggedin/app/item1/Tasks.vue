<template>
  <div class="tasks">
    <template v-if="contacts?.[slctdCntctIndex]?.Tasks">
      <div
        class="tasks-title"
        :style="{
          gridTemplateColumns:
            slctd.eventIndx === null && TasksFltrd[0].length > 0 && TasksFltrd[2].length > 0
              ? TasksFltrd[mode].length > 1
                ? 'calc(100% - 67.5px) 22.5px 22.5px 22.5px'
                : 'calc(100% - 45px) 22.5px 22.5px'
              : slctd.eventIndx === null && TasksFltrd[mode].length > 1
                ? 'calc(100% - 45px) 22.5px 22.5px'
                : 'calc(100% - 22.5px) 22.5px',
        }"
      >
        <div :title="'Tasks for ' + slctd.cntct.fllNm">Tasks for {{ slctd.cntct.fllNm }}</div>

        <button v-if="slctd.eventIndx === null && Tasks.length > 1" @click="sortAscDesc = !sortAscDesc">
          <i v-if="sortAscDesc" class="fa-solid fa-arrow-down-wide-short"></i>
          <i v-else class="fa-solid fa-arrow-up-wide-short"></i>
        </button>

        <button
          v-if="slctd.eventIndx === null && Tasks.length !== 0 && TasksFltrd[0].length > 0 && TasksFltrd[2].length > 0"
          @click="chngMode"
        >
          <i style="font-size: 19px; margin-top: 1px" :class="'fa-solid fa-battery-' + plcy[mode]"></i>
        </button>

        <button @click="newTask" :disabled="dsbld">
          <i class="fa-solid fa-square-plus"></i>
        </button>
      </div>

      <template v-for="(task, taskIndex) in Tasks">
        <div class="tasks-body">
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
              task?.Status === true ||
              task?.Status == '1' ||
              userRole < 4 ||
              (userRole < 7 &&
                task.Create != userData.id &&
                !task.Assign.includes(userData.id?.toString()) &&
                task.Update != userData.id)
            "
            v-on:blur="updateTask($event.target.value, task.clmnIndex, 'Date')"
          />
          <span class="tasks-label">Tag:</span>
          <select
            :value="task.Tag"
            @change="updateTask($event.target.value, task.clmnIndex, 'Tag')"
            :disabled="
              dsbld ||
              task?.Status === true ||
              task?.Status == '1' ||
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
              task?.Status === true ||
              task?.Status == '1' ||
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
            :disabled="
              dsbld ||
              task?.Status === true ||
              task?.Status == '1' ||
              userRole < 4 ||
              (userRole < 7 &&
                task.Create != userData.id &&
                !task.Assign.includes(userData.id?.toString()) &&
                task.Update != userData.id)
            "
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
          <div>
            <span
              spellcheck="false"
              :contenteditable="
                dsbld ||
                task?.Status === true ||
                task?.Status == '1' ||
                userRole < 4 ||
                (userRole < 7 &&
                  task.Create != userData.id &&
                  !task.Assign.includes(userData.id?.toString()) &&
                  task.Update != userData.id)
                  ? 'false'
                  : 'plaintext-only'
              "
              v-on:blur="updateTask($event, task.clmnIndex, 'Desc')"
              >{{ task?.Desc }}</span
            >
          </div>
        </div>
      </template>
      <div
        v-if="slctd.eventIndx !== null && contacts[slctdCntctIndex].Tasks.length > 1"
        class="tasks-body"
        style="text-align: right"
      >
        <div>
          <b @click="showAllTasks()"
            >Show {{ TasksFltrd[1].length - 1 }} more task{{ TasksFltrd[1].length - 1 > 1 ? 's' : '' }}
          </b>
        </div>
      </div>

      <div v-if="Tasks.length === 0" class="tasks-body">No tasks</div>

      <div
        v-if="
          slctd.eventIndx === null &&
          TasksFltrd[1].length > 1 &&
          ((mode === 0 && TasksFltrd[2].length > 0) || (mode === 2 && TasksFltrd[0].length > 0))
        "
        style="padding: 10px; text-align: right"
      >
        <b v-if="mode === 0" @click="mode = 2"
          >{{ TasksFltrd[2].length }} unfinished task{{ TasksFltrd[2].length > 1 ? 's' : '' }}</b
        >
        <b v-else @click="mode = 0"
          >{{ TasksFltrd[0].length }} finished task{{ TasksFltrd[0].length > 1 ? 's' : '' }}</b
        >
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
          ? this.TasksFltrd[this.mode].sort((a, b) => a?.Date?.localeCompare(b?.Date))
          : this.TasksFltrd[this.mode].sort((a, b) => b?.Date?.localeCompare(a?.Date));
    },
    TasksFltrd() {
      return [
        this.contacts[this.slctdCntctIndex][this.clmn]
          .map((val, index) => {
            return { ...val, clmnIndex: index };
          })
          .filter((tsk) => tsk?.Status === true || tsk?.Status == '1'),
        this.contacts[this.slctdCntctIndex][this.clmn].map((val, index) => {
          return { ...val, clmnIndex: index };
        }),
        this.contacts[this.slctdCntctIndex][this.clmn]
          .map((val, index) => {
            return { ...val, clmnIndex: index };
          })
          .filter((tsk) => tsk?.Status === false || tsk?.Status == '' || tsk?.Status === undefined),
      ];
    },
  },

  data() {
    return { clmn: 'Tasks', mode: 2, plcy: ['empty', 'half', 'full'], sortAscDesc: false };
  },

  methods: {
    chngMode() {
      this.mode = this.mode === 2 ? 0 : this.mode + 1;
    },
    newTask() {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      const newTask = {
        Date: this.slctdY_m_d + this.updt.updtngY_m_d_H_i_s_z.slice(10, 16),
        Assign: [this.userData.id.toString()],
        Create: this.userData.id.toString(),
        Update: this.userData.id.toString(),
        Created: this.updt.updtngY_m_d_H_i_s_z,
      };
      this.contacts[this.slctdCntctIndex][this.clmn] = [...this.contacts[this.slctdCntctIndex][this.clmn], newTask];
      this.slctd.eventIndx = oldCntct[this.clmn].length;
      this.patchContactInfo(newTask, this.clmn, oldCntct[this.clmn].length, oldCntct, this.slctdCntctIndex);
    },
    updateTask(event, clmnIndex, key) {
      if (key == 'Desc') event.target.innerHTML = event.target.innerHTML.replace(/ +(?= )/g, '').replaceAll('<br>', '');
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      event = key != 'Desc' ? event : event.target.innerHTML.replace(/ +(?= )/g, '').replaceAll('<br>', '');
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
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id.toString(); // check how this gets recorded into the database, check the update object 3 lines below
        // prettier-ignore
        this.patchContactInfo({ [key]: this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key], Update: this.userData.id }, this.clmn, clmnIndex, oldCntct, this.slctdCntctIndex);
      }
    },
    deleteTask(clmnIndex) {
      if (confirm('Are you sure you would like to delete this?') == true) {
        this.deleteContactInfo(
          this.clmn,
          clmnIndex,
          JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex])),
          this.slctdCntctIndex,
          true,
        );
        this.showAllTasks();
      }
    },
    showAllTasks() {
      this.slctd.eventIndx = null;
      this.mode = 1;
    },
    getTaskOwners() {
      // need to still disable checkbox when task is completed
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
    slctdCntctIndex() {
      this.mode = 2;
    },
  },
};
</script>

<style>
.tasks div:nth-child(odd) {
  background-color: lightblue;
}
.tasks div:nth-child(even) {
  background-color: white;
}
.tasks div:nth-child(odd) select,
.tasks div:nth-child(odd) input,
.tasks div:nth-child(odd) span[contenteditable] {
  background-color: lightblue;
  border: 1px solid gray;
}
.tasks div:nth-child(even) select,
.tasks div:nth-child(even) input,
.tasks div:nth-child(even) span[contenteditable] {
  background-color: white;
  border: 1px solid lightgray;
}
.tasks-title {
  font-weight: bold;
  padding: 5px;
  color: black;
  display: grid;
}
.tasks-title div {
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tasks-title button {
  background-color: transparent;
  border: 0px;
  padding: 0px;
  cursor: pointer;
  color: #417cd9;
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
.tasks-body select,
.tasks-body button {
  width: calc(100% - 100px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
  overflow: hidden;
}
.tasks-body input[type='checkbox'] {
  height: auto;
  width: auto;
}
.tasks span[contenteditable] {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
  min-height: 32px;
  display: block; /* not sure if this is needed */
}
.tasks span[contenteditable]:empty::before {
  min-height: 32px;
  content: 'Enter task description';
  display: inline-block;
  color: grey;
}
.tasks span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
}
.tasks-body span[contenteditable]:focus {
  outline: none;
}
.tasks b {
  cursor: pointer;
}
</style>
