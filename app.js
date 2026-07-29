"use strict";

const CONFIG = {
  storageKey: "cafe-juju-experience-incident-v2",
  soundHorrorLink: "",
  memberCardReturnUrl: "https://obneao-indy.github.io/juju-members-card/special-cards",
  assets: {
    end1Audio: "./assets/ending1-temp.m4a",
    end2Audios: [
      "./assets/am-chase.mp3",
      "./assets/am-detected.mp3",
      "./assets/am-scream.wav"
    ],
    bgm: "./assets/cafe1f-bgm-loop-v2.wav",
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

const EPILOGUES = [
  {
    id: "END_1",
    label: "ED.1 エピローグ",
    condition: "電話に出た",
    text: `点検作業中、突然掛かってきた電話。

「発信者不明」と表示された不気味な画面を暫し眺めて、なんとなく、電話を取ることにした。

電話の向こうから聞こえてきたのは、少女の声だった。

その幼い声には似つかわしくない、自責や自律に満ちた少女の言葉・・・

胸を刺すような憐憫に引き込まれそうになる。

一体この子は"誰"で、何故電話を掛けてきたのか、何故自分に掛かってきたのか・・・

それに出て・・・良かったのだろうか・・・`
  },
  {
    id: "END_2",
    label: "ED.2 エピローグ",
    condition: "電話を拒否",
    text: `点検作業中、突然掛かってきた電話。

「発信者不明」と表示された不気味な画面を暫し眺めて、畏れを感じ、電話を切った。

「一体何だったのだろう」

そんな言葉を頭の中に浮かべるかどうか、
突然、見慣れたスマートフォンの画面が真っ赤なノイズに包まれた。

また次の瞬間には、人間叫び声とも獣の咆哮ともつかない、悍ましい音が響き渡った。

跳ね上げた心臓を抑えながら、
何かを思い出す。

身体をめちゃくちゃに振り乱しながら、狭い廊下の中を追いかけてくる・・・

赤いマントに身を包んだ、何か

覚えのない記憶が、画面から流れ込んでくるような感覚。

頭がクラクラする。

なんで、こんな電話・・・出れば良かったのか？

だって・・・怖かったから・・・`
  },
  {
    id: "END_3",
    label: "exED.1 エピローグ",
    condition: "SRの祭壇を入力",
    text: CONFIG.additionalRecord
  },
  {
    id: "HIDDEN_2",
    label: "exED.2 エピローグ",
    condition: "全項目が埋まる",
    text: `項目を全て埋め、業務を完了した。

「体験」という名目でこの店を見て周り、このゲームを通じてスタッフの仕事の一部を垣間見た。

「業務」なんて言葉には似つかわしくない軽作業だったなと思う。

ただ、"見て"周るだけだなんて・・・

なんで、最後までやろうと思ったんだろう、あんな電話まで掛かってきたのに、

いや、答えは単純だ。

これは"ゲーム"だから、このエピローグも物語の一部だから、

現実なんてここには一つもないから。

だけど、物語に触れている間

考えていたことは、浮かんだ感想は、

現実以外の何物でもないのだと・・・思う。`
  }
];

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const inspectionByKey = new Map(CONFIG.inspections.map((item) => [normalizeCode(item.code), item]));
const inspectionByCode = new Map(CONFIG.inspections.map((item) => [item.code, item]));

let state = loadState();
let lastMessage = "";
let busy = false;
let currentAudio = null;
let currentRinger = null;
let currentVibrationInterval = null;
let bgmAudio = null;

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
    hiddenEnding2Completed: false,
    seenEpilogueNotices: [],
    staffSignature: "",
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

function allDutiesReady() {
  return state.allInspectionPointsCompleted && state.additionalRecordViewed;
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
  startBgm();
  renderIntro();
}

function renderTitle() {
  const hasEpilogues = unlockedEpilogues().length > 0;
  setView(`
    <section class="title-screen">
      <p class="collab-kicker">チラズアート×呪物Caféジュジュ</p>
      <div class="title-visual" aria-label="体験事件"></div>
      <div class="title-actions">
        <button id="start" type="button">スタート</button>
        ${hasEpilogues ? `<button id="epilogue" class="secondary" type="button">エピローグ</button>` : ""}
        ${endingCount() > 0 ? `<button id="receive-call" class="secondary" type="button">着信を受ける</button>` : ""}
      </div>
    </section>
  `, "app");
  bind("#start", "click", startGame);
  bind("#epilogue", "click", renderEpilogueMenu);
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
  bind("#begin-work", "click", showSoundRecommendation);
}

function showSoundRecommendation() {
  startBgm();
  setView(`
    <section class="intro-screen">
      <div class="sound-notice" role="status" aria-live="polite">
        <h1>イヤホン推奨</h1>
        <p>このゲームは、音声を出してお楽しみください</p>
        <small>このゲームは大きな音が出る可能性があります</small>
        <span class="loading-text">ロード中……</span>
      </div>
    </section>
  `, "app");
  setTimeout(() => {
    renderHome("管理番号を入力してください。");
  }, 6000);
}

function renderHome(message = "") {
  resumeBgm();
  updateAllChecked();
  if (allDutiesReady() && !state.hiddenEnding2Completed) {
    saveState();
    renderAllDutiesComplete();
    return;
  }
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
    setTimeout(() => {
      busy = false;
      renderCall();
    }, 650);
  } else if (state.allInspectionPointsCompleted) {
    if (allDutiesReady() && !state.hiddenEnding2Completed) {
      setTimeout(renderAllDutiesComplete, 900);
    } else {
      showToast("全点検項目を確認しました。\nALL CHECKED");
    }
  }
}

function renderCall() {
  pauseBgm();
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
  startHeavyVibration();
  setTimeout(() => {
    stopAudio();
    stopVibration();
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
  pauseBgm();
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

function renderAllDutiesComplete() {
  pauseBgm();
  setView(`
    <section class="screen all-complete-screen">
      <div class="official-mark">Caféジュジュ 店内点検業務</div>
      <h1>すべての業務を完了しました</h1>
      <p class="body-text">点検記録と追加点検記録の確認が完了しました。</p>
      <div class="actions">
        <button id="report-duty" type="button">報告する</button>
      </div>
    </section>
  `);
  bind("#report-duty", "click", renderCertificateEntry);
}

function renderCertificateEntry() {
  const existingName = state.staffSignature || "";
  setView(`
    <section class="screen certificate-screen">
      <article class="certificate">
        <div class="certificate-office">Caféジュジュ 業務管理課</div>
        <h1>業務完了証明書</h1>
        <p class="certificate-lead">下記スタッフ体験者は、店内点検業務および追加点検記録の確認を完了したことを証明します。</p>
        <dl class="certificate-lines">
          <div><dt>業務名</dt><dd>体験事件 店内点検業務</dd></div>
          <div><dt>確認項目</dt><dd>通常点検 12項目 / 追加点検 1項目</dd></div>
          <div><dt>発行日</dt><dd>${escapeHtml(formatDate(new Date()))}</dd></div>
        </dl>
        <label class="signature-field">
          <span>記名欄</span>
          <input id="staff-signature" type="text" maxlength="6" autocomplete="off" value="${escapeHtml(existingName)}" ${existingName ? "disabled" : ""} placeholder="6文字以内">
        </label>
        <p class="certificate-note">記名後、この名前は専用の特別カードに反映されます。</p>
        <div class="certificate-stamp">確認済</div>
      </article>
      <div class="actions">
        <button id="submit-signature" type="button" ${existingName ? "disabled" : ""}>入力完了</button>
      </div>
    </section>
  `);
  bind("#submit-signature", "click", confirmSignature);
}

function confirmSignature() {
  const input = document.querySelector("#staff-signature");
  const name = (input ? input.value : "").trim().slice(0, 6);
  if (!name) {
    showToast("ニックネームを入力してください。");
    return;
  }
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="signature-confirm" role="dialog" aria-modal="true" aria-labelledby="signature-confirm-title">
      <div class="modal compact-modal">
        <h2 id="signature-confirm-title">一度入力すると変更できません。<br>この名前でいいですか？</h2>
        <p class="signature-preview">${escapeHtml(name)}</p>
        <div class="confirm-actions">
          <button id="confirm-signature" type="button">はい</button>
          <button id="cancel-signature" class="secondary" type="button">いいえ</button>
        </div>
      </div>
    </div>
  `);
  bind("#confirm-signature", "click", () => finalizeSignature(name));
  bind("#cancel-signature", "click", () => {
    const modal = document.querySelector("#signature-confirm");
    if (modal) modal.remove();
  });
}

function finalizeSignature(name) {
  state.staffSignature = name;
  state.hiddenEnding2Completed = true;
  state.completionStampGranted = true;
  saveState();
  localStorage.setItem("JUJU_CHILLAS_STAFF_SIGNATURE", name);
  const url = `${CONFIG.memberCardReturnUrl}?chillas_staff_signature=${encodeURIComponent(name)}`;
  setView(`
    <section class="screen ending">
      <div class="ending-code">隠しエンディング 2</div>
      <h1>業務完了証明</h1>
      <div class="clear">COMPLETE</div>
      <p class="body-text">記名を受理しました。</p>
    </section>
  `);
  setTimeout(() => {
    showEpilogueNotice("HIDDEN_2", () => {
      location.href = url;
    });
  }, 1200);
}

function renderEnding(id) {
  pauseBgm();
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
    if (id === "END_3" && allDutiesReady() && !state.hiddenEnding2Completed) {
      showEpilogueNotice("END_3", renderAllDutiesComplete);
      return;
    }
    if (id === "END_3") {
      showEpilogueNotice("END_3", renderTitle);
      return;
    }
    if (id === "END_1" || id === "END_2") {
      showAdditionalPopupBeforeTitle(id);
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

function showAdditionalPopupBeforeTitle(endingId) {
  document.body.insertAdjacentHTML("beforeend", renderAdditionalPopup());
  bind("#close-guide", "click", () => {
    const modal = document.querySelector(".modal-backdrop");
    if (modal) modal.remove();
    showEpilogueNotice(endingId, renderTitle);
  });
}

function unlockedEpilogues() {
  return EPILOGUES.filter((item) => {
    if (item.id === "HIDDEN_2") return state.hiddenEnding2Completed;
    return hasEnding(item.id);
  });
}

function hasSeenEpilogueNotice(id) {
  return Array.isArray(state.seenEpilogueNotices) && state.seenEpilogueNotices.includes(id);
}

function markEpilogueNoticeSeen(id) {
  if (!Array.isArray(state.seenEpilogueNotices)) state.seenEpilogueNotices = [];
  if (!state.seenEpilogueNotices.includes(id)) {
    state.seenEpilogueNotices.push(id);
    saveState();
  }
}

function showEpilogueNotice(id, next) {
  if (!EPILOGUES.some((item) => item.id === id) || hasSeenEpilogueNotice(id)) {
    next();
    return;
  }
  markEpilogueNoticeSeen(id);
  setView(`
    <section class="screen epilogue-added-screen">
      <h1>新しいエンディングエピローグが追加されました。</h1>
      <p class="body-text">タイトル画面からご確認いただけます。</p>
      <div class="actions">
        <button id="continue-after-epilogue-notice" type="button">確認する</button>
      </div>
    </section>
  `);
  bind("#continue-after-epilogue-notice", "click", next);
}

function renderEpilogueMenu() {
  pauseBgm();
  const rows = EPILOGUES.map((item) => {
    const unlocked = unlockedEpilogues().some((entry) => entry.id === item.id);
    return `
      <button class="epilogue-row ${unlocked ? "" : "locked"}" type="button" data-epilogue-id="${item.id}" ${unlocked ? "" : "disabled"}>
        <span>${escapeHtml(item.label)}</span>
        <small>${unlocked ? escapeHtml(item.condition) : "未開放"}</small>
      </button>
    `;
  }).join("");

  setView(`
    <section class="screen epilogue-menu-screen">
      <header class="epilogue-header">
        <h1>エピローグ</h1>
        <p>解放済みの記録を選択してください。</p>
      </header>
      <div class="epilogue-list">${rows}</div>
      <div class="actions">
        <button id="back-title" class="secondary" type="button">タイトルへ</button>
      </div>
    </section>
  `);
  document.querySelectorAll("[data-epilogue-id]").forEach((button) => {
    button.addEventListener("click", () => renderEpilogueText(button.dataset.epilogueId));
  });
  bind("#back-title", "click", renderTitle);
}

function renderEpilogueText(id) {
  const item = unlockedEpilogues().find((entry) => entry.id === id);
  if (!item) {
    renderEpilogueMenu();
    return;
  }
  setView(`
    <section class="screen epilogue-text-screen">
      <article class="terminal section epilogue-document">
        <p class="epilogue-code">${escapeHtml(item.label)}</p>
        <h1>${escapeHtml(item.condition)}</h1>
        <div class="epilogue-body">${escapeHtml(item.text)}</div>
      </article>
      <div class="actions">
        <button id="back-epilogue-menu" type="button">一覧へ戻る</button>
      </div>
    </section>
  `);
  bind("#back-epilogue-menu", "click", renderEpilogueMenu);
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
    audio.volume = 1;
    let resolved = false;
    let fallback = null;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      if (fallback) clearTimeout(fallback);
      resolve();
    };
    const scheduleFallback = (ms) => {
      if (fallback) clearTimeout(fallback);
      fallback = setTimeout(finish, ms);
    };
    scheduleFallback(fallbackMs);
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        scheduleFallback((audio.duration * 1000) + 700);
      }
    });
    audio.addEventListener("ended", () => {
      finish();
    });
    audio.addEventListener("error", () => {
      scheduleFallback(fallbackMs);
    });
    audio.play().catch(() => {
      scheduleFallback(fallbackMs);
    });
  });
}

function playAudioLayer(paths) {
  stopAudio();
  currentAudio = paths.flatMap((path) => [path, path]).map((path, index) => {
    const audio = new Audio(path);
    audio.volume = 1;
    audio.currentTime = index % 2 === 0 ? 0 : 0.035;
    audio.play().catch(() => {});
    return audio;
  });
}

function startBgm() {
  if (!bgmAudio) {
    bgmAudio = new Audio(CONFIG.assets.bgm);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.04;
    bgmAudio.preload = "auto";
  }
  bgmAudio.play().catch(() => {});
}

function pauseBgm() {
  if (bgmAudio) bgmAudio.pause();
}

function resumeBgm() {
  if (bgmAudio) bgmAudio.play().catch(() => {});
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
      gain.gain.linearRampToValueAtTime(0.36, now + 0.03);
      gain.gain.setValueAtTime(0.36, now + 0.42);
      gain.gain.linearRampToValueAtTime(0, now + 0.45);
    };
    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }
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

function startHeavyVibration() {
  stopVibration();
  if (!("vibrate" in navigator)) return;
  const pattern = [280, 60, 280, 60, 520, 90, 220, 50, 220];
  navigator.vibrate(pattern);
  currentVibrationInterval = setInterval(() => {
    navigator.vibrate(pattern);
  }, 1800);
}

function stopVibration() {
  if (currentVibrationInterval) {
    clearInterval(currentVibrationInterval);
    currentVibrationInterval = null;
  }
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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}
