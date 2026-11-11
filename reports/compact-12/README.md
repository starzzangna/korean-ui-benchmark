# B 재비교와 전문 서비스 축소안

[비교 화면](../../compact/index.html) · [상세 분석](../../docs/COMPACT_12.md) · [요약](summary.json)

| 검사 | 통과 |
|---|---|
| [browser-checks](browser-checks.json) | 101/101 |
| [design-and-sync-checks](design-and-sync-checks.json) | 80/80 |
| [stability-checks](stability-checks.json) | 11/11 |
| [role-checks](role-checks.json) | 12/12 |
| [content-motion-checks](content-motion-checks.json) | 12/12 |
| [size-checks](size-checks.json) | 4/4 |
| [b-motion-comparison](b-motion-comparison.json) | 12/12 |

총232건 통과. 기존 Craft11 실행 파일 19개와 보존 기준10종을 확인했다. SaaS 포함6개 카테고리는 직전 HTML과 동일하다.

전문 서비스 패널은 PC 약684→477px, 모바일705→622px다.1440×768/900·1280×800에서 첫 화면 내 전체 패널을 확인했다. 모바일390px 문서 길이는2464→2378px다. 결과 전환·펼침·200% 확대에서 읽기 기준점과CTA·다음 섹션 위치의 변동2px 미만 및 오버플로 없음도 확인했다.

PC/모바일의 모션은 실제 진입·감소 설정을 확인하며, 체감 부드러움이나 실기기 성능을 수치만으로 판정하지 않는다. CSS 글자 확대는 두 방식으로 검사했고 실제 브라우저 메뉴 확대/실기기 검토는 별도다. 짧은 결과의 예약 여백과 모바일 작품 속 작은 글자, 행사 소개와 일정 사이의 반복은 남아 있다.

| 비교 | PC | 모바일 | 전체 |
|---|---|---|---|
| professional | [보기](previews/professional-pc.jpg) | [보기](previews/professional-mobile.jpg) | [보기](previews/professional-overview.jpg) |
| portfolio | [보기](previews/portfolio-pc.jpg) | [보기](previews/portfolio-mobile.jpg) | [보기](previews/portfolio-overview.jpg) |
| event | [보기](previews/event-pc.jpg) | [보기](previews/event-mobile.jpg) | [보기](previews/event-overview.jpg) |

전문 서비스 캡처는 B/Craft11/Compact12 순서, 다른 두 범주는 B/Craft11 순서다. 이번에 전문 서비스만 조정했고 나머지는 분석 대상이다. 같은 작성자의 후속 개선으로 최초 생성 성능의 독립 실험은 아니다. 로컬 데모이며 실제 전송이나 이번 변경의 GitHub Pages 배포는 없다.
