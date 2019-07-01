<template>
  <v-container pt-0 pr-0 pb-0 pl-0>
    <v-form ref="form" @submit.prevent="submit()">
      <v-text-field
        @blur="closeForm()"
        append-icon="add"
        solo
        ref="input"
        v-model="title"
        placeholder="Title"
        :rules="[rules.required]"
      ></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    title: "",
    rules: {
      required: value => !!value || "Required"
    }
  }),
  methods: {
    submit() {
      this.$store
        .dispatch("POST_LIST", {
          title: this.title
        })
        .then(response => {
          this.$store.commit("SET_NOTIFICATION", {
            display: true,
            text: "List has been created!",
            alerrClass: "success"
          });
          this.title = '';
          this.$router.push({
            name: 'tasks',
            params: {
              id: response.data.id
            }
          })

          this.$store.commit("SET_NEW_LIST_FORM", false);
        });
    },
    closeForm() {
      this.$store.commit("SET_NEW_LIST_FORM", false);
    }
  },
  mounted() {
    this.$refs.input.focus();
  }
};
</script>
