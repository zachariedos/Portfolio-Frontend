<template>
  <div class="autoScroll" @click="(scrollplay = !scrollplay), autoScroll()">
    <img v-if="!scrollplay" src="../img/play.png" alt="play" />
    <img v-else src="../img/pause.png" alt="play" />
  </div>
  <h1></h1>
  <div id="title">
    <img src="../img/profile.jpg" alt="Profile picture" class="profile" />
    <h1>Expérience</h1>
    <h1 class="colored">professionnelle</h1>
    <div class="scroll">scroll</div>
  </div>
  <div id="content">
    <div v-for="experience in experiences" class="step">
      <h2>{{ experience.companyName }}</h2>
      <h3>
        {{ JSON.parse(experience.fromto).start }}
        -
        {{ JSON.parse(experience.fromto).end }}
      </h3>
      <p>
        {{ experience.description }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { createNoise2D } from "simplex-noise";
import { gsap } from "gsap";
import { format } from "date-fns";
import { fr } from "date-fns/esm/locale";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
export default {
  name: "Expériences",
  props: {
    msg: String,
  },
  data() {
    return {
      experiences: "",
      experiencesnb: "",
      dateLocales: { fr: fr },
      espacement: 250, // ne pas toucher
      stepgeneratestyle: "",
      scrollplay: false,
      counter: 0,
      timerOn: 0,
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

            this.experiencesnb = Object.keys(this.experiences).length;
            var style = document.createElement("style");
            style.type = "text/css";
            for (var i = 0; i < this.experiencesnb; i++) {
              this.stepgeneratestyle += `.step:nth-child(${i + 1}) { top: ${
                (i + 1) * (this.espacement * 2)
              }px} `;
            }

            style.innerHTML = this.stepgeneratestyle;
            document.getElementsByTagName("head")[0].appendChild(style);
            setTimeout(() => {
              this.showmustGoOn();
            }, 0.001);
          }
        })
        .catch(() => console.log("erreur serveur"));
    },

    autoScroll() {
      if (this.scrollplay) {
        window.scrollBy(0, 2);
        setTimeout(() => {
          this.autoScroll();
        }, 0.1);
      }
    },
    showmustGoOn() {
      const content = document.querySelector("#content");
      const nbexperiences = this.experiencesnb;
      const espacement = this.espacement;

      gsap.registerPlugin(ScrollTrigger);

      const noise2D = createNoise2D();

      // Create circles, step circles and lines
      for (let i = 0; i < nbexperiences * espacement + espacement; i++) {
        // Define it's a step every 250 circles (500px)
        const step = i % espacement === 0 && i !== 0;
        const div = document.createElement("div");

        if (step) {
          div.classList.add("step-circle");
        } else {
          div.classList.add("circle");
        }

        // Create noise coefficients
        const c1 = noise2D(i * 0.003, i * 0.0033);
        const c2 = noise2D(i * 0.002, i * 0.001);

        const style = !step
          ? {
              transform: `translate(${c2 * 50}px) rotate(${
                c2 * 300
              }deg) scale(${3 + c1 * 3}, ${3 + c2 * 2})`,
              boxShadow: `0 0 0 .5px hsla(${Math.floor(
                i * 0.3
              )}, 70%, 70%, .1)`,
            }
          : {
              transform: `translate(${c2 * 50}px)`,
              border: `solid 5px hsla(${Math.floor(i * 0.3)}, 70%, 70%, 1)`,
            };
        Object.assign(div.style, style);
        content.appendChild(div);

        if (step) {
          const div = document.createElement("div");
          div.classList.add("line");
          const style = {
            background: `linear-gradient(90deg, hsla(${Math.floor(
              i * 0.3
            )}, 70%, 70%, 1) 0%, rgb(35, 39, 46) 100%)`,
          };
          Object.assign(div.style, style);
          content.appendChild(div);
        }
      }

      // Create circles animations
      const Circles = document.querySelectorAll(".circle");
      const tl = gsap.timeline({
        scrollTrigger: {
          scrub: 1,
          start: "top top",
          end: "bottom center",
        },
      });
      Circles.forEach((c) => {
        tl.from(c, {
          opacity: 0,
        });
      });

      // Create Step circles animations
      const StepCircles = document.querySelectorAll(".step-circle");
      StepCircles.forEach((step_circle) => {
        gsap.from(step_circle, {
          scrollTrigger: {
            trigger: step_circle,
            start: "top center",
            toggleActions: "restart none none reverse",
          },
          scale: 0,
          ease: "back",
        });
      });

      // Create Line animations
      const Lines = document.querySelectorAll(".line");
      Lines.forEach((line) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: "top center",
            toggleActions: "restart none none reverse",
          },
          width: 0,
        });
      });

      // Create Steps animations
      const Steps = document.querySelectorAll(".step");
      Steps.forEach((step) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top center",
            toggleActions: "restart none none reverse",
          },
          opacity: 0,
        });
      });
    },
  },
  mounted() {
    this.showExperiences();
  },
};

//------------------------------------------------------------------------------------------------
</script>

<style scooped>
::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(26, 29, 35);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
* {
  margin: 0;
  padding: 0;
}
body {
  position: relative;
}

p {
  margin: 10px 0;
}

#content {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 50px;
  line-height: 1em;
}

h2 {
  letter-spacing: -1px;
}

h3 {
  opacity: 0.65;
  font-weight: 500;
}

.profile {
  clip-path: circle(40%);
  height: 50%;
  margin-bottom: 10px;
}

.colored {
  background: rgb(255, 0, 0);
  background: linear-gradient(
    60deg,
    hsla(0, 70%, 70%, 1) 0%,
    hsla(60, 70%, 70%, 1) 20%,
    hsla(120, 70%, 70%, 1) 40%,
    hsla(180, 70%, 70%, 1) 60%,
    hsla(240, 70%, 70%, 1) 80%,
    hsla(300, 70%, 70%, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.circle,
.step-circle {
  width: 15px;
  height: 15px;
  border-radius: 25%;
  margin: -13px 0 0 50px;
}

.step-circle {
  background-color: rgb(35, 39, 46);
  position: relative;
  z-index: 10;
  margin-top: -25px;
}

.line {
  width: 100%;
  height: 2px;
  margin: -2px;
  transform: translateY(-12px);
}

.step {
  width: calc(100% - 160px);
  left: 140px;
  position: absolute;
  padding-top: 10px;
  text-align: left;
}

#title {
  height: 50vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.autoScroll {
  background-color: white;
  position: -webkit-fixed;
  position: fixed;
  width: 50px;
  height: 50px;
  bottom: 30px;
  right: 30px;
  border-radius: 10px;
  z-index: 9999;
  display: flex;
}
.autoScroll:hover {
  cursor: pointer;
}
.autoScroll img {
  width: 30px;
  margin: auto;
}
</style>
