<template>
  <v-layout row justify-center>
    <v-dialog v-model="open" scrollable max-width="60%">
      <v-card>
        <v-card-title>
          <span class="headline">{{ TASK_TITLE }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent="addNote()">
              <v-textarea
                outline
                v-model="note"
                label="Note"
                placeholder="Star writing your note here"
              ></v-textarea>

              <v-btn color="success" type="submit">Save</v-btn>
            </v-form>
          </v-container>

          <v-list three-line subheader>
            <v-subheader>Notes</v-subheader>
            <v-list-tile v-for="(note, key) in NOTES" v-bind:key="key">
              <v-list-tile-content>
                <v-list-tile-title>{{ note.note }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon @click.prevent="deleteNote(note.id)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn flat color="primary" @click="open = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="red" dark @click="deleteTask()">Remove Task</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
export default {
  name: "notesModal",
  data: () => ({
    note: "",
    open: true
  }),
  computed: {
    NOTES() {
      return this.$store.getters.NOTES(
        this.$route.params.id,
        this.$route.params.taskId
      );
    },
    TASK_TITLE() {
      return this.$store.getters.TASK_TITLE(
        this.$route.params.id,
        this.$route.params.taskId
      );
    }
  },
  methods: {
    addNote() {
      this.$store
        .dispatch("POST_NOTE", {
          note: this.note,
          taskId: this.$route.params.taskId,
          listId: this.$route.params.id
        })
        .then(response => {
          this.note = "";
        })
        .catch(error => {
          this.$store.commit("SET_NOTIFICATION", {
            dispay: true,
            text: "Something went wrong",
            alertClass: "error"
          });
        });
    },
    deleteNote(noteId) {
      this.$store
        .dispatch("DELETE_NOTE", {
          noteId,
          taskId: this.$route.params.taskId,
          listId: this.$route.params.id
        })
        .then(response => {
          this.$store.commit("SET_NOTIFICATION", {
            display: true,
            text: "Note has been removed",
            alertClass: "success"
          });
        })
        .catch(error => {
          this.$store.commit("SET_NOTIFICATION", {
            display: true,
            text: "Something bad happened",
            alertClass: "error"
          });
        });
    },
    deleteTask() {
      this.$store
        .dispatch("DELETE_TASK", {
          taskId: this.$route.params.taskId,
          listId: this.$route.params.id
        })
        .then((status) => {
          if (status === 204) {
            this.$store.commit("SET_NOTIFICATION", {
              display: true,
              text: "Task has been removed",
              alertClass: "success"
            });
            this.open = false;
          }
        })
        .catch(error => {
          this.$store.commit("SET_NOTIFICATION", {
            display: true,
            text: "Something bad happened",
            alertClass: "error"
          });
        });
    }
  },
  mounted() {
    this.$store.dispatch("GET_NOTES", {
      listId: this.$route.params.id,
      taskId: this.$route.params.taskId
    });
  },
  watch: {
    open: function(value) {
      if (value === false) {
        this.$router.push({
          name: "tasks",
          params: {
            id: this.$route.params.id
          }
        });
      }
    }
  }
};
</script>
