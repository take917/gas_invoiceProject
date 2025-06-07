# 請求書自動生成ツール（Google Apps Script × TypeScript）

Google Apps Script（GAS）と TypeScript で構築した、請求書を自動生成・PDF 化し、スプレッドシートと連携するツールです。

---

## プロジェクト構成

├── .clasp.json
├── .gitignore
├── appsscript.json
├── main.ts # GAS のメインロジック
├── ui.html # 入力用 UI（InputBox）
├── README.md
├── node_modules/ # npm パッケージ群（.gitignore で除外）
├── package.json
├── tsconfig.json

## clasp のセットアップ

npm install -g @google/clasp
clasp login

## typescript のインストールと GAS の補完

npm init -y
npm install --save-dev typescript @types/google-apps-script

## クラウドの GAS エディターとローカルの VScode の紐付け

clasp clone {GAS の ID}

## まだ GAS のエディターは使ってなく、コマンドで作成

clasp create --title "プロジェクト名" --type standalone

## VScode で入力したコードをクラウドの GAS エディターへ入力

clasp push

## TypeScript で書いた ts ファイルを js へ変換

npm tsc

## クラウドの GAS エディターをローカルに取り込む

clasp pull
