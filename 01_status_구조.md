# 한성대학교 서비스 상태 모니터링 — 구조 및 운영 가이드

> 처음 설정하는 분은 맨 아래 **[최초 설정 가이드](#최초-설정-가이드)** 섹션부터 읽으세요.

---

## 접속 URL

| 주소 | 설명 |
|---|---|
| `https://hsuniv.github.io` | 현재 운영 주소 |
| `https://status.hansung.ac.kr` | DNS 등록 후 사용 예정 (두 주소 동시 접속 가능) |

---

## 파일 구조

```
hsuniv.github.io/
├── index.html                    ← 🌐  메인 대시보드 (브라우저가 보는 페이지)
├── sitecheck/
│   ├── sites.json                ← ✏️  체크할 사이트 목록 (직접 수정)
│   ├── comment.json              ← ✏️  상태 배너·이슈 기록 관리 (직접 수정)
│   ├── status.json               ← 🤖  현재 체크 결과 (Actions 자동 생성)
│   ├── history.json              ← 🤖  90일 이력 데이터 (Actions 자동 누적)
│   └── index.html                ← ↩️  / 로 리다이렉트 (건드릴 필요 없음)
└── .github/workflows/
    └── health-check.yml          ← ⏱️  자동 체크 워크플로우 정의
```

**직접 수정하는 파일**: `sites.json`, `comment.json`  
**자동 생성 파일**: `status.json`, `history.json` (손으로 수정 불필요)

---

## 동작 흐름

### ① 자동 체크 — GitHub Actions (10분마다)

```
GitHub Actions 스케줄러 (cron: */10 * * * *)
  └── ubuntu-latest VM 생성 → 저장소 checkout
  └── sitecheck/sites.json 읽기
  └── 각 URL에 curl 요청 → HTTP 상태코드 + 응답시간(ms) 수집
  └── sitecheck/status.json 덮어쓰기 (현재 상태)
  └── sitecheck/history.json 업데이트 (사이트별 실패 횟수 누적, 90일 유지)
  └── 자동 커밋 & push [skip ci]
```

> **중요**: 페이지의 "새로고침" 버튼은 이미 저장된 파일을 다시 읽는 것뿐이다.
> 실제 사이트 점검은 GitHub Actions만 수행한다.

### ② 대시보드 조회 — 브라우저

```
브라우저에서 https://hsuniv.github.io 접속
  └── JS가 세 파일을 병렬로 fetch()
      ├── status.json   → 현재 사이트별 상태 테이블 렌더링
      ├── history.json  → 사이트별 90일 미니 상태바 렌더링
      └── comment.json  → 상단 배너 + 이슈 기록 렌더링
```

---

## 상태 색상 기준

10분마다 점검하며, 하루 누적 실패 횟수로 색을 결정한다.  
단발성 오류 한 번으로 빨강이 되지 않는다.

| 색 | 조건 | 점검 실패 횟수 |
|---|---|---|
| 🟢 초록 | 30분 미만 다운 | 하루 2회 이하 실패 |
| 🟡 노랑 | 30분 이상 다운 | 하루 3~5회 실패 |
| 🔴 빨강 | 1시간 이상 다운 | 하루 6회 이상 실패 |
| ⬛ 회색 | 데이터 없음 | 시스템 도입 이전 날짜 |

---

## 각 파일 역할 상세

### `sitecheck/sites.json` — 체크 대상 목록

체크할 사이트를 추가·삭제·순서변경한다. 수정 후 push하면 다음 실행부터 반영.

```json
{
  "sites": [
    {"name": "표시할 이름",  "url": "https://체크할주소.com"},
    {"name": "사이트 2",     "url": "https://example.org"}
  ]
}
```

### `sitecheck/comment.json` — 상태 배너 및 이슈 기록 관리

장애 발생 시 또는 공지가 필요할 때 이 파일을 직접 수정한다.

```json
{
  "status": "green",      // green | yellow | red
  "message": "",          // 비워두면 기본 메시지 표시
  "incidents": [
    {
      "date": "2026-04-25",
      "title": "이슈 제목",
      "body": "상세 내용"
    }
  ]
}
```

- `status`: 상단 배너 색상 결정 (`green` / `yellow` / `red`)
- `message`: 배너 메시지. 비워두면 상태별 기본 메시지 자동 표시
- `incidents`: 하단 "주요 이슈 기록" 항목. **최신 이슈를 배열 맨 앞에 추가**

### `sitecheck/status.json` — 현재 체크 결과 (자동 생성)

Actions가 10분마다 덮어쓴다. 손으로 수정하지 않는다.

```json
{
  "updated": "2026-04-25 23:25 KST",
  "sites": [
    {"name": "메인홈", "url": "http://...", "status": 200, "ms": 1411},
    {"name": "SMS",    "url": "http://...", "status": 0,   "ms": 250}
  ]
}
```

- `status`: HTTP 응답 코드. 연결 실패 시 `0`
- `ms`: 응답 시간(밀리초). 리다이렉트 포함 최종 응답 기준

### `sitecheck/history.json` — 90일 이력 (자동 누적)

Actions가 10분마다 사이트별 실패 횟수를 누적한다. 90일 초과분 자동 삭제.

```json
{
  "days": [
    {
      "date": "2026-04-25",
      "sites": {
        "SMS": 12,
        "EDU": 8
      }
    }
  ]
}
```

- `sites` 안의 숫자: 해당 날짜의 점검 실패 횟수 (× 10분 = 누적 다운 시간)
- 정상 사이트는 `sites`에 등록되지 않음 (미등록 = 0회 실패 = 초록)

### `.github/workflows/health-check.yml` — 자동 실행 워크플로우

- `cron: '*/10 * * * *'` → 10분마다 자동 실행
- `workflow_dispatch` → Actions 탭에서 수동 실행 가능
- `[skip ci]` 커밋 태그로 재귀 실행 방지
- GitHub Actions 봇 계정으로 커밋 (기여자 오염 없음)

---

## 사이트 추가/제거/순서 변경

`sitecheck/sites.json`을 수정하고 push하면 다음 실행부터 반영된다.  
배열 순서 = 대시보드 표시 순서.

```json
{
  "sites": [
    {"name": "기존 사이트",  "url": "https://existing.com"},
    {"name": "새로 추가",    "url": "https://new-site.com"}
  ]
}
```

---

## 상태 배너 변경 방법 (긴급 공지)

장애 발생 시 `sitecheck/comment.json`을 수정하고 push한다.

```json
{
  "status": "red",
  "message": "현재 학습관리시스템(LMS) 접속 장애가 발생하고 있습니다. 담당팀에서 확인 중입니다.",
  "incidents": [...]
}
```

복구 후 `status`를 `"green"`으로 되돌리고, `incidents`에 이슈 항목을 추가한다.

---

## 수동 즉시 실행

```
GitHub 저장소 → Actions 탭
→ "Site Health Check" 워크플로우 선택
→ "Run workflow" 버튼 클릭
```

push 후 10분을 기다리지 않고 바로 결과를 확인하거나,  
장애 복구 후 즉시 정상 확인이 필요할 때 사용한다.

---

## 향후 DNS 연결 방법 (status.hansung.ac.kr)

1. DNS 관리 시스템에서 CNAME 레코드 추가:
   - 호스트: `status`
   - 값: `hsuniv.github.io`

2. GitHub 저장소 **Settings → Pages → Custom domain**:
   - `status.hansung.ac.kr` 입력 → **Save**

완료 후 두 주소 모두 동시에 접속된다.  
`https://hsuniv.github.io`는 사라지지 않는다.

---

## 최초 설정 가이드

처음 이 저장소를 GitHub에 올리고 동작시키기 위한 단계별 안내.  
코드를 몰라도 GitHub 웹사이트 클릭만으로 완료할 수 있다.

### STEP 1 — 저장소를 GitHub에 올린다

> 저장소 이름이 반드시 `{조직명}.github.io` 형식이어야 한다.  
> 예: 조직 이름이 `hsuniv` → 저장소 이름 `hsuniv.github.io`

### STEP 2 — GitHub Pages를 활성화한다

1. 저장소 상단 **Settings** 클릭
2. 왼쪽 메뉴 **Pages** 클릭
3. **Source**: `Deploy from a branch` 선택
4. **Branch**: `main` / 폴더: `/ (root)` → **Save**
5. 잠시 후 `https://hsuniv.github.io` 접속 확인

### STEP 3 — Actions 쓰기 권한을 켠다 ⚠️ 필수

이 설정이 없으면 `status.json`, `history.json` 커밋이 실패해 대시보드가 업데이트되지 않는다.

1. 저장소 **Settings** 클릭
2. 왼쪽 메뉴 **Actions → General** 클릭
3. **Workflow permissions** → **Read and write permissions** 선택
4. **Save**

### STEP 4 — 첫 번째 체크를 직접 실행한다

1. 저장소 상단 **Actions** 탭 클릭
2. 왼쪽 목록에서 **Site Health Check** 클릭
3. **Run workflow** 버튼 클릭 → 확인
4. 1~2분 후 초록 체크 표시 확인
5. `https://hsuniv.github.io` 접속 → 대시보드 정상 표시 확인

이후 10분마다 자동으로 실행된다.

---

## 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| 대시보드가 "불러오는 중"에서 멈춤 | status.json 없음 (Actions 미실행) | STEP 4 진행 |
| Actions가 빨간 X로 실패 | 쓰기 권한 미설정 | STEP 3 재확인 |
| 사이트 추가 후 반영 안 됨 | sites.json push 필요 | 파일 저장 후 push |
| 페이지 새로고침해도 데이터 안 바뀜 | 정상 동작 (Actions만 데이터 갱신) | 10분 대기 또는 수동 실행 |
| 미니 상태바가 전부 회색 | history.json 데이터 없음 | Actions 실행 후 하루 지나면 채워짐 |
| 배너 색이 실제 상태와 다름 | comment.json 수동 설정값 | comment.json status 확인 후 수정 |
| 대시보드가 오래된 데이터를 표시 | 브라우저 캐시 | Ctrl+Shift+R (강력 새로고침) |
