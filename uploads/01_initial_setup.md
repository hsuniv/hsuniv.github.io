# Workflow 01: 최초 환경 구축

## 목표
IT 헬프데스크 Bot 최초 실행 전, 패키지 설치 → FAQ 수집 → 서버 기동까지 완료.

## 완료된 설정 (2026-04-10 기준)

### 확정된 값
- `BOARD_NO=1927` — IT 보안 게시판 (base64 enc 파라미터 디코딩으로 확인)
- `BOARD_URL=https://hansung.ac.kr/info/4017/subview.do`
- `WORKS_BOT_ID=11946894`
- `WORKS_CLIENT_ID=hB8kgmL_QG58w73DEVxN`
- `WORKS_SERVICE_ACCOUNT=lwbka.serviceaccount@hansung.kr`
- `WORKS_PRIVATE_KEY_PATH=./private_20260410104134.key` — PEM 형식
- 서버 포트: **5001** (HTTPS)
- 인증서: `cert.pem` / `key.pem` — 자체 서명 (10년 유효)

### 네이버 웍스 앱 정보
- 앱 이름: IT헬프데스크Bot-itinfra팀
- 스코프: bot, bot.message, bot.read
- 인증 방식: Service Account + Private Key (JWT, RS256)
- Bot Secret: Developer Console Bot 탭에서 확인

---

## 입력값
- `.env` 파일에 모든 키 입력 완료
- `ANTHROPIC_API_KEY` 입력 완료
- 인터넷 연결

## 단계

### 1. 패키지 설치
```bash
pip install -r requirements.txt
pip install pyjwt cryptography==41.0.7
```

> cryptography는 41.0.7 버전 고정. 최신 버전은 Python 3.9에서 DLL 오류 발생.

### 2. .env 설정 확인
```
ANTHROPIC_API_KEY=sk-ant-...

# 게시판 크롤링 대상 URL
# BOARD_URLS_HASH: 해시 비교 (내용 변경 시만 업데이트) — IT 매뉴얼처럼 수정이 잦은 게시판
# BOARD_URLS_NEW:  날짜 비교 (신규 게시글만 수집) — 공지사항 등 등록 후 수정 없는 게시판
BOARD_URLS_HASH=https://hansung.ac.kr/info/4016/subview.do
BOARD_URLS_NEW=https://hansung.ac.kr/info/4017/subview.do,https://www.hansung.ac.kr/hansung/6172/subview.do

WORKS_BOT_ID=11946894
WORKS_CLIENT_ID=hB8kgmL_QG58w73DEVxN
WORKS_CLIENT_SECRET=...
WORKS_SERVICE_ACCOUNT=lwbka.serviceaccount@hansung.kr
WORKS_PRIVATE_KEY_PATH=./private_20260410104134.key

PAGE_ROOTS=https://www.hansung.ac.kr/hansung/6298/subview.do,...
FLASK_SECRET_KEY=...
```

### 3. FAQ 크롤링
```bash
python tools/crawl_faq.py --force
```
- `data/faq.json` 생성
- 완료 후 확인:
```bash
python -c "
import json
with open('data/faq.json', encoding='utf-8') as f:
    d = json.load(f)
print(f'FAQ: {d[\"metadata\"][\"total\"]}건, 수집일: {d[\"metadata\"][\"crawled_at\"]}')
"
```

### 4. 홈페이지 정적 페이지 크롤링
```bash
python tools/crawl_pages.py --force
```
- `data/pages.json` 생성
- PAGE_ROOTS의 각 URL에서 서브메뉴 자동 감지 후 하위 페이지 수집

### 5. 서버 실행 (개발 PC — Windows)

#### 포트 확인 및 기존 프로세스 종료

```powershell
# 5001 포트 사용 여부 확인
netstat -ano | findstr :5001
```

출력 예시:
```
TCP    0.0.0.0:5001    0.0.0.0:0    LISTENING    35052
```

이미 사용 중이면 해당 PID(위 예시: 35052) 종료:
```powershell
taskkill /f /pid 35052
```

#### 서버 시작

```powershell
python .\app.py
```

정상 기동 확인:
```
 * Running on http://127.0.0.1:5001
 * Running on http://220.66.103.151:5001
```

브라우저에서 `http://127.0.0.1:5001` 접속해 챗 화면 확인.  
관리자 페이지: `http://127.0.0.1:5001/hsmgmt`

#### 서버 종료

터미널에서 **Ctrl+C** 입력.

---

**운영(Rocky Linux):** `https://{도메인}:443` — Workflow 04 참고

### 6. 네이버 웍스 Callback 등록
Developer Console → Bot 탭 → Callback URL 입력:
```
https://{공인도메인}/callback
```
- **자체 서명 인증서로는 네이버 웍스 콜백 수신 불가** (공인 인증서 필요)
- 로컬 테스트는 curl/requests로 직접 POST 시뮬레이션 가능:
```bash
python -c "
import requests, urllib3
urllib3.disable_warnings()
requests.post('https://127.0.0.1:5001/callback', verify=False, json={
    'type': 'message',
    'source': {'userId': 'test_user'},
    'content': {'type': 'text', 'text': '웹메일 로그인이 안돼요'}
})
"
```

### 7. 네이버 웍스 토큰 발급 테스트
```bash
python -c "
from tools.works_api import _get_access_token
print(_get_access_token()[:40])
"
```
→ 토큰 문자열 출력되면 인증 성공

---

## 결과물
- `data/faq.json` — IT 매뉴얼 FAQ 데이터
- `data/pages.json` — 홈페이지 정적 페이지 데이터
- Flask 서버 HTTPS 정상 기동

---

## 예외 처리

| 문제 | 해결 |
|------|------|
| cryptography DLL 오류 | `pip install cryptography==41.0.7` 로 버전 고정 |
| 포트 5001 이미 사용 중 | `netstat -ano \| grep :5001` 로 PID 확인 후 `taskkill /PID {pid} /F` |
| Works 토큰 발급 실패 | .env의 CLIENT_ID/SECRET/SERVICE_ACCOUNT/KEY_PATH 확인 |
| 크롤링 결과 0건 | BOARD_NO 재확인, crawl_faq.py 선택자 수정 |
| 네이버 웍스 콜백 미수신 | 공인 HTTPS 필요 → Rocky Linux 배포 후 진행 |

---

## 다음 단계: Rocky Linux 배포
로컬 개발 완료 후 Rocky Linux 서버에 배포해야 네이버 웍스 실제 연동 가능.
→ Workflow 04 (Rocky Linux 배포) 참고
