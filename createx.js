const passwordInput = document.getElementById("password");
const passwordTriggerButton = document.querySelector(
  ".modal-login-form-group-password__button"
);
const emailInput = document.querySelector(".user-inp");
const modal = document.querySelector("#loginModal");

function showPassword() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordTriggerButton.innerHTML = "Yashir";
  } else {
    passwordInput.type = "password";
    passwordTriggerButton.innerHTML = "Ko'rsat";
  }
}

// function openModal(status) {
//   console.log("xato")
//    if (status === "open") {
//         modal.style.display = "flex";
//         modal.style.pointerEvents = "auto";
//     } else {
//         modal.style.display = "none";
//         modal.style.pointerEvents = "none";
//     }
// }

// function openModal(status) {
//   console.log(status);
//   if (status === "open") {
//     modal.style.display = "flex";
//     modal.style.pointerEvents = "auto";
//     document.body.classList.add("modal-open");
//   } else {
//     modal.style.display = "none";
//     modal.style.pointerEvents = "none";
//     document.body.classList.add("modal-open");
//   }
// }

// function openModal(status) {
//   console.log(status);
//   if (status === "open") {
//     modal.style.display = "flex";
//     modal.style.pointerEvents = "auto";
//     document.body.classList.add("modal-open"); // scrollni bloklaymiz
//   } else {
//     modal.style.display = "none";
//     modal.style.pointerEvents = "none";
//     document.body.classList.remove("modal-open"); // scrollni qayta yoqamiz
//   }
// }

function openModal(status) {
  if (status === "open") {
    modal.style.display = "flex";
    modal.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden"; // Scrollni bloklash
  } else {
    modal.style.display = "none";
    modal.style.pointerEvents = "none";
    
  }
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.body.style.overflow = ""; // Scrollni qayta tiklash
}

function toggleMenu() {
  document.getElementById("head-nav-responsive").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const postsSection = document.querySelector(".latest-posts");

  // Blog post container
  const postsContainer = document.createElement("div");
  postsContainer.className = "posts-container container";
  postsSection.appendChild(postsContainer);

  fetch("https://api.spaceflightnewsapi.net/v4/blogs/")
    .then((res) => res.json())
    .then((data) => {
      const blogs = data.results.slice(0, 3); // Faqat 3ta post

      blogs.forEach((post) => {
        const card = document.createElement("div");
        card.className = "post-card";

        card.innerHTML = `
          <img src="${post.image_url}" class="post-img" />
          <div class="news-data">
            <span>News</span> |
            <span>${post.published_at}</span>
          </div>
          <h3 class="post-title">${post.title}</h3>
          <p class="post-summary">${post.summary.slice(0, 120)}...</p>
          <a class="post-link" href="${post.url}" target="_blank">Read →</a>
        `;

        postsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Blog posts loading error:", error);
    });
});

function submit() {
  const data = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  const url = "https://studyin-uzbekistan.uz/api/v1/common/auth/login/";

  fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": "reqres-free-v1",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
    .then(({ ok, json }) => {
      console.log(json);
      if (!ok) {
        alert("Xatolik: " + json.error);
      } else {
        localStorage.setItem("token", json.access);
        getUser();
      }
    });
}

function getUser() {
  const token = localStorage.getItem("token");

  if (token) {
    fetch("https://studyin-uzbekistan.uz/api/v1/cabinet/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
        console.log(json);
        if (!ok) {
          localStorage.removeItem("token");
          alert("Xatolik: " + json.error);
        } else {
          const userButton = document.querySelector(".head-btn2");
          const fullName = `${json.first_name} ${json.last_name}`;

          userButton.innerHTML = `${fullName}`;
        }
      });
  }
}

getUser();
