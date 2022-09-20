// Inspired by: https://www.august.com.au/blog/how-to-send-slack-alerts-from-google-sheets-apps-script/

function buildReport() {
  const ss = SpreadsheetApp.getActive();
  let data = ss.getActiveSheet().getRange("A2:C30").getValues(); // Change the range based on your data
  let payloadList = buildAlert(data);
  sendAlert(payloadList);
}

function nameToTag(name){
  
  let map_nameID = {
    // Key is name from Spreadsheet, value is user ID from Slack workspace
    "Petter": "UGF1ERTS9",
    "Sofie": "URPT4PM7S",
    "Kristian": "UMCNGUZ8X",
    "Frederick": "UGEL80S2Y",
    "Johannes": "UN6MADJ5Q"
  }
  // Try to look up name 
  tag = map_nameID[name];
  if(tag){
    return "<@"+tag+">";
  }
  else{
    return name;
  }
}

function buildAlert(data) {
  let today = new Date();
  let name = "Rottmann";
  let extraName = "";
  let meetingToday = false;
  for(let i=0; i<30-2;i++){ // This might have to be changed depending on your data
    let rowDate = new Date(data[i][0]);
    console.log(rowDate);
    if(today.getFullYear() == rowDate.getFullYear() & today.getMonth() == rowDate.getMonth() & today.getDate() == rowDate.getDate()){
      name = data[i][1];
      extraName = data[i][2];
      meetingToday = true;
    }
  }


  name = nameToTag(name);
  extraName = nameToTag(extraName);
  if(extraName != ""){extraName = " and " + extraName;}


  let payload = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":bell: *Board meeting today* :bell:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Today " + name + extraName + " will represent us at the board meeting."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Sent by Fredbot* :robot_face: "
        }
      }
    ]
  };
  return [payload, meetingToday];
}



function sendAlert(payloadList) {
  const webhook = "<Fill inn webhook URL here>";
  var options = {
    "method": "post", 
    "contentType": "application/json", 
    "muteHttpExceptions": true, 
    "payload": JSON.stringify(payloadList[0]) 
  };
  if(payloadList[1]){
    try {
      UrlFetchApp.fetch(webhook, options);
    } catch(e) {
      Logger.log(e);
    }
  }
}
