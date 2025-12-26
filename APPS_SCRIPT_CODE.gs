// Google Apps Script - Wedding RSVP Handler with CORS Support
// Replace the code in your Google Apps Script editor with this

const SHEET_ID = '19fZuRrLRXw2W5-SXDn87IGepvYS2Wuk3vFjDQef3JGo';
const SHEET_NAME = 'RSVP';
const SECRET_TOKEN = 'wanajahidwedding2026';

function doPost(e) {
  try {
    // Validate token
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return buildResponse(false, 'Unauthorized', 401);
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Get form data
    const nama = e.parameter.nama || '';
    const kehadiran = e.parameter.kehadiran || '';
    const jumlah = e.parameter.jumlah || '';
    const ucapan = e.parameter.ucapan || '';
    const timestamp = new Date().toLocaleString('ms-MY', { 
      timeZone: 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Append to sheet
    sheet.appendRow([nama, kehadiran, jumlah, ucapan, timestamp]);
    
    return buildResponse(true, 'RSVP saved successfully', 200);
  } catch (error) {
    return buildResponse(false, error.toString(), 500);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'list') {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      const data = sheet.getDataRange().getValues();
      
      // Skip header row (index 0)
      const entries = [];
      for (let i = 1; i < data.length; i++) {
        entries.push({
          Nama: data[i][0],
          Kehadiran: data[i][1],
          Jumlah: data[i][2],
          Ucapan: data[i][3],
          Timestamp: data[i][4]
        });
      }
      // Support JSONP if `callback` parameter is provided (avoids CORS issues for GET)
      const callback = e.parameter.callback;
      if (callback) {
        const js = callback + '(' + JSON.stringify(entries) + ');';
        return ContentService.createTextOutput(js).setMimeType(ContentService.MimeType.JAVASCRIPT);
      }

      return buildResponse(true, entries, 200);
    }
    
    return buildResponse(false, 'Invalid action', 400);
  } catch (error) {
    return buildResponse(false, error.toString(), 500);
  }
}

function buildResponse(ok, data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify({
    ok: ok,
    data: data,
    statusCode: statusCode
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  
  return output;
}

// Handle preflight requests
function doOptions(e) {
  return ContentService.createTextOutput('OK');
}
