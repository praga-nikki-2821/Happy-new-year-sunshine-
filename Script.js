const lamp = document.getElementById("lamp");
const book = document.getElementById("book");
const indicator = document.getElementById("page-indicator");
const overlay = document.getElementById("newYearOverlay");

const leftPage = document.querySelector(".page.left .page-content");
const rightPage = document.querySelector(".page.right .page-content");

/* ===== TIME LOGIC ===== */
const newYearTime = new Date("2026-01-01T00:00:00");
const now = new Date();

if (now < newYearTime) {
  setTimeout(showNewYearMoment, newYearTime - now);
}

function showNewYearMoment() {
  overlay.style.display = "flex";
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 2 });

  setTimeout(() => {
    gsap.to(overlay, {
      opacity: 0,
      duration: 2,
      onComplete: () => overlay.style.display = "none"
    });
  }, 4000);
}

/* ===== PAGE DATA ===== */
const pageData = [
  { type: "text", content: "Hey Sunshine 🌤️<br><br>As the year gently closes its chapter…" },
  { type: "text", content: "Some moments were heavy… And somewhere in between, there was you ❤️" },
  { type: "text", content: "You carry strength in a way that doesn’t ask to be noticed…" },
  { type: "photo", src: "photos/photo1.jpg", caption: "A quiet moment" },
  { type: "text", content: "You call yourself a strong woman — and maybe you are —" },
  { type: "text", content: "Days where you can just breathe, rest, and be yourself 🌙" },
  { type: "photo", src: "photos/photo2.jpg", caption: "Somewhere in between" },
  { type: "text", content: "Hard days will come — not to trap us in them…" },
  { type: "text", content: "Eat well… jojo well… stay hydrated…" },
  { type: "photo", src: "photos/photo3.jpg", caption: "Just you" },
  { type: "text", content: "Happy New Year, Sunshine ✨<br><br>Good night… spice dreams…" }
];

let currentPage = 0;
let zoomLevel = 1;

/* ===== RENDER ===== */
function renderPage(container, page) {
  if (!page) {
    container.innerHTML = "";
    return;
  }

  if (page.type === "text") {
    container.innerHTML = `<div>${page.content}</div>`;
  } else {
    container.innerHTML = `
      <div class="photo-page">
        <img src="${page.src}">
        <div class="caption">${page.caption}</div>
      </div>`;
  }
}

function renderPages() {
  renderPage(leftPage, pageData[currentPage]);
  renderPage(rightPage, pageData[currentPage + 1]);
  indicator.textContent = `${currentPage + 1} of ${pageData.length}`;
}

/* ===== LAMP ===== */
lamp.addEventListener("click", () => {
  gsap.to("body", { backgroundColor: "#1a1a1a", duration: 1.2 });
  gsap.to(book, { opacity: 1, scale: 1, duration: 1.1, delay: 0.4 });
  book.classList.remove("hidden");
});

/* ===== PAGE TURN ===== */
function turnForward() {
  if (currentPage >= pageData.length - 2) return;
  gsap.to(".page.right", {
    rotationY: -180,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.set(".page.right", { rotationY: 0 });
      currentPage += 2;
      renderPages();
    }
  });
}

function turnBackward() {
  if (currentPage <= 0) return;
  currentPage -= 2;
  renderPages();
  gsap.fromTo(".page.right", { rotationY: -180 }, {
    rotationY: 0,
    duration: 0.8,
    ease: "power2.inOut"
  });
}

/* ===== GESTURES ===== */
const hammer = new Hammer(book);
hammer.get("pinch").set({ enable: true });

hammer.on("swipeleft", turnForward);
hammer.on("swiperight", turnBackward);

hammer.on("pinch", e => {
  zoomLevel = Math.min(Math.max(1, e.scale), 2.2);
  gsap.to(book, { scale: zoomLevel, duration: 0.2 });
});

/* INIT */
renderPages();
