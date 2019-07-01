<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
// import Login from './components/Auth/Login'
// import Signup from './components/Auth/Signup'
import Todo from './components/Todo'

export default {
  name: 'app',
  components: {
    Todo
  }
}
</script>