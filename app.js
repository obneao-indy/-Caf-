"use strict";

const CONFIG = {
  storageKey: "cafe-juju-experience-incident-v2",
  soundHorrorLink: "",
  assets: {
    end1Audio: "./assets/digicam_last_voice.mp3",
    end2Audios: [
      "./assets/am-chase.mp3",
      "./assets/am-detected.mp3",
      "./assets/am-scream.wav"
    ],
    titleLogo: "./assets/title-logo.png"
  },
  altar: {
    code: "SR804"
  },
  inspections: [
    { code: "KT417", floor: "1F", name: "客席テーブル", resultText: "客席テーブルを点検しました。\n異常なし。" },
    { code: "NX092", floor: "1F", name: "階段扉", resultText: "階段扉を点検しました。\n異常なし。" },
    { code: "VC681", floor: "1F", name: "クマのぬいぐるみ", resultText: "クマのぬいぐるみを点検しました。\n異常なし。" },
    { code: "RM538", floor: "1F", name: "青い時計", resultText: "青い時計を点検しました。\n異常なし。" },
    { code: "BL739", floor: "1F", name: "絵本", resultText: "絵本を点検しました。\n異常なし。" },
    { code: "YH246", floor: "1F", name: "緑のカーテン", resultText: "緑のカーテンを点検しました。\n異常なし。" },
    { code: "DF964", floor: "2F", name: "白いキャビネット", resultText: "白いキャビネットを点検しました。\n異常なし。" },
    { code: "MQ180", floor: "2F", name: "客席テーブル", resultText: "2階の客席テーブルを点検しました。\n異常なし。" },
    { code: "TV503", floor: "2F", name: "生き人形", resultText: "生き人形を点検しました。\n異常なし。" },
    { code: "AR725", floor: "2F", name: "マグロ", resultText: "マグロを点検しました。\n異常なし。" },
    { code: "HW691", floor: "2F", name: "サウンドルーム入り口", resultText: "サウンドルーム入り口を点検しました。\n異常なし。" },
    { code: "ZK358", floor: "2F", name: "展示棚③", resultText: "展示棚③を点検しました。\n異常なし。" }
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
const inspectionByKey = new Map(CONFIG.inspections.map((item) => [normalizeCode(item.code), item]));
const inspectionByCode = new Map(CONFIG.inspections.map((item) => [item.code, item]));

let state = loadState();
let lastMessage = "";
let busy = false;
let currentAudio = null;
let currentRinger = null;

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
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
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
  if (!hasEnding(id)) state.viewedEndings.push(id);
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

function render() {
  renderTitle();
}

function startGame() {
  state.started = true;
  saveState();
  renderIntro();
}

function renderTitle() {
  setView(`
    <section class="title-screen">
      <div class="title-visual" aria-label="体験事件"></div>
      <div class="title-actions">
        <button id="start" type="button">スタート</button>
        ${endingCount() > 0 ? `<button id="receive-call" class="secondary" type="button">着信を受ける</button>` : ""}
      </div>
    </section>
  `, "app");
  bind("#start", "click", startGame);
  bind("#receive-call", "click", () => renderCall());
}

function renderIntro() {
  setView(`
    <section class="intro-screen">
      <p class="intro-copy">店内に設置された管理番号を探し、チェックリストに入力して点検業務を完了してください。<br><br>五か所点検すると業務を完了できます。<br><br>所要時間：5～10分</p>
      <button id="begin-work" class="intro-button hidden" type="button">スタッフ体験を開始する</button>
    </section>
  `, "app");
  setTimeout(() => {
    const button = document.querySelector("#begin-work");
    if (button) button.classList.remove("hidden");
  }, 900);
  bind("#begin-work", "click", () => renderHome("管理番号を入力してください。"));
}

function renderHome(message = "") {
  updateAllChecked();
  saveState();
  const msg = message || "管理番号を入力してください。";
  setView(`
    <div class="altar-bg">
      <section class="screen home-screen">
        <button id="home-button" class="home-button" type="button" aria-label="タイトルへ戻る">ホーム</button>
        <header class="home-header">
          <img src="${CONFIG.assets.titleLogo}" alt="体験事件" class="home-logo">
          <p class="subhead">店内点検業務</p>
        </header>
        <section class="terminal section input-panel">
          <h2>管理番号入力</h2>
          <form id="entry" class="entry">
            <input id="code" class="code-input" type="text" inputmode="text" maxlength="5" autocomplete="off" autocapitalize="characters" placeholder="AA000">
            <button type="submit">点検する</button>
          </form>
          <div class="message ${messageClass(msg)}">${escapeHtml(msg)}</div>
        </section>
        ${renderChecklist()}
      </section>
    </div>
  `, "app");
  bind("#entry", "submit", onSubmitCode);
  bind("#home-button", "click", renderHomeConfirm);
}

function messageClass(message) {
  if (message.includes("見つかりません")) return "error";
  if (message.includes("確認しました") || message.includes("点検しました") || message.includes("完了")) return "good";
  return "";
}

function renderChecklist() {
  const discovered = state.discoveredInspectionCodes
    .map((code) => inspectionByCode.get(code))
    .filter(Boolean)
    .map((item) => `<li class="checked"><span class="check">✓</span><span>${escapeHtml(displayName(item))}</span></li>`);

  const content = discovered.length
    ? discovered.join("")
    : `<li><span class="check"></span><span>未記録</span></li>`;

  return `
    <section class="terminal section checklist-panel">
      <h2>点検記録</h2>
      <ul class="check-list">${content}</ul>
    </section>
  `;
}

function onSubmitCode(event) {
  event.preventDefault();
  if (busy) return;

  const input = document.querySelector("#code");
  const key = normalizeCode(input.value);

  if (!key) {
    renderHome("管理番号を入力してください。");
    return;
  }

  if (key === normalizeCode(CONFIG.altar.code)) {
    unlockAdditionalRecord();
    return;
  }

  const item = inspectionByKey.get(key);
  if (!item) {
    renderHome("該当する管理番号が見つかりません。");
    return;
  }

  if (state.discoveredInspectionCodes.includes(item.code)) {
    renderHome(`${displayName(item)}は点検済みです。`);
    return;
  }

  state.discoveredInspectionCodes.push(item.code);
  lastMessage = item.resultText;
  updateAllChecked();
  saveState();
  renderHome(lastMessage);

  if (discoveredCount() === 5 && !state.autoCallTriggered && !hasEnding("END_1") && !hasEnding("END_2")) {
    state.autoCallTriggered = true;
    saveState();
    busy = true;
    showToast("必要点検数を満たしました。\n業務完了処理を開始します。");
    setTimeout(() => {
      busy = false;
      renderCall();
    }, 1400);
  } else if (state.allInspectionPointsCompleted) {
    showToast("全点検項目を確認しました。\nALL CHECKED");
  }
}

function renderCall() {
  stopAudio();
  startRinging();
  startVibration();
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
  stopRinging();
  stopVibration();
  setView(`
    <section class="call-screen">
      <div class="caller">
        <div class="caller-status">通話中</div>
        <h1 class="caller-name">発信者不明</h1>
        <p class="caller-note">音声再生中</p>
      </div>
    </section>
  `, "app");
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

function startEnd2() {
  if (busy) return;
  busy = true;
  stopRinging();
  stopVibration();
  const overlay = document.createElement("div");
  overlay.className = "red-room active";
  document.body.appendChild(overlay);
  playAudioLayer(CONFIG.assets.end2Audios);
  setTimeout(() => {
    stopAudio();
    overlay.remove();
    state.redRoomExperienced = true;
    addEnding("END_2");
    saveState();
    busy = false;
    lastMessage = "業務を終了します。";
    renderEnding("END_2");
  }, 6300);
}

function unlockAdditionalRecord() {
  state.additionalRecordViewed = true;
  addEnding("END_3");
  saveState();
  setView(`
    <div class="altar-bg">
      <section class="screen record-screen">
        <header class="topbar">
          <div class="top-title"><h1>体験事件</h1></div>
          <p class="subhead">追加点検記録</p>
        </header>
        <section class="terminal section">
          <h2>祭壇の点検記録が見つかりました。</h2>
          <p class="body-text">追加点検記録を表示します。</p>
        </section>
        <section class="terminal section record-panel">
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
      <div class="actions ending-actions">
        <button id="back-main" type="button">タイトルへ</button>
      </div>
    </section>
  `);
  bind("#back-main", "click", () => {
    if (id === "END_1" || id === "END_2") {
      showAdditionalPopupBeforeTitle();
      return;
    }
    renderTitle();
  });
}

function renderAdditionalPopup() {
  const link = CONFIG.soundHorrorLink
    ? `<a class="button-link" href="${CONFIG.soundHorrorLink}">サウンドホラー案内</a>`
    : "";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div class="modal">
        <h2 id="guide-title">追加コンテンツ</h2>
        <p class="body-text">サウンドホラーをご注文の上、<br>サウンドルーム内の祭壇に記載された<br>管理番号を入力してください。</p>
        <p class="hint">追加点検記録をお読みいただけます。</p>
        ${link}
        <button id="close-guide" type="button">確認した</button>
      </div>
    </div>
  `;
}

function closeAdditionalPopup() {
  const modal = document.querySelector(".modal-backdrop");
  const actions = document.querySelector(".ending-actions");
  if (modal) modal.remove();
  if (actions) actions.classList.remove("hidden");
}

function showAdditionalPopupBeforeTitle() {
  document.body.insertAdjacentHTML("beforeend", renderAdditionalPopup());
  bind("#close-guide", "click", () => {
    const modal = document.querySelector(".modal-backdrop");
    if (modal) modal.remove();
    renderTitle();
  });
}

function renderHomeConfirm() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="home-confirm" role="dialog" aria-modal="true" aria-labelledby="home-confirm-title">
      <div class="modal compact-modal">
        <h2 id="home-confirm-title">タイトルに戻りますか？</h2>
        <div class="confirm-actions">
          <button id="confirm-title" type="button">はい</button>
          <button id="cancel-title" class="secondary" type="button">いいえ</button>
        </div>
      </div>
    </div>
  `);
  bind("#confirm-title", "click", () => {
    const modal = document.querySelector("#home-confirm");
    if (modal) modal.remove();
    renderTitle();
  });
  bind("#cancel-title", "click", () => {
    const modal = document.querySelector("#home-confirm");
    if (modal) modal.remove();
  });
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

function playAudioLayer(paths) {
  stopAudio();
  currentAudio = paths.map((path) => {
    const audio = new Audio(path);
    audio.volume = 1;
    audio.play().catch(() => {});
    return audio;
  });
}

function startRinging() {
  stopRinging();
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const gain = context.createGain();
    const oscA = context.createOscillator();
    const oscB = context.createOscillator();
    oscA.frequency.value = 880;
    oscB.frequency.value = 1174;
    oscA.type = "sine";
    oscB.type = "triangle";
    gain.gain.value = 0;
    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(context.destination);
    oscA.start();
    oscB.start();
    const pulse = () => {
      const now = context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain.gain.setValueAtTime(0.18, now + 0.38);
      gain.gain.linearRampToValueAtTime(0, now + 0.45);
    };
    pulse();
    const interval = setInterval(pulse, 900);
    currentRinger = { context, oscillators: [oscA, oscB], interval };
  } catch {
    currentRinger = null;
  }
}

function stopRinging() {
  if (!currentRinger) return;
  clearInterval(currentRinger.interval);
  currentRinger.oscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {}
  });
  currentRinger.context.close().catch(() => {});
  currentRinger = null;
}

function startVibration() {
  if ("vibrate" in navigator) {
    navigator.vibrate([450, 180, 450, 700, 450, 180, 450]);
  }
}

function stopVibration() {
  if ("vibrate" in navigator) navigator.vibrate(0);
}

function stopAudio() {
  stopRinging();
  stopVibration();
  if (!currentAudio) return;
  const audios = Array.isArray(currentAudio) ? currentAudio : [currentAudio];
  audios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
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
