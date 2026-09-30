/* ===== Birthday microsite: script.js ===== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

let burst = () => {}; // filled in by initConfetti()

/* ---------- Start everything ---------- */
function initPage() {
  initParticles();
  initConfetti();
  initScrollAnimations();
  initBirthdayProgram();
  initLightbox();
  initFinal();

  // Open button: reveal story, confetti, scroll down
  $("#openBtn").addEventListener("click", () => {
    $("#story").classList.remove("hidden");
    initScrollAnimations(); // re-check now that content is visible
    burst(80);
    setTimeout(() => $("#story").scrollIntoView({ behavior: "smooth" }), 400);
  });
}

/* ---------- Floating gold particles ---------- */
function initParticles() {
  const c = $("#particles");
  const ctx = c.getContext("2d");
  let dots = [];

  function resize() {
    c.width = innerWidth;
    c.height = innerHeight;
    dots = Array.from({ length: 45 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.4 + 0.1,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "rgba(227, 169, 43, 0.55)";
    dots.forEach((d) => {
      d.y -= d.s;
      if (d.y < -5) {
        d.y = c.height + 5;
        d.x = Math.random() * c.width;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  resize();
  addEventListener("resize", resize);
  draw();
}

/* ---------- Confetti (no library) ---------- */
function initConfetti() {
  const c = $("#confetti");
  const ctx = c.getContext("2d");
  const colors = ["#e3a92b", "#f6dc8c", "#6d1a2b", "#fff8ea", "#c9822b"];
  let pieces = [];
  let running = false;

  function resize() {
    c.width = innerWidth;
    c.height = innerHeight;
  }
  resize();
  addEventListener("resize", resize);

  function frame() {
    ctx.clearRect(0, 0, c.width, c.height);
    pieces.forEach((p) => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < c.height + 20);
    if (pieces.length) requestAnimationFrame(frame);
    else {
      running = false;
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }

  burst = (count = 100) => {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: c.width / 2,
        y: c.height * 0.6,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    if (!running) {
      running = true;
      frame();
    }
  };
}

/* ---------- Scroll reveal, counters, light parallax ---------- */
function initScrollAnimations() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        $$(".count", e.target).forEach(countUp);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15 },
  );
  $$(".reveal:not(.in)").forEach((el) => io.observe(el));

  // Parallax only needs to be attached once
  if (initScrollAnimations.done) return;
  initScrollAnimations.done = true;
  addEventListener(
    "scroll",
    () => {
      if (reduceMotion) return;
      $$("[data-speed]").forEach((el) => {
        const r = el.parentElement.getBoundingClientRect(); // parent, so no feedback loop
        el.style.top = r.top * parseFloat(el.dataset.speed) + "px";
      });
    },
    { passive: true },
  );
}

function countUp(el) {
  const to = +el.dataset.to;
  let n = 0;
  const t = setInterval(() => {
    el.textContent = ++n;
    if (n >= to) clearInterval(t);
  }, 600);
}

/* ---------- Birthday.exe ---------- */
function initBirthdayProgram() {
  const lines = [
    "> Initializing birthday...",
    "> Loading happiness...",
    "> Loading cake...",
    "> Removing bugs...",
    "> Adding good memories...",
    ">",
    "> Process completed successfully ✅",
    ">",
    "> HAPPY BIRTHDAY 🎂",
  ];
  const btn = $("#runBtn");
  const term = $("#terminal");
  let busy = false;

  btn.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    term.textContent = "";
    let i = 0;
    const t = setInterval(() => {
      term.textContent += lines[i++] + "\n";
      if (i >= lines.length) {
        clearInterval(t);
        busy = false;
        burst(140);
      }
    }, 450);
  });
}

/* ---------- Lightbox (click, keyboard, prev/next) ---------- */
function initLightbox() {
  const box = $("#lightbox");
  const img = $("#lbImg");
  const cap = $("#lbCap");
  let items = [];
  let index = 0;

  function show(i) {
    index = (i + items.length) % items.length;
    const fig = items[index];
    img.src = $("img", fig).src;
    cap.textContent = fig.querySelector("figcaption")?.textContent || "";
  }
  function open(fig) {
    // Only photos that actually have an image file
    items = $$(".photo").filter((f) => $("img", f));
    show(items.indexOf(fig));
    box.classList.remove("hidden");
    $("#lbClose").focus();
  }
  function close() {
    box.classList.add("hidden");
  }

  $$(".photo").forEach((fig) => {
    fig.tabIndex = 0;
    fig.addEventListener("click", () => $("img", fig) && open(fig));
    fig.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && $("img", fig)) {
        e.preventDefault();
        open(fig);
      }
    });
  });

  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(index - 1));
  $("#lbNext").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  addEventListener("keydown", (e) => {
    if (box.classList.contains("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
}

/* ---------- Final surprise modal ---------- */
function initFinal() {
  const modal = $("#modal");
  $("#surpriseBtn").addEventListener("click", () => {
    modal.classList.remove("hidden");
    $("#modalClose").focus();
    burst(160);
  });
  $("#modalClose").addEventListener("click", () =>
    modal.classList.add("hidden"),
  );
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.add("hidden");
  });
}

document.addEventListener("DOMContentLoaded", initPage);
