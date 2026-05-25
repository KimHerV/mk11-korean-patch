// MK11 한글 패치 · FAQ 데이터
// 진실 소스 공급원: 이 파일을 수정하면 랜딩 페이지에 자동 반영됩니다.
//
// 구조:
//   category  { kr, en }          카테고리 제목
//   items[]
//     q       { kr, en }          질문
//     a       { kr, en }          답변 본문 (\n 으로 단락 구분)
//     list    { kr[], en[] }      (선택) 글머리 목록
//     note    { kr, en }          (선택) 하단 보충 설명

window.MK11_FAQ = [
  {
    category: { kr: "기본 안내", en: "General" },
    items: [
      {
        q: {
          kr: "패치가 번역하는 내용은 무엇인가요?",
          en: "What does this patch translate?"
        },
        a: {
          kr: "스토리, UI, 튜토리얼, 무브리스트, 아이템, 크립트, DLC, 인게임 대사, Aftermath까지 번역 가능한 모든 항목을 반영했습니다. 비공식 팬 제작 패치로, 상업적 목적 없이 만들어졌습니다.",
          en: "Story, UI, tutorials, movelists, items, the Krypt, DLC content, in-game dialogue, and Aftermath. All translatable content in the game. This is an unofficial fan-made patch with no commercial intent."
        }
      },
      {
        q: {
          kr: "왜 게임 언어를 중국어 간체로 설정해야 하나요?",
          en: "Why do I need to set the game language to Simplified Chinese?"
        },
        a: {
          kr: "한글 패치는 게임 내 중국어 간체(CHS) 리소스 슬롯을 통해 적용됩니다. <strong>Steam 라이브러리에서 게임 우클릭 → 속성 → 언어</strong>에서 중국어 간체로 변경해야 합니다. 인게임 언어 설정에서 변경하는 것은 적용되지 않습니다.",
          en: "The patch is applied through the Simplified Chinese (CHS) resource slot. You must change the language via <strong>Steam library → right-click game → Properties → Language</strong>. Changing it from within the game's own settings will not work."
        }
      }
    ]
  },
  {
    category: { kr: "설치", en: "Installation" },
    items: [
      {
        q: {
          kr: "설치·제거는 어떻게 되나요?",
          en: "How does install and uninstall work?"
        },
        a: {
          kr: "설치 시 원본 파일이 자동으로 백업됩니다.\n<b>GUI 설치</b>: 매니저에서 제거를 실행하면 원본 상태로 복구됩니다.\n<b>CLI 설치</b>: 설치 시 압축 해제한 폴더의 <code>uninstall.bat</code>(Windows) 또는 <code>bash uninstall.sh</code>(Steam Deck / Linux)를 실행하십시오.\n제거 후 영어로 플레이하려면 Steam → 게임 속성 → 언어에서 영어로 변경해 주십시오.",
          en: "Original files are automatically backed up at install time.\n<b>GUI Setup</b>: Run uninstall from the manager to restore original files.\n<b>CLI Setup</b>: Run <code>uninstall.bat</code> (Windows) or <code>bash uninstall.sh</code> (Steam Deck / Linux) from the folder you extracted at install time.\nAfterward, go to Steam → game Properties → Language and switch to English."
        },
        note: {
          kr: "게임 업데이트로 패치가 작동하지 않으면 매니저가 자동으로 감지해 안내합니다.",
          en: "If a game update breaks the patch, the manager will detect it and notify you."
        }
      },
      {
        q: {
          kr: "Steam 외 다른 환경에서 사용 가능한가요?",
          en: "Does it work outside of Steam?"
        },
        a: {
          kr: "Steam PC 버전을 공식 지원합니다. Epic Games 버전은 미검증입니다. Steam Deck / Linux는 <a href='https://github.com/KimHerV/mk11-korean-patch/releases/latest' target='_blank' rel='noopener'>CLI 설치</a>를 권장합니다.",
          en: "Officially supported on Steam PC. The Epic Games version has not been tested. For Steam Deck / Linux, use the <a href='https://github.com/KimHerV/mk11-korean-patch/releases/latest' target='_blank' rel='noopener'>CLI Setup</a>."
        },
        note: {
          kr: "Steam Deck / Linux에서 한글이 표시되지 않는 경우, Steam 시작 옵션에 <code>WINEDLLOVERRIDES=\"dinput8=n,b\" %command%</code>를 추가해 보시기 바랍니다.",
          en: "If Korean text doesn't appear on Steam Deck or Linux, try adding <code>WINEDLLOVERRIDES=\"dinput8=n,b\" %command%</code> to your Steam launch options."
        }
      },
      {
        q: {
          kr: "온라인 멀티플레이에서 사용할 수 있나요?",
          en: "Can I use this in online multiplayer?"
        },
        a: {
          kr: "Steam PC 환경에서 온라인 포함 동작을 확인했습니다. 단, 이 패치는 게임의 파일 검증을 메모리에서 우회하는 방식(CVD 우회)을 사용하므로, 온라인 플레이는 본인 판단 하에 진행하시기 바랍니다.",
          en: "Confirmed working on Steam PC, including online play. However, this patch uses an in-memory CVD bypass to work around the game's file validation, so online play is at your own discretion."
        },
        note: {
          kr: "본 패치에는 치트, 언락, DLC 우회, 승부 조작 등 부정 행위 기능이 포함되어 있지 않습니다. 번역 텍스트와 폰트만 적용됩니다.",
          en: "This patch does not include cheats, unlocks, DLC bypass, or any match-manipulation features. It applies translation text and font only."
        }
      }
    ]
  },
  {
    category: { kr: "4K 컷신", en: "4K Cinematics" },
    items: [
      {
        q: {
          kr: "4K Cinematic Pack을 설치했는데 컷신이 일반 해상도입니다.",
          en: "I installed the 4K Cinematic Pack but cinematics still look standard."
        },
        a: {
          kr: "MK11의 오래된 동작 방식 때문입니다. 게임이 Movies_4k 폴더를 직접 읽지 않고 Movies 폴더를 기준으로 재생합니다.\n해결 방법: Movies_4k 안의 파일들을 Movies 폴더에 덮어쓰십시오. Movies_4k가 Movies의 모든 파일을 포함하지는 않으므로, 기존 파일을 삭제하지 말고 덮어쓰는 방식으로만 진행해야 합니다.",
          en: "This is a long-standing MK11 behavior. The game reads cinematics from the Movies folder, not Movies_4k, even with the pack installed.\nFix: Copy files from Movies_4k into the Movies folder. Do not delete existing Movies files. Overwrite only, since Movies_4k does not contain every file in Movies."
        },
        note: {
          kr: "4K 팩을 설치하지 않으셨다면 이 작업은 필요 없습니다.",
          en: "If you haven't installed the 4K pack, no action is needed."
        }
      }
    ]
  },
  {
    category: { kr: "오류 · 보안", en: "Errors & Security" },
    items: [
      {
        q: {
          kr: "\"Unable to load ASIMK11.asi. Error: 126\" 오류가 뜹니다.",
          en: "I see \"Unable to load ASIMK11.asi. Error: 126\"."
        },
        a: {
          kr: "의존성 파일 누락이 원인입니다. 아래 순서로 확인해 주십시오.",
          en: "A missing dependency is the likely cause. Try the following in order."
        },
        list: {
          kr: [
            "최신 인스톨러로 재설치",
            "<a href='https://aka.ms/highdpimfc2013x64enu' target='_blank' rel='noopener'>Visual C++ 2013 Redistributable (x64) ↗</a> 설치"
          ],
          en: [
            "Re-install using the latest installer",
            "Install <a href='https://aka.ms/highdpimfc2013x64enu' target='_blank' rel='noopener'>Visual C++ 2013 Redistributable (x64) ↗</a>"
          ]
        },
        note: {
          kr: "해결되지 않으면 에러 문구와 인스톨러 버전을 피드백으로 제보해 주십시오.",
          en: "If the issue persists, please report the exact error and installer version via the feedback form."
        }
      },
      {
        q: {
          kr: "설치했는데 패치가 적용되지 않거나 게임에 문제가 생겼습니다.",
          en: "The patch installed but isn't working, or the game has issues."
        },
        a: {
          kr: "Steam 라이브러리에서 게임 우클릭 → 속성 → 언어가 중국어 간체로 설정되어 있는지 먼저 확인해 주십시오. 인게임 언어 설정은 적용되지 않습니다. 설치 경로와 보안 프로그램 차단 여부도 함께 확인하시면 좋습니다.\n프레임 드랍이나 오디오 끊김은 패치가 원인일 가능성이 낮습니다. DX11/DX12 설정, 드라이버, 원본 게임 환경을 먼저 점검해 주십시오.",
          en: "First, check Steam library → right-click game → Properties → Language and confirm it is set to Simplified Chinese. The in-game language setting will not apply the patch. Also check the install path and whether any security software blocked the patch.\nFrame drops and audio stuttering are unlikely to be caused by the patch. Check DX11/DX12 settings, driver, and base game environment first."
        }
      },
      {
        q: {
          kr: "Windows Defender가 설치 파일을 악성으로 탐지합니다.",
          en: "Windows Defender is flagging the installer as malicious."
        },
        a: {
          kr: "패치 인스톨러에 대한 Windows Defender 오탐 제거가 2026-05-23 기준으로 확인되었습니다. 탐지가 계속 보인다면 로컬 보안 정의 캐시가 아직 갱신되지 않은 경우일 수 있습니다.\n먼저 <b>Windows 보안 → 바이러스 및 위협 방지 → 보호 업데이트 → 업데이트 확인</b>을 실행해 주십시오.\n즉시 갱신이 필요하면, 관리자 권한 명령 프롬프트에서 아래 명령을 순서대로 실행하십시오.\n<code>cd \"C:\\Program Files\\Windows Defender\"</code>\n<code>MpCmdRun.exe -removedefinitions -dynamicsignatures</code>\n<code>MpCmdRun.exe -SignatureUpdate</code>",
          en: "Windows Defender false positive on the patch installer was confirmed removed as of 2026-05-23. If the warning still appears, the local security definition cache may not have updated yet.\nFirst, run <b>Windows Security → Virus &amp; threat protection → Protection updates → Check for updates</b>.\nIf an immediate update is needed, run the following commands in order in an administrator Command Prompt.\n<code>cd \"C:\\Program Files\\Windows Defender\"</code>\n<code>MpCmdRun.exe -removedefinitions -dynamicsignatures</code>\n<code>MpCmdRun.exe -SignatureUpdate</code>"
        },
        note: {
          kr: "v1.1 패치 인스톨러: 2026년 5월 23일 오탐 제거 확인.",
          en: "v1.1 patch installer: false positive removed, confirmed May 23, 2026."
        }
      },
      {
        q: {
          kr: "Smart App Control이 설치 파일을 차단합니다.",
          en: "Smart App Control is blocking the installer."
        },
        a: {
          kr: "Smart App Control(SAC)은 코드 서명과 실행 파일 평판을 기준으로 차단 여부를 판단하는 시스템으로, Windows Defender 오탐 해제와는 별도로 동작합니다. 따라서 Defender에서 오탐이 제거되었더라도, 서명되지 않은 실행 파일은 SAC 환경에서 계속 차단될 수 있습니다.\nSAC 환경에서는 <a href='https://github.com/KimHerV/mk11-korean-patch/releases/latest' target='_blank' rel='noopener'>CLI 설치</a>를 권장합니다. CLI 설치는 EXE 인스톨러 대신 스크립트만으로 동작하므로, GUI 설치기와 같은 방식의 차단 대상이 아닙니다.",
          en: "Smart App Control (SAC) determines whether to block based on code signing and executable reputation, operating independently of Windows Defender false positive status. Unsigned executables may continue to be blocked by SAC even after a Defender false positive has been cleared.\nFor SAC-enabled systems, the <a href='https://github.com/KimHerV/mk11-korean-patch/releases/latest' target='_blank' rel='noopener'>CLI Setup</a> is recommended. CLI Setup runs as a script rather than an EXE installer, so it is not subject to the same type of blocking as the GUI installer."
        },
        note: {
          kr: "CLI 설치는 SAC 환경에서 실행 제한 없이 사용할 수 있는 공식 대안입니다.",
          en: "CLI Setup is the recommended alternative for SAC-enabled environments."
        }
      },
      {
        q: {
          kr: "VirusTotal이나 다른 보안 프로그램에서도 탐지됩니다.",
          en: "VirusTotal or other security tools are also flagging the files."
        },
        a: {
          kr: "Microsoft Defender에서는 2026-05-23 기준으로 설치 파일의 탐지 제거가 확인되었습니다. 다만 VirusTotal은 여러 독립 엔진이 각자 다른 기준으로 판단하므로, Defender 결과와 별개로 일부 엔진에서는 탐지가 남아 있을 수 있습니다.\n원인은 크게 세 가지입니다.\n<b>1. 비서명 실행 파일</b>\n현재 GUI 설치기는 코드 서명이 없는 실행 파일입니다. 일반적인 Windows 배포 환경에서는 코드 서명이 중요한 신뢰 기준으로 작동하며, 일부 보안 제품은 비서명 실행 파일에 더 엄격하게 반응할 수 있습니다.\n<b>2. 인스톨러 패키징 방식</b>\n현재 GUI 설치기는 PyInstaller 기반으로 패키징되어 있습니다. 이 방식은 실행 시 내부 파일을 임시 경로에 풀어 로드하고, 패치 설정 및 관리 파일을 AppData 경로에 배치합니다. 일부 보안 엔진은 이런 실행 패턴 자체를 의심 신호로 해석할 수 있습니다.\n<b>3. CVD 우회 로더 체인(ASIMK11.asi)</b>\n이 패치는 수정된 게임 파일이 정상적으로 로드되도록 CVD 우회 로더 체인을 사용합니다. 게임 실행 시 로더가 함께 동작하며, 일부 휴리스틱 엔진은 이런 메모리 접근 및 로더 체인 동작을 경고 대상으로 볼 수 있습니다.\n또한 v1.1은 업데이트 기능 오류 수정으로 인해 핵심 실행 파일이 다시 빌드되면서 해시가 변경되었고, 그 과정에서 일부 엔진에서 오탐이 다시 발생했습니다.",
          en: "Microsoft Defender detections on the installer were confirmed removed as of 2026-05-23. However, VirusTotal aggregates many independent engines each using its own criteria, so some may still flag the files independently of Defender's result.\nThere are three main causes.\n<b>1. Unsigned executable</b>\nThe GUI installer is an unsigned executable. In standard Windows distribution environments, code signing is an important trust signal, and some security products apply stricter scrutiny to unsigned executables.\n<b>2. Installer packaging method</b>\nThe GUI installer is packaged using PyInstaller. At runtime, it extracts internal files to a temporary path and places patch configuration and manager files under AppData. Some security engines may interpret this execution pattern as a suspicious signal.\n<b>3. CVD bypass loader chain (ASIMK11.asi)</b>\nThis patch uses a CVD bypass loader chain to allow modified game files to load correctly. The loader runs alongside the game at launch, and some heuristic engines may flag this type of memory access and loader chain behavior.\nAdditionally, the v1.1 hotfix required rebuilding core executables to fix an update function bug, which changed the file hash and caused false positives to re-emerge in some engines."
        },
        note: {
          kr: "현재 False Positive 제출 대응과 함께, GUI 인스톨러의 내부 패키징 구조를 계속 정리하고 있으며, 보다 신뢰 가능한 배포 방식으로 개선해가고 있습니다. EXE 인스톨러 실행이 어렵거나 부담되신다면 GUI 대신 CLI 설치 방식을 권장합니다.",
          en: "False positive submissions are being handled as needed, alongside ongoing improvements to the GUI installer's internal packaging toward a more trustworthy distribution method. If running the EXE installer is blocked or undesirable, the CLI Setup is recommended."
        }
      }
    ]
  },
  {
    category: { kr: "기타", en: "Other" },
    items: [
      {
        q: {
          kr: "왜 DLL 파일이 포함되나요? 어떤 파일이 설치되나요?",
          en: "Why does the patch include DLL files? What gets installed?"
        },
        a: {
          kr: "MK11 최신 빌드는 모든 게임 에셋을 엄격 검증하므로, 한글 번역 파일과 폰트만 교체해서는 정상 로드되지 않습니다. 메모리에서만 동작하는 CVD 우회 플러그인이 필요하며, 디스크의 게임 파일은 변경하지 않습니다.\n실제로 설치되는 파일은 아래와 같습니다.<dl class=\"faq-manifest\"><div class=\"faq-manifest-row\"><dt>Coalesced.CHS</dt><dd>한글 번역 텍스트 전체 (53,000+ 항목)</dd></div><div class=\"faq-manifest-row\"><dt>ui_c_inGameFonts_chs.xxx</dt><dd>나눔스퀘어 네오 커스텀 렌더링</dd></div><div class=\"faq-manifest-row\"><dt>dinput8.dll</dt><dd>ASI 플러그인 로더 · <a href=\"https://github.com/ThirteenAG/Ultimate-ASI-Loader\" target=\"_blank\" rel=\"noopener\">Ultimate ASI Loader ↗</a></dd></div><div class=\"faq-manifest-row\"><dt>ASIMK11.asi · ASIMK11.ini</dt><dd>CVD 우회 플러그인 · <code>bDisableAntiCVD = true</code> 옵션만 활성 · <a href=\"https://github.com/thethiny/ASIMK11\" target=\"_blank\" rel=\"noopener\">ASIMK11 ↗</a></dd></div><div class=\"faq-manifest-row\"><dt>libzmq · libsodium</dt><dd>ASIMK11 의존 라이브러리 · <a href=\"https://github.com/zeromq/libzmq\" target=\"_blank\" rel=\"noopener\">ZeroMQ ↗</a> / <a href=\"https://github.com/jedisct1/libsodium\" target=\"_blank\" rel=\"noopener\">libsodium ↗</a></dd></div></dl>",
          en: "Recent MK11 builds strictly verify every game asset, so replacing translation files and fonts alone is not enough. A memory-only CVD bypass plugin is required; the game files on disk are never modified.\nThe files actually installed are listed below.<dl class=\"faq-manifest\"><div class=\"faq-manifest-row\"><dt>Coalesced.CHS</dt><dd>All Korean translation text (53,000+ entries)</dd></div><div class=\"faq-manifest-row\"><dt>ui_c_inGameFonts_chs.xxx</dt><dd>NanumSquare Neo custom rendering</dd></div><div class=\"faq-manifest-row\"><dt>dinput8.dll</dt><dd>ASI plugin loader · <a href=\"https://github.com/ThirteenAG/Ultimate-ASI-Loader\" target=\"_blank\" rel=\"noopener\">Ultimate ASI Loader ↗</a></dd></div><div class=\"faq-manifest-row\"><dt>ASIMK11.asi · ASIMK11.ini</dt><dd>CVD bypass plugin · only <code>bDisableAntiCVD = true</code> enabled · <a href=\"https://github.com/thethiny/ASIMK11\" target=\"_blank\" rel=\"noopener\">ASIMK11 ↗</a></dd></div><div class=\"faq-manifest-row\"><dt>libzmq · libsodium</dt><dd>ASIMK11 runtime dependencies · <a href=\"https://github.com/zeromq/libzmq\" target=\"_blank\" rel=\"noopener\">ZeroMQ ↗</a> / <a href=\"https://github.com/jedisct1/libsodium\" target=\"_blank\" rel=\"noopener\">libsodium ↗</a></dd></div></dl>"
        },
        list: {
          kr: [
            "실행 파일(.exe) · 게임 원본 파일 무변조",
            "비영리 개인 프로젝트",
            "저작권자 Warner Bros. Entertainment Inc. 및 NetherRealm Studios의 요청 시 즉시 배포 중단"
          ],
          en: [
            "Game executable (.exe) and original files unmodified",
            "Non-commercial personal project",
            "Distribution will cease immediately upon request from copyright holder Warner Bros. Entertainment Inc. or NetherRealm Studios"
          ]
        },
        note: {
          kr: "전체 오픈소스 라이브러리와 라이선스 정보는 GitHub의 <a href='https://github.com/KimHerV/mk11-korean-patch/blob/main/THIRD_PARTY_NOTICES.md' target='_blank' rel='noopener'>THIRD_PARTY_NOTICES.md ↗</a>에서 확인할 수 있습니다.",
          en: "The full list of open-source libraries and their licenses is available in <a href='https://github.com/KimHerV/mk11-korean-patch/blob/main/THIRD_PARTY_NOTICES.md' target='_blank' rel='noopener'>THIRD_PARTY_NOTICES.md ↗</a> on GitHub."
        }
      },
      {
        q: {
          kr: "오역이나 오류를 제보하고 싶습니다.",
          en: "I want to report a mistranslation or an error."
        },
        a: {
          kr: "이 페이지 하단의 피드백 폼을 이용해 주십시오. 문제 위치(스토리/메뉴/무브리스트 등)와 현재 표시 문구를 함께 남겨주시면 빠르게 확인할 수 있습니다.",
          en: "Use the feedback form at the bottom of this page. Include the location (story/menu/movelist/etc.) and the current text to help locate and resolve the issue faster."
        }
      }
    ]
  }
];
