"use strict";

const CONFIG = {
  storageKey: "cafe-juju-experience-incident-v1",
  soundHorrorLink: "",
  assets: {
    end1Audio: "./assets/digicam_last_voice.mp3",
    end2Audio: "./assets/red_mantle_chase.mp3",
    titleLogo: "./assets/title-logo.png"
  },
  altar: {
    code: "SR-A00"
  },
  inspections: [
    { code: "1F-A01", floor: "1F", name: "客席テーブル", resultText: "客席テーブルを点検しました。\n異常なし。" },
    { code: "1F-A02", floor: "1F", name: "階段扉", resultText: "階段扉を点検しました。\n異常なし。" },
    { code: "1F-A03", floor: "1F", name: "クマのぬいぐるみ", resultText: "クマのぬいぐるみを点検しました。\n異常なし。" },
    { code: "1F-A04", floor: "1F", name: "青い時計", resultText: "青い時計を点検しました。\n異常なし。" },
    { code: "1F-A05", floor: "1F", name: "絵本", resultText: "絵本を点検しました。\n異常なし。" },
    { code: "1F-A06", floor: "1F", name: "緑のカーテン", resultText: "緑のカーテンを点検しました。\n異常なし。" },
    { code: "2F-A01", floor: "2F", name: "白いキャビネット", resultText: "白いキャビネットを点検しました。\n異常なし。" },
    { code: "2F-A02", floor: "2F", name: "客席テーブル", resultText: "2階の客席テーブルを点検しました。\n異常なし。" },
    { code: "2F-A03", floor: "2F", name: "生き人形", resultText: "生き人形を点検しました。\n異常なし。" },
    { code: "2F-A04", floor: "2F", name: "マグロ", resultText: "マグロを点検しました。\n異常なし。" },
    { code: "2F-A05", floor: "2F", name: "サウンドルーム入り口", resultText: "サウンドルーム入り口を点検しました。\n異常なし。" },
    { code: "2F-A06", floor: "2F", name: "展示棚③", resultText: "展示棚③を点検しました。\n異常なし。" }
  ],
  additionalRecord: `追加点検記録

コラボ準備期間中、
サウンドルームの祭壇に
紫色のチンチラの人形が置かれていた。

人形を設置したスタッフが誰なのかはわからない。

人形が置かれて以降、
サウンドルームおよび店内設備から、
未設定の音声が再生される事例が発生した。

海の音。
コンビニの入店音。
銭湯の排水音。
カメラのシャッター音。
誰かに追われる足音。

あるスタッフは、複数の異なる場所や記録が、
紫色の人形を通じて
店内に流れ込んでいると言っていた。

本点検システム内で再生された音声についても、
その影響なのかもしれない。

人形は現在も祭壇に保管されている。`
};

const ENDINGS = {
  END_1: { code: "END 1", title: "業務完了", result: "CLEAR" },
  END_2: { code: "END 2", title: "赤い部屋", result: "CLEAR" },
  END_3: { code: "END 3", title: "流入記録", result: "COMPLETE" }
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let state = loadState();
let lastMessage = "";
let busy = false;
let currentAudio = null;

const inspectionByKey = new Map(CONFIG.inspections.map((item) => [normalizeCode(item.code), item]));
const inspectionByCode = new Map(CONFIG.inspections.map((item) => [item.code, item]));

render();

function defaultState() {
  return {
    started: false,
    discoveredInspectionCodes: [],
    viewedEndings: [],
    completionStampGranted: false,
    redRoomExperienced: false,
    additionalRecordViewed: false,
    allInspectionPointsCompleted: false,
    autoCallTriggered: false,
    updatedAt: null
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
    return { ...defaultState(), ...(saved || {}) };
  } catch {
    return defaultState();
  }
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
}

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[\s-]+/g, "");
}

function discoveredCount() {
  return state.discoveredInspectionCodes.length;
}

function endingCount() {
  return state.viewedEndings.length;
}

function hasEnding(id) {
  return state.viewedEndings.includes(id);
}

