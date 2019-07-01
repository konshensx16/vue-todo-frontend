<template>
  <div style="height: 100%;">
    <v-card style="height: 100%; overflow: hidden">
      <v-toolbar color="blue" dark>
        <EditListTitle :listTitle="listTitle"/>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>search</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list two-line style="height: calc(100% - 128px); overflow-y: scroll">
        <template v-for="(task, key) in TASKS">
          <Task v-bind:key="key" :task="task" :index="key"/>
        </template>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout>
          <v-flex>
            <NewTask/>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
    <router-view :key="$route.fullPath" name="notes"></router-view>
  </div>
</template>


<script>
import Task from "./Task";
import NewTask from "./NewTask";
import NotesModal from "./NotesModal";
import EditListTitle from './EditListTitle'
export default {
  name: "tasks",
  components: { Task, NewTask, NotesModal, EditListTitle },
  data: () => ({
    
  }),
  computed: {
    listTitle () {
      return this.$store.getters.LIST_TITLE(this.$route.params.id);
    },
    TASKS () {
      return this.$store.getters.TASKS(this.$route.params.id);
    }
  },
  async mounted () {
    await this.$store.dispatch("GET_TASKS", this.$route.params.id);
  }
};
</script>
