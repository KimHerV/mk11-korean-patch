# Landing Page Writing Style Guide

Applies to all user-facing text in this directory: `content.js`, `data/changelog.js`, `data/faq.js`, `data/banner.js`.

---

## Korean

**Tone: 합쇼체 (formal polite)**

All sentences end in `-합니다 / -습니다 / -입니다` or equivalent formal polite forms.

```
# Good
수정했습니다. / 확인됐습니다. / 있습니다.

# Bad
수정. / 확인. / 있음.
```

**Structure: short declarative sentences**

- One idea per sentence.
- No filler adverbs (`매우`, `정말`, `놀랍도록`).
- No marketing adjectives.

**Prohibited characters**

- `—` (em-dash): forbidden everywhere. Use `:` for title/subtitle separation, `.` or `,` for clause breaks.

**Word-break**

Body text uses `word-break: keep-all` globally. Write natural Korean spacing — do not insert manual breaks.

---

## English

**Tone: past-tense, object-centered**

- Bullet items start with a past-tense verb: `Added`, `Fixed`, `Updated`, `Injected`, `Removed`.
- Paragraph leads use passive where the actor is the project: "X was identified", "Y was submitted".
- No first-person plural. No `We`, `our`, or `us`. This is a solo project.

```
# Good
Fixed with urlopen + manual read/write loop.
Two defects were discovered immediately after release.

# Bad
We fixed this with urlopen.
Our tests showed...
```

**Prohibited characters**

- `—` (em-dash): forbidden. Use `:` or `.` instead.

---

## Patch notes and security log (`data/changelog.js`)

Reference tone: Ubisoft AC Odyssey 1.5.1 patch notes (structure only — not the monthly newsletter tone; no marketing adjectives, no exclamations).

- `lead`: 2-3 sentences max. States what happened and why. No evaluation language.
- `highlights[].title`: noun phrase, no verb.
- `highlights[].items`: one fact per bullet. KR ends in 합쇼체. EN starts with past-tense verb or is a data label (SHA256, submission ID).
- Data labels (hashes, UUIDs, file names) are exempt from sentence-ending rules.

**Entry title structure**

`changelog.js` renders a version chip (`v1.0`, `v1.1`) separately above each entry title. Do not repeat the version in the `title` field.

KR title pattern: `[주요 성과]: [부가 내용]` — colon separates primary from secondary.
EN title pattern: `[Primary Achievement]: [Qualifier]` or comma-separated achievements.

Target length: ~25-30 characters (KR). Reference: v1.1 = 30자.

```
# Good
"스토리 모드 1부 품질 개선: 패치 매니저 핫픽스 포함"
"인게임 대화·스토리 2부 화법 교정: 기술명 동기화"

# Bad (version chip duplication)
"v1.1 Microsoft Defender 오탐 제출 및 심사 완료"
```

**Separator rules (KR)**

| 구분자 | 용도 | 예시 |
|--------|------|------|
| `:` | 주요/부가 구분 (제목 계층) | `스토리 2부 교정: 기술명 동기화` |
| `·` | 짧고 동류인 명사 병렬 나열 | `인게임 대화·스토리 2부`, `무브리스트·튜토리얼` |
| `,` + `및/그리고` | 리드 문장 내 다중 항목 열거 | `기술명 765건을 동기화하고, ... 교정했습니다` |

`·` 사용 금지 케이스: 절(clause) 수준의 구문 연결, 의미 단위가 다른 구문 결합.

**EN separator rules**

- `,` for enumeration in lead sentences and multi-item titles.
- `:` for main/qualifier split in titles.
- `·` is not standard in English — do not use.

**Title vs. content consistency**

The `title` must accurately reflect what is documented in `highlights`. If an outcome is recorded in the highlights, the title should name it.

```
# Good (outcome reflected, no version prefix)
"Microsoft Defender 오탐 제출 및 심사 완료"

# Bad (outcome omitted, version prefix present)
"v1.0 Microsoft Defender 오탐 제출"
```

---

## FAQ (`data/faq.js`)

Same rules as above. Question text (`q`) is interrogative; answer text (`a`) follows 합쇼체 / past-tense EN rules.

---

## HTML comments

All HTML, CSS, and JS comments are written in English only.