function addEnding(id) {
  if (!hasEnding(id)) {
    state.viewedEndings.push(id);
  }
  state.completionStampGranted = true;
}

function updateAllChecked() {
  state.allInspectionPointsCompleted = discoveredCount() === CONFIG.inspections.length;
}

function displayName(item) {
  if (item.name === "客席テーブル") return `${item.floor === "1F" ? "1階" : "2階"} ${item.name}`;
  return item.name;
}

function setView(html, className = "screen") {
  app.className = className;
  app.innerHTML = html;
}

function bind(selector, event, handler) {
  const node = document.querySelector(selector);
  if (node) node.addEventListener(event, handler);
}

function startGame() {
  state.started = true;
  saveState();
  renderMain("店内の点検対象付近に貼られた管理番号をご確認ください。");
}

function render() {
  if (!state.started) {
    renderIntro();
    return;
  }
  renderMain(lastMessage);
}

function renderIntro() {
  setView(`
    <section class="hero">
      <div class="hero-inner">
        <p class="kicker">Caféジュジュ</p>
        <h1 class="title">スタッフ体験</h1>
        <p class="body-text">店内に設置された管理番号を探し、<br>点検業務を完了してください。</p>
        <p class="body-text">12か所のうち、5か所を点検すると<br>業務完了イベントが発生します。</p>
        <p class="body-text">所要時間：約5～10分</p>
        <p class="body-text">スタッフへの声かけは必要ありません。<br>展示物には触れないでください。</p>
        <div class="actions">
          <button id="start">スタッフ体験を開始する</button>
        </div>
      </div>
    </section>
  `, "app");
  bind("#start", "click", startGame);
}

function renderHeader() {
  return `
    <header class="topbar">
      <div class="top-title">
        <h1>体験事件</h1>
        ${state.completionStampGranted ? `<span class="stamp">体験完了スタンプ</span>` : ""}
      </div>
      <p class="subhead">店内点検業務</p>
    </header>
  `;
}

function renderStats() {
  const remainingToCall = Math.max(0, 5 - discoveredCount());
  const completeLabel = state.allInspectionPointsCompleted ? "ALL CHECKED" : `業務完了まで あと${remainingToCall}件`;
  return `
    <section class="terminal section">
      <h2>進行状況</h2>
      <div class="progress-grid">
        <div class="stat"><b>${discoveredCount()} / ${CONFIG.inspections.length}</b><span>点検済み</span></div>
        <div class="stat"><b>${endingCount()} / 3</b><span>エンディング</span></div>
      </div>
      <p class="hint">${completeLabel}</p>
    </section>
  `;
}

function renderMain(message = "") {
  updateAllChecked();
  saveState();
  const msg = message || "管理番号を入力してください。";
  setView(`
    <div class="altar-bg">
      <section class="screen">
        ${renderHeader()}
        ${renderStats()}
        <section class="terminal section">
          <h2>管理番号入力</h2>
          <form id="entry" class="entry">
            <input id="code" class="code-input" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" placeholder="管理番号を入力してください">
            <button type="submit">点検する</button>
          </form>
          <p class="hint">店内の点検対象付近に貼られた管理番号をご確認ください。</p>
          <div class="message ${msg.includes("見つかりません") ? "error" : msg.includes("確認しました") || msg.includes("点検しました") ? "good" : ""}">${escapeHtml(msg)}</div>
        </section>
        ${renderChecklist()}
        ${renderAfterClearActions()}
        ${renderAdditionalGuide()}
        ${renderEndingStatus()}
      </section>
    </div>
  `, "app");
  bind("#entry", "submit", onSubmitCode);
  bind("#retry-call", "click", () => renderCall());
}

