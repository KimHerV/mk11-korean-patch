/**
 * Changelog data (inline JS, same pattern as banner.js).
 *
 * Add new versions to the front of the array.
 *
 * Schema:
 *   version, date     - required, strings
 *   title             - {kr, en} one-line title
 *   lead              - {kr, en} one-paragraph summary
 *   highlights        - [{title:{kr,en}, items:{kr:[], en:[]}}]
 *   install_note      - {kr, en} install guidance (optional). string -> single paragraph, array -> bullet list
 *   github_release    - URL (optional)
 */
window.MK11_CHANGELOG = [
  {
    version: "1.1",
    date: "2026-05-17",
    title: {
      kr: "스토리 모드 1부 품질 개선",
      en: "Story Mode Part 1: Quality Refinement"
    },
    lead: {
      kr: "이번 업데이트는 스토리 모드 1부(애프터매스 이전)에 한정된 품질 개선입니다. 1부 전체를 다시 검토하여 등장인물별 말투와 표현을 다듬었습니다. 같은 인물이라도 처한 상황에 따라 말투가 자연스럽게 달라지도록 체계를 정비했습니다. 2부(애프터매스)와 그 외 영역은 이번 범위에서 제외되며, 후속 버전에서 다뤄집니다.",
      en: "This update is limited to Story Mode Part 1 (pre-Aftermath). Part 1 was re-reviewed end-to-end, and each character's speech and expressions were refined. The system was updated so a character's tone now varies naturally by state (revenant, past, etc.). Part 2 (Aftermath) and other areas are out of scope and will be addressed in later versions."
    },
    highlights: [
      {
        title: { kr: "캐릭터별 말투 정밀화", en: "Character-specific tone refinement" },
        items: {
          kr: [
            "제이드: 에데니아 귀족의 품위와 전사의 단호함을 함께 살렸습니다. 전투 상황에서는 격식을 풀어 단호하게 말하도록 화법을 조정했습니다.",
            "리우 캉과 키타나: 친밀한 사이를 살려 양쪽 모두 반말로 통일했습니다. 이전 버전의 비대칭 말투를 교정했습니다.",
            "리우 캉과 서브제로, 한조(스콜피온): 대장군 사이의 상호 존중을 살려 작전 회의 자리의 격조 있는 존댓말로 통일했습니다.",
            "캐시가 과거의 소냐를 만날 때: 시간 이상으로 만난 젊은 시절의 어머니에 대한 예우를 적용했습니다. 사적 자리와 공식 자리를 구분합니다.",
            "세트리온: 모성적 권위(하게체), 신적 단죄(선언체), 의례적 선포(합쇼체)를 상황별 비율로 분배했습니다.",
            "라이덴: 필멸자 앞에서의 멘토 말투(하게체)와 우주적 선포(선언체)를 구분했습니다. 다크 라이덴에는 별도 말투를 적용합니다.",
            "엘더 갓: 챕터11 라이덴의 응답에서 신격 사이의 합쇼체 화법을 새로 정립했습니다.",
            "쿵 라오, 제이드, 키타나(레버넌트 상태): 사후 부활한 모습에 차갑고 단호한 말투를 적용했습니다.",
            "조니, 잭스, 스콜피온, 케이노(과거 시점): 젊은 시절의 미숙함과 패기를 말투에 반영했습니다.",
            "밀리나, 눕 사이보트: 이전에 누락됐던 화자별 기본 어조를 보강했습니다."
          ],
          en: [
            "Jade: Refined to combine Edenian noble dignity with warrior decisiveness. Added a combat exception so that speech becomes direct and less formal in combat.",
            "Liu Kang and Kitana: Unified to mutual informal speech to reflect their intimate bond. Corrected the prior asymmetric register.",
            "Liu Kang with Sub-Zero and Hanzo (Scorpion): Unified to a dignified war-council register to reflect mutual respect between leaders.",
            "Cassie meeting past Sonya: Applied a respectful register for a young mother met through a time anomaly. Private and official contexts are distinguished.",
            "Cetrion: Distributed maternal authority (Hage-che), divine judgment (declarative), and ceremonial proclamation (Hapsho-che) by context.",
            "Raiden: Distinguished between the mentor tone toward mortals (Hage-che) and cosmic decree (declarative). Dark Raiden uses a separate register.",
            "Elder Gods: Formalized the Hapsho-che register used between deities in Ch.11 Raiden's response.",
            "Kung Lao, Jade, Kitana (revenant): Applied a cold, resolute tone to their post-death resurrection.",
            "Johnny, Jax, Scorpion, Kano (past): Reflected the inexperience and brashness of their younger selves in speech.",
            "Mileena, Noob Saibot: Reinforced the default speaker registers that were previously missing."
          ]
        }
      },
      {
        title: { kr: "캐릭터 상태별 말투 차별화 (신규)", en: "Character state-based tone differentiation (new)" },
        items: {
          kr: [
            "새로 도입한 네 가지 상태 분류 체계로 총 294줄에 차별화된 말투를 적용했습니다. 같은 인물이라도 상태에 따라 말투가 달라집니다.",
            "레버넌트(사후 부활, 5명 61줄): 리우 캉, 제이드, 키타나, 쿵 라오, 세트리온이 해당됩니다.",
            "과거(크로니카가 데려온 젊은 시절, 5명 190줄): 소냐, 잭스, 조니, 스콜피온, 케이노가 해당됩니다.",
            "다크(챕터0 오프닝, 10줄): 라이덴이 해당됩니다.",
            "신격(챕터12 화신 변환 이후, 33줄): 리우 캉이 해당됩니다."
          ],
          en: [
            "Introduced a new 4-state system and applied differentiated registers across 294 lines. The same character's tone now varies by state.",
            "Revenant (post-death, 5 characters / 61 lines): Liu Kang, Jade, Kitana, Kung Lao, Cetrion.",
            "Past (younger selves brought by Kronika, 5 characters / 190 lines): Sonya, Jax, Johnny, Scorpion, Kano.",
            "Dark (Ch.0 opening, 10 lines): Raiden.",
            "Divine (Ch.12 fire-god transformation, 33 lines): Liu Kang."
          ]
        }
      },
      {
        title: { kr: "말투 규칙 체계화 (내부 개선)", en: "Register doctrine systematization (internal)" },
        items: {
          kr: [
            "캐릭터별 화법을 화자 기본 말투, 청자별 경어 매핑, 상태별 말투 변형의 세 층 구조로 정리했습니다.",
            "검수 도구가 화자와 청자의 짝, 상태 변형을 동시에 인식하도록 검수 서버를 5세대로 개선했습니다.",
            "스토리 뷰어에 상태 배지, 경어 매트릭스 보기, 일괄 적용 기능을 추가했습니다."
          ],
          en: [
            "Reorganized character speech into a 3-layer structure: speaker voice pattern, per-listener register map, and state variants.",
            "Upgraded the review tooling to MCP server v5 so that speaker-listener pairs and state variants are recognized simultaneously.",
            "Added state badges, a register matrix popup, and bulk-apply tools to the Story Viewer."
          ]
        }
      },
      {
        title: { kr: "번역 품질 1,075건 개선", en: "1,075 translation quality improvements" },
        items: {
          kr: [
            "경어법 일관성을 114건 교정했습니다. 화자와 청자 관계에 맞는 어미를 자동으로 탐지하여 적용했습니다.",
            "문체와 표현을 961건 자연화했습니다. 문장 구조를 재구성하고 어휘를 정제했습니다.",
            "스토리 1부 전체를 직접 다시 검토했습니다."
          ],
          en: [
            "Corrected 114 honorifics-consistency issues, applying auto-detection of speaker-listener relationships.",
            "Naturalized 961 style and expression issues through sentence restructuring and vocabulary refinement.",
            "Reviewed Story Part 1 end-to-end by hand."
          ]
        }
      }
    ],
    install_note: {
      kr: [
        "GUI: 매니저에서 v1.1 업데이트를 내려받아 주세요.",
        "CLI: install 스크립트를 다시 실행하면 최신 버전으로 받아집니다."
      ],
      en: [
        "GUI: download the v1.1 update from the manager.",
        "CLI: re-run the install script to fetch the latest version."
      ]
    },
    github_release: "https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.1"
  },
  {
    version: "1.0",
    date: "2026-05-13",
    title: {
      kr: "플랫폼 지원 확장: Steam Deck 및 Linux Bazzite",
      en: "Platform Support Expansion: Steam Deck and Linux Bazzite"
    },
    lead: {
      kr: "v1.0 패치 내용은 그대로 유지하면서, Steam Deck과 Linux Bazzite 환경을 위한 CLI 설치 채널을 추가했습니다. Windows GUI 인스톨러에 더해 터미널에서 한 줄로도 설치할 수 있습니다.",
      en: "Kept the v1.0 patch content intact while adding a CLI installation channel for Steam Deck and Linux Bazzite. The patch can now be installed with a single terminal command in addition to the Windows GUI installer."
    },
    highlights: [
      {
        title: { kr: "CLI 설치 채널 신설", en: "New CLI installation channel" },
        items: {
          kr: [
            "Steam Deck SteamOS 환경을 정식 지원합니다.",
            "Linux Bazzite(Flatpak 기반 Steam) 환경을 정식 지원합니다.",
            "Windows에서도 GUI 대신 CLI로 설치할 수 있습니다(install.bat).",
            "터미널에서 install.sh를 한 줄로 실행하여 설치를 진행할 수 있습니다."
          ],
          en: [
            "Added official support for Steam Deck (SteamOS).",
            "Added official support for Linux Bazzite (Flatpak-based Steam).",
            "Enabled CLI installation on Windows as an alternative to the GUI (install.bat).",
            "Provided a single-command install via `install.sh` in the terminal."
          ]
        }
      },
      {
        title: { kr: "설치 후 재실행 동작", en: "Re-installation behavior" },
        items: {
          kr: [
            "install 스크립트를 다시 실행하면 최신 패치로 자동 갱신됩니다.",
            "별도 매니저 없이 스크립트 한 번으로 적용, 복구, 갱신이 모두 처리됩니다."
          ],
          en: [
            "Re-running the install script automatically updates to the latest patch.",
            "Handled apply, restore, and update through a single script, without a separate manager."
          ]
        }
      }
    ],
    install_note: {
      kr: "GitHub 릴리즈에서 MK11-Korean-Patch-CLI-Setup.zip을 받아 압축을 해제한 뒤, install.sh(또는 install.bat)를 실행하시기 바랍니다.",
      en: "Download MK11-Korean-Patch-CLI-Setup.zip from the GitHub release, extract it, and run install.sh (or install.bat)."
    },
    github_release: "https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.0"
  },
  {
    version: "1.0",
    date: "2026-05-04",
    title: {
      kr: "첫 정식 출시: 게임 전체 한글화",
      en: "Initial Release: Full Game Localization"
    },
    lead: {
      kr: "MK11 한글 패치의 첫 정식 버전입니다. 스토리 모드, 무브리스트, UI, DLC, 인게임 교환 대사까지 게임 전체에 걸쳐 총 53,000건 이상의 번역을 적용했습니다.",
      en: "First official release of the MK11 Korean Patch. Over 53,000 translations were applied across story mode, movelists, UI, DLC, and in-game dialogue exchanges."
    },
    highlights: [
      {
        title: { kr: "번역 범위 (총 53,000건+)", en: "Translation coverage (53,000+ entries)" },
        items: {
          kr: [
            "아이템 및 크립트 22,689건을 번역했습니다.",
            "UI 8,900건을 번역했습니다.",
            "인게임 교환 대사 9,648건을 번역했습니다.",
            "DLC 5,109건을 번역했습니다.",
            "무브리스트 3,732건을 번역했습니다.",
            "스토리 모드 3,004건을 번역했습니다(1부와 애프터매스 2부 포함)."
          ],
          en: [
            "Translated 22,689 entries across Items and Krypt.",
            "Translated 8,900 UI entries.",
            "Translated 9,648 in-game dialogue entries.",
            "Translated 5,109 DLC entries.",
            "Translated 3,732 movelist entries.",
            "Translated 3,004 story mode entries (Part 1 and Aftermath Part 2 included)."
          ]
        }
      },
      {
        title: { kr: "한글 폰트 및 게임 무결성 검증 우회", en: "Korean font and game integrity bypass" },
        items: {
          kr: [
            "한글 글리프가 적용된 폰트 에셋을 컴파일했습니다.",
            "2026 빌드의 CVD(콘텐츠 무결성 검증) 우회 플러그인(ASIMK11)을 통합했습니다.",
            "디스크 파일을 변경하지 않고 메모리 단계에서만 동작하도록 처리했습니다(원본 보존)."
          ],
          en: [
            "Compiled the font asset with Korean glyphs applied.",
            "Integrated the CVD (Content Validation Data) bypass plugin (ASIMK11) for the 2026 build.",
            "Operated entirely in memory without modifying disk files (original assets preserved)."
          ]
        }
      },
      {
        title: { kr: "Windows GUI 인스톨러 및 매니저", en: "Windows GUI installer and manager" },
        items: {
          kr: [
            "단일 실행파일 인스톨러(MK11-Korean-Patch-Setup.exe)를 제공합니다.",
            "상태 확인과 재적용을 위한 패치 매니저를 동봉했습니다.",
            "사전 요구사항으로 VC++ 2013 / 2015-2022 재배포 패키지와 WebView2 Evergreen이 필요합니다.",
            "인스톨러, 매니저, dinput8.dll이 Microsoft Defender 공식 심사를 통과했습니다(2026-05-10 승인)."
          ],
          en: [
            "Provided a single-executable installer (MK11-Korean-Patch-Setup.exe).",
            "Bundled a patch manager for status check and re-application.",
            "Required VC++ 2013 / 2015-2022 redistributables and WebView2 Evergreen as prerequisites.",
            "Cleared the installer, manager, and dinput8.dll through Microsoft Defender's official review (approved on 2026-05-10)."
          ]
        }
      },
      {
        title: { kr: "수동 설치 자산 동시 제공", en: "Manual install assets also provided" },
        items: {
          kr: [
            "Coalesced.CHS: 한글 번역 파일을 수동 적용용으로 제공합니다.",
            "ui_c_inGameFonts_chs.xxx: 한글 폰트 파일을 수동 적용용으로 제공합니다.",
            "MK11-CVD-Bypass.zip: CVD 우회 플러그인을 수동 적용용으로 제공합니다."
          ],
          en: [
            "Provided Coalesced.CHS as the Korean translation file for manual install.",
            "Provided ui_c_inGameFonts_chs.xxx as the Korean font file for manual install.",
            "Provided MK11-CVD-Bypass.zip as the CVD bypass plugin for manual install."
          ]
        }
      }
    ],
    install_note: {
      kr: "Steam의 MK11 → 속성 → 언어를 \"간체 중국어\"로 설정한 뒤 인스톨러를 실행하시기 바랍니다.",
      en: "Set Steam → MK11 → Properties → Language to \"Simplified Chinese\", then run the installer."
    },
    github_release: "https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.0"
  }
];
