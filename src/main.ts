function openFormDialog() {
  const html = HtmlService.createHtmlOutputFromFile("ui")
    .setWidth(600)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, "請求書作成フォーム");
}

function processInvoice(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = sheet.getSheetByName("設定制御用");
  const manageSheet = sheet.getSheetByName("管理表");
}
