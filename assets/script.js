(() => {
  const $ = (s, p = document) => p.querySelector(s),
    $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const html = document.documentElement;
  const toast = $("#toast");
  let timer;
  function say(t = "Copiado!") {
    toast.textContent = t;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 1400);
  }
  async function copy(t) {
    try {
      await navigator.clipboard.writeText(t);
    } catch (e) {
      const a = document.createElement("textarea");
      a.value = t;
      a.style.position = "fixed";
      a.style.opacity = "0";
      document.body.append(a);
      a.select();
      document.execCommand("copy");
      a.remove();
    }
    say();
  }
  function theme(t) {
    html.dataset.theme = t;
    try {
      localStorage.setItem("cmd-theme", t);
    } catch (e) {}
  }
  let saved = null;
  try {
    saved = localStorage.getItem("cmd-theme");
  } catch (e) {}
  theme(
    saved ||
      (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"),
  );
  $("#themeBtn")?.addEventListener("click", () =>
    theme(html.dataset.theme === "dark" ? "light" : "dark"),
  );
  $("#menuBtn")?.addEventListener("click", () =>
    $("#mobileNav")?.classList.toggle("open"),
  );
  $$(".copy").forEach((b) =>
    b.addEventListener("click", () =>
      copy(b.closest(".code-box").querySelector("code").innerText.trim()),
    ),
  );
  $$(".mini-copy").forEach((b) =>
    b.addEventListener("click", () =>
      copy(b.closest(".cmd-row").querySelector("code").innerText.trim()),
    ),
  );
  const items = $$(".search-item"),
    inp = $("#pageSearch"),
    count = $("#resultCount"),
    grid = $("#contentGrid");
  function norm(s) {
    return (s || "")
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  function filter() {
    const q = norm(inp?.value || "");
    let n = 0;
    items.forEach((x) => {
      const ok =
        !q || norm((x.dataset.search || "") + " " + x.innerText).includes(q);
      x.dataset.hidden = ok ? "false" : "true";
      if (ok) n++;
    });
    if (count) count.textContent = n;
    let old = $(".no-results", grid);
    if (n === 0 && !old) {
      old = document.createElement("div");
      old.className = "no-results";
      old.textContent = "Nenhum tópico encontrado nesta página.";
      grid.append(old);
    }
    if (n > 0 && old) old.remove();
  }
  inp?.addEventListener("input", filter);
  filter();
  const modal = $("#searchModal"),
    global = $("#globalSearch"),
    results = $("#globalResults");
  const index = [
    ["Início", "Visão geral de todas as áreas", "index.html"],
    [
      "Git",
      "Commits, branches, merge, stash, restore, tags, gitignore",
      "git.html",
    ],
    [
      "GitHub",
      "Remote, push, pull, clone, Pages, Issues, Pull Requests, README",
      "github.html",
    ],
    [
      "Terminal Linux",
      "pwd, ls, cd, mkdir, cp, mv, rm, chmod, grep, processos e portas",
      "linux.html",
    ],
    [
      "XAMPP",
      "Apache, MySQL, htdocs, localhost, phpMyAdmin, logs e portas",
      "xampp.html",
    ],
    [
      "HTML / CSS / JavaScript",
      "Front-end, DOM, eventos, localStorage, servidor estático",
      "frontend.html",
    ],
    [
      "PHP",
      "Sintaxe, formulários, sessões, servidor local e XAMPP",
      "php.html",
    ],
    [
      "MySQL",
      "CREATE, INSERT, SELECT, UPDATE, DELETE, JOIN, ALTER TABLE",
      "mysql.html",
    ],
    [
      "Node / NPM",
      "npm install, scripts, dependências, audit e package.json",
      "node.html",
    ],
    [
      "Fluxos do dia a dia",
      "Novo projeto, commits, Pages, branches, clone, XAMPP e diagnóstico",
      "fluxos.html",
    ],
  ];
  function globalRender() {
    const q = norm(global.value);
    const found = index.filter(
      (r) => !q || norm(r[0] + " " + r[1]).includes(q),
    );
    results.innerHTML =
      found
        .map(
          (r) =>
            `<a href="${r[2]}"><div><b>${r[0]}</b><span>${r[1]}</span></div><span>→</span></a>`,
        )
        .join("") || '<div class="no-results">Nada encontrado.</div>';
  }
  function openSearch() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    global.value = "";
    globalRender();
    setTimeout(() => global.focus(), 30);
  }
  function closeSearch() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  $("#globalSearchBtn")?.addEventListener("click", openSearch);
  $("#closeSearch")?.addEventListener("click", closeSearch);
  global?.addEventListener("input", globalRender);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });
  document.addEventListener("keydown", (e) => {
    const typing = ["INPUT", "TEXTAREA"].includes(
      document.activeElement?.tagName,
    );
    if (e.key === "/" && !typing) {
      e.preventDefault();
      inp?.focus();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape") {
      closeSearch();
      $("#mobileNav")?.classList.remove("open");
    }
  });
  const top = $("#toTop"),
    prog = $("#scrollProgress");
  function scroll() {
    const y = scrollY,
      h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%";
    top.classList.toggle("show", y > 650);
  }
  addEventListener("scroll", scroll, { passive: true });
  scroll();
  top?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: "smooth" }),
  );
})();
