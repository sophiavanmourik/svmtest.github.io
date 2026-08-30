const nodes = [...document.querySelectorAll(".node")];
const bonds = [...document.querySelectorAll(".bonds path")];
const card = document.querySelector("#node-card");
const filters = [...document.querySelectorAll(".filter")];
let selected = null;

function connectedIds(id) {
  const ids = new Set([id]);
  bonds.forEach((bond) => {
    if (bond.dataset.from === id) ids.add(bond.dataset.to);
    if (bond.dataset.to === id) ids.add(bond.dataset.from);
  });
  return ids;
}

function activate(node) {
  const linked = connectedIds(node.id);
  nodes.forEach((item) => item.classList.toggle("muted", !linked.has(item.id)));
  bonds.forEach((bond) => {
    const active = bond.dataset.from === node.id || bond.dataset.to === node.id;
    bond.classList.toggle("active", active);
    bond.classList.toggle("muted", !active);
  });
  if (card) {
    card.innerHTML = `<p class="card-kicker">${node.dataset.category.replaceAll(" ", " / ")}</p><h2>${node.dataset.title}</h2><p>${node.dataset.text}</p>`;
  }
}

function reset() {
  if (selected) return;
  nodes.forEach((node) => node.classList.remove("muted"));
  bonds.forEach((bond) => bond.classList.remove("active", "muted"));
}

nodes.forEach((node) => {
  node.addEventListener("mouseenter", () => activate(node));
  node.addEventListener("mouseleave", reset);
  node.addEventListener("focus", () => activate(node));
  node.addEventListener("blur", reset);
  node.addEventListener("click", () => {
    nodes.forEach((item) => item.classList.remove("selected"));
    if (selected === node) {
      selected = null;
      reset();
    } else {
      selected = node;
      node.classList.add("selected");
      activate(node);
    }
  });
});

filters.forEach((button) => button.addEventListener("click", () => {
  selected = null;
  nodes.forEach((node) => node.classList.remove("selected"));
  filters.forEach((item) => item.classList.toggle("active", item === button));
  const category = button.dataset.filter;
  nodes.forEach((node) => {
    const visible = category === "all" || node.id === "sophia" || node.dataset.category.split(" ").includes(category);
    node.classList.toggle("muted", !visible);
  });
  bonds.forEach((bond) => bond.classList.remove("active", "muted"));
}));

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
