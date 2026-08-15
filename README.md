# Business Card Atlas

名刺をスキャンして保存し、一覧ダッシュボードと関係マップで管理するWeb MVPです。
local-first で動くので、まずはブラウザだけで試せます。

```bash
npm install
npm run dev
```

## Features

- 名刺画像の取り込みと手入力
- 一覧ダッシュボードでの検索とフィルタ
- タグと会社キーワードによる分類
- Obsidian 風の関係グラフ
- 将来の紹介候補を考えるマッチング下地

## App Flow

1. 名刺画像をアップロードする
2. OCR 代替として必要情報を入力する
3. タグと会社キーワードで整理する
4. 一覧と関係グラフでつながりを確認する
5. 紹介候補を見て、次のアクションを決める

## Planning

- Linear project: https://linear.app/tom108/project/business-card-atlas-fbce5aa78f8f
- Issue: TOM-97, TOM-98, TOM-99, TOM-100

## GitHub

- Repository: https://github.com/robatodt74-byte/portfolio-react
- Branch: `feature/business-card-atlas`
- If you are on another terminal, run:

```bash
git fetch origin
git checkout feature/business-card-atlas
```

## Notes

- 取り込みはMVPでは画像アップロードと手入力を中心にしている
- `localStorage` に保存するので、同じブラウザでは再読込しても残る
- 将来は OCR、バックエンド同期、モバイルアプリ化を追加しやすい構成にしている
