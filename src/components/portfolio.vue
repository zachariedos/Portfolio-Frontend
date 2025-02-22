<template>
  <div id="title">
    <img src="../img/profile.jpg" alt="Profile picture" class="profile" />
    <h1 class="colored">Portfolio</h1>
    <div class="scroll">scroll</div>
  </div>
  <div id="content">
    <div v-for="site in sites" class="step">
      <h2>
        <a v-bind:href="site.link" target="_blank">{{ site.siteName }}</a>
      </h2>
      <p>
        {{ site.description }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { createNoise2D } from "simplex-noise";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

export default {
  name: "Portfolio",
  props: {
    msg: String,
  },
  data() {
    return {
      sites: "",
      sitesnb: "",
      espacement: 250, // ne pas toucher
      stepgeneratestyle: "",
    };
  },
  methods: {
    async showSites() {
      axios
          .get(`${process.env.VUE_APP_API_URL}/portfolio`)
          .then((resp) => {
            if (resp.data) {
              this.sites = resp.data;
              this.sitesnb = Object.keys(this.sites).length;
              var style = document.createElement("style");
              style.type = "text/css";
              for (var i = 0; i < this.sitesnb; i++) {
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

    showmustGoOn() {
      const content = document.querySelector("#content");
      const nbsites = this.sitesnb;
      const espacement = this.espacement;

      gsap.registerPlugin(ScrollTrigger);

      const noise2D = createNoise2D();

      // Create circles, step circles and lines
      for (let i = 0; i < nbsites * espacement + espacement; i++) {
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
    this.showSites();
  },
};
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
h2 a {
  color: unset;
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
</style>