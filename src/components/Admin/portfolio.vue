<template>
  <div class="bodypage">
    <h1>Site</h1>
    <div id="sites">
      <div
        v-for="(site, index) in sites"
        class="card"
        v-bind:id="`site${index}`"
        v-bind:siteName="`${site.siteName}`"
      >
        <div class="container">
          {{ site.siteName }}<br />
          {{ site.description }}<br />
          {{ site.link }}<br />
        </div>
        <div class="btn">
          <img class="moove" @click="goUp($event)" src="../../img/top.png" />
          <img
            class="moove"
            @click="goDown($event)"
            src="../../img/bottom.png"
          />
        </div>
        <p @click="deleteSites()" class="deleteButton">X</p>
      </div>
    </div>
    <div class="AddSt">
      <p>Ajout d'un site</p>
      <div class="AddStTexte">
        <textarea
          v-model="addStDescValue"
          id="AddStDesc"
          class="InputAdd"
          placeholder="Description du site"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div class="AddStInput">
        <input
          v-model="addStTitleValue"
          id="AddStTitle"
          class="InputAdd"
          type="text"
          placeholder="Titre du site"
        />
        <input
          v-model="addStLinkValue"
          id="addStLink"
          class="InputAdd"
          type="text"
          placeholder="Lien du site"
        />
        <p class="plusst" @click="addSite()">+</p>
      </div>
    </div>
  </div>
</template>
<style scooped></style>
<script>
import axios from "axios";
export default {
  name: "Sites",
  data() {
    return {
      sites: "",
      clickedSite: "",
      addStTitleValue: "",
      addStDescValue: "",
      addStLinkValue: "",
    };
  },
  methods: {
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
    },
    async showSites() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/portfolio`)
        .then((resp) => {
          if (resp.data) {
            this.sites = resp.data;
          }
        })
        .catch(() => {
          console.log("erreur serveur");
        });
    },
    async updateSitesIndex() {
      await this.sites.forEach((site) => {
        site.newIndex = document
          .querySelector(`[sitename="${site.siteName}"]`)
          .id.replace("site", "");
        axios
          .put(`${process.env.VUE_APP_API_URL}/portfolio/modifySiteIndex`, site, {})
          .then((resp) => {});
      });
    },
    async deleteSites() {
      await this.sites.forEach((site) => {
        if (site.siteName == event.target.parentNode.getAttribute("siteName")) {
          axios
            .post(`${process.env.VUE_APP_API_URL}/portfolio/deleteSite`, site, {})
            .then((resp) => {
              this.showSites();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    goUp(event) {
      this.clickedSite = event.target.parentNode.parentNode.id.replace(
        "site",
        ""
      );
      const currentelem = document.getElementById(`site${this.clickedSite}`);
      const beforeelem = document.getElementById(`site${this.clickedSite - 1}`);
      if (beforeelem != null) {
        currentelem.after(beforeelem);
        const transfereid = [currentelem.id, beforeelem.id];
        currentelem.id = transfereid[1];
        beforeelem.id = transfereid[0];
      }
      this.updateSitesIndex();
    },
    goDown(event) {
      this.clickedSite = event.target.parentNode.parentNode.id.replace(
        "site",
        ""
      );
      const currentelem = document.getElementById(`site${this.clickedSite}`);
      const afterelem = document.getElementById(
        `site${parseFloat(this.clickedSite) + 1}`
      );
      if (afterelem != null) {
        currentelem.before(afterelem);
        const transfereid = [currentelem.id, afterelem.id];
        currentelem.id = transfereid[1];
        afterelem.id = transfereid[0];
      }
      this.updateSitesIndex();
    },
    addSite() {
      let site = JSON.stringify({
        siteName: this.addStTitleValue,
        description: this.addStDescValue,
        link: this.addStLinkValue,
      });
      axios
        .post(`${process.env.VUE_APP_API_URL}/portfolio/addSite`, JSON.parse(site), {})
        .then(() => {
          this.showSites();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: {},
  mounted() {
    this.showSites();
  },
};
</script>
<style>
img.moove {
  width: 40px;
  filter: grayscale(1) invert(1);
}
img.moove:hover {
  cursor: pointer;
}
div.bodypage {
  padding: 20px;
}
.card {
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-top: 20px;
  width: 33%;
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  min-width: 200px;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.473);
}

/* Add some padding inside the card container */
.container {
  flex: 80%;
  padding: 2px 16px;
}
.sites {
  justify-content: center;
}
.deleteButton {
  color: red;
  font-size: 20;
  font-weight: bold;
}

.deleteButton:hover {
  cursor: pointer;
}

.InputAdd {
  background-color: #ffffff1c;
  border-radius: 5px;
  border: 2px solid white;
  font-size: 18px;
  color: white;
  margin: 10px;
}

.plusst {
  color: rgb(0, 181, 0);
  font-size: 30px;
  margin-left: 10px;
}

.AddSt {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.AddStTexte {
  flex-direction: row;
  display: flex;
}
.AddStInput {
  flex-direction: row;
  display: flex;
}

.plusst:hover {
  cursor: pointer;
}
</style>
