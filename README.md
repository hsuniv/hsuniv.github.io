# hsuniv.github.io

한성대학교 IT인프라팀 GitHub Pages.  
현재 기능: 주요 웹서비스 상태 자동 모니터링 대시보드.

**대시보드 주소:** https://hsuniv.github.io/sitecheck

---

## 기능 소개

- 한성대학교 26개 주요 웹서비스의 HTTP 상태를 **10분마다 자동으로 체크**한다.
- 결과는 대시보드 페이지에서 실시간으로 확인할 수 있다.
- 🟢 정상 / 🟡 리다이렉트 / 🔴 오류로 시각적으로 표시.

---

## 처음 설정하는 방법 (한 번만 하면 됨)

### 1단계 — 저장소를 본인 계정/조직으로 복사한다

GitHub에서 이 저장소를 Fork하거나, 아래처럼 직접 새 저장소를 만들어 파일을 올린다.

> 저장소 이름은 반드시 `{계정이름}.github.io` 형식이어야 GitHub Pages로 자동 배포된다.  
> 예: `hsuniv.github.io`

---

### 2단계 — GitHub Pages를 켠다

1. 저장소 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 사이드바에서 **Pages** 클릭
3. **Source** 항목을 `Deploy from a branch`로 설정
4. Branch를 `main`, 폴더를 `/ (root)`로 선택 → **Save** 클릭

잠시 후 `https://{계정이름}.github.io` 주소로 접속 가능해진다.

---

### 3단계 — Actions 쓰기 권한을 켠다 ⚠️ 필수

이 설정이 없으면 자동 체크가 결과를 저장하지 못해 대시보드가 업데이트되지 않는다.

1. 저장소 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 사이드바에서 **Actions → General** 클릭
3. 아래쪽 **Workflow permissions** 항목에서 **Read and write permissions** 선택
4. **Save** 클릭

---

### 4단계 — 첫 번째 체크를 수동으로 실행한다

10분 뒤 자동으로 실행되지만, 바로 확인하고 싶다면:

1. 저장소 상단 메뉴에서 **Actions** 클릭
2. 왼쪽 목록에서 **Site Health Check** 클릭
3. 오른쪽 **Run workflow** 버튼 클릭 → **Run workflow** 확인

1~2분 후 `sitecheck/status.json` 파일이 자동으로 업데이트된다.

---

## 사이트 추가 / 제거 방법

`sitecheck/sites.json` 파일을 수정하고 push하면 다음 실행부터 반영된다.

```json
{
  "sites": [
    {"name": "표시할 이름",  "url": "https://체크할주소.com"},
    {"name": "삭제하려면",   "url": "이 줄을 지운다"}
  ]
}
```

---

## 파일 구조

```
hsuniv.github.io/
├── index.html                       ← 홈 (랜딩 페이지)
├── sitecheck/
│   ├── index.html                   ← 대시보드 UI
│   ├── sites.json                   ← ✏️ 체크할 사이트 목록 (직접 수정)
│   └── status.json                  ← 🤖 GitHub Actions가 자동 업데이트
└── .github/workflows/
    └── health-check.yml             ← ⏱️ 10분마다 자동 실행되는 체크 스크립트
```

---

## 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| 대시보드가 "불러오는 중"에서 멈춤 | status.json 없음 또는 Actions 미실행 | 4단계(수동 실행) 진행 |
| Actions가 "permission denied"로 실패 | 쓰기 권한 미설정 | 3단계 재확인 |
| 사이트를 추가했는데 반영 안 됨 | sites.json push 필요 | 파일 저장 후 push 확인 |
| status.json은 업데이트되는데 대시보드가 안 바뀜 | 브라우저 캐시 | Ctrl+Shift+R (강력 새로고침) |
