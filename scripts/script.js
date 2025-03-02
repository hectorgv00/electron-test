const path = require("path");
const fs = require("fs");

document.addEventListener("DOMContentLoaded", async () => {
  const textContainer = document.querySelector(".main-text-container");
  const texts = ["Hector Gonzalez Viejo", "Full Stack Developer"];
  let index = 0;
  let charIndex = 0;
  let deleting = false;

  const projectsContainer = document.querySelector(".projects-container");

  const jsonPath = path.join(__dirname, "/public/json/projects.json");
  const projectsUnparsed = await fs.promises.readFile(jsonPath, "utf-8");
  const projects = JSON.parse(projectsUnparsed);

  projects.forEach((project) => {
    const a = document.createElement("a");
    const article = document.createElement("article");
    const image = document.createElement("img");
    const title = document.createElement("p");
    const description = document.createElement("p");

    a.href = `project.html?name=${project.name}`;

    article.classList.add("project-card");
    image.src = project.img;
    title.classList.add("card-title");
    title.textContent = project.title;
    description.classList.add("card-body");
    description.textContent = project.description;

    article.appendChild(image);
    article.appendChild(title);
    article.appendChild(description);
    a.appendChild(article);
    projectsContainer.appendChild(a);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document
    .querySelectorAll(".fade-in, .slide-in-right, .slide-in-left")
    .forEach((element) => {
      observer.observe(element);
    });

  function typeEffect() {
    const currentText = texts[index];
    if (!deleting) {
      textContainer.textContent = currentText.substring(0, charIndex++);
      if (charIndex > currentText.length) {
        deleting = true;
        setTimeout(typeEffect, 1000);
        return;
      }
    } else {
      textContainer.textContent = currentText.substring(0, charIndex--);
      if (charIndex === -1) {
        deleting = false;
        index = (index + 1) % texts.length;
        setTimeout(typeEffect, 500); // Espera antes de empezar el nuevo texto
        return;
      }
    }
    setTimeout(typeEffect, deleting ? 50 : 50);
  }

  function onSubmit(token) {
    document.getElementById("demo-form").submit();

    const form = document.getElementById("demo-form");
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      token,
    };

    // Make a post to ./mail/mail.php
    fetch("./mail/mail.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Message sent successfully");
        } else {
          alert("There was an error sending the message");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const submitButton = document.getElementById("submit-button");

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();

    grecaptcha.ready(function () {
      grecaptcha
        .execute("6Ld0nccqAAAAAFKpO37u2cRY2sT-Fmwe4yHAfUSQ", {
          action: "submit",
        })
        .then(async function (token) {
          const form = document.getElementById("contact-form");
          const formData = new FormData(form);
          formData.append("token", token);

          const response = await fetch("./mail/mail.php", {
            method: "POST",
            body: formData,
          });

          const result = await response.text();
          alert(result);
        });
    });
  });

  typeEffect();
});
