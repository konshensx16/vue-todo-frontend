<template>
  <div v-bind:style="{maxHeight: '96.3vh', height: '100%', backgroundSize: 'cover', backgroundImage: `url(${background})`}">
    <v-container fluid fill-height pl-0 pr-0 pb-0 pt-0>
      <v-layout row align-space-between justify-space-between>
        <v-flex lg3 pr-2>
          <Lists/>
      </v-flex>

        <v-flex lg6 pr-2 pl-2>
            <router-view name="tasks" :key="$route.fullPath"></router-view>
        </v-flex>

        <v-flex lg3 pl-2>
            <OptionsBar/>
        </v-flex>
      </v-layout>
    </v-container>
    <v-footer height="auto" color="indigo">
        <v-layout justify-center>
            <v-flex indigo white--text text-xs-center>
                &copy;2019
                <strong>Overseas Media</strong>
            </v-flex>
        </v-layout>
    </v-footer>
    <Notification/>
  </div>
</template>


<script>
import Lists from "./Lists";
import Tasks from "./Tasks";
import OptionsBar from "./OptionsBar";
import Notification from './Notification'

export default {
  name: "todo",
  components: { Lists, Tasks, OptionsBar, Notification },
  computed: {
    background () {
      return this.$store.getters.LIST_BACKGROUND(
        this.$route.params.id
      );
    }
  }
};
</script>
