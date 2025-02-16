<template>
  <div class="bodypage">
    <h1>Experiences</h1>
    <div id="experiences">
      <div
        v-for="(experience, index) in experiences"
        class="card"
        v-bind:id="`experience${index}`"
        v-bind:companyName="`${experience.companyName}`"
      >
        <div class="container">
          {{ experience.companyName }}<br />
          {{ experience.description }}<br />
          {{ JSON.parse(experience.fromto).start }} -
          {{ JSON.parse(experience.fromto).end }} <br />
        </div>
        <div class="btn">
          <img class="moove" @click="goUp($event)" src="../../img/top.png" />
          <img
            class="moove"
            @click="goDown($event)"
            src="../../img/bottom.png"
          />
        </div>
        <p @click="deleteExperiences()" class="deleteButton">X</p>
      </div>
    </div>
    <div class="AddXp">
      <p>Ajout d'experience</p>

      <div class="AddXpDateXTexte">
        <button
          id="todayBtn"
          v-bind:color="todaybtn"
          @click="todaybtn = !todaybtn"
        >
          Jusqu'à aujourd'hui
        </button>
        <DatePicker
          id="AddXpDate"
          v-model="picked"
          is-dark
          is-range
          :value="null"
          color="red"
        />
        <textarea
          v-model="addXpDescValue"
          id="AddXpDesc"
          class="InputAdd"
          placeholder="Description de l'experience"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div class="AddXpInput">
        <input
          v-model="addXpTitleValue"
          id="AddXpTitle"
          class="InputAdd"
          type="text"
          placeholder="Titre de l'experience"
        />
        <p class="plusxp" @click="addExperience()">+</p>
      </div>
    </div>
  </div>
</template>
<style scooped></style>
<script>
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/esm/locale";

export default {
  name: "Experiences",
  props: {
    msg: String,
  },
  data() {
    return {
      experiences: "",
      clickedExperience: "",
      picked: "",
      dateLocales: { fr: fr },
      todaybtn: false,
      addXpTitleValue: "",
      addXpDescValue: "",
    };
  },
  methods: {
    async showExperiences() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/`)
        .then((resp) => {
          if (resp.data) {
            this.experiences = resp.data;
            this.experiences.forEach((experience) => {
              let newstart = format(
                new Date(JSON.parse(experience.fromto).start),
                "dd MMMM yyyy",
                { locale: fr }
              );
              let newend =
                JSON.parse(experience.fromto).end != "today"
                  ? format(
                      new Date(JSON.parse(experience.fromto).end),
                      "dd MMMM yyyy",
                      { locale: fr }
                    )
                  : "Jusqu'à aujourd'hui";
              experience.fromto = `{"start": "${newstart}", "end": "${newend}"}`;
            });
          }
        })
        .catch(() => {
          console.log("erreur serveur");
        });
    },
    async updateExperiencesIndex() {
      await this.experiences.forEach((experience) => {
        experience.newIndex = document
          .querySelector(`[companyname="${experience.companyName}"]`)
          .id.replace("experience", "");
        axios
          .put(`${process.env.VUE_APP_API_URL}/modifyExperienceIndex`, experience, {})
          .then((resp) => {});
      });
    },
    async deleteExperiences() {
      await this.experiences.forEach((experience) => {
        if (
          experience.companyName ==
          event.target.parentNode.getAttribute("companyname")
        ) {
          axios
            .post(`${process.env.VUE_APP_API_URL}/deleteExperience`, experience, {})
            .then((resp) => {
              this.showExperiences();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    goUp(event) {
      this.clickedExperience = event.target.parentNode.parentNode.id.replace(
        "experience",
        ""
      );
      const currentelem = document.getElementById(
        `experience${this.clickedExperience}`
      );
      const beforeelem = document.getElementById(
        `experience${this.clickedExperience - 1}`
      );
      if (beforeelem != null) {
        currentelem.after(beforeelem);
        const transfereid = [currentelem.id, beforeelem.id];
        currentelem.id = transfereid[1];
        beforeelem.id = transfereid[0];
      }
      this.updateExperiencesIndex();
    },
    goDown(event) {
      this.clickedExperience = event.target.parentNode.parentNode.id.replace(
        "experience",
        ""
      );
      const currentelem = document.getElementById(
        `experience${this.clickedExperience}`
      );
      const afterelem = document.getElementById(
        `experience${parseFloat(this.clickedExperience) + 1}`
      );
      if (afterelem != null) {
        currentelem.before(afterelem);
        const transfereid = [currentelem.id, afterelem.id];
        currentelem.id = transfereid[1];
        afterelem.id = transfereid[0];
      }
      this.updateExperiencesIndex();
    },
    addExperience() {
      let experience = "";
      const experienceTitle = this.addXpTitleValue;
      const experienceDate = this.picked;
      const experienceDesc = this.addXpDescValue;
      this.todaybtn && experienceDate ? (experienceDate.end = "today") : "";

      experience = JSON.stringify({
        companyName: experienceTitle,
        description: experienceDesc,
        fromto: experienceDate,
      });

      axios
        .post(`${process.env.VUE_APP_API_URL}/addExperience`, JSON.parse(experience), {})
        .then((resp) => {
          this.showExperiences();
        });
    },
  },
  components: {},
  mounted() {
    this.showExperiences();
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
.experiences {
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

.plusxp {
  color: rgb(0, 181, 0);
  font-size: 30px;
  margin-left: 10px;
}

.AddXp {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.AddXpDateXTexte {
  flex-direction: row;
  display: flex;
}
.AddXpInput {
  flex-direction: row;
  display: flex;
}

.plusxp:hover {
  cursor: pointer;
}

#todayBtn {
  border: none;
  height: 50px;
  width: 200px;
  border-radius: 2px;
  margin: 5px;
}
#todayBtn[color="false"] {
  background-color: #b84545;
}

#todayBtn[color="true"] {
  background-color: #5cae5c;
}
</style>