function renderChecklist() {
  const discovered = state.discoveredInspectionCodes
    .map((code) => inspectionByCode.get(code))
    .filter(Boolean)
    .map((item) => `<li class="checked"><span class="check">✓</span><span>${escapeHtml(displayName(item))}</span></li>`);

  if (state.redRoomExperienced) {
    discovered.push(`<li class="checked"><span class="check">✓</span><span>あかいへや</span></li>`);
  }

  const blanks = Array.from({ length: Math.max(0, CONFIG.inspections.length - state.discoveredInspectionCodes.length) }, () =>
    `<li><span class="check"></span><span>未確認</span></li>`
  );

  return `
    <section class="terminal section">
      <h2>点検記録</h2>
      <ul class="check-list">${[...discovered, ...blanks].join("")}</ul>
    </section>
  `;
}

function renderAfterClearActions() {
  if (endingCount() === 0) return "";
  return `
    <section class="terminal section">
      <h2>業務完了</h2>
      <p class="body-text">点検済み ${discoveredCount()} / ${CONFIG.inspections.length}<br>エンディング ${endingCount()} / 3</p>
      <div class="actions">
        <button class="secondary" type="button" onclick="renderMain('点検を続行します。')">点検を続ける</button>
        <button id="retry-call" type="button">別のエンディングを見る</button>
      </div>
    </section>
  `;
}

function renderAdditionalGuide() {
  const link = CONFIG.soundHorrorLink
    ? `<div class="actions"><a class="button-link" href="${CONFIG.soundHorrorLink}">サウンドホラー案内</a></div>`
    : "";
  return `
    <section class="terminal section">
      <h2>追加コンテンツ</h2>
      <p class="body-text">サウンドホラーをご注文の上、<br>サウンドルーム内の祭壇に記載された<br>管理番号を入力してください。</p>
      <p class="body-text">追加コンテンツをお読みいただけます。</p>
      <p class="hint">サウンドホラーは店頭でご注文いただけます。</p>
      ${link}
    </section>
  `;
}

function renderEndingStatus() {
  const labels = state.viewedEndings.map((id) => ENDINGS[id].title);
  const complete = discoveredCount() === CONFIG.inspections.length && endingCount() === 3;
  return `
    <section class="terminal section">
      <h2>エンディング収集状況</h2>
      <div class="meta-row">
        <span class="pill">エンディング ${endingCount()} / 3</span>
        <span class="pill">点検済み ${discoveredCount()} / ${CONFIG.inspections.length}</span>
        ${complete ? `<span class="pill">COMPLETE</span>` : ""}
      </div>
      <p class="hint">${labels.length ? labels.map(escapeHtml).join(" / ") : "未取得"}</p>
    </section>
  `;
}

function onSubmitCode(event) {
  event.preventDefault();
  if (busy) return;
  const input = document.querySelector("#code");
  const raw = input.value;
  const key = normalizeCode(raw);

  if (!key) {
    renderMain("管理番号を入力してください。");
    return;
  }

  if (key === normalizeCode(CONFIG.altar.code)) {
    unlockAdditionalRecord();
    return;
  }

  const item = inspectionByKey.get(key);
  if (!item) {
    renderMain("該当する管理番号が見つかりません。");
    return;
  }

  if (state.discoveredInspectionCodes.includes(item.code)) {
    renderMain(`${displayName(item)}は点検済みです。`);
    return;
  }

  state.discoveredInspectionCodes.push(item.code);
  updateAllChecked();
  const count = discoveredCount();
  lastMessage = `${item.resultText}\n\n点検済み ${count} / ${CONFIG.inspections.length}`;
  saveState();
  renderMain(lastMessage);

  if (count === 5 && !state.autoCallTriggered && !hasEnding("END_1") && !hasEnding("END_2")) {
    state.autoCallTriggered = true;
    saveState();
    busy = true;
    showToast("必要点検数を満たしました。\n業務完了処理を開始します。");
    setTimeout(() => {
      busy = false;
      renderCall();
    }, 1400);
  } else if (count === CONFIG.inspections.length) {
    showToast("全点検項目を確認しました。\n点検済み 12 / 12\nALL CHECKED");
  }
}

