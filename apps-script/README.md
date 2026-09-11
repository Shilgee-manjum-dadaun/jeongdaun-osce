# 질문 접수 Apps Script

실기연습 암기 스프레드시트(`12u7d7B4LgIWw8saxLvRcB1Ni7aJ_PCZGAwgrl52zG_o`)에 「질문」 탭을 만들고, 사이트에서 POST로 행을 추가합니다.

## 배포

1. 스프레드시트 → 확장 프로그램 → Apps Script
2. `Code.gs` 내용을 이 폴더의 `Code.gs`로 교체 후 저장
3. 배포 → 새 배포 → 웹 앱
   - 실행 계정: 나
   - 액세스 권한: 모든 사용자
4. 웹 앱 URL(`/exec`)을 `public/ask-config.json`의 `webhookUrl`에 넣고 사이트 재배포

## POST 본문 (text/plain JSON)

```json
{ "type": "이건 왜 물어보나요?", "message": "...", "page": "...", "userAgent": "..." }
```
