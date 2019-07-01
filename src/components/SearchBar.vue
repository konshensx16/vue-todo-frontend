<template>
  <input
    type="text"
    placeholder="Search..."
    v-model.trim="input"
    v-on:input="search()"
    ref="input"
    @blur="closeSearchBar()"
    style="width: 100%"
  >
</template>

<script>
export default {
  // name: " listSearch",
  data: () => ({
    input: ""
  }),
  methods: {
    search() {
      this.$store.dispatch("UPDATE_CURATED_LIST", this.input);
      this.$store.commit("SET_LIST_SEARCH", this.input);
    },
    closeSearchBar() {
      this.$store.commit("SET_DISPLAY_SEARCH_LIST", false);
    }
  }
};
</script>