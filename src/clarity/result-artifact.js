import {drawArtifact,scaleArtifact,labelFor} from '../craft/result-artifact.js';
export {drawArtifact,scaleArtifact,labelFor};
// 설계 가정과 판단이다. 조사 결과나 실제 고객 성과를 의미하지 않는다.
export const examples={
 s1:{label:'브랜드 진단',before:'책 제목을 모르는 방문자가 관심 주제부터 고르는 서점을 가정했습니다.',after:'읽고 싶은 주제에서 출발해, 지금의 나에게 맞는 책을 고릅니다.',rationale:'설계 판단 · 제목 대신 관심 주제를 첫 단서로 삼아, 어떤 서점인지 소개 문장에서도 드러냅니다.'},
 s2:{label:'웹 서비스 기획',before:'관심 주제는 있지만 원하는 책 제목은 모르는 방문자의 탐색을 가정했습니다.',after:'관심 주제 고르기 → 책 소개 비교하기 → 내 서가에 담기 → 서가에서 다시 찾기',rationale:'설계 판단 · 주제로 시작하고 소개를 비교한 뒤 저장하도록 순서를 정했습니다. 다시 찾는 행동은 내 서가로 이어집니다.'},
 s3:{label:'콘텐츠 정리',before:'같은 책 정보를 주제 목록·책 소개·내 서가에서 이어 읽는 상황을 가정했습니다.',after:'주제 탐색 → 책 소개 → 내 서가',rationale:'설계 판단 · 목록에는 주제, 소개에는 선택 근거, 내 서가에는 다시 찾을 정보를 두어 각 화면의 역할을 나눕니다.'}
};
