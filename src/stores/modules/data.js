import Vue from "vue";
import axios from "axios";
import _ from "lodash";

export default {
  state: {
    lists: [],
    curatedLists: []
  },
  getters: {
    LISTS: state => {
      return state.lists;
    },
    CURATED_LISTS: (state, getters, rootState) => {
      if (!state.curatedLists.length && rootState.search.listSearch === "") {
        return state.lists;
      } else if (
        state.curatedLists.length &&
        rootState.search.listSearch !== ""
      ) {
        return state.curatedLists;
      } else if (rootState.search.listSearch === "") {
        return state.curatedLists;
      }
    },
    TASKS_COUNT: state => index => {
      if (index) {
        return state.lists.find(list => list.id === index).tasks.length;
      }
    },
    LIST_TITLE: state => index => {
      if (index) {
        return state.lists.find(list => list.id === index).title;
      }
    },
    TASKS: state => index => {
      if (index) {
        return state.lists.find(list => list.id === index).curatedTasks;
      }
    },
    TASK_TITLE: state => (listId, taskId) => {
      if (listId && taskId) {
        return state.lists
          .find(list => list.id === listId)
          .tasks.find(task => task.id === taskId).title;
      }
    },
    NOTES: state => (listId, taskId) => {
      return state.lists
        .find(list => list.id === listId)
        .tasks.find(task => task.id === taskId).notes;
    },
    LIST_BACKGROUND: state => index => {
      if (index) {
        return state.lists.find(list => list.id === index).backgroundPath;
      }
    }
  },
  mutations: {
    SET_LISTS: (state, payload) => {
      state.lists = payload;
    },
    ADD_LIST: (state, payload) => {
      state.lists.unshift(payload);
    },
    SET_TASKS: (state, { data, listId }) => {
      Vue.set(
        state.lists.find(list => list.id === listId),
        "curatedTasks",
        data
      );
      state.lists.find(list => list.id === listId).tasks = data;
    },
    ADD_TASK: (state, { data, listId }) => {
      state.lists.find(list => list.id === listId).tasks.push(data);
    },
    SET_TASK_STATUS: (state, { data, taskId, listId }) => {
      state.lists
        .find(list => list.id === listId)
        .tasks.find(task => task.id === taskId).isComplete = data;
    },
    SET_NOTES: (state, { data, listId, taskId }) => {
      state.lists
        .find(list => list.id === listId)
        .tasks.find(task => task.id === taskId).notes = data;
    },
    ADD_NOTE: (state, { data, listId, taskId }) => {
      state.lists
        .find(list => list.id === listId)
        .tasks.find(task => task.id === taskId)
        .notes.push(data);
    },
    REMOVE_NOTE: (state, { noteId, listId, taskId }) => {
      let notes = state.lists
        .find(list => list.id === listId)
        .tasks.find(task => task.id === taskId).notes;

      let rs = notes.filter(currentNote => {
        return currentNote.id !== noteId;
      });

      state.lists
        .find(list => list.id === listId)
        .tasks.find(task => task.id === taskId).notes = [...rs];
    },
    REMOVE_TASK: (state, { listId, taskId }) => {
      let tasks = state.lists.find(list => list.id === listId).tasks;

      let rs = tasks.filter(currentTask => {
        return currentTask.id !== taskId;
      });
      state.lists.find(list => list.id === listId).tasks = [...rs];
    },
    UPDATE_TASK_TITLE: (state, { title, listId }) => {
      if (listId && title) {
        state.lists.find(list => list.id === listId).title = title;
      }
    },
    REMOVE_LIST: (state, listId) => {
      let rs = state.lists.filter(currentList => {
        return currentList.id !== listId;
      });

      state.lists = [...rs];
    },
    SET_BACKGROUND: (state, { listId, url }) => {
      state.lists.find(list => list.id === listId).backgroundPath = url;
    },
    SET_CURATED_LIST: (state, payload) => {
      state.curatedLists = payload;
    },
    SET_LIST_SORT_VALUE: (state, { value, listId }) => {
      state.lists.find(
        list => list.id === listId
      ).preferences.sortValue = value;
    },
    SET_LIST_FILTER_VALUE: (state, { value, listId }) => {
      state.lists.find(
        list => list.id === listId
      ).preferences.filterValue = value;
    },
    SORT_LIST_BY: (state, { value, listId }) => {
      let tasks = state.lists.find(list => list.id === listId).tasks;
      let rs = [];
      switch (value) {
        case "name":
          rs = _.sortBy(tasks, task => {
            return task.title;
          });
          break;
        case "date":
          rs = _.sortBy(tasks, task => {
            return task.createdAt;
          });
          break;
      }
      state.lists.find(list => list.id === listId).curatedTasks = [...rs];
    },
    FILTER_LIST_BY: (state, { filter_query, listId }) => {
      let tasks = state.lists.find(list => list.id === listId).tasks;
      let rs = [];
      switch (filter_query) {
        case "remaining":
          rs = tasks.filter(task => {
            return !task.isComplete;
          });
          break;
        case "completed":
          rs = tasks.filter(task => {
            return task.isComplete;
          });
          break;
        case "all":
          rs = tasks;
          break;
      }
      state.lists.find(list => list.id === listId).curatedTasks = [...rs];
    }
  },
  actions: {
    GET_LISTS: async ({ commit }) => {
      let { data } = await axios.get(`lists`);
      commit("SET_LISTS", data);
    },
    POST_LIST: ({ commit }, payload) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`lists`, payload)
          .then(({ data, status }) => {
            commit("ADD_LIST", data);
            if (status === 200 || status === 201) {
              resolve({ data, status });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GET_TASKS: async ({ commit, state }, payload) => {
      let { data } = await axios.get(`lists/${payload}/tasks`);
      commit("SET_TASKS", {
        data,
        listId: payload
      });

      let preferences = state.lists.find(list => list.id === payload)
        .preferences;
      commit("SORT_LIST_BY", { value: preferences.sortValue, listId: payload });
      commit("FILTER_LIST_BY", {
        filter_query: preferences.filterValue,
        listId: payload
      });
    },
    POST_TASK: async ({ commit }, { listId, taskTitle }) => {
      let { data } = await axios.post(`/lists/${listId}/tasks`, {
        title: taskTitle
      });
      commit("ADD_TASK", {
        data,
        listId
      });
    },
    TOGGLE_TASK: async ({ commit }, { taskId, listId }) => {
      let { data } = await axios.patch(`tasks/${taskId}/status`);
      commit("SET_TASK_STATUS", {
        data,
        taskId,
        listId
      });
    },
    GET_NOTES: async ({ commit }, { listId, taskId }) => {
      let { data } = await axios.get(`tasks/${taskId}/notes`);
      commit("SET_NOTES", {
        data,
        listId,
        taskId
      });
    },
    POST_NOTE: ({ commit }, { note, listId, taskId }) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`tasks/${taskId}/notes`, {
            note
          })
          .then(({ data }) => {
            commit("ADD_NOTE", {
              data,
              listId,
              taskId
            });
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    DELETE_NOTE: ({ commit }, { noteId, listId, taskId }) => {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/notes/${noteId}`)
          .then(({ status }) => {
            if (status === 204) {
              commit("REMOVE_NOTE", {
                noteId,
                listId,
                taskId
              });
              resolve(status);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    DELETE_TASK: ({ commit }, { listId, taskId }) => {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/tasks/${taskId}`)
          .then(({ status }) => {
            if (status === 204) {
              commit("REMOVE_TASK", { listId, taskId });
              resolve(status);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    UPDATE_LIST_TITLE: ({ commit }, { title, listId }) => {
      return new Promise(async (resolve, reject) => {
        let { data, status } = await axios.patch(`lists/${listId}/title`, {
          title
        });
        if (status === 204 || status === 200) {
          commit("UPDATE_TASK_TITLE", {
            listId,
            title
          });
          resolve({ data, status });
        } else {
          reject({ data, status });
        }
      });
    },
    DELETE_LIST: ({ commit }, { listId }) => {
      return new Promise((resolve, reject) => {
        axios
          .delete(`lists/${listId}`)
          .then(({ status }) => {
            if (status === 204 || status === 200) {
              commit("REMOVE_LIST", listId);
              resolve(status);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    UPDATE_CURATED_LIST: ({ commit, state }, input) => {
      let rs = state.lists.filter(list => {
        return list.title.toLowerCase().includes(input);
      });
      commit("SET_CURATED_LIST", rs);
    }
  }
};
