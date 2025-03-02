const path = require("path");
const fs = require("fs");

document.addEventListener("DOMContentLoaded", async () => {
  const projectName = new URLSearchParams(window.location.search).get("name");

  const jsonPath = path.join(__dirname, "/public/json/projects.json");
  const projectsUnparsed = await fs.promises.readFile(jsonPath, "utf-8");
  const projects = JSON.parse(projectsUnparsed);

  const project = projects.find((project) => project.name === projectName);

  const pageTitle = document.querySelector("title");
  const projectTitle = document.querySelectorAll(".main-text-container");
  const projectDescription = document.querySelector("#long-description");
  const projectImage = document.querySelector("#main-picture");
  const link = document.querySelector("#link");
  const technologies = document.querySelector("#technologies");
  const playStore = document.querySelector("#link-play");
  const appStore = document.querySelector("#link-app");

  pageTitle.textContent = `Hector's portfolio ${project.title}`;
  projectTitle.forEach((title) => {
    title.textContent = project.title;
  });
  projectDescription.innerHTML = project.longDescription;
  projectImage.style.backgroundImage = `url(${project.img})`;

  project.technologies.forEach((technology) => {
    const li = document.createElement("li");
    li.classList.add(`${technology}`);
    technologies.appendChild(li);
  });

  if (project.link) {
    link.href = project.link;
  } else {
    link.style.display = "none";
  }
  if (project.playStoreLink) {
    playStore.href = project.playStoreLink;
  } else {
    playStore.style.display = "none";
  }
  if (project.appStoreLink) {
    appStore.href = project.appStoreLink;
  } else {
    appStore.style.display = "none";
  }
});
