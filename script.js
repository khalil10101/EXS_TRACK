/* =====================================================
   1) EDIT HERE: your 5 modules
   -----------------------------------------------------
   name : the module name shown on the square
   td   : number of TD series (0 to 6)
   tp   : number of TP series (0 to 6)
   ===================================================== */
const MODULES = [
  { name: "Java", td: 3, tp: 4  },
  { name: "Compilation", td: 1, tp: 2  },  
  { name: "Base de Donne", td: 4, tp: 4 },  
  { name: "I.A", td: 1 , tp:  2 },  
  { name: "reseau", td: 1 , tp: 2 },  
];

const MAX_ITEMS = 7;
const STORE_KEY = "modules-progress";
const THEME_KEY = "modules-theme";

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

let progress = load(STORE_KEY, {}); 

const clamp = n => Math.max(0, Math.min(MAX_ITEMS, Number(n) || 0));
const keyOf = (mod, type, n) => `${mod.name}|${type}|${n}`;

function render() {
  const root = document.getElementById("modules");
  root.innerHTML = "";

  MODULES.forEach(mod => {
    const counts = { TD: clamp(mod.td), TP: clamp(mod.tp) };
    const total = counts.TD + counts.TP;
    let done = 0;

    const card = document.createElement("section");
    card.className = "module";

    const head = document.createElement("div");
    head.className = "module-head";
    const title = document.createElement("h2");
    title.textContent = mod.name;
    const info = document.createElement("p");
    info.className = "progress";
    head.append(title, info);
    card.append(head);

    ["TD", "TP"].forEach(type => {
      const section = document.createElement("div");
      section.className = "section";
      const h = document.createElement("h3");
      h.textContent = type;
      section.append(h);

      if (counts[type] === 0) {
        const p = document.createElement("p");
        p.className = "empty";
        p.textContent = `No ${type} yet`;
        section.append(p);
      } else {
        const grid = document.createElement("div");
        grid.className = "items";
        for (let i = 1; i <= counts[type]; i++) {
          const k = keyOf(mod, type, i);
          const isDone = !!progress[k];
          if (isDone) done++;

          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "item" + (isDone ? " done" : "");
          btn.textContent = `${type}${i}`;
          btn.setAttribute("aria-pressed", isDone);
          btn.addEventListener("click", () => {
            if (progress[k]) delete progress[k]; else progress[k] = true;
            save(STORE_KEY, progress);
            render();
          });
          grid.append(btn);
        }
        section.append(grid);
      }
      card.append(section);
    });

    info.textContent = total ? `${done}/${total} done` : "Add your TD and TP in script.js";
    if (total && done === total) card.classList.add("complete");
    root.append(card);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById("theme-toggle").setAttribute("aria-checked", theme === "dark");
}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let theme = load(THEME_KEY, prefersDark ? "dark" : "light");
applyTheme(theme);
document.getElementById("theme-toggle").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  save(THEME_KEY, theme);
  applyTheme(theme);
});

render();