/* ===== EDIT THESE ===== */
const CONFIG = {
  whatsapp: "2340000000000",   // your number: country code + number, no + or spaces (e.g. 2348012345678)
  sms: "+2340000000000",       // your number for normal SMS
  instagram: "manuelstattooworld" // your Instagram username
};
/* ====================== */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Nav: solid on scroll, mobile menu
const nav = $("#nav"), menu = $("#menu"), burger = $("#burger"), toTop = $("#toTop");
addEventListener("scroll", () => {
  nav.classList.toggle("solid", scrollY > 40);
  toTop.classList.toggle("show", scrollY > 700);
}, { passive: true });
const setMenu = open => {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
burger.onclick = () => setMenu(!menu.classList.contains("open"));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
toTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

// Scroll reveal
const io = new IntersectionObserver((es, o) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); }
}), { threshold: .12 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });

// Hero parallax on mouse move
const art = $("#heroArt");
if (art && matchMedia("(hover:hover)").matches) {
  addEventListener("mousemove", e => {
    const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2;
    $$(".hc", art).forEach((im, i) => im.style.transform = `translate(${x * (8 + i * 6)}px,${y * (8 + i * 6)}px)`);
  });
}

// Gallery filters
const items = $$("#gallery .g");
$$("#filters .chip").forEach(btn => btn.onclick = () => {
  $$("#filters .chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.f;
  items.forEach(it => it.classList.toggle("hide", f !== "all" && !it.dataset.cat.split(" ").includes(f)));
});

// Lightbox
const lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
let list = [], idx = 0;
const show = () => {
  const it = list[idx], im = $("img", it);
  lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = $("figcaption", it).textContent;
};
const openLB = it => {
  list = items.filter(i => !i.classList.contains("hide"));
  idx = list.indexOf(it); show();
  lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
};
const closeLB = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
const step = d => { idx = (idx + d + list.length) % list.length; show(); };
items.forEach(it => it.addEventListener("click", () => openLB(it)));
$("#lbClose").onclick = closeLB;
$("#lbPrev").onclick = () => step(-1);
$("#lbNext").onclick = () => step(1);
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
let tx = 0;
lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) step(d > 0 ? -1 : 1); });

// Contact links + form
const hello = "Hi Manuel, I found your website and I'd like to book a tattoo.";
const waBase = `https://wa.me/${CONFIG.whatsapp}`;
$("#linkWA").href = `${waBase}?text=${encodeURIComponent(hello)}`;
$("#floatWA").href = `${waBase}?text=${encodeURIComponent(hello)}`;
$("#linkSMS").href = `sms:${CONFIG.sms}?&body=${encodeURIComponent(hello)}`;
$("#linkIG").href = `https://instagram.com/${CONFIG.instagram}`;

const build = () => {
  const name = $("#fName").value.trim(), msg = $("#fMsg").value.trim(), err = $("#err");
  if (!name || !msg) { err.textContent = "Please add your name and describe your idea."; return null; }
  err.textContent = "";
  const place = $("#fPlace").value.trim();
  return `Hi Manuel, I'm ${name}.\nStyle: ${$("#fStyle").value}\n${place ? "Placement: " + place + "\n" : ""}Idea: ${msg}`;
};
$("#sendWA").onclick = () => { const t = build(); if (t) open(`${waBase}?text=${encodeURIComponent(t)}`, "_blank"); };
$("#sendSMS").onclick = () => { const t = build(); if (t) location.href = `sms:${CONFIG.sms}?&body=${encodeURIComponent(t)}`; };
$("#form").addEventListener("submit", e => e.preventDefault());

$("#year").textContent = new Date().getFullYear();
