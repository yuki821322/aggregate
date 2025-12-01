<h1>QR Attendance &amp; Aggregation System<br />（出席管理 × 集計ダッシュボード）</h1>

  <p>
    イベントや講義・研修などで利用できる
    <strong>QR コード出席管理システム</strong>を Next.js + Prisma + SQLite で開発中。
  </p>
  <p>
    参加者は事前登録され、当日発行される <strong>QR コード</strong>を読み取ることで出席登録。<br />
    管理側は <strong>リアルタイムの出席状況・出席者の推移・ログ一覧</strong>を確認できる。
  </p>

  <hr />

  <h2>🧩 システム構成（開発中）</h2>

  <h3>管理者画面（Admin）</h3>
  <ul>
    <li>イベント一覧</li>
    <li>新規イベント作成</li>
    <li>イベント情報編集</li>
    <li>イベントダッシュボード（集約画面）</li>
    <li>出席ログ確認・集計</li>
    <li>カメラ付きチェックイン画面（管理端末用）</li>
  </ul>

  <h3>参加者情報管理</h3>
  <ul>
    <li>参加者モデル（名前・学籍番号/社員番号・メールなど）</li>
    <li>イベントごとの参加者登録（EventAttendee）</li>
    <li>QR トークン発行（ユニークな出席用コード）</li>
  </ul>

  <h3>出席ログシステム</h3>
  <ul>
    <li>QR 読み取りで出席</li>
    <li>遅刻判定 / 早すぎるチェックイン判定</li>
    <li>1人目の打刻記録（firstCheckedInAt）</li>
    <li>AttendanceLog への記録</li>
    <li>誰がどの端末で処理したか（handledBy / deviceLabel）</li>
  </ul>

  <hr />

  <h2>📌 現在の進捗状況（2025/xx 時点）</h2>

  <h3>✔ 1. Prisma モデルの設計 &amp; DB 構築 完了</h3>
  <p>以下のモデルを実装済み：</p>
  <ul>
    <li><code>AccountUser</code>（管理者/スタッフ）</li>
    <li><code>Participant</code>（学生・社員など）</li>
    <li><code>Event</code>（日付・開始時刻・遅刻閾値など）</li>
    <li><code>EventAttendee</code>（イベント × 参加者、QR トークン付き）</li>
    <li><code>AttendanceLog</code>（チェックインログ）</li>
  </ul>
  <p>イベント〜参加者〜出席ログのリレーションはすべて完成。</p>

  <h3>✔ 2. 管理画面の UI レイアウト構築 完成</h3>
  <p>
    Next.js App Router + CSS Modules で
    <strong>「1ページ1CSS」</strong> のプロジェクト設計。
  </p>
  <p>実装済みページ：</p>
  <ul>
    <li><code>/admin/events</code>（イベント一覧）</li>
    <li><code>/admin/events/[eventId]</code>（詳細）</li>
    <li><code>/admin/events/[eventId]/dashboard</code>（イベントのダッシュボード／集約画面）</li>
  </ul>

  <h3>✔ 3. イベントダッシュボード 実装完了</h3>

  <h4>⭐ 基本情報</h4>
  <ul>
    <li>タイトル</li>
    <li>日付</li>
    <li>開始時刻</li>
  </ul>

  <h4>⭐ サマリーカード</h4>
  <ul>
    <li>登録済み参加者数</li>
    <li>出席人数（ユニーク参加者数）</li>
    <li>出席率（%計算）</li>
  </ul>

  <h4>⭐ 出席ログ一覧</h4>
  <ul>
    <li>最近20件のチェックイン履歴</li>
    <li>オンタイム / 遅刻 / 早すぎ / 無効</li>
    <li>出席時刻</li>
    <li>処理端末 / 処理者</li>
  </ul>

  <p>今後追加予定：</p>
  <ul>
    <li>時系列グラフ（出席の推移）</li>
    <li>部署・学年別の内訳</li>
    <li>遅刻率の情報など</li>
  </ul>

  <h3>✔ 4. チェックイン API 完成</h3>
  <p><code>POST /api/check-in</code> を実装し、以下の処理まで対応：</p>
  <ul>
    <li>QR トークンから参加者を特定</li>
    <li>遅刻判定</li>
    <li>早すぎ判定</li>
    <li>無効トークン判定</li>
    <li>AttendanceLog へ保存</li>
    <li>初回打刻は EventAttendee にも記録</li>
    <li>API レスポンスでステータス/参加者情報を返す</li>
  </ul>

  <h3>✔ 5. チェックイン画面（管理端末） 完成</h3>
  <p><code>/admin/checkin</code></p>
  <h4>対応済み：</h4>
  <ul>
    <li>手入力（QRリーダー含む）</li>
    <li>カメラを使った QR 読み取り（<code>@yudiel/react-qr-scanner</code>）</li>
    <li>結果カード表示（エラー/初回打刻/2回目以降）</li>
  </ul>
  <p>UIは管理画面と統一したダーク×青系デザイン。</p>

  <hr />

  <h2>🔜 今後の予定（ToDo）</h2>

  <h3>🎯 イベントごとの専用チェックインページ</h3>
  <p>
    例： <code>/events/[eventId]/checkin</code><br />
    → そのイベント用の QR だけを受付可能にする
  </p>

  <h3>🎯 出席率・人数の時系列グラフ</h3>
  <p>
    Recharts または Chart.js を使って：
  </p>
  <ul>
    <li>時間ごとの出席増加</li>
    <li>全体出席率の推移</li>
  </ul>

  <h3>🎯 モバイル向け簡易参加者ビュー</h3>
  <p>参加者自身が「自分の出席状態」だけチェックできる画面。</p>

  <h3>🎯 リアルタイム更新</h3>
  <p>
    WebSocket or Next.js <code>revalidateTag</code> による<br />
    ダッシュボードの自動更新。
  </p>

  <hr />

  <h2>✨ このプロジェクトのゴール</h2>
  <ul>
    <li>学校・研修・イベントなどで <strong>誰でも直感的に使える出席管理</strong> を作る</li>
    <li>ハードウェア不要 &amp; QR さえあれば運用可能</li>
    <li>管理側の入力負担ゼロ</li>
    <li>出席率の分析・不正検知・改善にも使える</li>
  </ul>
