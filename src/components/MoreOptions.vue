<template>
  <v-layout>
    <v-navigation-drawer v-model="open" absolute right>
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User avatar">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Overseas Media</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>

      <v-form>
        <v-container fluid>
          <v-flex xs12>
            <img :src="imageUrl" height="150px" alt>

            <v-text-field
              label="Select an image"
              v-model="imageName"
              prepend-icon="attach_file"
              @click="pickFile"
            ></v-text-field>

            <input
              type="file"
              style="display: none"
              ref="image"
              accept="image/*"
              @change="onFilePicked"
            >
          </v-flex>

          <v-btn :loading="loading" :disabled="!imageFile" @click="uploadFile()">
            Set as background
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-container>
      </v-form>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
export default {
  name: "moreOptions",
  data: () => ({
    loading: false,
    imageName: "",
    imageUrl: "",
    imageFile: ""
  }),
  computed: {
    open: {
      get() {
        return this.$store.getters.DRAWER;
      },
      set(value) {
        this.$store.commit("SET_DRAWER", value);
      }
    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;

      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }

        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0];
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    uploadFile() {
      this.loading = true;
      this.$store.dispatch("UPLOAD_BACKGROUND", {
        listId: this.$route.params.id,
        file: this.imageFile
      })
      .then(response => {
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      }) 
    }
  }
};
</script>
