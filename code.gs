function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // Format the date
  const date = new Date(data.date);
  const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "d-MMM-yyyy");
  
  // Add the row to the sheet
  sheet.appendRow([
    formattedDate,           // Date
    data.category,           // Category
    data.subcategory,        // Subcategory
    data.quantity,           // Quantity
    data.unitPrice,          // Unit Price
    data.totalAmount,        // Total Amount
    data.recipient,          // Consumer
    data.description         // Description
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Save Penny API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}