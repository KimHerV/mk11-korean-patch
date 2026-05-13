// MK11 한글 패치 · 랜딩 페이지 콘텐츠
// 이 파일만 편집하면 됩니다. 저장 후 브라우저 새로고침(F5)으로 반영됩니다.
//
// 값 형식:
//   "key": "string"          → 두 언어 공통 (버전, 브랜드명, 숫자 등)
//   "key": { kr: "...", en: "..." } → 언어별 번역

window.MK11_CONTENT = {

  // ── Hero ──────────────────────────────────────────────────────
  "hero.eyebrow":       "ver 1.0 (2026-05-04)",
  "hero.title_en":      "MORTAL KOMBAT 11",
  "hero.title_kr": {
    kr: "한글 패치",
    en: "Korean Patch"
  },
  "hero.subtitle": {
    kr: "스토리 · 무브리스트 · UI · DLC<br>게임 전체 완전 한글화",
    en: "Story · Movelist · UI · DLC<br>Complete Korean Localization"
  },
  "hero.btn_download": {
    kr: "설치 방법 보기 ↓",
    en: "How to Install ↓"
  },
  "hero.btn_feedback": {
    kr: "번역 피드백",
    en: "Translation Feedback"
  },
  "hero.platform_steam":     { kr: "Steam · 지원",               en: "Steam · Supported" },
  "hero.platform_steamdeck": { kr: "Steam Deck · CLI 설치 지원", en: "Steam Deck · Supported via CLI" },
  "hero.platform_epic":      { kr: "Epic Games · 미검증",        en: "Epic Games · Unverified" },
  "hero.platform_msstore":   { kr: "Microsoft Store · 미검증",   en: "Microsoft Store · Unverified" },
  "hero.legal": {
    kr: "비공식 팬 제작 패치입니다. Mortal Kombat 11 및 관련 상표는 Warner Bros. Entertainment Inc. 및 NetherRealm Studios의 소유입니다. 본 패치는 한국 사용자를 위한 접근성 개선 목적으로 제작되었으며, 피드백은 언제든 환영입니다.",
    en: "Unofficial fan-made patch. Mortal Kombat 11 and all related trademarks are the property of Warner Bros. Entertainment Inc. and NetherRealm Studios. This patch was created for accessibility purposes for Korean-speaking players. Feedback is always welcome."
  },
  "hero.credit": "by KimHerV",

  // ── Stats ─────────────────────────────────────────────────────
  "stats.s1_num":   "100%",
  "stats.s1_label": { kr: "번역 완료율",   en: "Translation Complete" },
  "stats.s2_num":   "53,000+",
  "stats.s2_label": { kr: "번역 항목",     en: "Translated Entries" },
  "stats.s3_num":   { kr: "37개",          en: "37" },
  "stats.s3_label": { kr: "번역 파일",     en: "Translation Files" },
  "stats.s4_label":  { kr: "총 다운로드",   en: "Total Downloads" },
  "stats.count_suffix": { kr: "회", en: "" },

  // ── Screenshots ───────────────────────────────────────────────
  "screenshots.heading": { kr: "스크린샷",              en: "Screenshots" },
  "screenshots.sub":     { kr: "실제 인게임 한글 화면", en: "In-game Korean text" },
  "screenshots.slide1_label": { kr: "캐릭터 선택",        en: "Character Select" },
  "screenshots.slide2_label": { kr: "스토리 모드",         en: "Story Mode" },
  "screenshots.slide3_label": { kr: "전투 대사",           en: "Battle Dialogue" },
  "screenshots.slide4_label": { kr: "무브리스트",          en: "Movelist" },
  "screenshots.slide5_label": { kr: "튜토리얼",            en: "Tutorial" },
  "screenshots.slide6_label": { kr: "아이템 · 커스터마이즈", en: "Items & Customize" },

  // ── Features ──────────────────────────────────────────────────
  "features.heading": { kr: "번역 범위", en: "What's Translated" },

  "features.card1_title": { kr: "스토리 모드", en: "Story Mode" },
  "features.card1_desc": {
    kr: "챕터 1~12 전체 대사 · 챕터 엔딩 · Aftermath DLC 대화 완전 번역 <span class=\"n\">(3,004항목)</span>",
    en: "All dialogue for Chapters 1–12 · Chapter endings · Aftermath DLC conversations fully translated <span class=\"n\">(3,004 entries)</span>"
  },
  "features.card2_title": { kr: "무브리스트", en: "Movelist" },
  "features.card2_desc": {
    kr: "기본 캐릭터 25인 전 기술명·설명 번역. 기술명 일관성 통일 <span class=\"n\">(3,732항목)</span>",
    en: "All 25 base characters: move names and descriptions fully translated with consistent naming <span class=\"n\">(3,732 entries)</span>"
  },
  "features.card3_title": { kr: "UI 전체", en: "Full UI" },
  "features.card3_desc": {
    kr: "메뉴, 튜토리얼, 래더, 전투 알림, 업적, 상점 UI 완전 번역 <span class=\"n\">(8,900항목)</span>",
    en: "Menus, tutorials, ladders, combat alerts, achievements, and shop UI fully translated <span class=\"n\">(8,900 entries)</span>"
  },
  "features.card4_title": { kr: "아이템 & 크립트", en: "Items & Krypt" },
  "features.card4_desc": {
    kr: "아이템 이름·설명·어빌리티·기어·스킨 번역. 섕 쑹 크립트 나레이션 포함 <span class=\"n\">(22,689항목)</span>",
    en: "Item names, descriptions, abilities, gear, and skins translated. Includes Shang Tsung Krypt narration <span class=\"n\">(22,689 entries)</span>"
  },
  "features.card5_title": { kr: "DLC 전 콘텐츠", en: "All DLC Content" },
  "features.card5_desc": {
    kr: "GOTY Edition DLC 전체: 밀리나, 레인, 람보, 조커, 스폰 등 11개 캐릭터 팩 무브리스트·래더·엔딩 번역 <span class=\"n\">(5,109항목)</span>",
    en: "Full GOTY Edition DLC: Mileena, Rain, Rambo, Joker, Spawn and 11 character packs. Movelists, ladders, and endings translated <span class=\"n\">(5,109 entries)</span>"
  },
  "features.card6_title": { kr: "인게임 대사", en: "Battle Dialogue" },
  "features.card6_desc": {
    kr: "전투 인트로·응답 1,350쌍. 37개 캐릭터 전원 고유 화법 확립. 로보캅의 단정함, 람보의 무게감, 스폰의 냉혹함 <span class=\"n\">(9,648항목)</span>",
    en: "1,350 battle intro/response pairs. 37 characters each with their own distinct voice: RoboCop's bluntness, Rambo's gravity, Spawn's cold menace <span class=\"n\">(9,648 entries)</span>"
  },

  // ── About ─────────────────────────────────────────────────────
  "about.heading": { kr: "프로젝트 이야기",  en: "Project Story" },
  "about.sub":     { kr: "시작부터 배포까지", en: "From Start to Release" },

  "about.e0_date":  { kr: "20여 년 전", en: "20+ Years Ago" },
  "about.e0_title": { kr: "한글화의 시작", en: "The Beginning" },
  "about.e0_body": {
    kr: "어린 시절, Half-Life: Counter-Strike의 AmxModX 서버 설정 파일에 달린 주석들을 하나씩 번역하며, 누군가에게 작은 도움이 되었을 때 느꼈던 기쁨이 있었다. 그 순수했던 경험이 한글화에 대한 오래된 관심의 씨앗이 됐다.",
    en: "As a child, I translated the comments in Half-Life: Counter-Strike's AmxModX server configuration files one by one, and felt a small joy each time it helped someone. That innocent experience planted a long-standing interest in localization."
  },

  "about.e1_date":  "2026. 03. 21",
  "about.e1_title": { kr: "시작: 한글 없음", en: "Start: No Korean" },
  "about.e1_body": {
    kr: "MK11의 실행 파일에는 12개 언어가 하드코딩되어 있었다. 한글은 그 목록에 없었다. 공식 지원이 불가능하다면 방법은 하나였다. 이미 존재하는 언어 슬롯 중 하나를 한국어처럼 동작하게 만드는 것. 여러 가능성을 검토한 끝에 중국어 간체(CHS) 슬롯을 기준으로 접근하기로 했다.",
    en: "MK11's executable had 12 hardcoded languages. Korean wasn't one of them. If official support wasn't possible, there was only one way left: take an existing language slot and make it behave like Korean. After weighing the options, the Simplified Chinese (CHS) slot was chosen as the basis."
  },

  "about.e2_date":  "2026. 03. 22–24",
  "about.e2_title": { kr: "암호화 해독", en: "Breaking the Encryption" },
  "about.e2_body": {
    kr: "번역 파일인 <code>Coalesced.CHS</code>는 바로 읽을 수 없는 구조였다. 여러 분석 끝에 내부 데이터를 해독하는 데 성공했고, 39개 INI 파일과 수만 줄의 텍스트에 접근할 수 있었다. 비로소 실제 번역 작업을 시작할 수 있는 기반이 열렸다.",
    en: "The translation file <code>Coalesced.CHS</code> wasn't something you could open and read. After a series of analyses, the internal data could finally be decoded, opening access to 39 INI files and tens of thousands of lines of text. Only then was the foundation for real translation work in place."
  },

  "about.e3_date":  "2026. 03. 25–28",
  "about.e3_title": { kr: "첫 번째 돌파: 한글이 화면에 뜨다", en: "First Breakthrough: Korean on Screen" },
  "about.e3_body": {
    kr: "폰트 파일 교체는 처음 여러 차례 모두 크래시로 끝났다. 단순히 글리프 이미지를 바꾸는 것만으로는 해결되지 않았고, 게임이 글자를 배치하는 내부 규칙을 함께 이해해야 했다. 기존 작품의 공식 한국어 리소스와 관련 자료를 비교하며 그 구조를 추적했고, 마침내 한글 글리프를 화면에 안정적으로 표시하는 데 성공했다. 이때부터 프로젝트는 \"가능성\"이 아니라 \"실제로 끝까지 갈 수 있는 일\"이 됐다.",
    en: "The first several attempts at font replacement all ended in crashes. Swapping glyph images alone didn't solve it; the internal rules the game used to lay text out had to be understood as well. Tracing that structure meant comparing the official Korean assets from a related title with other references. Eventually, Korean glyphs could be rendered on screen reliably. From that moment on, the project shifted from \"a possibility\" to \"something that could actually be carried through to the end.\""
  },

  "about.e4_date":  "2026. 04. 03",
  "about.e4_title": { kr: "두 번째 돌파: 검증 시스템의 벽", en: "Second Breakthrough: The Wall of Asset Validation" },
  "about.e4_body": {
    kr: "최신 빌드에서는 에셋 검증이 크게 강화되어, 작은 변경만으로도 게임이 정상적으로 로드되지 않는 문제가 생겼다. 여러 우회 시도가 실패한 끝에, 디스크의 원본 파일을 직접 바꾸지 않는 방향으로 해결책을 정리할 수 있었다. 이 과정에서는 기존 오픈소스 프로젝트의 도움도 컸다. 이 순간부터 패치는 단순한 번역 파일이 아니라, 실제 플레이 환경에서 동작하는 배포 가능한 형태로 나아가기 시작했다.",
    en: "In the newer build, asset validation had been hardened to the point where even small changes prevented the game from loading properly. After several failed workarounds, the answer landed on a different angle: leave the original files on disk untouched. Existing open-source projects were a real help along the way. From that point on, the patch stopped being just a set of translated files and started becoming something that could actually be shipped and run in a real play environment."
  },

  "about.e5_date":  "2026. 04. 05–24",
  "about.e5_title": { kr: "번역 엔진: 언어 규칙 설계", en: "Translation Engine: Designing the Language Rules" },
  "about.e5_body": {
    kr: "처음엔 기본적인 틀만 있었다. 하지만 번역을 시작하자 곧 한계가 드러났다. 스토리 INI 파일에는 화자 정보가 없었고, 누가 누구에게 말하는지 알지 못하면 적절한 경어 수준을 정할 수 없었다. 이를 해결하기 위해 다양한 게임과 자료를 참고하며, 캐릭터 관계, UI 문장 규칙, 격투 게임 용어 관행, 화자 식별 기준을 하나씩 정리했다. 그렇게 Foundation이 세워졌고, 53,000여 개 항목을 번역하는 내내 계속 보강되었다.",
    en: "At the start there was only a basic framework. The limits showed up the moment translation began. Story INI files carried no speaker information, and without knowing who was speaking to whom, the right level of speech politeness simply couldn't be decided. Working through that meant drawing on a range of games and references and gradually pinning down character relationships, conventions for UI phrasing, fighting-game terminology, and the criteria for identifying speakers. That is how the Foundation was built, and it kept being reinforced throughout the translation of more than 53,000 entries."
  },

  "about.e6_date":  "2026. 04. 26–05. 02",
  "about.e6_title": { kr: "번역 엔진: 37인의 화법 정립", en: "Translation Engine: Establishing 37 Distinct Voices" },
  "about.e6_body": {
    kr: "기존 엔진으로 전투 인트로 대사를 번역하기 시작했지만, 곧 구조적인 결함이 드러났다. 짧은 문장에서 말투 위반을 제대로 잡아내지 못했고, 전체를 다시 검토해야 하는 상황이 생겼다. 결국 일부 작업을 리셋하고, 키 구조를 전수 분석하며 캐릭터별 말투를 다시 세우기 시작했다. 상대에 따라 존댓말과 반말의 수준이 달라지는 구조까지 확인하면서, 37명의 캐릭터가 각자 자기 목소리를 가지도록 조정했다. 이 작업만 7일이 걸렸다.",
    en: "Battle intro dialogue had started running through the existing engine when a structural flaw became clear. Tone violations in short sentences weren't being caught reliably, and a full re-examination was unavoidable. Part of the work was reset, the key structure was audited end to end, and each character's speech style was re-established from the ground up. As the structure revealed how the same character's politeness shifted depending on the opponent, all 37 characters were tuned until each had a voice of their own. That step alone took seven days."
  },

  "about.toggle_more": { kr: "더 보기", en: "Read more" },
  "about.toggle_less": { kr: "접기",    en: "Show less" },

  "about.e7_date":  "2026. 05. 02",
  "about.e7_title": { kr: "완성", en: "Complete" },
  "about.e7_body": {
    kr: "42일간의 여정 끝에, 번역 가능한 모든 항목이 한국어로 옮겨졌다. 총 53,000여 개 항목 규모의 v1.0이었다. 실제 플레이에서만 드러나는 엣지 케이스들이 여전히 남아 있다는 것도 알고 있었다. 그래서 이 버전은 끝이 아니라 첫 공개에 가깝다. 국내 정식 발매가 없어 이 작품을 포기하셨던 분들께, 이제는 그 경험을 한국어로 열어드리고 싶었다.",
    en: "After a 42-day journey, every translatable entry had been moved into Korean. This was v1.0, with around 53,000 entries in total. Edge cases that only surface through actual play were certainly still out there, and that was clear from the start. In that sense, this version is less an ending than a first public release. For those who had given up on this title because it never received an official Korean release, the goal now is simply to open that experience back up in Korean."
  },

  // ── Install ───────────────────────────────────────────────────
  "install.heading": { kr: "설치 방법", en: "How to Install" },
  "install.subheading": {
    kr: "환경에 맞는 설치 방법을 선택하세요.",
    en: "Choose the setup path that fits your environment."
  },

  "install.prereq_heading": {
    kr: "사전 요구사항 (대부분 이미 설치되어 있습니다)",
    en: "Prerequisites (usually already installed)"
  },
  "install.prereq_vc2013_name": "Visual C++ 2013 (x64) ↗",
  "install.prereq_vc2022_name": "Visual C++ 2015-2022 (x64) ↗",
  "install.prereq_webview2_name": {
    kr: "WebView2 에버그린 독립형 설치 프로그램 ↗",
    en: "WebView2 Evergreen Standalone Installer ↗"
  },

  // 3-step quick start (game launch dropped — it's a result, not a step).
  // step1/step2 swap text per channel via data-channel-text in script.js.
  // CTA position references avoided; describe the file/action only.
  "install.step1_title": { kr: "다운로드", en: "Download" },
  "install.step1_desc": {
    kr: "<code>MK11-Korean-Patch-Setup.exe</code>를 받습니다.",
    en: "Get <code>MK11-Korean-Patch-Setup.exe</code>."
  },
  "install.step1_desc_cli": {
    kr: "<code>MK11-Korean-Patch-CLI-Setup.zip</code>을 받아 원하는 위치에 압축을 풉니다.",
    en: "Get <code>MK11-Korean-Patch-CLI-Setup.zip</code> and extract it anywhere."
  },
  "install.step2_title": { kr: "실행", en: "Run" },
  "install.step2_desc": {
    kr: "설치기를 실행하면 MK11 경로가 자동 탐지되며, 확인 후 패치가 적용됩니다.",
    en: "Run the installer. Your MK11 path is detected automatically; confirm to apply the patch."
  },
  "install.step2_desc_cli": {
    kr: "Windows에서는 <code>install.bat</code>을 더블 클릭, Steam Deck (Linux)에서는 터미널에서 <code>bash install.sh</code>를 실행하세요. 콘솔 창이 단계별로 안내합니다.",
    en: "Windows: double-click <code>install.bat</code>. Steam Deck (Linux): run <code>bash install.sh</code> in a terminal. The console walks you through each step."
  },
  "install.step3_title": { kr: "Steam 언어 설정", en: "Set Steam Language" },
  "install.step3_desc": {
    kr: "Steam 게임 속성 → 언어 → <code>중국어 간체(Simplified Chinese)</code> 로 설정하세요.",
    en: "Steam game properties → Language → <code>Simplified Chinese</code>."
  },
  "install.complete": {
    kr: "완료. 이제 게임을 실행하면 한글이 적용됩니다.",
    en: "Done. Launch the game to see Korean applied."
  },

  // CTA labels swap per selected card (script.js applies the *_cli variant when CLI is chosen).
  // Same "<channel> 설치 다운로드" pattern for visual symmetry.
  "install.btn_download": {
    kr: "GUI 설치 다운로드",
    en: "Download GUI Setup"
  },
  "install.btn_download_cli": {
    kr: "CLI 설치 다운로드",
    en: "Download CLI Setup"
  },

  // ── Install: channel cards (GUI recommended / CLI alternative) ──
  "install.badge_recommended": { kr: "권장", en: "RECOMMENDED" },
  "install.badge_alternative": { kr: "대체", en: "ALTERNATIVE" },

  "install.card_gui_title": { kr: "GUI INSTALL", en: "GUI INSTALL" },
  "install.card_gui_tagline": {
    kr: "대부분의 Windows 사용자에게 가장 쉬운 방법입니다.",
    en: "The simplest path for most Windows users."
  },
  "install.card_gui_caption_placeholder": {
    kr: "설치기 미리보기 준비 중",
    en: "Installer preview coming soon"
  },
  "install.card_gui_fallback": {
    kr: "문제가 생기면 CLI 설치를 사용하세요.",
    en: "If anything blocks the installer, fall back to CLI Setup."
  },

  "install.card_cli_title": { kr: "CLI INSTALL", en: "CLI INSTALL" },
  "install.card_cli_tagline": {
    kr: "Windows와 Steam Deck (Linux)를 모두 지원합니다.",
    en: "Supports both Windows and Steam Deck (Linux)."
  },
  "install.card_cli_fallback": {
    kr: "터미널 또는 스크립트 실행이 필요합니다.",
    en: "Requires running a terminal or script."
  },

  // ── Trust strip ──────────────────────────────────────────────
  "install.trust_strip": {
    kr: "Microsoft Defender 공식 검토 통과 (5/6 제출 · 5/10 승인) · VirusTotal 70여 개 엔진 전수 통과",
    en: "Cleared by Microsoft Defender (submitted May 6, approved May 10) · Passed across 70+ engines on VirusTotal"
  },

  // ── CLI card: platform tags ─────────────────────────────────
  // Single Unix path: same install.sh runs on both Steam Deck (SteamOS) and Linux.
  // Steam Deck is listed first because it's the actual driver for the CLI track.
  "install.cli_platform_windows": "Windows 11/10/8/7",
  "install.cli_platform_unix":    "Steam Deck (Linux · Bazzite)",
  "install.beta_label":           "BETA",

  // Inline hint chip beside the Windows command — clearer than a "::" comment
  "install.cli_hint_doubleclick": {
    kr: "더블클릭하세요",
    en: "double-click"
  },

  // ── CLI card: terminal viewer preview lines ─────────────────
  "install.cli_preview_l1": {
    kr: "MK11 한글 패치 v1.0",
    en: "MK11 Korean Patch v1.0"
  },
  "install.cli_preview_l2": {
    kr: "Steam 경로 자동 탐지 완료",
    en: "Steam install path detected"
  },
  "install.cli_preview_l3": {
    kr: "설치를 진행할까요? [Y/n]",
    en: "Proceed with install? [Y/n]"
  },
  "install.cli_preview_l4": {
    kr: "[1/3] 원본 백업... OK",
    en: "[1/3] Backing up originals... OK"
  },
  "install.cli_preview_l5": {
    kr: "[2/3] 패치 적용... OK",
    en: "[2/3] Applying patch... OK"
  },
  "install.cli_preview_l6": {
    kr: "완료. Steam 언어를 중국어 간체로 설정하세요.",
    en: "Done. Set Steam language to Simplified Chinese."
  },



  // ── Online ────────────────────────────────────────────────────
  "online.heading": { kr: "다운로드 전 안내", en: "Before You Download" },
  "online.p1": {
    kr: "정품 Steam 기준으로 온라인 플레이 정상 동작을 확인했습니다. 본 패치는 번역 텍스트와 폰트 적용에 필요한 최소 구성만 사용하며, 치트·언락·게임 변조 기능은 포함하지 않습니다.",
    en: "Online play has been verified on a genuine Steam copy. This patch uses only the minimum components needed to apply the translation and font, and contains no cheats, unlocks, or gameplay modifications."
  },
  "online.p2": {
    kr: "비공식 팬 제작 패치이므로 환경에 따라 차이가 있을 수 있습니다. 자세한 내용은 <a href='#faq' class='online-faq-link'>자주 묻는 질문 ↗</a>을 참고하세요.",
    en: "As an unofficial patch, behavior may vary by environment. For details, see the <a href='#faq' class='online-faq-link'>FAQ ↗</a>."
  },
  "online.btn_cancel":  { kr: "닫기", en: "Close" },
  "online.btn_confirm": { kr: "확인", en: "OK"    },

  // ── FAQ ───────────────────────────────────────────────────────
  "faq.heading": { kr: "자주 묻는 질문", en: "FAQ" },
  "faq.sub":     { kr: "설치·호환성·보안·피드백 관련 안내", en: "Installation, compatibility, security, and feedback" },

  // ── Feedback ──────────────────────────────────────────────────
  "feedback.heading": { kr: "번역 피드백", en: "Translation Feedback" },
  "feedback.sub": {
    kr: "오역이나 어색한 번역을 발견하셨나요?<br>파트를 선택하고 내용을 남겨주세요. 익명으로 제출할 수 있으며,<br>피드백은 번역 품질 개선에만 사용됩니다.",
    en: "Found a mistranslation or awkward phrasing?<br>Select a category and leave your feedback. Submissions are anonymous<br>and used solely for translation quality improvement."
  },
  "feedback.label_category":      { kr: "번역 파트",    en: "Category" },
  "feedback.label_subcategory":   { kr: "세부 항목",     en: "Sub-category" },
  "feedback.label_subcategory_hint": { kr: "(선택)",    en: "(optional)" },
  "feedback.opt_sub_placeholder": { kr: "세부 항목 선택", en: "Select sub-category" },

  "feedback.label_original":      { kr: "게임 내 텍스트", en: "In-game Text" },
  "feedback.label_original_hint": { kr: "(선택)",          en: "(optional)" },
  "feedback.placeholder_original": { kr: "보이는 그대로 입력", en: "Enter text as shown in-game" },

  "feedback.sub_story_mk11":      { kr: "파트1: 모탈 컴뱃 11",    en: "Part 1: Mortal Kombat 11" },
  "feedback.sub_story_aftermath": { kr: "파트2: 애프터매스",       en: "Part 2: Aftermath" },
  "feedback.sub_story_ending":    { kr: "클래식 타워 엔딩",        en: "Classic Tower Ending" },

  "feedback.sub_items_gear":      { kr: "기어 이름 · 설명",  en: "Gear Name & Description" },
  "feedback.sub_items_skin":      { kr: "스킨 이름",        en: "Skin Name" },
  "feedback.sub_items_ability":   { kr: "어빌리티 설명",     en: "Ability Description" },
  "feedback.label_characters":    { kr: "캐릭터",        en: "Characters" },
  "feedback.label_suggestion":    { kr: "피드백 내용",   en: "Feedback" },
  "feedback.label_nickname":      { kr: "닉네임",        en: "Nickname" },
  "feedback.label_nickname_hint": { kr: "(선택)",        en: "(optional)" },

  "feedback.char_placeholder_a":  { kr: "내 캐릭터", en: "My Character" },
  "feedback.char_placeholder_b":  { kr: "상대 캐릭터", en: "Opponent" },
  "feedback.placeholder_suggestion": {
    kr: "어색한 부분, 오역, 개선 제안 등을 자유롭게 작성해주세요.",
    en: "Describe the issue, mistranslation, or your suggestion."
  },
  "feedback.placeholder_nickname": { kr: "익명", en: "Anonymous" },
  "feedback.nickname_default":     { kr: "익명", en: "Anonymous" },

  "feedback.opt_placeholder": { kr: "파트를 선택하세요", en: "Select a category" },
  "feedback.opt_ingame":    { kr: "인트로 대사", en: "Intro Dialogue" },
  "feedback.opt_story":     { kr: "스토리 모드",           en: "Story Mode" },
  "feedback.opt_movelist":  { kr: "무브리스트",             en: "Movelist" },
  "feedback.opt_tutorial":  { kr: "튜토리얼",              en: "Tutorial" },
  "feedback.opt_items":     { kr: "아이템 · 커스터마이즈", en: "Items & Customize" },
  "feedback.opt_ui":        { kr: "UI · 메뉴",             en: "UI & Menus" },
  "feedback.opt_krypt":     { kr: "크립트",                 en: "Krypt" },
  "feedback.opt_other":     { kr: "기타",                   en: "Other" },

  "feedback.char_picker_title":   { kr: "캐릭터 선택",  en: "Select Characters" },
  "feedback.char_picker_confirm": { kr: "확인",         en: "Confirm"           },
  "feedback.char_picker_sub_a":     { kr: "내 캐릭터를 선택하세요",  en: "Select your character"  },
  "feedback.char_picker_sub_b":     { kr: "상대 캐릭터를 선택하세요", en: "Select opponent"        },
  "feedback.msg_chars_required":  { kr: "두 캐릭터를 모두 선택해주세요.", en: "Please select both characters." },
  "feedback.err_category":        { kr: "번역 파트를 선택해주세요.",     en: "Please select a category." },
  "feedback.err_suggestion":      { kr: "피드백 내용을 입력해주세요.",    en: "Please enter your feedback." },

  "feedback.label_screenshot":      { kr: "스크린샷",             en: "Screenshot" },
  "feedback.label_screenshot_hint": { kr: "(선택, 최대 2MB)",    en: "(optional, max 2MB)" },
  "feedback.screenshot_btn":        { kr: "이미지 선택",          en: "Choose image" },
  "feedback.screenshot_remove":     { kr: "제거",                 en: "Remove" },
  "feedback.screenshot_warn": {
    kr: "2MB 이하 이미지만 첨부할 수 있습니다.",
    en: "Only images under 2MB can be attached."
  },
  "feedback.sysinfo_label": {
    kr: "시스템 정보 함께 제출 (OS, GPU, 디스플레이)",
    en: "Include system info (OS, GPU, Display)"
  },

  "feedback.btn_submit":    { kr: "피드백 제출", en: "Submit Feedback" },
  "feedback.btn_submitting": { kr: "제출 중...", en: "Submitting..." },
  "feedback.msg_success": { kr: "피드백이 제출됐습니다. 감사합니다!", en: "Feedback submitted. Thank you!" },
  "feedback.msg_error":   { kr: "제출에 실패했습니다. 잠시 후 다시 시도해주세요.", en: "Submission failed. Please try again later." },

  // ── Footer ────────────────────────────────────────────────────
  "footer.title":                { kr: "MORTAL KOMBAT 11 KOREAN PATCH",  en: "MORTAL KOMBAT 11 KOREAN PATCH" },
  "footer.credit":               { kr: "by KimHerV",   en: "by KimHerV" },
  "footer.release_notes":        { kr: "릴리즈 노트",      en: "Release Notes" },
  "footer.issue_tracker":        { kr: "이슈 트래커",      en: "Issue Tracker" },
  "footer.press":                { kr: "디스이즈게임",     en: "Press coverage" },
  "footer.first_release_label":  { kr: "최초 배포",        en: "First released" },
  "footer.latest_version_label": { kr: "최신 버전",        en: "Latest" },
  "player.unmute_hint":   { kr: "소리 켜기",        en: "Unmute" },

  // ── Engine Visualizer ────────────────────────────────────────
  "engine.heading":       { kr: "번역 엔진: 화법 시스템", en: "Translation Engine: Speech System" },
  "engine.wip":           { kr: "개발 중", en: "In Development" },
  "engine.sub":           { kr: "37인 캐릭터의 화법 체계. 노드를 클릭하면 상세 정보를, 두 번째 노드를 클릭하면 화법 관계를 비교합니다. 드래그·줌으로 탐색하세요.", en: "The speech register system behind 37 characters. Click a node for details, click a second node to compare registers. Drag and zoom to explore." },
  "engine.filter_all":    { kr: "전체", en: "All" },
  "engine.panel_formality":   { kr: "기본 어체",   en: "Default Register" },
  "engine.panel_register":    { kr: "역할",         en: "Role" },
  "engine.panel_tone":        { kr: "어조",         en: "Tone" },
  "engine.panel_vocab":       { kr: "핵심 어휘",    en: "Key Vocabulary" },
  "engine.panel_doctrine":    { kr: "화법 독트린",   en: "Speech Doctrine" },
  "engine.panel_quirks":      { kr: "화법 특이사항", en: "Speech Notes" },
  "engine.panel_emotion":     { kr: "감정 팔레트",   en: "Emotion Palette" },
  "engine.panel_sentence":    { kr: "문장 패턴",     en: "Sentence Pattern" },
  "engine.panel_relations":   { kr: "주요 관계",     en: "Notable Relationships" },
  "engine.pair_fallback":     { kr: "직접 매핑 없음. 기본 어체 적용.", en: "No direct mapping. Default register applied." },
  "engine.pair_hint":         { kr: "그래프에서 다른 캐릭터를 클릭하면 화법 관계를 비교합니다.", en: "Click another node in the graph to compare speech registers." },
  "engine.close":             { kr: "닫기", en: "Close" },
  "footer.legal": {
    kr: "비공식 팬 제작 패치. Mortal Kombat 11 및 관련 상표는 Warner Bros. Entertainment Inc. 및 NetherRealm Studios의 소유입니다.",
    en: "Unofficial fan-made patch. Mortal Kombat 11 and related trademarks are the property of Warner Bros. Entertainment Inc. and NetherRealm Studios."
  }
};
