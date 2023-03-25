# Buer
<img src="https://raw.githubusercontent.com/jtpotato/buer/main/icon/icon.jpg" width="100px">

Named after the God of Wisdom in Genshin Impact.

A text summary and OCR utility Discord bot - internal tool, not documented very well.

Uses tesseract.js for OCR, summary still in development. May use GPT-2 in future. May be completely eclipsed by Discord's in-house summary features.

# Instructions for self-host
- Clone this repository (`--depth=1`)

Create a .env file with the following environment variables
- `BUER_TOKEN`
- `BUER_CLIENT_ID`

Run `pnpm run refresh-commands` and `pnpm run start`
