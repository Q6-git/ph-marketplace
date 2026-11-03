// 팔렝케 마켓 — 필리핀 중고거래 시제품 (프레임워크 없는 SPA)
(() => {
  "use strict";

  // ---------- 저장소 ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("palengke:" + key);
        return v ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("palengke:" + key, JSON.stringify(value));
        return true;
      } catch {
        toast("저장 공간이 부족해요. 사진 크기를 줄여 주세요.");
        return false;
      }
    },
  };

  let myItems = store.get("myItems", []);
  let favorites = new Set(store.get("favorites", []));
  let chats = store.get("chats", {});
  let soldIds = new Set(store.get("sold", []));

  const filters = { q: "", category: "all", region: "", sort: "new", freeOnly: false };

  const allItems = () => [...myItems, ...SAMPLE_ITEMS];
  const findItem = (id) => allItems().find((i) => i.id === id);
  const isMine = (item) => item.id.startsWith("u");

  // ---------- 유틸 ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const peso = (n) => (n === 0 ? "무료 나눔" : "₱" + n.toLocaleString("en-PH"));
  const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

  function timeAgo(ts) {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 1) return "방금 전";
    if (m < 60) return m + "분 전";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "시간 전";
    const d = Math.floor(h / 24);
    return d < 30 ? d + "일 전" : Math.floor(d / 30) + "달 전";
  }

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function thumb(item, cls = "") {
    const sold = soldIds.has(item.id) ? `<span class="sold-badge">거래완료</span>` : "";
    if (item.photo) {
      return `<div class="thumb ${cls}"><img src="${item.photo}" alt="${esc(item.title)}" loading="lazy">${sold}</div>`;
    }
    const color = item.color || "#8a8f98";
    return `<div class="thumb ${cls}" style="--c:${esc(color)}"><span class="thumb-icon">${catOf(item.category).icon}</span>${sold}</div>`;
  }

  function favBtn(item) {
    const on = favorites.has(item.id);
    return `<button class="fav ${on ? "on" : ""}" data-fav="${esc(item.id)}" aria-pressed="${on}" aria-label="찜하기">${on ? "♥" : "♡"}</button>`;
  }

  function card(item) {
    return `
      <article class="card">
        <a href="#/item/${esc(item.id)}" class="card-link">
          ${thumb(item)}
          <div class="card-body">
            <h3 class="card-title">${esc(item.title)}</h3>
            <p class="card-price ${item.price === 0 ? "free" : ""}">${peso(item.price)}</p>
            <p class="card-meta">${esc(item.region.split(" · ").pop())} · ${timeAgo(item.createdAt)}</p>
          </div>
        </a>
        ${favBtn(item)}
      </article>`;
  }

  // ---------- 화면: 홈 ----------
  function renderHome() {
    const q = filters.q.trim().toLowerCase();
    let list = allItems().filter((i) => {
      if (filters.category !== "all" && i.category !== filters.category) return false;
      if (filters.region && i.region !== filters.region) return false;
      if (filters.freeOnly && i.price !== 0) return false;
      if (q && !(i.title + " " + i.desc).toLowerCase().includes(q)) return false;
      return true;
    });
    const sorters = {
      new: (a, b) => b.createdAt - a.createdAt,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      popular: (a, b) => (b.views || 0) - (a.views || 0),
    };
    list.sort(sorters[filters.sort]);

    const chips = CATEGORIES.map(
      (c) =>
        `<button class="chip ${filters.category === c.id ? "on" : ""}" data-cat="${c.id}"><span>${c.icon}</span>${c.name}</button>`
    ).join("");

    const regionOpts = ['<option value="">필리핀 전체 지역</option>']
      .concat(REGIONS.map((r) => `<option ${filters.region === r ? "selected" : ""}>${esc(r)}</option>`))
      .join("");

    app.innerHTML = `
      ${filters.q ? "" : `
      <section class="hero">
        <div>
          <h1>우리 동네 중고거래,<br>팔렝케에서 <em>Mabuhay!</em></h1>
          <p>마닐라부터 세부, 다바오까지. GCash로 간편하게, 직거래로 안전하게.</p>
        </div>
        <a href="#/sell" class="btn btn-light">내 물건 팔기 →</a>
      </section>`}
      <div class="chips" role="tablist" aria-label="카테고리">${chips}</div>
      <div class="toolbar">
        <select id="regionSel" aria-label="지역">${regionOpts}</select>
        <select id="sortSel" aria-label="정렬">
          <option value="new" ${filters.sort === "new" ? "selected" : ""}>최신순</option>
          <option value="popular" ${filters.sort === "popular" ? "selected" : ""}>인기순</option>
          <option value="low" ${filters.sort === "low" ? "selected" : ""}>낮은 가격순</option>
          <option value="high" ${filters.sort === "high" ? "selected" : ""}>높은 가격순</option>
        </select>
        <label class="check"><input type="checkbox" id="freeOnly" ${filters.freeOnly ? "checked" : ""}> 무료 나눔만</label>
        <span class="count">${filters.q ? `“${esc(filters.q)}” 검색 결과 ` : ""}${list.length}개</span>
      </div>
      ${list.length
        ? `<div class="grid">${list.map(card).join("")}</div>`
        : `<div class="empty"><p>😢 조건에 맞는 물건이 없어요.</p><button class="btn" id="resetFilters">필터 초기화</button></div>`}
    `;

    $$(".chip", app).forEach((b) =>
      b.addEventListener("click", () => {
        filters.category = b.dataset.cat;
        renderHome();
      })
    );
    $("#regionSel").addEventListener("change", (e) => { filters.region = e.target.value; renderHome(); });
    $("#sortSel").addEventListener("change", (e) => { filters.sort = e.target.value; renderHome(); });
    $("#freeOnly").addEventListener("change", (e) => { filters.freeOnly = e.target.checked; renderHome(); });
    const reset = $("#resetFilters");
    if (reset)
      reset.addEventListener("click", () => {
        Object.assign(filters, { q: "", category: "all", region: "", sort: "new", freeOnly: false });
        $("#searchInput").value = "";
        renderHome();
      });
  }

  // ---------- 화면: 상세 ----------
  function renderDetail(id) {
    const item = findItem(id);
    if (!item) {
      app.innerHTML = `<div class="empty"><p>삭제되었거나 없는 게시글이에요.</p><a class="btn" href="#/">홈으로</a></div>`;
      return;
    }
    const mine = isMine(item);
    const sold = soldIds.has(item.id);
    const tags = (arr) => arr.map((t) => `<span class="tag">${esc(t)}</span>`).join("");

    app.innerHTML = `
      <a href="#/" class="back">← 목록으로</a>
      <div class="detail">
        <div class="detail-media">${thumb(item, "big")}</div>
        <div class="detail-info">
          <p class="crumb">${catOf(item.category).icon} ${catOf(item.category).name}</p>
          <h1>${esc(item.title)}</h1>
          <p class="detail-price ${item.price === 0 ? "free" : ""}">${peso(item.price)}</p>
          <p class="card-meta">📍 ${esc(item.region)} · ${timeAgo(item.createdAt)} · 조회 ${item.views || 0}</p>

          <dl class="specs">
            <dt>상태</dt><dd>${esc(item.condition)}</dd>
            <dt>거래 방법</dt><dd>${tags(item.deal)}</dd>
            <dt>결제</dt><dd>${tags(item.pay)}</dd>
          </dl>

          <p class="desc">${esc(item.desc).replace(/\n/g, "<br>")}</p>

          <div class="seller">
            <div class="avatar">${esc(item.seller.charAt(0))}</div>
            <div>
              <strong>${esc(item.seller)}</strong>
              <span>⭐ ${item.rating ? item.rating.toFixed(1) : "신규"} · ${mine ? "내 게시글" : "본인인증 완료"}</span>
            </div>
          </div>

          <div class="actions">
            ${favBtn(item)}
            ${mine
              ? `<button class="btn" id="toggleSold">${sold ? "판매중으로 변경" : "거래완료로 변경"}</button>
                 <button class="btn btn-danger" id="deleteItem">삭제</button>`
              : `<button class="btn btn-primary grow" id="openChat" ${sold ? "disabled" : ""}>${sold ? "거래가 완료된 물건이에요" : "💬 판매자와 채팅하기"}</button>`}
          </div>

          <div class="safety">
            🛡️ <strong>안전거래 팁</strong> · 몰이나 경찰서 근처 등 사람 많은 곳에서 만나세요. 물건을 확인하기 전에는 GCash로 먼저 송금하지 마세요.
          </div>
        </div>
      </div>
      <div id="chatPanel"></div>
    `;

    if (mine) {
      $("#toggleSold").addEventListener("click", () => {
        sold ? soldIds.delete(item.id) : soldIds.add(item.id);
        store.set("sold", [...soldIds]);
        toast(sold ? "판매중으로 바꿨어요" : "거래완료! 축하해요 🎉");
        renderDetail(id);
      });
      $("#deleteItem").addEventListener("click", () => {
        if (!confirm("이 게시글을 삭제할까요?")) return;
        myItems = myItems.filter((i) => i.id !== item.id);
        store.set("myItems", myItems);
        favorites.delete(item.id);
        store.set("favorites", [...favorites]);
        toast("삭제했어요");
        location.hash = "#/my";
      });
    } else if (!sold) {
      $("#openChat").addEventListener("click", () => openChat(item));
      if (chats[item.id]) openChat(item);
    }
  }

  // ---------- 채팅 (모의) ----------
  const REPLIES = [
    "안녕하세요! 네 아직 판매 중이에요 😊",
    "직거래는 주말 오후가 편해요. 어디가 편하세요?",
    "GCash도 가능하고 현금도 괜찮아요.",
    "조금은 깎아드릴 수 있어요. 얼마 생각하세요?",
    "Salamat po! 그럼 그때 뵐게요 🙏",
  ];

  function openChat(item) {
    const panel = $("#chatPanel");
    const msgs = chats[item.id] || [];
    panel.innerHTML = `
      <section class="chat">
        <header><strong>${esc(item.seller)}</strong>님과의 채팅 <small>(시제품: 자동 응답)</small></header>
        <div class="chat-log" id="chatLog"></div>
        <div class="quick">
          ${["아직 판매하시나요?", "가격 조정 가능할까요?", "GCash 되나요?", "직거래 장소는 어디인가요?"]
            .map((q) => `<button class="chip" data-q="${esc(q)}">${esc(q)}</button>`).join("")}
        </div>
        <form id="chatForm" class="chat-form">
          <input id="chatInput" placeholder="메시지를 입력하세요" autocomplete="off" maxlength="300">
          <button class="btn btn-primary">보내기</button>
        </form>
      </section>`;

    const log = $("#chatLog");
    const draw = () => {
      log.innerHTML = msgs.length
        ? msgs.map((m) => `<div class="msg ${m.me ? "me" : ""}"><span>${esc(m.text)}</span></div>`).join("")
        : `<p class="chat-hint">판매자에게 첫 메시지를 보내 보세요.</p>`;
      log.scrollTop = log.scrollHeight;
    };
    const send = (text) => {
      text = text.trim();
      if (!text) return;
      msgs.push({ me: true, text });
      chats[item.id] = msgs;
      store.set("chats", chats);
      draw();
      setTimeout(() => {
        const theirs = msgs.filter((m) => !m.me).length;
        msgs.push({ me: false, text: REPLIES[theirs % REPLIES.length] });
        store.set("chats", chats);
        if (document.body.contains(log)) draw();
      }, 900);
    };
    $("#chatForm").addEventListener("submit", (e) => {
      e.preventDefault();
      send($("#chatInput").value);
      $("#chatInput").value = "";
    });
    $$("[data-q]", panel).forEach((b) => b.addEventListener("click", () => send(b.dataset.q)));
    draw();
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    $("#chatInput").focus({ preventScroll: true });
  }

  // ---------- 화면: 판매하기 ----------
  function renderSell() {
    const checks = (name, arr, def) =>
      arr.map((v) => `<label class="check"><input type="checkbox" name="${name}" value="${esc(v)}" ${def.includes(v) ? "checked" : ""}> ${esc(v)}</label>`).join("");

    app.innerHTML = `
      <a href="#/" class="back">← 취소</a>
      <h1 class="page-title">내 물건 팔기</h1>
      <form id="sellForm" class="sell" novalidate>
        <label class="photo-drop" id="photoDrop">
          <input type="file" accept="image/*" id="photoInput" hidden>
          <span id="photoPreview">📷<br>사진 추가 (선택)</span>
        </label>

        <label>제목 <input name="title" required maxlength="60" placeholder="예: 아이폰 13 128GB 블루"></label>

        <div class="row">
          <label>카테고리
            <select name="category" required>
              <option value="">선택하세요</option>
              ${CATEGORIES.filter((c) => c.id !== "all").map((c) => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("")}
            </select>
          </label>
          <label>상태
            <select name="condition">${CONDITIONS.map((c) => `<option>${c}</option>`).join("")}</select>
          </label>
        </div>

        <div class="row">
          <label>가격 (₱)
            <input name="price" type="number" inputmode="numeric" min="0" step="1" placeholder="예: 2500">
          </label>
          <label class="check inline"><input type="checkbox" name="free"> 무료 나눔</label>
        </div>

        <label>거래 지역
          <select name="region" required>
            <option value="">선택하세요</option>
            ${REGIONS.map((r) => `<option>${esc(r)}</option>`).join("")}
          </select>
        </label>

        <fieldset><legend>거래 방법</legend>${checks("deal", DEALS, ["직거래"])}</fieldset>
        <fieldset><legend>결제 수단</legend>${checks("pay", PAYMENTS, ["현금", "GCash"])}</fieldset>

        <label>설명
          <textarea name="desc" rows="5" maxlength="1000" placeholder="구매 시기, 사용감, 하자 여부, 직거래 가능 장소 등을 적어 주세요."></textarea>
        </label>

        <label>판매자 이름 <input name="seller" maxlength="20" placeholder="예: Juan D." value="${esc(store.get("sellerName", ""))}"></label>

        <p class="form-error" id="formError" role="alert"></p>
        <button class="btn btn-primary big">등록하기</button>
      </form>`;

    const form = $("#sellForm");
    let photo = null;

    $("#photoInput").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        photo = await resizeImage(file, 800);
        $("#photoPreview").innerHTML = `<img src="${photo}" alt="미리보기">`;
      } catch {
        toast("사진을 불러오지 못했어요");
      }
    });

    form.free.addEventListener("change", () => {
      form.price.disabled = form.free.checked;
      if (form.free.checked) form.price.value = "";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#formError");
      const deal = $$('input[name="deal"]:checked', form).map((i) => i.value);
      const pay = $$('input[name="pay"]:checked', form).map((i) => i.value);
      const price = form.free.checked ? 0 : Number(form.price.value);

      const problems = [];
      if (!form.title.value.trim()) problems.push("제목");
      if (!form.category.value) problems.push("카테고리");
      if (!form.free.checked && (!form.price.value || price < 0 || !Number.isFinite(price))) problems.push("가격");
      if (!form.region.value) problems.push("거래 지역");
      if (!deal.length) problems.push("거래 방법");
      if (!pay.length) problems.push("결제 수단");
      if (problems.length) {
        err.textContent = problems.join(", ") + "을(를) 확인해 주세요.";
        return;
      }

      const seller = form.seller.value.trim() || "나";
      store.set("sellerName", form.seller.value.trim());
      const item = {
        id: "u" + Date.now().toString(36),
        title: form.title.value.trim(),
        price: Math.round(price),
        category: form.category.value,
        region: form.region.value,
        condition: form.condition.value,
        deal,
        pay,
        desc: form.desc.value.trim() || "설명이 없습니다.",
        seller,
        rating: 0,
        createdAt: Date.now(),
        views: 0,
        photo,
        color: "#0b7a75",
      };
      myItems.unshift(item);
      if (!store.set("myItems", myItems)) {
        myItems.shift();
        return;
      }
      toast("등록 완료! 🎉");
      location.hash = "#/item/" + item.id;
    });
  }

  function resizeImage(file, max) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(); };
      img.src = url;
    });
  }

  // ---------- 화면: 찜 / 내 판매 ----------
  function renderList(title, list, emptyMsg) {
    app.innerHTML = `
      <h1 class="page-title">${title} <small>${list.length}</small></h1>
      ${list.length
        ? `<div class="grid">${list.map(card).join("")}</div>`
        : `<div class="empty"><p>${emptyMsg}</p><a class="btn btn-primary" href="${title === "내 판매" ? "#/sell" : "#/"}">${title === "내 판매" ? "첫 물건 올리기" : "둘러보기"}</a></div>`}`;
  }

  // ---------- 라우터 ----------
  const app = $("#app");

  function route() {
    const [, page, id] = location.hash.split("/");
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === (page || "home")));
    if (page === "item" && id) renderDetail(decodeURIComponent(id));
    else if (page === "sell") renderSell();
    else if (page === "favorites")
      renderList("찜한 물건", allItems().filter((i) => favorites.has(i.id)), "♡를 눌러 마음에 드는 물건을 모아 보세요.");
    else if (page === "my") renderList("내 판매", myItems, "아직 올린 물건이 없어요.");
    else renderHome();
    window.scrollTo(0, 0);
  }

  // 찜 버튼 (어느 화면이든)
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fav]");
    if (!b) return;
    e.preventDefault();
    const id = b.dataset.fav;
    const on = !favorites.has(id);
    on ? favorites.add(id) : favorites.delete(id);
    store.set("favorites", [...favorites]);
    $$(`[data-fav="${CSS.escape(id)}"]`).forEach((x) => {
      x.classList.toggle("on", on);
      x.textContent = on ? "♥" : "♡";
      x.setAttribute("aria-pressed", on);
    });
    toast(on ? "찜 목록에 추가했어요" : "찜을 해제했어요");
  });

  // 검색
  const searchInput = $("#searchInput");
  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      filters.q = searchInput.value;
      if (location.hash && location.hash !== "#/") location.hash = "#/";
      else renderHome();
    }, 200);
  });
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    filters.q = searchInput.value;
    if (location.hash && location.hash !== "#/") location.hash = "#/";
    else renderHome();
  });

  window.addEventListener("hashchange", route);
  route();
})();
