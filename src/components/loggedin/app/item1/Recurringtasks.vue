<template>
  <div class="recur-tasks">
    <template v-if="contacts?.[slctdCntctIndex]?.RecurTasks">
      <div class="recur-tasks-title">
        <div class="recur-tasks-title-grid-container">
          <div class="recur-tasks-title-grid-item1">
            Recurring tasks for
            {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
            {{ contacts[slctdCntctIndex].Members[0]?.Name }}
          </div>
          <div class="tasks-title-grid-item2">
            <button
              v-if="slctd.eventIndx === null"
              @click="
                sortAscDesc = !sortAscDesc;
                recurTaskMemo = recurTaskMemo + 1;
              "
            >
              <template v-if="RecurTasks.length > 1">
                <i v-if="sortAscDesc" class="fa-solid fa-arrow-down-wide-short"></i>
                <i v-else class="fa-solid fa-arrow-up-wide-short"></i>
              </template>
            </button>
          </div>
          <div class="recur-tasks-title-grid-item3">
            <button @click="newRecurTask">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <template v-for="(recurTask, recurTaskIndex) in RecurTasks" v-memo="[recurTaskMemo]">
        <div
          class="recur-tasks-body"
          :style="{
            'background-color': recurTaskIndex % 2 ? 'lightblue' : 'white',
          }"
        >
          <i
            v-if="
              userRole > 5 ||
              (userRole <= 5 &&
                recurTask.Assign.includes(userData.id.toString()) &&
                updt.initialUsrTmstmp + 86400000 > new Date(recurTask?.Created)?.getTime())
            "
            class="fa-solid fa-trash"
            @click="deleteRecurTask(recurTask.clmnIndex)"
          ></i>
          <span class="recur-tasks-label">Start:</span>
          <input
            type="date"
            :value="recurTask.Start"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            v-on:blur="
              updateRecurTaskFreq(
                recurTask.clmnIndex,
                $event.target.value,
                contacts[slctdCntctIndex][clmn][recurTask.clmnIndex].Freq,
              )
            "
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">End:</span>
          <input
            type="date"
            :value="recurTask.End"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            v-on:blur="updateRecurTask($event.target.value, recurTask.clmnIndex, 'End')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">Time:</span>
          <input
            type="time"
            :value="recurTask.Time"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            v-on:blur="updateRecurTask($event.target.value, recurTask.clmnIndex, 'Time')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">Recur:</span>
          <select
            :value="recurTask.Freq"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            @change="
              updateRecurTaskFreq(
                recurTask.clmnIndex,
                contacts[slctdCntctIndex][clmn][recurTask.clmnIndex].Start,
                $event.target.value,
              )
            "
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          >
            <option>Annually</option>
            <option>Semiannually</option>
            <option>Quarterly</option>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <span class="recur-tasks-label">Assigned:</span>
          <input
            type="checkbox"
            :id="'recurTaskOwnrChckBx' + recurTaskIndex"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id?.toString()) &&
                recurTask.Update != userData.id)
            "
            @change="updateRecurTask($event, recurTask.clmnIndex, 'Assign')"
          />
          <select
            class="recurTaskOwnrSlct"
            style="width: calc(100% - 120px)"
            :id="'recurTask' + recurTask.clmnIndex"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
            :title="
              Array.isArray(recurTask.Assign)
                ? recurTask.Assign.map((assignee) =>
                    sttngs?.entity?.taskGroups?.[assignee]
                      ? sttngs.entity.taskGroups[assignee].map(
                          (groupAssignee) => ' ' + userList[groupAssignee]?.FirstName,
                        )
                      : ' ' + userList[assignee]?.FirstName,
                  )
                : false
            "
            @change="getRecurTaskOwners"
          >
            <option disabled v-if="sttngs?.entity?.taskGroups">======Users======</option>
            <option
              v-for="(userInfo, userNo) in userList"
              :value="userNo"
              :selected="recurTask.Assign[recurTask.Assign.length - 1]?.toString() == userNo?.toString()"
              :style="{
                background: recurTask.Assign.includes(userNo?.toString())
                  ? 'rgba(100, 100, 100, 0.3)'
                  : 'rgba(100, 100, 100, 0)',
                fontWeight: recurTask.Assign.includes(userNo?.toString()) ? 'bold' : 'normal',
              }"
            >
              {{ userInfo.FirstName }}
            </option>
            <template v-if="sttngs?.entity?.taskGroups">
              <option disabled>===User groups===</option>
              <option
                v-for="(taskGrpVal, taskGrpKey) in sttngs.entity.taskGroups"
                :selected="recurTask.Assign[recurTask.Assign.length - 1]?.toString() == taskGrpKey"
                :style="{
                  background: recurTask.Assign.includes(taskGrpKey)
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'rgba(100, 100, 100, 0)',
                  fontWeight: recurTask.Assign.includes(taskGrpKey) ? 'bold' : 'normal',
                }"
              >
                {{ taskGrpKey }}
              </option>
            </template>
            <option disabled>=================</option>
            <option v-if="userList?.[recurTask?.Update]?.FirstName" disabled>
              Updated by {{ userList[recurTask.Update].FirstName }}
            </option>
            <option v-if="userList?.[recurTask?.Create]?.FirstName" disabled>
              Created by {{ userList[recurTask.Create].FirstName }}
            </option>
          </select>
          <span class="recur-tasks-label">Finished:</span>
          <button
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            @click="
              updateRecurTask(updt.updtngY_m_d_H_i_s_z.slice(0, 10), recurTask.clmnIndex, 'Review');
              recurTaskMemo = recurTaskMemo + 1;
            "
          >
            {{
              recurTask.Review
                ? recurTask.Review.slice(5, 7) +
                  '/' +
                  recurTask.Review.slice(8, 10) +
                  '/' +
                  recurTask.Review.slice(0, 4)
                : 'Click here'
            }}
          </button>
          <div class="recur-tasks-span" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span
              spellcheck="false"
              :contenteditable="
                dsbld ||
                userRole < 4 ||
                (userRole < 7 &&
                  recurTask.Create != userData.id &&
                  !recurTask.Assign.includes(userData.id.toString()) &&
                  recurTask.Update != userData.id)
                  ? 'false'
                  : 'plaintext-only'
              "
              v-on:blur="updateRecurTask($event.target.innerHTML, recurTask.clmnIndex, 'Desc')"
              >{{ recurTask.Desc }}</span
            >
          </div>
        </div>
      </template>
      <div
        v-if="slctd.eventIndx !== null && contacts[slctdCntctIndex].RecurTasks.length > 1"
        class="recur-tasks-body"
        style="background-color: lightblue; text-align: right"
      >
        <div>
          <b @click="showAllRecurTasks()"
            >Show {{ contacts[slctdCntctIndex].RecurTasks.length - 1 }} more
            {{ contacts[slctdCntctIndex].RecurTasks.length - 1 > 1 ? 'tasks' : 'task' }}
          </b>
        </div>
      </div>

      <div v-if="RecurTasks.length === 0" class="recur-tasks-body" style="background-color: white">
        <div>No recurring tasks</div>
      </div>
    </template>
    <template v-else>Create a contact first</template>
  </div>
