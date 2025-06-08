function showInvoiceForm() {
  const html = HtmlService.createHtmlOutputFromFile("InvoiceForm")
    .setWidth(600)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, "請求書作成フォーム");
}

function getFormOptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const companiesRaw =
    ss.getSheetByName("マスタ_企業情報")?.getRange("A2:A").getValues() || [];
  const companies = companiesRaw.map((row) => row[0]).filter(String);

  const remarksSheet = ss.getSheetByName("マスタ_備考文例");
  const remarksRaw =
    remarksSheet?.getRange(2, 1, remarksSheet.getLastRow() - 1).getValues() ||
    [];
  const remarks = remarksRaw.map((row) => row[0]).filter(String);

  const accountsSheet = ss.getSheetByName("マスタ_銀行情報");
  const accountsRaw =
    accountsSheet
      ?.getRange(2, 1, accountsSheet.getLastRow() - 1, 3)
      .getValues() || [];
  const accounts = accountsRaw
    .map((row) => row.filter(String).join(" "))
    .filter((v) => v && v.trim() !== "");

  return { companies, remarks, accounts };
}
