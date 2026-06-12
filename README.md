# 비전 설문 페이지

정적 HTML/CSS/JS로 만든 분기형 설문 페이지입니다. `index.html`을 브라우저에서 열면 바로 실행됩니다.

## Google Sheets 연동

1. Google Sheet를 만들고 `확장 프로그램 > Apps Script`를 엽니다.
2. 아래 코드를 붙여넣고 저장합니다.
3. `배포 > 새 배포 > 웹 앱`을 선택합니다.
4. 실행 권한은 본인, 액세스 권한은 설문 응답자가 접근 가능한 범위로 설정합니다.
5. 발급된 웹 앱 URL을 `app.js` 상단의 `GOOGLE_SCRIPT_URL`에 넣습니다.

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const payload = JSON.parse(e.postData.contents);
  const answers = payload.answers || {};

  const row = [
    payload.submittedAt,
    payload.resultType,
    ...Object.keys(answers).map((key) => answers[key].answer),
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "submittedAt",
      "resultType",
      ...Object.keys(answers).map((key) => `${key}: ${answers[key].question}`),
    ]);
  }

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 결과 페이지 기준

결과는 응답에 따라 자동으로 분류됩니다.

- 복음을 전하고 있다고 답하면 `증인`
- 비전/사명을 안다고 답하면 `비전`
- 복음을 모른다고 답하면 `복음 이해`
- 복음을 전하지 못하는 이유를 답하면 `용기와 훈련`
- 그 외에는 `성찰`
