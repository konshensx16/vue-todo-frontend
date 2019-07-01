<template>
  <v-navigation-drawer permanent style="width: 100%; overflow: hidden">
    <v-toolbar color="blue" dark>
      <v-toolbar-title v-if="!DISPLAY_SEARCH_LIST">Your lists</v-toolbar-title>
        <SearchBar v-if="DISPLAY_SEARCH_LIST"/>
      <v-spacer></v-spacer>
      <v-btn icon @click.prevent="toggleSearchList()">
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list>
      <v-list-tile color="blue" @click.prevent="openNewListForm()" v-if="!isOpen">
        <v-list-tile-content>
          <v-list-tile-title>Create a new list</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-list-tile-title>
            <v-icon>add</v-icon>
          </v-list-tile-title>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile v-if="openNewListFormValue">
          <NewList/>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list style="height: calc(100% - 128px); overflow-y: scroll">
      <v-list-tile
        :to="{ name: 'tasks', params: { id: list.id} }"
        v-for="(list, key) in CURATED_LISTS"
        v-bind:key="key"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{ list.title }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-title>{{ TASKS_COUNT(list.id) }}</v-list-tile-title>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import SearchBar from "./SearchBar";
import NewList from './NewList';
import {mapGetters} from 'vuex';

export default {
  name: "lists",
  components: { SearchBar, NewList },
  data: () => ({}),
  computed: {
      ...mapGetters(['DISPLAY_SEARCH_LIST', 'CURATED_LISTS']),
      openNewListFormValue: {
          get () {
              return this.$store.getters.NEW_LIST_FORM;
          }, 
          set (value) {
              this.$store.commit("SET_NEW_LIST_FORM", value);
          }
      },
      isOpen() {
          return this.$store.getters.NEW_LIST_FORM;
      }
  },
  methods: {
      toggleSearchList () {
          this.$store.commit("SET_DISPLAY_SEARCH_LIST", !this.DISPLAY_SEARCH_LIST);
      },
      openNewListForm() {
          this.$store.commit("SET_NEW_LIST_FORM", true);
      },
      TASKS_COUNT(index) {
        return this.$store.getters.TASKS_COUNT(index);
      }
  },
   mounted () {
     this.$store.dispatch("GET_LISTS");
   }
};
</script>
