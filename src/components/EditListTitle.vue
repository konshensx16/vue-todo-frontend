<template>
  <div>
    <v-toolbar-title v-on:dblclick="toggleEdit()" v-if="!editing">{{ listTitle }}</v-toolbar-title>
    <v-form @submit.prevent="submit()" v-show="editing">
      <v-text-field
        ref="input"
        v-model="newTitle"
        solo
        flat
        clearable
        required
        @blur.prevent="stopEditing()"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    listTitle: String
  },
  data: () => ({
    editing: false,
    newTitle: ""
  }),
  methods: {
    valid() {
      return this.newTitle != null && this.newTitle.trim() !== "";
    },
    toggleEdit() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    submit() {
      if (!this.valid()) {
        this.newTitle = this.listTitle;
        return false;
      }

      this.$store
        .dispatch("UPDATE_LIST_TITLE", {
          title: this.newTitle,
          listId: this.$route.params.id
        })
        .then(response => {
          this.editing = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    stopEditing() {
      this.editing = false;
    }
  },
  mounted() {
    this.newTitle = this.listTitle;
  }
};
</script>

