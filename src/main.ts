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

function processInvoiceForm(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("管理表");
  const controlSheet = ss.getSheetByName("設定制御用");

  if (!sheet || !controlSheet) {
    throw new Error("管理表か設定制御用シートが見つかりません");
  }
  const lastRow = sheet?.getLastRow() + 1;

  const currentNumber = controlSheet?.getRange("A2").getValue();
  const newNumber = currentNumber + 1;
  const invoiceNumber = `INV-${String(currentNumber).padStart(3, "0")}`;
  controlSheet?.getRange("A2").setValue(newNumber);

  const breakdownText = formData.breakdown
    .map((item) => {
      const unitPriceFormatted = Number(item.unitPrice).toLocaleString();
      return `${item.itemsSubject} ${
        item.itemTitle || ""
      } @${item.unitPrice.toLocaleString()} * ${item.qty}セット`;
    })
    .join("\n");

  sheet.getRange(lastRow, 10, 1, 1).insertCheckboxes();
  sheet
    ?.getRange(lastRow, 1, 1, 10)
    .setValues([
      [
        lastRow - 1,
        formData.invoiceDay,
        invoiceNumber,
        formData.company,
        formData.subject,
        formData.totalAmount,
        breakdownText,
        formData.transferAccount,
        formData.remarks,
        true,
      ],
    ]);
  const TEMPLATE_ID = "1jiGJG7XaDQBcH6uZo8aVfH72zZgneGFFHl0OI6lJynQ";
  const DEST_FOLDER_ID = "1DgSlbvnFvnkUtsiGOVdRmuKdEQSGlW4V";

  const TemplateDoc = DriveApp.getFileById(TEMPLATE_ID);
  const copiedDoc = TemplateDoc.makeCopy(`請求書_${invoiceNumber}`);
  const doc = DocumentApp.openById(copiedDoc.getId());
  const body = doc.getBody();

  body.replaceText("{{company}}", formData.company);
  body.replaceText("{{date}}", formData.invoiceDay);
  body.replaceText("{{callNumber}}", invoiceNumber);
  body.replaceText("{{subject}}", formData.subject);
  body.replaceText("{{includingPrice}}", formData.totalAmount);
  body.replaceText("{{breakdown}}", breakdownText);
  body.replaceText("{{transferAccount}}", formData.transferAccount);
  body.replaceText("{{remarks}}", formData.remarks);

  doc.saveAndClose();

  const pdf = DriveApp.getFileById(copiedDoc.getId()).getAs(MimeType.PDF);
  const destFolder = DriveApp.getFolderById(DEST_FOLDER_ID);
  destFolder.createFile(pdf);
}

function getItemMaster() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("マスタ_件名内訳");
  const data = sheet?.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues(); // A, B列
  const result = {};
  if (!data) {
    throw new Error("データがありません");
  }
  data.forEach(([subject, price]) => {
    if (subject && price) {
      const numericPrice = parseInt(String(price).replace(/[^\d]/g, ""), 10); // ¥削除
      result[subject] = numericPrice;
    }
  });
  return result;
}