</template>

<script>
export default {
  name: 'Recur Tasks',

  inject: [
    'contacts',
    'deleteContactInfo',
    'dsbld',
    'patchContactInfo',
    'slctdCntctIndex',
    'slctd',
    'slctdY_m_d',
    'sttngs',
    'updt',
    'userData',
    'userList',
    'userRole',
  ],

  computed: {
    RecurTasks() {
      return this.slctd.eventIndx !== null
        ? [
            {
              ...this.contacts[this.slctdCntctIndex].RecurTasks[this.slctd.eventIndx],
              clmnIndex: this.slctd.eventIndx,
            },
          ]
        : this.sortAscDesc
          ? this.contacts[this.slctdCntctIndex].RecurTasks.map((val, index) => {
              return { ...val, clmnIndex: index };
            }).sort((a, b) => a?.Start?.localeCompare(b?.Start))
          : this.contacts[this.slctdCntctIndex].RecurTasks.map((val, index) => {
              return { ...val, clmnIndex: index };
            }).sort((a, b) => b?.Start?.localeCompare(a?.Start));
    },
  },

  data() {
    return { clmn: 'RecurTasks', sortAscDesc: false, recurTaskMemo: 0 };
  },

  methods: {
    newRecurTask() {
      const prevRecurTasksLen = this.contacts[this.slctdCntctIndex].RecurTasks.length;
      const newRecurTask = {
        Start: this.slctdY_m_d,
        Recur: [this.slctdY_m_d.slice(5, 10)],
        Freq: 'Annually',
        Assign: [this.userData.id.toString()],
        Create: this.userData.id,
        Update: this.userData.id,
        Created: this.updt.updtngY_m_d_H_i_s_z,
      };
      const newRecurTasks = [...this.contacts[this.slctdCntctIndex].RecurTasks, newRecurTask];
      const cloneCntct = this.contacts[this.slctdCntctIndex];
      cloneCntct.RecurTasks = newRecurTasks;
      this.slctd.eventIndx = this.contacts[this.slctdCntctIndex].RecurTasks.length - 1;
      this.patchContactInfo(newRecurTask, this.clmn, prevRecurTasksLen, cloneCntct);
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
    updateRecurTask(event, clmnIndex, key) {
      event = typeof event === 'boolean' || typeof event === 'object' ? event : event.trim().replaceAll('<br>', '');
      if (
        (event != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] && event != '') ||
        (event == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        key == 'Assign'
          ? event.target.checked
            ? cloneCntct[this.clmn][clmnIndex][key].push(event.target.nextSibling.value?.toString())
            : cloneCntct[this.clmn][clmnIndex][key].splice(
                cloneCntct[this.clmn][clmnIndex][key].indexOf(event.target.nextSibling.value?.toString()),
                1,
              )
          : (cloneCntct[this.clmn][clmnIndex][key] = event);
        cloneCntct[this.clmn][clmnIndex].Update = this.userData.id;
        this.recurTaskMemo = this.recurTaskMemo + 1;
        this.patchContactInfo(
          { [key]: cloneCntct[this.clmn][clmnIndex][key], Update: this.userData.id },
          this.clmn,
          clmnIndex,
          cloneCntct,
        );
      }
    },
    updateRecurTaskFreq(clmnIndex, start, freq) {
      if (
        start != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Start ||
        freq != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Freq
      ) {
        let recur;
        if (freq == 'Annually') {
          recur = [start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28'];
        } else if (freq == 'Semiannually') {
          const halfYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 6);
          recur = [
            start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28',
            new Date(halfYearLater).toISOString().slice(5, 10),
          ];
        } else if (freq == 'Quarterly') {
          const quarterYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 3);
          const halfYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 6);
          const thirdYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 9);
          recur = [
            start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28',
            new Date(quarterYearLater).toISOString().slice(5, 10),
            new Date(halfYearLater).toISOString().slice(5, 10),
            new Date(thirdYearLater).toISOString().slice(5, 10),
          ];
        } else if (freq == 'Monthly') {
          recur = start.slice(8, 10);
        } else if (freq == 'Weekly') {
          recur = new Date(start + 'T00:00:00').getDay().toString();
        } else if (freq == 'Daily') {
          recur = 'everyday';
        }

        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[this.clmn][clmnIndex].Start = start;
        cloneCntct[this.clmn][clmnIndex].Recur = recur;
        cloneCntct[this.clmn][clmnIndex].Freq = freq;
        cloneCntct[this.clmn][clmnIndex].Update = this.userData.id;
        this.recurTaskMemo = this.recurTaskMemo + 1;
        // prettier-ignore
        this.patchContactInfo({ Start: start, Freq: freq, Recur: recur, Update: this.userData.id }, this.clmn, clmnIndex, cloneCntct);
      }
    },
    deleteRecurTask(clmnIndex) {
      if (confirm('Are you sure you would like to delete this?') == true) {
        this.deleteContactInfo(this.clmn, clmnIndex, true);
        this.showAllRecurTasks();
      }
    },
    showAllRecurTasks() {
      this.slctd.eventIndx = null;
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
    getRecurTaskOwners() {
      Array.from(document.getElementsByClassName('recurTaskOwnrSlct')).forEach((el, elIndx) => {
        if (this.contacts[this.slctdCntctIndex].RecurTasks[el.id.slice(9)].Assign.includes(el.value)) {
          let recurTaskOwnrChckBx = document.getElementById('recurTaskOwnrChckBx' + elIndx);
          let recurTaskOwnr = this.contacts[this.slctdCntctIndex].RecurTasks[el.id.slice(9)].Assign;
          recurTaskOwnrChckBx.checked = true;
          recurTaskOwnr.length < 2 && recurTaskOwnr.includes(el.value)
            ? (recurTaskOwnrChckBx.disabled = true)
            : (recurTaskOwnrChckBx.disabled = false);
        } else {
          let recurTaskOwnrChckBx = document.getElementById('recurTaskOwnrChckBx' + elIndx);
          let recurTaskOwnr = this.contacts[this.slctdCntctIndex].RecurTasks[el.id.slice(9)].Assign;
          recurTaskOwnrChckBx.checked = false;
          recurTaskOwnr.length < 2 && recurTaskOwnr.includes(el.value)
            ? (recurTaskOwnrChckBx.disabled = true)
            : (recurTaskOwnrChckBx.disabled = false);
        }
      });
    },
  },
  mounted() {
    this.getRecurTaskOwners();
  },
  updated() {
    this.getRecurTaskOwners();
  },
  watch: {
    'slctd.eventIndx'() {
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
    slctdCntctIndex() {
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
  },
};
</script>

<style>
.recur-tasks-title {
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.recur-tasks-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 52.5px) 30px 22.5px;
}
.recur-tasks-title-grid-item1 {
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recur-tasks-title-grid-item2 button,
.recur-tasks-title-grid-item3 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417cd9;
}
.recur-tasks-title-grid-item2 button:hover,
.recur-tasks-title-grid-item3 button:hover {
  color: #db66ff;
}
.recur-tasks-body {
  padding: 10px;
}
.recur-tasks-body i {
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.recur-tasks-body i:hover {
  color: DimGrey;
}
.recur-tasks-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 65px;
  text-align: right;
}
.recur-tasks-body input,
.recur-tasks-body select,
.recur-tasks-body button {
  width: calc(100% - 100px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
  overflow: hidden;
}
.recur-tasks-body input[type='checkbox'] {
  height: auto;
  width: auto;
}
.recur-tasks-span {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
}
.recur-tasks-span span[contenteditable] {
  min-height: 32px;
  display: block; /* not sure if this is needed */
}
.recur-tasks-span span[contenteditable]:empty::before {
  min-height: 32px;
  content: 'Enter task description';
  display: inline-block;
  color: grey;
}
.recur-tasks-span span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
}
.recur-tasks-body span[contenteditable]:focus {
  outline: none;
}
.recur-tasks b {
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
