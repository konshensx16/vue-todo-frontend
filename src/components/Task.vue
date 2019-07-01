<template>
  <v-list-tile ripple @click.prevent="toggle(index)">
    <v-list-tile-action>
      <v-btn icon @click.stop="openModal()">
        <v-icon color="pink">edit</v-icon>
      </v-btn>
    </v-list-tile-action>

    <v-list-tile-content>
      <v-list-tile-title>{{ task.title }}</v-list-tile-title>
      <v-list-tile-sub-title>This task contains {{ NOTES_COUNT }} notes</v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action-text></v-list-tile-action-text>
    <v-icon v-if="!task.isComplete" color="grey">check_circle</v-icon>

    <v-icon v-else color="green">check_circle</v-icon>
  </v-list-tile>
</template>


<script>
export default {
  name: "task",
  props: {
    task: Object,
    index: Number
  },
  data: () => ({
    selected: [2]
  }),
  computed: {
    NOTES_COUNT() {
      return this.task.notes.length;
    }
  },
  methods: {
    toggle(index) {
      this.$store.dispatch("TOGGLE_TASK", {
        taskId: this.task.id,
        listId: this.$route.params.id
      });
      // TODO: push the changes to the store.
    },
    openModal() {
      this.$router.push({
        name: "notes",
        params: { taskId: this.task.id }
      });
    }
  }
};
</script>