function renderCall() {
  stopAudio();
  setView(`
    <section class="call-screen">
      <div class="caller">
        <div class="caller-status">着信中</div>
        <h1 class="caller-name">発信者不明</h1>
        <p class="caller-note">ボタンを押すと音が流れる場合があります。</p>
        <div class="call-buttons">
          <button id="decline" class="danger" type="button">拒否</button>
          <button id="answer" class="call" type="button">応答</button>
        </div>
      </div>
    </section>
  `, "app");
  bind("#answer", "click", startEnd1);
  bind("#decline", "click", startEnd2);
}

async function startEnd1() {
  if (busy) return;
  busy = true;
  setView(`
    <section class="call-screen">
      <div class="caller">
        <div class="caller-status">通話中</div>
        <h1 class="caller-name">発信者不明</h1>
        <p class="caller-note">音声再生中</p>
        <div class="actions">
          <button id="stop-audio" class="secondary" type="button">音声を停止する</button>
        </div>
      </div>
    </section>
  `, "app");
  bind("#stop-audio", "click", stopAudio);
  await playConfiguredAudio(CONFIG.assets.end1Audio, 2600);
  stopAudio();
  setView(`
    <section class="call-screen">
      <div class="caller">
        <div class="caller-status">通話が終了しました。</div>
      </div>
    </section>
  `, "app");
  setTimeout(() => {
    busy = false;
    addEnding("END_1");
    saveState();
    renderEnding("END_1");
  }, 800);
}

async function startEnd2() {
  if (busy) return;
  busy = true;
  const overlay = document.createElement("div");
  overlay.className = "red-room active";
  overlay.innerHTML = "<span>あかいへや</span>";
  document.body.appendChild(overlay);
  playConfiguredAudio(CONFIG.assets.end2Audio, 3300);
  setTimeout(() => {
    stopAudio();
    overlay.remove();
    state.redRoomExperienced = true;
    addEnding("END_2");
    saveState();
    busy = false;
    lastMessage = "業務を終了します。";
    renderEnding("END_2");
  }, 3300);
}

function unlockAdditionalRecord() {
  state.additionalRecordViewed = true;
  addEnding("END_3");
  saveState();
  setView(`
    <div class="altar-bg">
      <section class="screen">
        ${renderHeader()}
        <section class="terminal section">
          <h2>祭壇の点検記録が見つかりました。</h2>
          <p class="body-text">追加点検記録を表示します。</p>
        </section>
        <section class="terminal section">
          <div class="record">${escapeHtml(CONFIG.additionalRecord)}</div>
        </section>
        <section class="terminal section">
          <h2>追加点検記録</h2>
          <p class="body-text">確認完了</p>
          <div class="actions">
            <button id="show-end3" type="button">END 3を確認する</button>
          </div>
        </section>
      </section>
    </div>
  `, "app");
  bind("#show-end3", "click", () => renderEnding("END_3"));
}

function renderEnding(id) {
  const ending = ENDINGS[id];
  setView(`
    <section class="screen ending">
      <div class="ending-code">${ending.code}</div>
      <h1>${ending.title}</h1>
      <div class="clear">${ending.result}</div>
      <div class="actions">
        <button id="back-main" type="button">点検画面へ戻る</button>
        ${id !== "END_3" ? `<button id="retry-call" class="secondary" type="button">別のエンディングを見る</button>` : ""}
      </div>
    </section>
  `);
  bind("#back-main", "click", () => renderMain(id === "END_2" ? "業務を終了します。" : "業務完了"));
  bind("#retry-call", "click", () => renderCall());
}

function playConfiguredAudio(path, fallbackMs) {
  stopAudio();
  return new Promise((resolve) => {
    const audio = new Audio(path);
    currentAudio = audio;
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };
    const fallback = setTimeout(finish, fallbackMs);
    audio.addEventListener("ended", () => {
      clearTimeout(fallback);
      finish();
    });
    audio.addEventListener("error", () => {
      clearTimeout(fallback);
      setTimeout(finish, fallbackMs);
    });
    audio.play().catch(() => {
      clearTimeout(fallback);
      setTimeout(finish, fallbackMs);
    });
  });
}

function stopAudio() {
  if (!currentAudio) return;
  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
