const SPREADSHEET_ID = '12u7d7B4LgIWw8saxLvRcB1Ni7aJ_PCZGAwgrl52zG_o';
const SHEET_NAME = '질문';

function ensureSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['타임스탬프', '유형', '내용', '페이지', 'UserAgent']);
    sh.setFrozenRows(1);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow(['타임스탬프', '유형', '내용', '페이지', 'UserAgent']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const type = String(data.type || '').trim();
    const message = String(data.message || '').trim();
    if (!type || !message) {
      return json_({ ok: false, error: 'type and message required' });
    }
    const sh = ensureSheet_();
    sh.appendRow([
      new Date(),
      type,
      message,
      String(data.page || ''),
      String(data.userAgent || '').slice(0, 300),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'jeongdaun-questions' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
