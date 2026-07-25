# 体験事件

Caféジュジュ店内周遊用のスマートフォン向けミニゲームです。

## 公開

GitHub Pagesで公開する場合は、リポジトリの Settings → Pages から以下を設定します。

- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

公開URLは通常、以下の形式です。

https://obneao-indy.github.io/-Caf-/

## 差し替え箇所

管理番号、祭壇コード、音声ファイルパス、案内リンクは `app.js` 冒頭の `CONFIG` で変更できます。

音声ファイルを使う場合は以下の名前で `assets` に配置します。

- `digicam_last_voice.mp3`
- `am-chase.mp3`
- `am-detected.mp3`
- `am-scream.wav`
- `cafe1f-bgm-loop.wav`
