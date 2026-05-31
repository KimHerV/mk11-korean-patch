/**
 * Changelog + security response history (unified).
 *
 * Add new entries to the FRONT of the array on each release.
 * Entries are filtered by tag on the changelog page.
 *
 * Schema:
 *   version, date     - required strings
 *   tags              - string[]: one or more of "translation", "security", "platform"
 *   title             - {kr, en}
 *   lead              - {kr, en}
 *   highlights        - [{title:{kr,en}, items:{kr:[], en:[]}}]
 *   install_note      - {kr, en} optional. string -> single <p>, array -> <ul>
 *   github_release    - URL (optional)
 *
 * Title rules (see WRITING_STYLE.md):
 *   - No version prefix (version chip is rendered separately)
 *   - Title must accurately reflect what highlights document
 *   - Security cleared entries: "Microsoft Defender 오탐 제거 확인"
 *   - Rebuild entries:    "즉시 재빌드: ..." / "핫픽스 재빌드: ..."
 */
window.MK11_CHANGELOG = [
  {
    version: "1.2",
    date: "2026-05-31",
    tags: ["translation"],
    title: {
      kr: "인게임 대화·스토리 2부 화법 교정: 기술명 동기화",
      en: "In-Game Dialogue and Story Part 2 Speech Corrections: Move Name Sync"
    },
    lead: {
      kr: "무브리스트·튜토리얼 기술명 765건을 통합 동기화하고, 인게임 1v1 대화 8,964건의 말투를 각 캐릭터 화법에 맞게 교정했습니다. 이전까지 영문으로만 표시됐던 전투 중 자동 대사 2,306건을 한국어로 새로 번역하고, 스토리 모드 2부(애프터매스) 대사 795건을 개선했습니다. v1.1 대비 총 12,830건이 업데이트됩니다.",
      en: "Synchronized 765 move name entries across movelist and tutorial, and corrected speech style in 8,964 in-game 1v1 dialogue lines. Translated 2,306 combat auto-lines previously shown in English only and improved 795 story mode Part 2 (Aftermath) lines. 12,830 total changes from v1.1."
    },
    highlights: [
      {
        title: { kr: "기술명 통합 관리 및 동기화 파이프라인 추가", en: "Move name database consolidation and sync pipeline" },
        items: {
          kr: [
            "기술명 데이터베이스를 1,199개로 통합하여 게임 전체 기술명의 일관성을 확보했습니다. 기존에는 Movelist, Tutorial.HUB, Tutorial 세 섹션에 분산된 기술명들이 표기마다 차이가 있었습니다.",
            "기술명 번역 기준을 새로이 체계화하여 1,199개를 전수 재검토하고 765건을 갱신했습니다. 고유 능력명은 음차(소울 크러시), 동작 서술형은 의미 번역(삼지창 찌르기), 위치·방향 수식어는 의미 번역(공중, 근거리) 방식으로 정합성을 확보했습니다.",
            "동기화 파이프라인을 추가하여 DB 변경 시 Movelist(228건)·Tutorial.HUB(142건)·Tutorial(395건) 세 섹션에 자동으로 반영되도록 개선했습니다. 향후 기술명 추가·수정 시 일관성이 자동으로 유지됩니다."
          ],
          en: [
            "Consolidated 1,199 move name entries into a unified database for consistency across the game. Previously, move names across the Movelist, Tutorial.HUB, and Tutorial sections had inconsistent notation.",
            "Reviewed all 1,199 entries against a systematized dual-criteria policy and updated 765. Ability names use phonetic transcription (소울 크러시), action descriptions use semantic translation (삼지창 찌르기), and positional modifiers use semantic translation (공중, 근거리).",
            "Added a synchronization pipeline so that database updates automatically flow to all three sections: Movelist (228 entries), Tutorial.HUB (142 entries), and Tutorial (395 entries). Future move name changes will maintain consistency automatically."
          ]
        }
      },
      {
        title: { kr: "인게임 1v1 대화 말투 교정", en: "In-game 1v1 dialogue speech corrections" },
        items: {
          kr: [
            "대전 전후 인트로·아웃트로 대화 8,964건을 각 캐릭터 화법에 맞게 교정했습니다. 기본 캐릭터 및 DLC 전 캐릭터의 1v1 대화를 포함합니다.",
            "세트리온: 선언체를 하게체로 교정했습니다(97건). 모성적 권위와 자애로운 신격 어조를 살렸습니다.",
            "쉬바: 선언체를 하게체로 교정했습니다(105건). 쇼칸 여왕의 품위 있는 전사 화법을 반영했습니다.",
            "샤오 칸: 반말을 선언체로 교정했습니다(98건). 폭군의 단언 어조를 살렸습니다.",
            "프로스트: 반말을 선언체로 통일했습니다(98건).",
            "섕 쑹: 반말을 하게체로 교정했습니다(48건). 격조 있는 음험한 화법을 적용했습니다.",
            "라이덴: 필멸자 앞 멘토 화법에서 선언체를 하게체로 교정했습니다(42건). 신격 선포와 멘토 대화를 상황별로 구분했습니다.",
            "신델: 선언체를 반말로 교정했습니다(53건). 오만한 냉담 어조를 살렸습니다.",
            "제이드: 친밀 상대(코탈 칸·키타나)에게는 반말을, 그 외에는 존댓말_비격식을 적용했습니다(81건). 에데니아 귀족의 냉담한 예의바름을 유지했습니다.",
            "케이노: 반말 일부를 반말_거침으로 강화했습니다(23건). 공격적인 대결 어조를 살렸습니다.",
            "재키 브릭스·잭스·캐시: 신격·왕족 상대 대사를 반말에서 존댓말_비격식으로 교정했습니다(각 36·22·36건)."
          ],
          en: [
            "Corrected speech style in 8,964 in-game intro/outro dialogue lines across base characters and all DLC.",
            "Cetrion: Corrected declarative (Seon-eon-che) to respectful elder speech (Hage-che) (97 lines). Restored her maternal divine warmth.",
            "Sheeva: Corrected declarative to Hage-che (105 lines). Reflected the Shokan queen's dignified warrior bearing.",
            "Shao Kahn: Corrected casual speech to declarative (98 lines). Restored the tyrant's commanding decree.",
            "Frost: Unified casual speech to declarative (98 lines).",
            "Shang Tsung: Corrected casual speech to Hage-che (48 lines). Applied his ceremoniously sinister formality.",
            "Raiden: Corrected declarative to Hage-che in mentor contexts (42 lines). Distinguished cosmic proclamation from elder counsel.",
            "Sindel: Corrected declarative to plain speech (98 lines). Restored her haughty, dismissive tone.",
            "Jade: Applied plain speech toward intimate characters (Kotal Kahn, Kitana) and polite (Jondae) speech toward others (81 lines). Preserved her icy Edenian politeness.",
            "Kano: Strengthened a subset of casual speech to aggressive speech (23 lines).",
            "Jacqui, Jax, Cassie: Corrected speech toward deities and royalty from casual to polite (36/22/36 lines respectively)."
          ]
        }
      },
      {
        title: { kr: "전투 중 자동 대사 신규 번역 추가", en: "Combat auto-lines added in Korean" },
        items: {
          kr: [
            "대전 중 자동으로 재생되는 도발·승리·반응 대사 2,306건이 이전까지 영문으로만 표시됐습니다. 이번 업데이트에서 전 캐릭터·DLC의 해당 대사를 한국어로 번역했습니다.",
            "포함 유형: 전투 중 도발, 상대 도착 반응, 매치 시작 반응, 승리 인용구입니다."
          ],
          en: [
            "Translated 2,306 auto-triggered combat lines across all characters and DLC that were previously shown in English only.",
            "Includes mid-fight taunts, opponent-encounter reactions, match-start quips, and victory lines."
          ]
        }
      },
      {
        title: { kr: "스토리 모드 품질 개선", en: "Story mode quality improvements" },
        items: {
          kr: [
            "스토리 모드 2부(Aftermath) 1,058줄 중 786줄을 개선했습니다. 109개 스토리 장면 중 104개에 걸쳐 정밀하게 다듬었습니다.",
            "Aftermath 신규 캐릭터(푸진·쉬바·람보)의 화자 화법을 장면 컨텍스트 기반으로 정립했습니다. 화자·청자 관계, 씬의 긴장도, 신격 여부에 따라 하게체·선언체·반말이 구분됩니다. 리우 캉의 신격 전환 후 화법은 일반 상태와 별도로 관리됩니다.",
            "1부 대사 9건도 추가 교정했습니다. 합계 795건의 스토리 대사가 이번 업데이트에 포함됩니다."
          ],
          en: [
            "Refined 786 of 1,058 Aftermath story lines across 104 of 109 story scenes.",
            "Established scene-context-based speech registers for new Aftermath characters Fujin, Sheeva, and Rambo. Register varies by speaker-listener relationship, scene tension, and divine status. Liu Kang's god-state speech is tracked separately from his base state in the database.",
            "Corrected 9 additional lines in story mode Part 1. Combined story update covers 795 lines."
          ]
        }
      },
      {
        title: { kr: "캐릭터 화법 기준 DB 전면 재편성", en: "Character speech doctrine database overhaul" },
        items: {
          kr: [
            "37명의 캐릭터 기본 화법과 상대방별 화법 예외를 구조화된 기준으로 재편성했습니다.",
            "상대방별 화법 예외 449건을 신규 등록했습니다. 인게임 1v1 대화 8,964건 교정의 검증 근거로 사용됐습니다.",
            "기존 항목의 중복·오류를 정리하여 전체 기준 항목을 559건 체계로 재구성했습니다.",
            "이 기준 DB는 향후 번역 자동 검수와 화법 일관성 유지에 계속 사용됩니다."
          ],
          en: [
            "Restructured speech doctrine for 37 characters, covering base speech style and per-opponent exceptions.",
            "Registered 449 new per-opponent speech exceptions. These served as the verification baseline for 8,964 in-game dialogue corrections.",
            "Consolidated and corrected existing entries into a 559-entry structured doctrine set.",
            "The doctrine database serves as the ongoing foundation for automated translation compliance checking."
          ]
        }
      },
      {
        title: { kr: "번역 검수 도구 개선", en: "Translation review tooling improvements" },
        items: {
          kr: [
            "INI 정합 검사기 오판 수정: '-아니다'로 끝나는 선언체 대사가 합쇼체로 오분류되던 문제를 수정했습니다(91건 해소).",
            "합쇼체와 존댓말_격식이 동일한 어미(-습니다/-십니까)를 공유한다는 점을 검사기에 반영했습니다. 리우 캉 등 존댓말_격식 화자의 대사 30건이 오분류에서 벗어났습니다.",
            "자기 이름을 부르는 독백 대사(예: 'You can do this, Briggs.')를 청자 화법 적용 대상에서 제외하는 예외를 추가했습니다.",
            "인게임 대화 검사에서 애프터매스 등 맥락 한정 화법 override를 제외하도록 정책을 정비했습니다.",
            "캐릭터 화법 DB 업데이트: 레인(RAN)의 비표준 자체 화법 '선언체_자칭'을 표준 선언체로 통합했습니다. 나이트울프↔리우 캉 화법을 동등 전사 관계 기준(반말)으로 재정립했습니다.",
            "캐릭터 화법 DB 업데이트: 레인(RAN)의 비표준 화법 '선언체_자칭'을 표준 선언체로 통합하고, 나이트울프↔리우 캉 화법을 동등 전사 관계 기준(반말)으로 재정립했습니다."
          ],
          en: [
            "Fixed a false positive in the INI compliance checker where lines ending in '-아니다' (declarative negation) were misclassified as Hapsho-che (91 cases resolved).",
            "Registered that Hapsho-che and Jondae-gyeoksik share identical verb endings (-습니다/-십니까). Resolved 30 false violations for characters like Liu Kang.",
            "Added a self-monologue exception: lines where a character addresses their own name (e.g. 'You can do this, Briggs.') are excluded from listener-speech rule checks.",
            "Updated InGameDialogue inspection policy to exclude context-tagged overrides (e.g. Aftermath-specific speech) that cannot be determined line-by-line.",
            "Character DB updates: merged Rain's non-standard 선언체_자칭 register into standard declarative. Revised Nightwolf's speech toward Liu Kang to peer-warrior plain speech."
          ]
        }
      }
    ],
    install_note: {
      kr: [
        "GUI(패치 인스톨러): 패치 매니저를 열고 업데이트 항목을 내려받으세요.",
        "CLI: install.bat(Windows) 또는 install.sh(Linux · Steam Deck)를 다시 실행하세요."
      ],
      en: [
        "GUI (Patch Installer): Open the Patch Manager and download the available update.",
        "CLI: Re-run install.bat (Windows) or install.sh (Linux / Steam Deck)."
      ]
    }
  },
  {
    version: "1.1",
    date: "2026-05-22",
    tags: ["security"],
    title: {
      kr: "Microsoft Defender 오탐 제거 확인",
      en: "Microsoft Defender False Positive Cleared"
    },
    lead: {
      kr: "v1.1 핫픽스 빌드에 대한 Defender 탐지를 확인하고 패치 인스톨러·패치 매니저 2건을 Microsoft Security Intelligence에 제출했습니다.",
      en: "Defender detection against the v1.1 hotfix build was identified. The patch installer and patch manager were submitted to Microsoft Security Intelligence."
    },
    highlights: [
      {
        title: { kr: "결과", en: "Outcome" },
        items: {
          kr: [
            "패치 인스톨러: \"detection has been removed\" 확인됐습니다.",
            "패치 매니저: 스캐너 탐지 없음 응답을 받았습니다. 추가 조치 없이 종결됐습니다.",
            ".asi 파일의 메모리 패처 행위는 일부 엔진이 구조적으로 탐지합니다. VirusTotal 잔여 탐지 가능성이 있습니다."
          ],
          en: [
            "Patch installer: \"detection has been removed\" confirmed.",
            "Patch manager: \"no positive detection\" response received. Closed with no further action.",
            "The .asi memory-patching behavior is structurally detected by some engines; residual VirusTotal detections may remain."
          ]
        }
      }
    ]
  },
  {
    version: "1.1",
    date: "2026-05-17",
    tags: ["translation", "security"],
    title: {
      kr: "스토리 모드 1부 품질 개선: 패치 매니저 핫픽스 포함",
      en: "Story Mode Part 1 Quality Refinement, Patch Manager Hotfix"
    },
    lead: {
      kr: "이번 업데이트는 스토리 모드 1부(애프터매스 이전)에 한정된 품질 개선입니다. 1부 전체를 다시 검토하여 등장인물별 말투와 표현을 다듬었습니다. 출시 직후 패치 매니저 자동 업데이트 경로의 결함 2건을 발견하여 당일 수정 후 재빌드했습니다.",
      en: "This update is limited to Story Mode Part 1 (pre-Aftermath). Part 1 was re-reviewed end-to-end and character speech was refined throughout. Two defects in the patch manager auto-update path were discovered shortly after release and fixed in a same-day rebuild."
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
      },
      {
        title: { kr: "패치 매니저 핫픽스 (2026-05-18 재빌드)", en: "Patch Manager Hotfix (2026-05-18 rebuild)" },
        items: {
          kr: [
            "결함 1: 자동 업데이트 중 패치 파일이 정상적으로 내려받아지지 않던 문제를 수정했습니다.",
            "결함 2: 업데이트 완료 후에도 '재설치 필요'로 오판정하던 문제를 수정했습니다.",
            "패치 인스톨러 SHA256: cf4f6b5c85b07f23c6c2ea5bcdc757b42023246d7869199b695359cf43146e96",
            "패치 매니저 SHA256: ca135f899479c3628366cd9e545804c608d009606cd7759766898aaffcb96b36"
          ],
          en: [
            "Defect 1: Patch files failed to download during auto-update. Fixed.",
            "Defect 2: A successful update was falsely reported as 'reinstall required'. Fixed.",
            "Patch installer SHA256: cf4f6b5c85b07f23c6c2ea5bcdc757b42023246d7869199b695359cf43146e96",
            "Patch manager SHA256: ca135f899479c3628366cd9e545804c608d009606cd7759766898aaffcb96b36"
          ]
        }
      }
    ],
    install_note: {
      kr: [
        "GUI: 패치 매니저에서 v1.1 업데이트를 내려받아 주세요.",
        "CLI: install 스크립트를 다시 실행하면 최신 버전으로 받아집니다."
      ],
      en: [
        "GUI: download the v1.1 update from the patch manager.",
        "CLI: re-run the install script to fetch the latest version."
      ]
    },
    github_release: "https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.1"
  },
  {
    version: "1.0",
    date: "2026-05-13",
    tags: ["platform"],
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
            "별도 패치 매니저 없이 스크립트 한 번으로 적용, 복구, 갱신이 모두 처리됩니다."
          ],
          en: [
            "Re-running the install script automatically updates to the latest patch.",
            "Handled apply, restore, and update through a single script, without a separate patch manager."
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
    date: "2026-05-06",
    tags: ["security"],
    title: {
      kr: "Microsoft Defender 오탐 제거 확인",
      en: "Microsoft Defender False Positive Cleared"
    },
    lead: {
      kr: "Trojan:Win32/Wacatac.H!ml 오탐 건으로 패치 인스톨러·패치 매니저 등 6건을 Microsoft Security Intelligence에 제출했습니다. 2026-05-10에 EXE 및 dinput8.dll 심사 완료를 확인했습니다.",
      en: "Six files including the patch installer, patch manager, and bundled components were submitted to Microsoft Security Intelligence for a Trojan:Win32/Wacatac.H!ml false positive. EXE and dinput8.dll reviews were completed on 2026-05-10."
    },
    highlights: [
      {
        title: { kr: "결과", en: "Outcome" },
        items: {
          kr: [
            "패치 인스톨러·패치 매니저: \"detection has been removed\" 확인됐습니다.",
            "dinput8.dll·ASI·DLL류: 스캐너 탐지 없음 응답을 받았습니다. 추가 조치 없이 종결됐습니다.",
            "랜딩 페이지 FAQ 및 README에 정상 판정을 반영해 배포했습니다(2026-05-11)."
          ],
          en: [
            "Patch installer and patch manager: \"detection has been removed\" confirmed.",
            "dinput8.dll, ASI, and DLLs: \"no positive detection\" response received. Closed with no further action.",
            "Landing page FAQ and README updated to reflect clearance, deployed on 2026-05-11."
          ]
        }
      }
    ]
  },
  {
    version: "1.0",
    date: "2026-05-04",
    tags: ["translation", "security"],
    title: {
      kr: "첫 정식 출시: 게임 전체 한글화",
      en: "Initial Release: Full Game Localization"
    },
    lead: {
      kr: "MK11 한글 패치의 첫 정식 버전입니다. 스토리 모드, 무브리스트, UI, DLC, 인게임 교환 대사까지 게임 전체에 걸쳐 총 53,000건 이상의 번역을 적용했습니다. 출시 당일 PyInstaller UPX 압축으로 인한 Defender 오탐이 확인되어 당일 --noupx 정책을 수립하고 재빌드했습니다.",
      en: "First official release of the MK11 Korean Patch. Over 53,000 translations were applied across story mode, movelists, UI, DLC, and in-game dialogue exchanges. A Defender false positive caused by PyInstaller UPX compression was identified on release day; a --noupx rebuild was shipped the same day."
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
        title: { kr: "Windows GUI 패치 인스톨러 및 패치 매니저", en: "Windows GUI patch installer and patch manager" },
        items: {
          kr: [
            "패치 인스톨러(MK11-Korean-Patch-Setup.exe)를 단일 실행파일로 제공합니다.",
            "상태 확인과 재적용을 위한 패치 매니저를 동봉했습니다.",
            "사전 요구사항으로 VC++ 2013 / 2015-2022 재배포 패키지와 WebView2 Evergreen이 필요합니다.",
            "패치 인스톨러, 패치 매니저, dinput8.dll의 Defender 오탐이 해제되었습니다(2026-05-10)."
          ],
          en: [
            "Provided a single-executable patch installer (MK11-Korean-Patch-Setup.exe).",
            "Bundled a patch manager for status check and re-application.",
            "Required VC++ 2013 / 2015-2022 redistributables and WebView2 Evergreen as prerequisites.",
            "Defender false positive detections on the patch installer, patch manager, and dinput8.dll were cleared (2026-05-10)."
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
      },
      {
        title: { kr: "출시 당일 재빌드: PyInstaller UPX 오탐 해소", en: "Same-day Rebuild: PyInstaller UPX False Positive Resolved" },
        items: {
          kr: [
            "PyInstaller --noupx 플래그를 추가했습니다.",
            "--version-file로 PE 메타데이터(CompanyName, FileDescription, FileVersion, LegalCopyright, ProductName)를 삽입했습니다.",
            "VirusTotal 7/69. 주요 백신 클린(MS, Norton, McAfee, BitDefender, ESET, Avast, AVG)입니다. Defender Cloud ML 통과를 확인했습니다."
          ],
          en: [
            "Added PyInstaller --noupx flag.",
            "Injected PE metadata (CompanyName, FileDescription, FileVersion, LegalCopyright, ProductName) via --version-file.",
            "VirusTotal 7/69. Major engines clean: MS, Norton, McAfee, BitDefender, ESET, Avast, AVG. Defender Cloud ML cleared."
          ]
        }
      }
    ],
    install_note: {
      kr: "Steam의 MK11 → 속성 → 언어를 \"간체 중국어\"로 설정한 뒤 패치 인스톨러를 실행하시기 바랍니다.",
      en: "Set Steam → MK11 → Properties → Language to \"Simplified Chinese\", then run the patch installer."
    },
    github_release: "https://github.com/KimHerV/mk11-korean-patch/releases/tag/v1.0"
  }
];
