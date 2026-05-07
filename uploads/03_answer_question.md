# Workflow 03: 질문→답변 처리

## 목표
교직원의 IT 질문을 받아 FAQ 검색 → Claude 답변 생성 → 네이버 웍스로 전송.

## 입력값
- 네이버 웍스 Bot Callback (POST /callback)
- 또는 웹 UI (POST /api/ask)

## 흐름

### 네이버 웍스 경로
```
교직원 → 웍스 메신저에서 Bot에게 메시지
    ↓
POST /callback (네이버 웍스 → Flask)
JSON: { type, source.userId, content.text }
    ↓
app.py — 메시지 이벤트 확인, userId/text 추출
    ↓
_process_question() 호출
    ↓
search_faq.py — 동의어 확장 + 키워드 매칭 → 상위 3개 FAQ 추출
search_departments.py — 연락처 관련 질문이면 검색
search_it_services.py — IT 서비스 관련이면 검색
    ↓
ask_claude.py — FAQ + 연락처 컨텍스트 + 질문 → Claude API → 답변
    ↓
works_api.py — POST /v1.0/bots/{botId}/users/{userId}/messages
    ↓
교직원에게 답변 수신
```

### 웹 UI 경로 (테스트용)
```
POST /api/ask → _process_question() → {"answer": ..., "sources": [...]}
```

---

## 동의어 확장 메커니즘 (search_faq.py)

검색 전에 질문의 토큰을 동의어로 확장해 검색 범위를 넓힘.
예: "이클 로그인 안 돼" → "이클래스", "eclass", "e-class" 도 함께 검색.

### 3단계 레이어

**레이어 1 — 앱 시작 시 로드 (data/synonyms.json)**
```
앱 시작 → data/synonyms.json 로드 → _SYNONYM_CACHE(메모리)에 저장
```
- `synonyms.json` 없으면 최초 1회 자동 생성 (하드코딩된 기본 동의어로 시드)
- 이후 재시작할 때도 AI 학습된 내용 유지됨

**레이어 2 — AI 동적 확장 (Claude Haiku)**
```
발동 조건: 검색 결과 0건 + _SYNONYM_CACHE에 없는 미지 토큰 존재
    ↓
Haiku API 호출 (~300ms)
프롬프트: "한성대학교 '{token}'은 학생이나 교직원이 쓰기에 무엇을 의미해?
         공식 명칭이나 표현을 최대 3개만 쉼표로 나열해. 모르면 빈 줄로 응답해."
    ↓
동의어로 재검색
```

**레이어 3 — 자동 학습 저장**
```
저장 조건: AI 동의어 반환 AND 그 동의어로 재검색 결과 있음 (둘 다 충족해야)
    ↓
_SYNONYM_CACHE 업데이트 (같은 프로세스의 다음 사용자 즉시 혜택)
data/synonyms.json 저장 (재시작 후에도 유지)
```
잘못된 AI 매핑은 저장하지 않음 (재검색 실패 시 기록 안 함).

### 전체 검색 흐름

```
검색 요청
    ↓
기존 검색 (_SYNONYM_CACHE 확장 + 2-gram 분해)
    ↓ 결과 있음? YES → 반환
    NO ↓
미지 토큰 추출 (캐시에 없는 것만)
    ↓ 없음? YES → 빈 결과 반환
    NO ↓
Haiku API 호출
    ↓ 동의어 없음? YES → 빈 결과 반환
    NO ↓
동의어로 재검색
    ↓ 결과 없음? YES → 빈 결과 반환
    NO ↓
캐시 + synonyms.json 저장 → 결과 반환
```

### 동의어 데이터 저장 위치

`data/synonyms.json` — 수동 등록 + AI 학습 모두 통합 관리

```json
{
  "version": "1.0",
  "updated_at": "2026-05-02T10:00:00",
  "synonyms": {
    "이클": {
      "terms": ["이클래스", "eclass", "e-class"],
      "source": "AI학습",
      "added_at": "2026-05-02T10:00:00",
      "hit_count": 5
    },
    "와이파이": {
      "terms": ["WiFi", "wifi", "무선", "무선랜"],
      "source": "수동",
      "added_at": "2026-05-02T10:00:00",
      "hit_count": null
    }
  }
}
```

- `source`: `"수동"` (관리자 직접 등록) / `"AI학습"` (자동 학습)
- `hit_count`: AI학습 항목이 실제로 검색에 쓰인 횟수 (수동은 null)
- 관리자 페이지 `/hsmgmt` → 동의어 사전 탭에서 추가/수정/삭제 가능

## 결과물 예시

```json
{
  "answer": "웹메일(Google Workspace)은 https://mail.hansung.ac.kr 에서 접속합니다.\n1. 학번@hansung.ac.kr 로 로그인\n2. 비밀번호 분실 시 종합정보시스템에서 포털 비밀번호 재설정\n3. 그래도 안 될 경우 IT인프라팀 문의\n\n📄 참고: 웹메일 사용 방법\n☎ 문의: IT인프라팀 02-760-4291",
  "sources": [
    {
      "title": "웹메일 사용 방법",
      "artcl_no": "1234",
      "reg_date": "2026-01-10"
    }
  ]
}
```

## 예외 처리

| 문제 | 해결 |
|------|------|
| `data/faq.json` 없음 | Claude 일반 지식으로 답변, IT인프라팀 연락 안내 |
| 관련 FAQ 없음 | Claude 일반 IT 지식으로 답변 시도 |
| Works 답장 실패 | 로그 기록 후 계속 (Callback은 200 반환 유지) |
| Claude API 오류 | "잠시 후 다시 시도해 주세요 (IT인프라팀 02-760-4291)" 반환 |
