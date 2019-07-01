<template>
  <div v-if="show">
    <v-card height="100%">
      <v-toolbar color="pink" dark>
        <v-toolbar-title>Options</v-toolbar-title>
      </v-toolbar>

      <v-list>
        <v-list-group
          v-for="(item, key) in items"
          v-bind:key="key"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-for="(subItem, key) in item.items"
            v-bind:key="key"
            v-on="item.action === 'sort' ? { click: () => sort(subItem.by) } : { click: () => filter(subItem.by) }"
            active-class
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>

        <v-list-group prepend-icon="filter" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>List options</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="removeList()">
            <v-list-tile-content>
              <v-list-tile-title class="danger">Remove list</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click.prevent="openDrawer()">
            <v-list-tile-content>
              <v-list-tile-title class="danger">Change background</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-card>
    <MoreOptions/>
  </div>
</template>


<script>
import MoreOptions from "./MoreOptions";

export default {
  name: "optionsBar",
  components: { MoreOptions },
  data: () => ({
    items: [
      {
        action: "sort",
        title: "Sort by",
        active: true,
        items: [
          {
            title: "Date",
            by: "date"
          },
          {
            title: "Name",
            by: "name"
          }
        ]
      },
      {
        action: "filter_list",
        title: "Filter by",
        active: false,
        items: [
          {
            title: "Remaining",
            by: "remaining"
          },
          {
            title: "Completed",
            by: "completed"
          },
          {
            title: "All",
            by: "all"
          }
        ]
      }
    ]
  }),
  computed: {
    show() {
      return !!this.$route.params.id;
    },
    drawer() {
      return this.$store.getters.DRAWER;
    }
  },
  methods: {
    sort(value) {
      this.$store.dispatch("SORT_BY", { value, listId: this.$route.params.id });
    },
    filter(value) {
      this.$store.dispatch("FILTER_BY", { value, listId: this.$route.params.id });
    },
    openDrawer() {
      this.$store.commit("SET_DRAWER", true);
    },
    removeList() {
      this.$store
        .dispatch("DELETE_LIST", {
          listId: this.$route.params.id
        })
        .then(response => {
          this.$store.commit("SET_NOTIFICATION", {
            display: true,
            text: "List has been removed",
            alertClass: "success"
          });
          this.$router.push({ name: "todo" });
        })
        .catch(error => {
          consoe.log(error);
        });
    }
  }
};
</script>
