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
          kr: "설치 시 원본 파일이 자동으로 백업됩니다. 매니저에서 제거를 실행하면 원본 상태(중국어 간체)로 복구됩니다. 영어로 플레이하려면 Steam 라이브러리에서 게임 우클릭 → 속성 → 언어에서 영어로 변경해 주세요.",
          en: "Original files are automatically backed up at install time. Running uninstall in the manager restores them to Simplified Chinese. To play in English afterward, go to Steam library → right-click game → Properties → Language and switch to English."
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
          kr: "Steam PC 버전 기준으로 온라인 포함 정상 동작을 확인했습니다. Epic Games 버전은 미검증입니다. Steam Deck / Linux은 CLI 설치로 동작했다는 보고가 있지만, 공식 지원 범위는 아닙니다.",
          en: "Confirmed working on Steam PC, including online play. The Epic Games version has not been tested. Steam Deck and Linux have been reported working via CLI Setup, but are not officially supported."
        },
        note: {
          kr: "Steam Deck / Linux에서 한글이 표시되지 않는 경우, Steam 시작 옵션에 <code>WINEDLLOVERRIDES=\"dinput8=n,b\" %command%</code>를 추가해 보세요. (CLI 설치에서 번역 로더 플러그인을 선택한 경우에만 필요합니다.)",
          en: "If Korean text doesn't appear on Steam Deck or Linux, try adding <code>WINEDLLOVERRIDES=\"dinput8=n,b\" %command%</code> to your Steam launch options. (Only needed if you opted into the translation loader plugin during CLI setup.)"
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
          kr: "MK11의 오래된 동작 방식 때문입니다. 게임이 Movies_4k 폴더를 직접 읽지 않고 Movies 폴더를 기준으로 재생합니다.\n해결 방법: Movies_4k 안의 파일들을 Movies 폴더에 덮어쓰세요. Movies_4k가 Movies의 모든 파일을 포함하지는 않으므로, 기존 파일을 삭제하지 말고 덮어쓰는 방식으로만 진행해야 합니다.",
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
          kr: "의존성 파일 누락이 원인입니다. 아래 순서로 확인해 주세요.",
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
          kr: "해결되지 않으면 에러 문구와 인스톨러 버전을 피드백으로 제보해 주세요.",
          en: "If the issue persists, please report the exact error and installer version via the feedback form."
        }
      },
      {
        q: {
          kr: "설치했는데 패치가 적용되지 않거나 게임에 문제가 생겼습니다.",
          en: "The patch installed but isn't working, or the game has issues."
        },
        a: {
          kr: "Steam 라이브러리에서 게임 우클릭 → 속성 → 언어가 중국어 간체로 설정되어 있는지 먼저 확인해 주세요. 인게임 언어 설정은 적용되지 않습니다. 설치 경로와 보안 프로그램 차단 여부도 함께 확인하시면 좋습니다.\n프레임 드랍이나 오디오 끊김은 패치가 원인일 가능성이 낮습니다. DX11/DX12 설정, 드라이버, 원본 게임 환경을 먼저 점검해 주세요.",
          en: "First, check Steam library → right-click game → Properties → Language and confirm it is set to Simplified Chinese. The in-game language setting will not apply the patch. Also check the install path and whether any security software blocked the patch.\nFrame drops and audio stuttering are unlikely to be caused by the patch. Check DX11/DX12 settings, driver, and base game environment first."
        }
      },
      {
        q: {
          kr: "Windows Defender가 설치 파일을 악성으로 탐지합니다.",
          en: "Windows Defender is flagging the installer as malicious."
        },
        a: {
          kr: "최신 빌드는 Microsoft 제출 결과 인스톨러와 패치 매니저 모두 정상 판정이 완료되었습니다. 이전에 경고가 발생했다면 구버전일 가능성이 있으므로, 최신 설치 파일로 다시 받아 확인해 주세요.",
          en: "The latest build has been cleared through Microsoft's official review process. Both the installer and patch manager received a clean verdict. If you saw a warning before, you may have an older build — please re-download the latest installer and try again."
        },
        note: {
          kr: "2026년 5월 6일 Microsoft에 제출, 5월 10일 정상 판정 확인. 최신 빌드에서도 동일 증상이 발생하면 Defender 보호 기록의 파일명과 경로를 함께 제보해 주세요.",
          en: "Submitted to Microsoft on May 6, 2026; clearance confirmed May 10, 2026. If the latest build still triggers a warning, please report the file name and path from Defender's protection history."
        }
      },
      {
        q: {
          kr: "Smart App Control이 설치 파일을 차단합니다.",
          en: "Smart App Control is blocking the installer."
        },
        a: {
          kr: "최신 빌드는 Microsoft 제출을 통해 인스톨러와 패치 매니저의 정상 판정이 확인되었습니다. Smart App Control이 켜진 환경에서도 설치 단계 차단이 재현되지 않는 것을 확인했습니다. 만약 동일 증상이 남아 있다면 최신 빌드 재다운로드 후 다시 시도해 주세요.",
          en: "The latest build has been cleared through Microsoft's official review process. We confirmed that installation proceeds without Smart App Control blocking on an SAC-enabled environment. If you are still experiencing a block, please re-download the latest build and try again."
        },
        note: {
          kr: "2026년 5월 6일 Microsoft에 제출, 5월 10일 정상 판정 확인.",
          en: "Submitted to Microsoft on May 6, 2026; clearance confirmed May 10, 2026."
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
          kr: "이 페이지 하단의 피드백 폼을 이용해 주세요. 문제 위치(스토리/메뉴/무브리스트 등)와 현재 표시 문구를 함께 남겨주시면 빠르게 확인할 수 있습니다.",
          en: "Use the feedback form at the bottom of this page. Include the location (story/menu/movelist/etc.) and the current text to help us find and fix the issue faster."
        }
      }
    ]
  }
];
