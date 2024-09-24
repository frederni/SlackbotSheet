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
    "James": "Uxxxxxxxx",
    "Linda": "Uxxxxxxxx",
    "Robert": "Uxxxxxxxx",
    "Mary": "Uxxxxxxxx",
    "William": "Uxxxxxxxx"
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
  // Define today and tomorrow
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let name = "Rottmann";
  let extraName = "";
  let meetingToday = false;
  let meetingTomorrow = false;
  
  for(let i=0; i<30-2;i++){ // This might have to be changed depending on your data
    let rowDate = new Date(data[i][0]);
    console.log(rowDate);
    if(today.getFullYear() == rowDate.getFullYear() & today.getMonth() == rowDate.getMonth() & today.getDate() == rowDate.getDate()){
      name = data[i][1];
      extraName = data[i][2];
      meetingToday = true;
    }

    else if (tomorrow.getFullYear() == rowDate.getFullYear() & tomorrow.getMonth() == rowDate.getMonth() & tomorrow.getDate() == rowDate.getDate()) {
      name = data[i][1];
      extraName = data[i][2];
      meetingTomorrow = true;
    }
  }


  name = nameToTag(name);
  extraName = nameToTag(extraName);
  if(extraName != ""){extraName = " and " + extraName;}


let payloadToday = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":bell: *Styremøte i dag* :bell:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "I dag kommer " + name + extraName + " på styremøtet deres."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Sendt av Skyggebot* :robot_face: "
        }
      }
    ]
  };
  
  let payloadTomorrow = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":bell: *Styremøte i morgen* :bell:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "I morgen kommer " + name + extraName + " på styremøtet deres."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Sendt av Skyggebot* :robot_face: "
        }
      }
    ]
  };

  return [payloadToday, payloadTomorrow, meetingToday, meetingTomorrow];
}



function sendAlert(payloadList) {
  const webhook = "<Fill inn webhook URL here>";
  
  var optionsToday = {
    "method": "post", 
    "contentType": "application/json", 
    "muteHttpExceptions": true, 
    "payload": JSON.stringify(payloadList[0]) 
  };

  var optionsTomorrow = {
    "method": "post", 
    "contentType": "application/json", 
    "muteHttpExceptions": true, 
    "payload": JSON.stringify(payloadList[1]) 
  };

  // Today
  if(payloadList[2]){
    try {
      UrlFetchApp.fetch(webhook, optionsToday);
    } catch(e) {
      Logger.log(e);
    }
  }

  // Tomorrow
  if (payloadList[3]){
    try {
      UrlFetchApp.fetch(webhook, optionsTomorrow);
    } catch(e) {
      Logger.log(e);
    }
  }
}
