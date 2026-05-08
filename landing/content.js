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
  "hero.platform_steam":   { kr: "Steam · 지원",          en: "Steam · Supported" },
  "hero.platform_epic":    { kr: "Epic Games · 미지원",   en: "Epic Games · Not supported" },
  "hero.platform_msstore": { kr: "Microsoft Store · 미지원", en: "Microsoft Store · Not supported" },
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

  "about.e0_date":  { kr: "10여 년 전", en: "Years Ago" },
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

  "install.prereq_heading": { kr: "사전 요구사항", en: "Prerequisites" },
  "install.prereq_vc2013_name": "Visual C++ 2013 (x64) ↗",
  "install.prereq_vc2022_name": "Visual C++ 2015-2022 (x64) ↗",

  "install.step1_title": { kr: "인스톨러 다운로드",  en: "Download Installer" },
  "install.step1_desc": {
    kr: "아래 다운로드 버튼을 클릭하여 <code>MK11-Korean-Patch-Setup.exe</code>를 받으세요.",
    en: "Click the download button below to get <code>MK11-Korean-Patch-Setup.exe</code>."
  },
  "install.step2_title": { kr: "인스톨러 실행", en: "Run Installer" },
  "install.step2_desc": {
    kr: "실행 후 MK11 설치 경로를 확인하면 자동으로 패치가 적용됩니다. Steam 경로는 자동 탐지됩니다.",
    en: "Run the installer and confirm your MK11 path. Steam installations are detected automatically."
  },
  "install.step3_title": { kr: "게임 언어 설정", en: "Set Game Language" },
  "install.step3_desc": {
    kr: "Steam 게임 속성 → 언어 → <code>중국어 간체(Simplified Chinese)</code> 로 설정하세요.",
    en: "Steam game properties → Language → <code>Simplified Chinese</code>."
  },
  "install.step4_title": { kr: "게임 실행", en: "Launch Game" },
  "install.step4_desc": {
    kr: "한글 텍스트와 폰트가 적용된 상태로 게임이 시작됩니다.",
    en: "The game will start with Korean text and font applied."
  },

  "install.manifest_heading": { kr: "설치되는 파일", en: "Installed Files" },
  "install.manifest_f1_name": "Coalesced.CHS",
  "install.manifest_f1_desc": {
    kr: "한글 번역 텍스트 전체 (53,000+ 항목)",
    en: "All Korean translation text (53,000+ entries)"
  },
  "install.manifest_f2_name": "ui_c_inGameFonts_chs.xxx",
  "install.manifest_f2_desc": {
    kr: "나눔스퀘어 네오 커스텀 렌더링",
    en: "NanumSquare Neo custom rendering"
  },
  "install.manifest_f3_name": "dinput8.dll",
  "install.manifest_f3_desc": {
    kr: "ASI 플러그인 로더 · <a href=\"https://github.com/ThirteenAG/Ultimate-ASI-Loader\" target=\"_blank\" rel=\"noopener\">Ultimate ASI Loader ↗</a>",
    en: "ASI plugin loader · <a href=\"https://github.com/ThirteenAG/Ultimate-ASI-Loader\" target=\"_blank\" rel=\"noopener\">Ultimate ASI Loader ↗</a>"
  },
  "install.manifest_f4_name": "ASIMK11.asi",
  "install.manifest_f4_desc": {
    kr: "CVD 우회 · 수정 파일 로드 허용 · <a href=\"https://github.com/thethiny/ASIMK11\" target=\"_blank\" rel=\"noopener\">ASI MK11 ↗</a>",
    en: "CVD bypass · allows modified file loading · <a href=\"https://github.com/thethiny/ASIMK11\" target=\"_blank\" rel=\"noopener\">ASI MK11 ↗</a>"
  },
  "install.manifest_f5_name": "ASIMK11.ini",
  "install.manifest_f5_desc": {
    kr: "CVD 우회 플러그인 설정 파일",
    en: "CVD bypass plugin configuration"
  },
  "install.manifest_f6_name": "libzmq-v120-mt-4_3_4.dll",
  "install.manifest_f6_desc": {
    kr: "ASIMK11 의존 라이브러리 · <a href=\"https://github.com/zeromq/libzmq\" target=\"_blank\" rel=\"noopener\">ZeroMQ ↗</a>",
    en: "ASIMK11 dependency library · <a href=\"https://github.com/zeromq/libzmq\" target=\"_blank\" rel=\"noopener\">ZeroMQ ↗</a>"
  },
  "install.manifest_f7_name": "libsodium.dll",
  "install.manifest_f7_desc": {
    kr: "ZeroMQ 의존 암호화 라이브러리 · <a href=\"https://github.com/jedisct1/libsodium\" target=\"_blank\" rel=\"noopener\">libsodium ↗</a>",
    en: "ZeroMQ dependency cryptography library · <a href=\"https://github.com/jedisct1/libsodium\" target=\"_blank\" rel=\"noopener\">libsodium ↗</a>"
  },

  "install.safety1": {
    kr: "실행 파일(.exe) · 게임 원본 파일 무변조",
    en: "Game executable (.exe) and original files unmodified"
  },
  "install.safety2": {
    kr: "비영리 개인 프로젝트",
    en: "Non-commercial personal project"
  },
  "install.safety3": {
    kr: "저작권자 Warner Bros. Entertainment Inc. 및 NetherRealm Studios의 요청 시 즉시 배포 중단",
    en: "Distribution will cease immediately upon request from copyright holder Warner Bros. Entertainment Inc. or NetherRealm Studios"
  },
  "install.btn_download": {
    kr: "최신 버전 다운로드",
    en: "Download Latest Version"
  },

  // ── Troubleshooting (Defender) ────────────────────────────────
  "trouble.heading": {
    kr: "Windows에서 다운로드가 차단될 때",
    en: "When Windows Blocks the Download"
  },
  "trouble.cause": {
    kr: "코드 서명되지 않은 인스톨러에 대해 일부 백신의 머신러닝 휴리스틱이 자동으로 격리하거나 삭제할 수 있습니다. 본 인스톨러는 PyInstaller 기반으로 빌드되어 있으며, 이 패키징 방식은 다른 PyInstaller 도구에서도 일부 ML 백신의 false positive가 보고되는 알려진 패턴입니다. 주요 백신은 정상 판정을 받았으나, 사용 중이신 환경에서 차단될 경우 아래 절차로 복원·진행하실 수 있습니다.",
    en: "Some antivirus programs use ML heuristics that may quarantine or auto-delete unsigned installers. This installer is built with PyInstaller, a packaging method known to produce ML false positives across many similar tools. Major AVs have cleared this patch, but if your environment blocks it, use either method below to restore or proceed."
  },
  "trouble.method1_title": {
    kr: "방법 1: 격리 항목 복원",
    en: "Method 1: Restore from quarantine"
  },
  "trouble.method1_step1": {
    kr: "사용 중이신 백신 프로그램의 격리 함 또는 위협/보호 기록 열기",
    en: "Open your antivirus program's quarantine or threat/protection history"
  },
  "trouble.method1_step2": {
    kr: "차단된 인스톨러 항목 찾기",
    en: "Find the blocked installer entry"
  },
  "trouble.method1_step3": {
    kr: "복원 또는 허용 클릭",
    en: "Click Restore or Allow"
  },
  "trouble.method2_title": {
    kr: "방법 2: 다운로드 폴더 예외 처리 후 재다운로드",
    en: "Method 2: Add download folder to exclusions, then re-download"
  },
  "trouble.method2_step1": {
    kr: "백신 설정 → 예외 항목 또는 제외 항목 메뉴 열기",
    en: "Open your antivirus settings → Exclusions or Exceptions"
  },
  "trouble.method2_step2": {
    kr: "다운로드 폴더를 예외 경로로 추가",
    en: "Add the Downloads folder as an exclusion"
  },
  "trouble.method2_step3": {
    kr: "인스톨러 다시 다운로드 후 실행",
    en: "Re-download the installer and run it"
  },
  "trouble.method2_step4": {
    kr: "설치 완료 후 예외 항목 제거 권장",
    en: "Remove the exclusion after install completes (recommended)"
  },
  "trouble.scan_heading": {
    kr: "주요 백신 검진 결과",
    en: "Major AV Scan Results"
  },
  "trouble.scan_note": {
    kr: "VirusTotal 70여 개 엔진 기준",
    en: "Per VirusTotal (70+ engines)"
  },
  "trouble.footer": {
    kr: "본 패치는 <a href=\"https://github.com/KimHerV/mk11-korean-patch\" target=\"_blank\" rel=\"noopener\">오픈소스</a>로 전체 코드를 확인하실 수 있습니다. 자체 DLL 개발 및 인스톨러 패키징 방식 개선을 통해 플랫폼 지원 확장과 백신 오탐지 감소를 점진적으로 진행할 예정입니다.",
    en: "This patch is <a href=\"https://github.com/KimHerV/mk11-korean-patch\" target=\"_blank\" rel=\"noopener\">open source</a> with the full code publicly reviewable. A custom DLL and installer packaging improvements are planned to gradually expand platform support and reduce AV false positives."
  },

  // ── Online ────────────────────────────────────────────────────
  "online.heading": { kr: "다운로드 전 안내", en: "Before You Download" },
  "online.p1": {
    kr: "본 패치는 현재 테스트 환경 기준으로 Steam 버전 MK11에서 온라인 접속 및 플레이를 확인했습니다.",
    en: "Online play has been verified in our test environment on the Steam version of MK11."
  },
  "online.do_heading": {
    kr: "본 패치가 수행하는 일",
    en: "What this patch does"
  },
  "online.do_1": {
    kr: "한글 번역 텍스트와 폰트 파일을 게임 폴더에 복사",
    en: "Copies Korean translation text and font files into the game folder"
  },
  "online.do_2": {
    kr: "한글 번역 파일이 게임에 정상 적용되도록 게임 내부 파일 검사를 잠시 우회 (게임 실행 파일 자체는 변경하지 않음)",
    en: "Briefly bypasses the game's internal file check so the Korean translation files are accepted (the game executable itself is not modified)"
  },
  "online.do_3": {
    kr: "위 우회를 위해 오픈소스 구성요소 4개 사용. 라이선스 상세는 <a href=\"https://github.com/KimHerV/mk11-korean-patch/blob/main/THIRD_PARTY_NOTICES.md\" target=\"_blank\" rel=\"noopener\">THIRD_PARTY_NOTICES ↗</a> 참조",
    en: "Uses 4 open-source components for the above bypass. See <a href=\"https://github.com/KimHerV/mk11-korean-patch/blob/main/THIRD_PARTY_NOTICES.md\" target=\"_blank\" rel=\"noopener\">THIRD_PARTY_NOTICES ↗</a> for full license details"
  },
  "online.dont_heading": {
    kr: "본 패치가 수행하지 않는 일",
    en: "What this patch does not do"
  },
  "online.dont_1": {
    kr: "치트, 언락, DLC 우회, 승부 조작 등 부정 행위",
    en: "No cheats, unlocks, DLC bypass, or match-result manipulation"
  },
  "online.dont_2": {
    kr: "게임 폴더 외 다른 파일·프로그램 변경",
    en: "No modification of files or programs outside the game folder"
  },
  "online.dont_3": {
    kr: "외부 서버와의 통신 또는 사용자 정보 수집",
    en: "No communication with external servers, no user-data collection"
  },
  "online.p3": {
    kr: "다만 비공식 팬 제작 패치이므로 게임 업데이트, 플랫폼 정책, 사용자 환경에 따라 동작이 달라질 수 있습니다. 온라인 사용이 걱정되시는 경우 싱글 플레이 또는 오프라인 환경에서 먼저 사용해보시는 것을 권장드립니다.",
    en: "This is an unofficial fan-made patch, so behavior may change with game updates, platform policy, or user environment. If you are concerned about online play, we recommend testing in single-player or offline mode first."
  },
  "online.btn_cancel":  { kr: "닫기",        en: "Close"        },
  "online.btn_confirm": { kr: "확인했습니다", en: "I understand" },

  // ── Feedback ──────────────────────────────────────────────────
  "feedback.heading": { kr: "번역 피드백", en: "Translation Feedback" },
  "feedback.sub": {
    kr: "오역이나 어색한 번역을 발견하셨나요?<br>파트를 선택하고 내용을 남겨주세요. 익명으로 제출할 수 있습니다.",
    en: "Found a mistranslation or awkward phrasing?<br>Select a category and leave your feedback. Anonymous submissions welcome."
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

  "feedback.btn_submit": { kr: "피드백 제출",                             en: "Submit Feedback" },
  "feedback.btn_submitting": { kr: "제출 중...",                          en: "Submitting..." },
  "feedback.notice":     { kr: "제출된 피드백은 번역 품질 개선에만 사용됩니다.", en: "Submitted feedback is used solely for translation quality improvement." },
  "feedback.msg_success": { kr: "피드백이 제출됐습니다. 감사합니다!", en: "Feedback submitted. Thank you!" },
  "feedback.msg_error":   { kr: "제출에 실패했습니다. 잠시 후 다시 시도해주세요.", en: "Submission failed. Please try again later." },

  // ── Footer ────────────────────────────────────────────────────
  "footer.title":         { kr: "MK11 한글 패치",  en: "MK11 Korean Patch" },
  "footer.credit":        { kr: "제작: KimHerV",   en: "Created by KimHerV" },
  "footer.release_notes": { kr: "릴리즈 노트",      en: "Release Notes" },
  "footer.issue_tracker": { kr: "이슈 트래커",      en: "Issue Tracker" },
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
    kr: "비공식 팬 제작 패치입니다. Mortal Kombat 11 및 관련 상표는 Warner Bros. Entertainment Inc. 및 NetherRealm Studios의 소유입니다. 본 패치는 한국 사용자를 위한 접근성 개선 목적으로 제작되었으며, 피드백은 언제든 환영입니다.",
    en: "Unofficial fan-made patch. Mortal Kombat 11 and all related trademarks are the property of Warner Bros. Entertainment Inc. and NetherRealm Studios. This patch was created for accessibility purposes for Korean-speaking players. Feedback is always welcome."
  }
};
