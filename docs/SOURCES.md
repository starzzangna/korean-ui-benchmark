# 원본 출처와 이용 조건

비교 화면에는 A/B 별칭을 사용하지만 원본의 저작자·이용 조건은 유지한다. 리비전과 파일 해시는 [입력 기록](input-provenance.json)에 있다.

| 표기 | 원본 | 이 저장소에 포함한 자료 |
|---|---|---|
| A | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 원본 모션 CSS/JS2개와 MIT 고지. 원본 파일은 수정하지 않음 |
| B | [uxjoseph/supanova-design-skill](https://github.com/uxjoseph/supanova-design-skill) | 입력의 출처/리비전/해시와 적용 범위만 기록. 원본 스킬 문서/패키지 자체는 미포함 |
| 자체 스킬 | `skills/korean-ui-design` | 자체 작성 지침·카테고리 문서·구현 예제·검토 도구 |

A의 모션 파일에는 [원본 MIT 고지](licenses/A-MIT.txt)를 적용한다. 신규 코드의 라이선스로 덮어쓰지 않는다. B는 확인한 입력 파일에서 명시적인 재배포 이용 조건을 확인하지 못했으므로, 원문을 복사해 배포하는 대신 출처를 연결했다. 이는 B가 공개 저장소라는 이유만으로 원문 재배포 권한이 있다고 간주하지 않기 위한 처리다.

원본의 추천 구조/표현 원칙을 적용한 결과이며 외부 저작자의 인증·협력·보증을 의미하지 않는다. [적용 범위](METHOD.md)를 함께 읽는다.

추가 실행 의존성은 Playwright(검사), Tailwind CSS CDN(B), Motion CDN(B), Google Fonts의 Outfit(B), Pretendard(CDN/로컬)다. 새 출력 파일 안의 의존성 URL과 npm 잠금 파일을 기준으로 재현한다. 사진/글꼴/가상 SVG의 이용 조건은 [에셋 문서](ASSETS.md)에 별도로 기록했다.
