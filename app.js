(() => {
  const REELS = { who: WHO, where: WHERE, what: WHAT, oops: MISTAKES };
  const KEYS = ["who", "where", "what"]; // the reels a real film is matched on
  const ALL = ["who", "where", "what", "oops"];
  const JACKPOT_RATE = 0.35; // share of spins quietly steered onto a real film

  // ---------- helpers ----------
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (rand, list) => list[Math.floor(rand() * list.length)];
  const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const newSeed = () => Math.floor(Math.random() * 1e9);
  // "A cheap hotel" -> "a cheap hotel", but leave "Las Vegas" alone.
  const lower = (s) => (/^(A|An|The|Her|His|Their|Its|Two|Three|Four|Five|Six|Seven|Eight|Some|Several|One)\b/.test(s)
    ? s[0].toLowerCase() + s.slice(1) : s);
  const upper = (s) => s[0].toUpperCase() + s.slice(1);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollTo = (node) => node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  const tally = (list) => list.reduce((acc, x) => ((acc[x] = (acc[x] || 0) + 1), acc), {});
  const top = (counts, n) => Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
  const shuffled = (rand, list) => list.map((x) => [rand(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);

  // ---------- index the real films ----------
  const indexOf = {};
  KEYS.forEach((k) => { indexOf[k] = {}; REELS[k].forEach((b, i) => (indexOf[k][b.id] = i)); });
  const tallies = {};
  KEYS.forEach((k) => (tallies[k] = REELS[k].map(() => 0)));
  MOVIES.forEach((m) => {
    m.idx = {};
    KEYS.forEach((k) => {
      const i = indexOf[k][m[k]];
      m.idx[k] = i === undefined ? -1 : i;
      if (i !== undefined) tallies[k][i]++;
    });
  });
  const complete = MOVIES.filter((m) => KEYS.every((k) => m.idx[k] >= 0));
  const realTitles = new Set(MOVIES.map((m) => m.t.toLowerCase()));
  const franchises = {};
  MOVIES.forEach((m) => { if (m.fr) (franchises[m.fr] = franchises[m.fr] || []).push(m); });
  Object.values(franchises).forEach((list) => list.sort((a, b) => a.y - b.y));

  function findMatches(state) {
    const tiers = { 3: [], 2: [], 1: [] };
    MOVIES.forEach((m) => {
      const hits = KEYS.filter((k) => m.idx[k] === state[k]);
      if (hits.length) tiers[hits.length].push({ m, hits });
    });
    return tiers;
  }

  // ---------- the parody incident report ----------
  function buildPitch(state) {
    const who = WHO[state.who], where = WHERE[state.where], what = WHAT[state.what], oops = MISTAKES[state.oops];
    const rand = mulberry32(state.seed);
    const vars = {
      subj: who.subj, subjLower: lower(who.subj), at: where.at, did: oops.did, threat: what.a,
      years: pick(rand, [30, 40, 100, 200]), place: pick(rand, where.names), thing: pick(rand, what.things),
    };
    let title;
    for (let i = 0; i < 20; i++) {
      title = fill(pick(rand, TITLE_TEMPLATES), vars);
      title = title.replace(/ (of|to|at|vs\.) The /g, " $1 the ");
      if (!realTitles.has(title.toLowerCase())) break;
    }
    const hows = shuffled(rand, EXITS_ALT);
    const exits = shuffled(rand, who.roster).map((name, i) => ({
      who: name, when: `minute ${EXITS[i].min + Math.floor(rand() * 5)}`,
      how: rand() < 0.5 ? EXITS[i].how : hows[i],
    }));
    exits.push({ who: who.survivor, when: "survives", how: "will not be discussing it" });
    exits.push({ who: "The dog", when: "survives", how: "knew the whole time" });
    return {
      title, number: 1000 + (state.seed % 9000),
      tagline: fill(pick(rand, TAGLINES), vars),
      synopsis: upper(fill(pick(rand, PLOTS), vars)),
      exits,
    };
  }

  // ---------- real film cards ----------
  function movieCard(m, note) {
    const li = el("li", "movie");
    const h = el("h3");
    h.append(el("span", "movie-title", m.t), el("span", "movie-year", ` (${m.y})`));
    li.append(h);
    if (note) li.append(el("p", "movie-note", note));
    if (m.d) li.append(el("p", "movie-stars", `Directed by ${m.d}`));
    const facts = el("dl", "facts");
    [["The insured", m.wt], ["Location", m.loc], ["Threat", m.th], ["Their mistake", m.mk]].forEach(([k, v]) => {
      if (v) facts.append(el("dt", null, k), el("dd", null, v));
    });
    if (facts.children.length) li.append(facts);
    if (m.s) li.append(el("p", "movie-sum", m.s));
    const a = el("a", "lookup", "Look it up ↗");
    a.href = m.u || `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(`${m.t} ${m.y} film`)}`;
    a.target = "_blank"; a.rel = "noopener";
    const fix = el("a", "lookup report", "Report a wrong detail");
    fix.href = "https://github.com/papaschnay2/horrorfilms/issues/new?title=" + encodeURIComponent(`Wrong detail: ${m.t} (${m.y})`);
    fix.target = "_blank"; fix.rel = "noopener";
    li.append(a, fix);
    return li;
  }

  function diffNote(m, missing) {
    if (m.idx[missing] < 0) return "Two for two. The third detail is not in our file, so this may be an exact match.";
    return {
      who: m.wt ? `Same incident, different victims: ${lower(m.wt)}.` : "Same incident, different victims.",
      where: m.loc ? `Same incident, different address: ${lower(m.loc)}.` : "Same incident, different address.",
      what: m.th ? `Same incident, different threat: ${lower(m.th)}.` : "Same incident, different threat.",
    }[missing];
  }

  let lastFinding = null;
  function renderVerdict(state, pitch) {
    const tiers = findMatches(state);
    const rand = mulberry32(state.seed ^ 0x5eed);
    const head = $("verdict-head"), sub = $("verdict-sub"), list = $("matches"), stamp = $("stamp");
    list.innerHTML = "";
    let level, shown, extra = "";

    if (tiers[3].length) {
      level = 3;
      const all = tiers[3].map((x) => x.m).sort((a, b) => a.y - b.y);
      shown = shuffled(rand, tiers[3]).slice(0, 3);
      const years = [...new Set(all.map((m) => m.y))];
      head.textContent = `They made it in ${years[0]}.` + years.slice(1, 4).map((y) => ` And ${y}.`).join("") +
        (years.length > 4 ? ` And ${years.length - 4} more times.` : "");
      // The franchise is the punchline: what did they do after that?
      const first = shown[0].m;
      const saga = first.fr && franchises[first.fr].length > 1 ? franchises[first.fr] : null;
      sub.textContent = all.length === 1
        ? `You called it “${pitch.title}.” They called it “${first.t}.”`
        : `You called it “${pitch.title}.” It has been filed ${all.length} times under other names.`;
      if (saga) {
        extra = `The “${first.fr}” file alone holds ${saga.length} entries: ${saga.map((m) => m.y).join(", ")}.`;
      }
      stamp.textContent = "Denied · pre-existing condition";
      shown.forEach(({ m }) => list.append(movieCard(m)));
      if (all.length > shown.length) list.append(el("li", "more", `…and ${all.length - shown.length} more on file.`));
      if (extra) list.append(el("li", "more saga", extra));
    } else if (tiers[2].length) {
      level = 2;
      shown = shuffled(rand, tiers[2]).slice(0, 3);
      head.textContent = "Not on file. But close.";
      sub.textContent = `“${pitch.title}” has not happened yet. ${plural(tiers[2].length, "prior incident is", "prior incidents are")} one detail away.`;
      stamp.textContent = "Under review";
      shown.forEach(({ m, hits }) => list.append(movieCard(m, diffNote(m, KEYS.find((k) => !hits.includes(k))))));
    } else {
      level = tiers[1].length ? 1 : 0;
      shown = shuffled(rand, tiers[1]).slice(0, 2);
      head.textContent = "No prior incident on file.";
      sub.textContent = `“${pitch.title}” appears to be original. Claim approved, pending the sequel.` +
        (shown.length ? " Nearest known incidents:" : "");
      stamp.textContent = "Approved · original incident";
      shown.forEach(({ m }) => list.append(movieCard(m)));
    }
    stamp.dataset.level = level;
    $("verdict").dataset.level = level;
    $("adjuster-note").textContent = `Adjuster's note: ${MISTAKES[state.oops].note}`;
    lastFinding = { state, pitch, level, head: head.textContent, stamp: stamp.textContent, movies: shown.map((x) => x.m) };
  }

  // ---------- reels ----------
  const reelEls = {};
  document.querySelectorAll(".reel").forEach((node) => {
    const key = node.dataset.key;
    const r = (reelEls[key] = {
      el: node, value: node.querySelector(".value"),
      tally: node.querySelector(".tally"), lock: node.querySelector(".lock"),
    });
    r.lock.addEventListener("click", () => {
      const locked = node.classList.toggle("locked");
      r.lock.setAttribute("aria-pressed", String(locked));
      r.lock.textContent = locked ? "Locked" : "Lock";
    });
  });

  function showFinal(key, i) {
    reelEls[key].value.textContent = REELS[key][i].label;
    if (key === "oops") { reelEls[key].tally.textContent = "in most of them"; return; }
    const n = tallies[key][i];
    reelEls[key].tally.textContent = n ? `in ${plural(n, "real film", "real films")}` : "no real films (yet)";
  }

  function animateReel(key, finalIndex, duration) {
    const r = reelEls[key];
    return new Promise((resolve) => {
      if (reduceMotion) { showFinal(key, finalIndex); return resolve(); }
      r.el.classList.remove("landed");
      r.el.classList.add("spinning");
      r.tally.innerHTML = "&nbsp;";
      const start = performance.now();
      const tick = () => {
        const elapsed = performance.now() - start;
        if (elapsed >= duration) {
          r.el.classList.remove("spinning");
          showFinal(key, finalIndex);
          void r.el.offsetWidth;
          r.el.classList.add("landed");
          return resolve();
        }
        r.value.textContent = REELS[key][Math.floor(Math.random() * REELS[key].length)].label;
        setTimeout(tick, 50 + (elapsed / duration) ** 2 * 220);
      };
      tick();
    });
  }

  let state = null;
  let pitchTimers = [];
  const isLocked = (k) => !!state && reelEls[k].el.classList.contains("locked");
  const randomIndex = (k) => Math.floor(Math.random() * REELS[k].length);

  function chooseNext() {
    const next = { seed: newSeed(), oops: isLocked("oops") ? state.oops : randomIndex("oops") };
    if (Math.random() < JACKPOT_RATE) {
      const pool = complete.filter((m) => KEYS.every((k) => !isLocked(k) || m.idx[k] === state[k]));
      if (pool.length) {
        const m = pool[Math.floor(Math.random() * pool.length)];
        KEYS.forEach((k) => (next[k] = m.idx[k]));
        return next;
      }
    }
    KEYS.forEach((k) => (next[k] = isLocked(k) ? state[k] : randomIndex(k)));
    return next;
  }

  // Show the incident report. The finding stays hidden until the claim is filed, unless `revealed`.
  function show(s, revealed) {
    state = s;
    pitchTimers.forEach(clearTimeout);
    pitchTimers = [];
    const pitch = buildPitch(s);
    $("report-no").textContent = `Incident report no. ${pitch.number}`;
    $("title").textContent = pitch.title;
    $("tagline").textContent = pitch.tagline;
    $("synopsis").textContent = pitch.synopsis;
    const exits = $("exits");
    exits.innerHTML = "";
    pitch.exits.forEach((x) => {
      const li = el("li", x.when === "survives" ? "lives" : null);
      li.append(el("span", "exit-who", x.who), el("span", "exit-how", `${upper(x.when)}, ${x.how}.`));
      exits.append(li);
    });
    renderVerdict(s, pitch);
    $("verdict").hidden = !revealed;
    $("poster").hidden = true;
    $("pitch").hidden = !!revealed;
    $("pitch").disabled = false;
    $("pitch-status").innerHTML = "&nbsp;";
    $("result").hidden = false;
    history.replaceState(null, "", "#" + encodeState(s));
    spinBtn.textContent = "Spin Again";
  }

  const spinBtn = $("spin");
  spinBtn.addEventListener("click", async () => {
    spinBtn.disabled = true;
    const next = chooseNext();
    await Promise.all(ALL.filter((k) => !isLocked(k)).map((k, i) => animateReel(k, next[k], 1100 + i * 480)));
    show(next, false);
    scrollTo($("result"));
    spinBtn.disabled = false;
  });

  // The pause before the finding is the joke. Do not shorten it.
  $("pitch").addEventListener("click", () => {
    const btn = $("pitch"), status = $("pitch-status");
    const reveal = () => {
      btn.hidden = true;
      status.innerHTML = "&nbsp;";
      $("verdict").hidden = false;
      scrollTo($("verdict"));
    };
    if (reduceMotion) return reveal();
    btn.disabled = true;
    const lines = ["Pulling the file…", "Checking for prior incidents…", "The adjuster is sighing…"];
    lines.forEach((line, i) => pitchTimers.push(setTimeout(() => (status.textContent = line), i * 750)));
    pitchTimers.push(setTimeout(reveal, lines.length * 750));
  });

  // ---------- share links: #who-where-what-mistakeNumber-seed ----------
  const encodeState = (s) => [WHO[s.who].id, WHERE[s.where].id, WHAT[s.what].id, s.oops, s.seed.toString(36)].join("-");
  function decodeState(hash) {
    const p = hash.replace(/^#/, "").split("-");
    if (p.length !== 5) return null;
    const s = { who: indexOf.who[p[0]], where: indexOf.where[p[1]], what: indexOf.what[p[2]], oops: Number(p[3]), seed: parseInt(p[4], 36) };
    const ok = KEYS.every((k) => s[k] !== undefined) && Number.isInteger(s.oops) && s.oops >= 0 && s.oops < MISTAKES.length;
    return ok && Number.isFinite(s.seed) ? s : null;
  }
  async function copy(btn, text, done, restore) {
    try { await navigator.clipboard.writeText(text); btn.textContent = done; }
    catch { btn.textContent = "Couldn't copy. Use your browser's share button instead."; }
    setTimeout(() => (btn.textContent = restore), 2500);
  }
  $("share").addEventListener("click", () => copy($("share"), location.href, "Copied. Send it to someone who screams at the screen.", "Copy link to this claim"));

  // ---------- poster ----------
  function wrapLines(ctx, text, maxW) {
    const lines = [];
    let line = "";
    text.split(/\s+/).forEach((w) => {
      const next = line ? `${line} ${w}` : w;
      if (line && ctx.measureText(next).width > maxW) { lines.push(line); line = w; } else line = next;
    });
    if (line) lines.push(line);
    return lines;
  }
  async function drawPoster(f) {
    const type = '"Special Elite", "Courier New", monospace', sans = '"IBM Plex Sans", Arial, sans-serif', stencil = '"Stardos Stencil", Impact, sans-serif';
    try {
      await Promise.all(['400 60px "Special Elite"', '700 60px "Stardos Stencil"', '400 30px "IBM Plex Sans"', '600 30px "IBM Plex Sans"']
        .map((font) => document.fonts.load(font)));
    } catch {}
    const W = 1080, H = 1350, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    const INK = "#1f1b16", RED = "#b3261e", MUTED = "#6b6152", RULE = "#cbbf9f";
    ctx.fillStyle = "#d9c08a"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f7f1e1"; ctx.fillRect(48, 48, W - 96, H - 96);
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(70, 70, W - 140, H - 140);
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    let y = 150;
    const line = (text, font, color, gap) => { ctx.font = font; ctx.fillStyle = color; ctx.fillText(text, W / 2, y); y += gap; };
    const block = (text, sizes, fontOf, color, maxLines, lead) => {
      let lines, size;
      for (size of sizes) { ctx.font = fontOf(size); lines = wrapLines(ctx, text, 860); if (lines.length <= maxLines) break; }
      lines.slice(0, maxLines).forEach((l) => { y += size * lead; ctx.fillStyle = color; ctx.fillText(l, W / 2, y); });
      y += size * 0.5;
    };
    const rule = () => { ctx.strokeStyle = RULE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(130, y); ctx.lineTo(W - 130, y); ctx.stroke(); y += 16; };
    line("MIDNIGHT MUTUAL LIFE & CASUALTY", `400 30px ${type}`, INK, 40);
    line(`INCIDENT REPORT NO. ${f.pitch.number}`, `600 22px ${sans}`, MUTED, 6);
    rule();
    block(f.pitch.title, [84, 70, 58, 48], (z) => `400 ${z}px ${type}`, INK, 3, 1.15);
    block(f.pitch.tagline, [30, 26], (z) => `italic 400 ${z}px ${sans}`, MUTED, 2, 1.35);
    y += 12; rule(); y += 4;
    [["THE INSURED", WHO[f.state.who].label], ["LOCATION", WHERE[f.state.where].label], ["THREAT", WHAT[f.state.what].label], ["NEGLIGENCE", MISTAKES[f.state.oops].label]]
      .forEach(([k, v]) => {
        y += 46;
        ctx.textAlign = "left"; ctx.font = `600 20px ${sans}`; ctx.fillStyle = MUTED; ctx.fillText(k, 150, y);
        ctx.font = `400 32px ${type}`; ctx.fillStyle = INK; ctx.fillText(v, 360, y);
        ctx.textAlign = "center";
      });
    y += 40; rule();
    // the rubber stamp
    y += 78;
    ctx.save();
    ctx.translate(W / 2, y); ctx.rotate(-0.06);
    ctx.font = `700 ${f.stamp.length > 22 ? 44 : 54}px ${stencil}`;
    const sw = ctx.measureText(f.stamp.toUpperCase()).width + 60;
    ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.strokeRect(-sw / 2, -58, sw, 84);
    ctx.fillStyle = RED; ctx.fillText(f.stamp.toUpperCase(), 0, 0);
    ctx.restore();
    y += 46;
    block(f.head, [54, 46, 40, 34], (z) => `400 ${z}px ${type}`, INK, 3, 1.25);
    y += 30;
    const names = f.movies.slice(0, 3).map((m) => `“${m.t}” (${m.y})`);
    if (names.length) {
      line(f.level === 3 ? "On file as:" : "Nearest prior incidents:", `italic 400 26px ${sans}`, MUTED, 0);
      names.forEach((n) => { if (y < H - 230) block(n, [34, 28, 24], (z) => `600 ${z}px ${sans}`, RED, 1, 1.5); });
    }
    y = H - 150;
    line("The Horror Movie Generator", `400 34px ${type}`, INK, 34);
    line("an unofficial fan parody", `400 20px ${sans}`, MUTED, 0);
    return c.toDataURL("image/png");
  }
  $("poster-btn").addEventListener("click", async () => {
    if (!lastFinding) return;
    $("poster-img").src = await drawPoster(lastFinding);
    $("poster-img").alt = `Poster: ${lastFinding.pitch.title}. ${lastFinding.head}`;
    $("poster").hidden = false;
    scrollTo($("poster"));
  });

  // ---------- daily case file ----------
  function setupDaily() {
    const now = new Date();
    const dayNo = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(2026, 10, 1)) / 864e5) + 1;
    const dull = new Set("that this with from what they them their there night house dead evil last part chapter final".split(" "));
    const leaks = (m) => {
      const clues = `${m.wt} ${m.loc} ${m.th} ${m.mk || ""}`.toLowerCase();
      return (m.t.toLowerCase().match(/[a-z]{4,}/g) || []).some((w) => !dull.has(w) && clues.includes(w));
    };
    const rand = mulberry32(20261113);
    const pool = shuffled(rand, complete.filter((m) => m.wt && m.loc && m.th && !leaks(m)).sort((a, b) => a.t.localeCompare(b.t)));
    if (pool.length < 12) { document.querySelector(".daily").hidden = true; return; }
    const answer = pool[((dayNo - 1) % pool.length + pool.length) % pool.length];
    const dayRand = mulberry32(dayNo * 7919);
    const others = pool.filter((m) => m !== answer)
      .map((m) => [dayRand() - (KEYS.some((k) => m.idx[k] === answer.idx[k]) ? 1 : 0), m])
      .sort((a, b) => a[0] - b[0]).slice(0, 5).map((x) => x[1]);
    const options = [answer, ...others].sort((a, b) => a.t.localeCompare(b.t));
    const clues = [
      ["The insured", answer.wt], ["Location", answer.loc], ["Threat", answer.th],
      answer.d ? ["Filed by", `${answer.d}, ${answer.y}`] : ["Year", String(answer.y)],
    ];
    const MAX = clues.length;
    let saved = { day: dayNo, guesses: [] }, streak = { last: 0, n: 0, best: 0 };
    try {
      const s = JSON.parse(localStorage.getItem("hfg-daily") || "null");
      if (s && s.day === dayNo && Array.isArray(s.guesses)) saved = s;
      streak = Object.assign(streak, JSON.parse(localStorage.getItem("hfg-daily-streak") || "{}"));
    } catch {}
    const store = () => {
      try {
        localStorage.setItem("hfg-daily", JSON.stringify(saved));
        localStorage.setItem("hfg-daily-streak", JSON.stringify(streak));
      } catch {}
    };
    const won = () => saved.guesses.includes(answer.t);
    const over = () => won() || saved.guesses.length >= MAX;
    const resultLine = () => (won()
      ? `${"☠".repeat(saved.guesses.length - 1)}${"✓"}${"·".repeat(MAX - saved.guesses.length)} solved on item ${saved.guesses.length} of ${MAX}`
      : `${"☠".repeat(MAX)} unsolved`);

    function render() {
      const shownCount = Math.min(saved.guesses.length + 1, MAX);
      const list = $("daily-clues");
      list.innerHTML = "";
      clues.forEach(([k, v], i) => {
        const open = i < shownCount || over();
        const li = el("li", open ? null : "sealed");
        li.append(el("span", "clue-k", k), el("span", null, open ? v : `Sealed until guess ${i + 1}`));
        list.append(li);
      });
      const box = $("daily-options");
      box.innerHTML = "";
      options.forEach((m) => {
        const b = el("button", null, m.t);
        b.type = "button";
        if (saved.guesses.includes(m.t)) b.className = m === answer ? "right" : "wrong";
        else if (over() && m === answer) b.className = "right";
        b.disabled = over() || saved.guesses.includes(m.t);
        b.addEventListener("click", () => guess(m));
        box.append(b);
      });
      const msg = $("daily-msg"), ans = $("daily-answer");
      ans.innerHTML = "";
      if (!over()) {
        msg.textContent = saved.guesses.length
          ? `Not that one. Another item has been unsealed. ${plural(MAX - saved.guesses.length, "guess", "guesses")} left.`
          : "Which film is this?";
      } else {
        msg.textContent = won()
          ? ["Solved on the first item. You have seen things.", "Solved on two items. Respectable.",
            "Solved on three items.", "Solved on the last item. You survive, barely."][saved.guesses.length - 1]
          : `Unsolved. It was “${answer.t}.” You did not make it to the sequel.`;
        ans.append(movieCard(answer));
        ans.append(el("li", "more", `Case file no. ${dayNo + 1} opens tomorrow.`));
      }
      $("daily-share").hidden = !over();
      $("daily-streak").textContent = streak.n;
      $("daily-best").textContent = streak.best;
    }
    function guess(m) {
      if (over()) return;
      saved.guesses.push(m.t);
      if (over() && streak.last !== dayNo) {
        streak.n = won() ? (streak.last === dayNo - 1 ? streak.n + 1 : 1) : 0;
        streak.best = Math.max(streak.best, streak.n);
        streak.last = dayNo;
      }
      store();
      render();
    }
    $("daily-no").textContent = `Daily case file no. ${dayNo} · ${now.toLocaleDateString(undefined, { month: "long", day: "numeric" })}`;
    $("daily-share").addEventListener("click", () => copy($("daily-share"),
      `Horror Case File no. ${dayNo}: ${resultLine()}\n${location.href.split("#")[0]}`, "Copied. Go and gloat.", "Copy my result"));
    render();
  }

  // ---------- would you survive? ----------
  function setupQuiz() {
    const form = $("quiz-form");
    QUIZ.forEach((item, qi) => {
      const fs = el("fieldset");
      fs.append(el("legend", null, `${qi + 1}. ${item.q}`));
      item.a.forEach((ans, ai) => {
        const id = `quiz-${qi}-${ai}`;
        const label = el("label");
        label.htmlFor = id;
        const input = el("input");
        input.type = "radio"; input.name = `quiz-${qi}`; input.value = String(ai); input.id = id;
        label.append(input, el("span", null, ans.t));
        fs.append(label);
      });
      form.append(fs);
    });
    let summary = "";
    form.addEventListener("change", () => {
      const picks = QUIZ.map((item, qi) => {
        const checked = form.querySelector(`input[name="quiz-${qi}"]:checked`);
        return checked ? item.a[Number(checked.value)] : null;
      });
      if (picks.some((p) => !p)) return;
      const risk = picks.reduce((n, p) => n + p.r, 0);
      const worst = picks.slice().sort((a, b) => b.r - a.r)[0];
      const safest = picks.filter((p) => p.r === 0).length;
      let stampText, head, when;
      if (risk <= 2) {
        stampText = "Insurable"; when = "You survive";
        head = "You survive. In fairness, you were never in the movie. You turned around at the gas station.";
      } else if (risk <= 7) {
        stampText = "Insurable, at a price"; when = "You survive";
        head = "You survive, changed. You are the sole survivor, and sequel obligations apply.";
      } else if (risk <= 13) {
        stampText = "High risk"; when = "Minute 71";
        head = "You make it to the third act, which is more than most. Then you get confident.";
      } else if (risk <= 19) {
        stampText = "Declined"; when = "Minute 38";
        head = "You are gone before the halfway mark. The others say your name once and move on.";
      } else {
        stampText = "Declined, with concern"; when = "Minute 9";
        head = "You are the cold open. The title appears directly after you do not.";
      }
      $("quiz-stamp").textContent = stampText;
      $("quiz-stamp").dataset.level = risk <= 7 ? 0 : 3;
      $("quiz-head").textContent = head;
      const facts = $("quiz-facts");
      facts.innerHTML = "";
      const rows = [
        ["Estimated departure", when],
        ["Classification", worst.r > 0 ? worst.kind : "The Realist"],
        ["Cause", worst.r > 0 && risk > 7 ? `${upper(worst.cause)}.` : "Not applicable. Please stop bragging."],
        ["Sensible decisions", `${safest} of ${QUIZ.length}`],
        ["Premium", risk <= 2 ? "Standard rate" : risk <= 7 ? "Triple, plus a waiver" : "We would rather not"],
      ];
      rows.forEach(([k, v]) => facts.append(el("dt", null, k), el("dd", null, v)));
      summary = `Midnight Mutual risk assessment: ${stampText}. Estimated departure: ${when.toLowerCase()}. Classification: ${rows[1][1]}.`;
      $("quiz-result").hidden = false;
    });
    $("quiz-share").addEventListener("click", () => copy($("quiz-share"),
      `${summary}\n${location.href.split("#")[0]}`, "Copied.", "Copy my assessment"));
  }

  // ---------- real or fake? ----------
  const ROMAN = ["III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const sequels = MOVIES.filter((m) => m.fr && (m.rel === "sequel" || m.rel === "prequel") && m.t.toLowerCase() !== m.fr.toLowerCase());
  const withPlots = MOVIES.filter((m) => m.s);
  function fakeSequel(m) {
    for (let i = 0; i < 30; i++) {
      const style = Math.random();
      const sub = pick(Math.random, FAKE_SUBTITLES);
      const t = style < 0.5 ? `${m.fr} ${pick(Math.random, ROMAN)}: ${sub}` : `${m.fr}: ${sub}`;
      if (!realTitles.has(t.toLowerCase())) return t;
    }
    return `${m.fr}: The Paperwork`;
  }
  const fakePlot = () => `${pick(Math.random, FAKE_PLOT_WHO)} ${pick(Math.random, FAKE_PLOT_GOES)} ${pick(Math.random, FAKE_PLOT_THEN)}.`;
  const game = { mode: sequels.length >= 8 ? "sequels" : "plots", real: null, fake: null, done: false, streak: 0, best: 0 };
  try { game.best = Number(localStorage.getItem("hfg-best")) || 0; } catch {}
  const choiceEls = [$("choice-a"), $("choice-b")];

  function newRound() {
    const plots = game.mode === "plots";
    game.real = pick(Math.random, plots ? withPlots : sequels);
    game.fake = plots ? fakePlot() : fakeSequel(game.real);
    game.done = false;
    const realFirst = Math.random() < 0.5;
    choiceEls.forEach((b, i) => {
      const isReal = (i === 0) === realFirst;
      b.textContent = isReal ? (plots ? game.real.s : game.real.t) : game.fake;
      b.dataset.real = String(isReal);
      b.className = plots ? "choice plot" : "choice";
      b.disabled = false;
    });
    $("game-sub").textContent = plots
      ? "One of these is the plot of a real horror film. We wrote the other one thirty seconds ago."
      : "One of these sequels exists. We made the other one up thirty seconds ago.";
    $("game-msg").innerHTML = "&nbsp;";
    $("game-next").hidden = true;
    $("best").textContent = game.best;
    $("mode-sequels").setAttribute("aria-pressed", String(!plots));
    $("mode-plots").setAttribute("aria-pressed", String(plots));
  }
  choiceEls.forEach((b) => b.addEventListener("click", () => {
    if (game.done) return;
    game.done = true;
    const right = b.dataset.real === "true";
    choiceEls.forEach((c) => { c.disabled = true; c.classList.add(c.dataset.real === "true" ? "is-real" : "is-fake"); });
    const m = game.real;
    const credit = `“${m.t}” (${m.y}${m.d ? `, directed by ${m.d}` : ""})`;
    $("game-msg").textContent = (right ? "Correct. " : "Incorrect. ") + (game.mode === "plots"
      ? `The real one is ${credit}. The other one is ours. For now.`
      : `${credit} is a real film that people were paid to make. “${game.fake}” is ours. For now.`);
    game.streak = right ? game.streak + 1 : 0;
    if (game.streak > game.best) {
      game.best = game.streak;
      try { localStorage.setItem("hfg-best", String(game.best)); } catch {}
    }
    $("streak").textContent = game.streak;
    $("best").textContent = game.best;
    $("game-next").hidden = false;
  }));
  $("game-next").addEventListener("click", newRound);
  $("mode-plots").addEventListener("click", () => { game.mode = "plots"; newRound(); });
  $("mode-sequels").addEventListener("click", () => { if (sequels.length) { game.mode = "sequels"; newRound(); } });

  // ---------- actuarial tables ----------
  function bars(target, rows) {
    const max = Math.max(...rows.map((r) => r[1]), 1);
    rows.forEach(([label, n]) => {
      const li = el("li");
      const bar = el("span", "bar");
      bar.style.width = `${(n / max) * 100}%`;
      li.append(el("span", "bar-label", label), el("span", "bar-n", String(n)), bar);
      target.append(li);
    });
  }

  function renderFacts() {
    const N = MOVIES.length;
    const facts = [];
    const the = MOVIES.filter((m) => /^the /i.test(m.t)).length;
    facts.push(`${the} of ${N} titles begin with “The.” It is the scariest word in the English language.`);
    const stop = new Set("the a an of in on at to and for from with part ii iii iv is it my no not you your de la".split(" "));
    const words = top(tally(MOVIES.flatMap((m) => [...new Set(m.t.toLowerCase().match(/[a-z']{3,}/g) || [])].filter((w) => !stop.has(w)))), 3);
    if (words.length === 3) {
      const [a, b, c] = words.map(([w]) => upper(w));
      facts.push(`The most common title words are “${a}” (${words[0][1]}), “${b}” (${words[1][1]}) and “${c}” (${words[2][1]}). The statistically average film is therefore called “The ${a} ${b} of the ${c}.”`);
    }
    const repeats = MOVIES.filter((m) => ["sequel", "prequel", "remake", "reboot", "spinoff"].includes(m.rel)).length;
    if (repeats) facts.push(`${repeats} of ${N} films on file (${Math.round((repeats / N) * 100)}%) are sequels, prequels, remakes or reboots. Originality is not a covered benefit.`);
    const biggest = top(Object.fromEntries(Object.entries(franchises).map(([k, v]) => [k, v.length])), 1)[0];
    if (biggest && biggest[1] > 2) {
      const list = franchises[biggest[0]];
      facts.push(`The largest single file is “${biggest[0]}”: ${biggest[1]} entries between ${list[0].y} and ${list[list.length - 1].y}. The threat has been declared permanently defeated in most of them.`);
    }
    const combos = new Set(complete.map((m) => KEYS.map((k) => m.idx[k]).join(",")));
    const total = WHO.length * WHERE.length * WHAT.length;
    const years = complete.map((m) => m.y);
    if (years.length > 5) {
      const span = Math.max(...years) - Math.min(...years) + 1;
      const doneBy = Math.max(...years) + Math.ceil((total - combos.size) / (combos.size / span));
      facts.push(`Films on file cover ${combos.size} of the ${total.toLocaleString()} possible combinations of victim, location and threat. At the current rate, every possible thing will have gone wrong by the year ${doneBy}.`);
    }
    const noMistake = MOVIES.filter((m) => m.mk).length;
    if (noMistake) facts.push(`In ${noMistake} of ${N} films we were able to identify a specific, avoidable decision. In the rest, we assume one occurred off screen.`);
    facts.forEach((f) => $("facts").append(el("li", null, f)));
  }

  function renderStats() {
    const years = MOVIES.map((m) => m.y);
    const span = `${Math.min(...years)}–${Math.max(...years)}`;
    $("count").textContent = `${MOVIES.length} real horror films on file, ${span}`;
    $("stats-sub").textContent =
      `Methodology: we read the plots of ${MOVIES.length} real horror films (${span}) so that you would not have to go down there. We are fine.`;
    renderFacts();
    KEYS.forEach((k) => bars($(`stat-${k}`), REELS[k].map((b, i) => [b.label, tallies[k][i]]).sort((a, b) => b[1] - a[1]).slice(0, 6)));
    bars($("stat-franchise"), top(Object.fromEntries(Object.entries(franchises).map(([k, v]) => [k, v.length])), 6));
    bars($("stat-decade"), Object.entries(tally(MOVIES.map((m) => `${Math.floor(m.y / 10) * 10}s`))).sort((a, b) => a[0].localeCompare(b[0])));
    bars($("stat-tags"), top(tally(MOVIES.flatMap((m) => m.tg || []).filter((t) => TAG_LABELS[t])), 6).map(([t, n]) => [TAG_LABELS[t], n]));

    const combos = {};
    complete.filter((m) => KEYS.every((k) => m[k] !== "other")).forEach((m) => {
      const key = KEYS.map((k) => m.idx[k]).join(",");
      (combos[key] = combos[key] || []).push(m);
    });
    const best = Object.entries(combos).sort((a, b) => b[1].length - a[1].length)[0];
    if (best && best[1].length > 1) {
      const [a, b, c] = best[0].split(",").map(Number);
      const line = $("stat-combo");
      line.append(
        el("b", null, "The most frequently filed claim: "),
        `${WHO[a].label} + ${WHERE[b].label} + ${WHAT[c].label}. It has happened ${best[1].length} times. `
      );
      const btn = el("button", "ghost small", "Show me");
      btn.type = "button";
      btn.addEventListener("click", () => {
        const s = { who: a, where: b, what: c, oops: randomIndex("oops"), seed: newSeed() };
        ALL.forEach((k) => showFinal(k, s[k]));
        show(s, true);
        scrollTo($("result"));
      });
      line.append(btn);
    }
  }

  // Exhibit A: real, avoidable decisions.
  const exhibits = shuffled(Math.random, MOVIES.filter((m) => m.mk));
  let exhibitAt = 0;
  function showExhibit() {
    if (!exhibits.length) { document.querySelector(".exhibit").hidden = true; return; }
    const m = exhibits[exhibitAt % exhibits.length];
    $("exhibit-text").textContent = `“${m.mk}”`;
    $("exhibit-src").textContent = `${m.t} (${m.y})`;
  }
  $("exhibit-next").addEventListener("click", () => { exhibitAt++; showExhibit(); });

  // ---------- browse everything ----------
  const sorted = MOVIES.slice().sort((a, b) => b.y - a.y || a.t.localeCompare(b.t));
  const haystack = new Map(sorted.map((m) => [m, [m.t, m.y, m.d, m.wt, m.loc, m.th, m.mk, m.fr, m.s].join(" ").toLowerCase()]));
  function renderBrowse() {
    const q = $("filter").value.trim().toLowerCase();
    const hits = q ? sorted.filter((m) => haystack.get(m).includes(q)) : sorted;
    const list = $("all-movies");
    list.innerHTML = "";
    hits.slice(0, 60).forEach((m) => list.append(movieCard(m)));
    $("filter-count").textContent = hits.length > 60
      ? `Showing 60 of ${hits.length}. Search to narrow it down.`
      : plural(hits.length, "film", "films");
  }
  $("filter").addEventListener("input", renderBrowse);
  $("browse-h").textContent = `The full case archive (${MOVIES.length} films)`;

  // ---------- go ----------
  renderStats();
  setupDaily();
  setupQuiz();
  showExhibit();
  renderBrowse();
  newRound();
  const shared = decodeState(location.hash);
  if (shared) {
    ALL.forEach((k) => showFinal(k, shared[k]));
    show(shared, true); // a shared link shows the finding straight away
  }
})();
