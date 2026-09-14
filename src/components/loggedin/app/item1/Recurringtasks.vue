<template>
  <div class="recur-tasks">
    <template v-if="contacts?.[slctdCntctIndex]?.RecurTasks">
      <div
        class="recur-tasks-title"
        :style="{
          gridTemplateColumns:
            slctd.eventIndx === null && RecurTasksFltrd[0].length > 0 && RecurTasksFltrd[2].length > 0
              ? RecurTasksFltrd[mode].length > 1
                ? 'calc(100% - 67.5px) 22.5px 22.5px 22.5px'
                : 'calc(100% - 45px) 22.5px 22.5px'
              : slctd.eventIndx === null && RecurTasksFltrd[mode].length > 1
                ? 'calc(100% - 45px) 22.5px 22.5px'
                : 'calc(100% - 22.5px) 22.5px',
        }"
      >
        <div :title="'Recurring tasks for ' + slctd.cntct.fllNm">Recurring tasks for {{ slctd.cntct.fllNm }}</div>

        <button v-if="slctd.eventIndx === null && RecurTasks.length > 1" @click="sortAscDesc = !sortAscDesc">
          <i v-if="sortAscDesc" class="fa-solid fa-arrow-down-wide-short"></i>
          <i v-else class="fa-solid fa-arrow-up-wide-short"></i>
        </button>

        <button
          v-if="
            slctd.eventIndx === null &&
            RecurTasks.length !== 0 &&
            RecurTasksFltrd[0].length > 0 &&
            RecurTasksFltrd[2].length > 0
          "
          @click="chngMode"
        >
          <i style="font-size: 19px; margin-top: 1px" :class="'fa-solid fa-battery-' + plcy[mode]"></i>
        </button>

        <button @click="newRecurTask" :disabled="dsbld">
          <i class="fa-solid fa-square-plus"></i>
        </button>
      </div>

      <template v-for="(recurTask, recurTaskIndex) in RecurTasks">
        <div class="recur-tasks-body">
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
            v-model.lazy="recurTask.Start"
            :disabled="
              dsbld ||
              (updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != '') ||
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
          />
          <span class="recur-tasks-label">End:</span>
          <input
            type="date"
            v-model.lazy="recurTask.End"
            :disabled="
              dsbld ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            v-on:blur="updateRecurTask($event.target.value, recurTask.clmnIndex, 'End')"
          />
          <span class="recur-tasks-label">Time:</span>
          <input
            type="time"
            v-model.lazy="recurTask.Time"
            :disabled="
              dsbld ||
              (updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != '') ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            v-on:blur="updateRecurTask($event.target.value, recurTask.clmnIndex, 'Time')"
          />
          <span class="recur-tasks-label">Recur:</span>
          <select
            :value="recurTask.Freq"
            :disabled="
              dsbld ||
              (updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != '') ||
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
              (updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != '') ||
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
            :disabled="updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != ''"
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
              (updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != '') ||
              userRole < 4 ||
              (userRole < 7 &&
                recurTask.Create != userData.id &&
                !recurTask.Assign.includes(userData.id.toString()) &&
                recurTask.Update != userData.id)
            "
            @click="updateRecurTask(updt.updtngY_m_d_H_i_s_z.slice(0, 10), recurTask.clmnIndex, 'Review')"
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
          <div>
            <span
              spellcheck="false"
              :contenteditable="
                dsbld ||
                (updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= recurTask.End && recurTask.End != '') ||
                userRole < 4 ||
                (userRole < 7 &&
                  recurTask.Create != userData.id &&
                  !recurTask.Assign.includes(userData.id.toString()) &&
                  recurTask.Update != userData.id)
                  ? 'false'
                  : 'plaintext-only'
              "
              v-on:blur="updateRecurTask($event, recurTask.clmnIndex, 'Desc')"
              >{{ recurTask.Desc }}</span
            >
          </div>
        </div>
      </template>
      <div
        v-if="slctd.eventIndx !== null && RecurTasksFltrd[1].length > 1"
        class="recur-tasks-body"
        style="text-align: right"
      >
        <div>
          <b @click="showAllRecurTasks()"
            >Show {{ RecurTasksFltrd[1].length - 1 }} more task{{ RecurTasksFltrd[1].length - 1 > 1 ? 's' : '' }}
          </b>
        </div>
      </div>

      <div v-if="RecurTasks.length === 0" class="recur-tasks-body">No recurring tasks</div>

      <div
        v-if="
          slctd.eventIndx === null &&
          RecurTasksFltrd[1].length > 1 &&
          ((mode === 0 && RecurTasksFltrd[2].length > 0) || (mode === 2 && RecurTasksFltrd[0].length > 0))
        "
        style="padding: 10px; text-align: right"
      >
        <b v-if="mode === 0" @click="mode = 2"
          >{{ RecurTasksFltrd[2].length }} active recurring task{{ RecurTasksFltrd[2].length > 1 ? 's' : '' }}</b
        >
        <b v-else @click="mode = 0"
          >{{ RecurTasksFltrd[0].length }} inactive recurring task{{ RecurTasksFltrd[0].length > 1 ? 's' : '' }}</b
        >
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
              ...this.contacts[this.slctdCntctIndex][this.clmn][this.slctd.eventIndx],
              clmnIndex: this.slctd.eventIndx,
            },
          ]
        : this.sortAscDesc
          ? this.RecurTasksFltrd[this.mode].sort((a, b) => a?.Start?.localeCompare(b?.Start))
          : this.RecurTasksFltrd[this.mode].sort((a, b) => b?.Start?.localeCompare(a?.Start));
    },
    RecurTasksFltrd() {
      return [
        this.contacts[this.slctdCntctIndex][this.clmn]
          .map((val, index) => {
            return { ...val, clmnIndex: index };
          })
          .filter((tsk) => this.updt.updtngY_m_d_H_i_s_z.slice(0, 10) >= tsk.End),
        this.contacts[this.slctdCntctIndex][this.clmn].map((val, index) => {
          return { ...val, clmnIndex: index };
        }),
        this.contacts[this.slctdCntctIndex][this.clmn]
          .map((val, index) => {
            return { ...val, clmnIndex: index };
          })
          .filter((tsk) => this.updt.updtngY_m_d_H_i_s_z.slice(0, 10) <= tsk.End || tsk.End === undefined),
      ];
    },
  },

  data() {
    return {
      clmn: 'RecurTasks',
      mode: 2,
      plcy: ['empty', 'half', 'full'],
      sortAscDesc: false,
    };
  },

  methods: {
    chngMode() {
      this.mode = this.mode === 2 ? 0 : this.mode + 1;
    },
    newRecurTask() {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      const newRecurTask = {
        Start: this.slctdY_m_d,
        Recur: [this.slctdY_m_d.slice(5, 10)],
        Freq: 'Annually',
        Assign: [this.userData.id.toString()],
        Create: this.userData.id,
        Update: this.userData.id,
        Created: this.updt.updtngY_m_d_H_i_s_z,
      };
      this.contacts[this.slctdCntctIndex][this.clmn] = [
        ...this.contacts[this.slctdCntctIndex][this.clmn],
        newRecurTask,
      ];
      this.slctd.eventIndx = oldCntct[this.clmn].length;
      this.patchContactInfo(newRecurTask, this.clmn, oldCntct[this.clmn].length, oldCntct, this.slctdCntctIndex);
    },
    updateRecurTask(event, clmnIndex, key) {
      if (
        key == 'Review' &&
        (this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Recur.includes(this.slctdY_m_d.slice(5, 10)) ||
          this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Recur == this.slctdY_m_d.slice(8, 10) ||
          this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Recur ==
            new Date(this.slctdY_m_d + 'T00:00:00').getDay().toString() ||
          this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Freq == 'Daily') &&
        this.slctdY_m_d > this.updt.updtngY_m_d_H_i_s_z.slice(0, 10) &&
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Review != this.slctdY_m_d &&
        confirm('Confirm that you are finishing this recurring task with a date in the future: ' + this.slctdY_m_d) ==
          true
      )
        event = this.slctdY_m_d;
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
            : this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key].splice(this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key].indexOf(event.target.nextSibling.value?.toString(),), 1, )
          : (this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event);
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id.toString();
        // prettier-ignore
        this.patchContactInfo({ [key]: this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key], Update: this.userData.id }, this.clmn, clmnIndex, oldCntct, this.slctdCntctIndex);
      }
    },
    updateRecurTaskFreq(clmnIndex, start, freq) {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      if (start != oldCntct[this.clmn][clmnIndex].Start || freq != oldCntct[this.clmn][clmnIndex].Freq) {
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

        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Start = start;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Recur = recur;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Freq = freq;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id;
        // prettier-ignore
        this.patchContactInfo({ Start: start, Freq: freq, Recur: recur, Update: this.userData.id }, this.clmn, clmnIndex, oldCntct, this.slctdCntctIndex);
      }
    },
    deleteRecurTask(clmnIndex) {
      if (confirm('Are you sure you would like to delete this?') == true) {
        this.deleteContactInfo(
          this.clmn,
          clmnIndex,
          JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex])),
          this.slctdCntctIndex,
          true,
        );
        this.showAllRecurTasks();
      }
    },
    showAllRecurTasks() {
      this.slctd.eventIndx = null;
      this.mode = 1;
    },
    getRecurTaskOwners() {
      Array.from(document.getElementsByClassName('recurTaskOwnrSlct'))?.forEach((el, elIndx) => {
        if (this.contacts[this.slctdCntctIndex].RecurTasks?.[el.id.slice(9)]?.Assign?.includes(el.value)) {
          let recurTaskOwnrChckBx = document.getElementById('recurTaskOwnrChckBx' + elIndx);
          let recurTaskOwnr = this.contacts[this.slctdCntctIndex].RecurTasks?.[el.id.slice(9)]?.Assign;
          recurTaskOwnrChckBx.checked = true;
          recurTaskOwnr.length < 2 && recurTaskOwnr?.includes(el.value)
            ? (recurTaskOwnrChckBx.disabled = true)
            : (recurTaskOwnrChckBx.disabled = false);
        } else {
          let recurTaskOwnrChckBx = document.getElementById('recurTaskOwnrChckBx' + elIndx);
          let recurTaskOwnr = this.contacts[this.slctdCntctIndex].RecurTasks?.[el.id.slice(9)]?.Assign;
          recurTaskOwnrChckBx.checked = false;
          recurTaskOwnr.length < 2 && recurTaskOwnr?.includes(el.value)
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
    slctdCntctIndex() {
      this.mode = 2;
    },
  },
};
</script>

<style>
.recur-tasks div:nth-child(odd) {
  background-color: lightblue;
}
.recur-tasks div:nth-child(even) {
  background-color: white;
}
.recur-tasks div:nth-child(odd) select,
.recur-tasks div:nth-child(odd) input,
.recur-tasks div:nth-child(odd) span[contenteditable] {
  background-color: lightblue;
  border: 1px solid gray;
}
.recur-tasks div:nth-child(even) select,
.recur-tasks div:nth-child(even) input,
.recur-tasks div:nth-child(even) span[contenteditable] {
  background-color: white;
  border: 1px solid lightgray;
}
.recur-tasks-title {
  font-weight: bold;
  padding: 5px;
  color: black;
  display: grid;
}
.recur-tasks-title div {
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recur-tasks-title button {
  background-color: transparent;
  border: 0px;
  padding: 0px;
  cursor: pointer;
  color: #417cd9;
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
.recur-tasks-body span[contenteditable] {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
  min-height: 32px;
  display: block; /* not sure if this is needed */
}
.recur-tasks-body span[contenteditable]:empty::before {
  min-height: 32px;
  content: 'Enter task description';
  display: inline-block;
  color: grey;
}
.recur-tasks-body span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
}
.recur-tasks-body span[contenteditable]:focus {
  outline: none;
}
.recur-tasks b {
  cursor: pointer;
}
</style>
