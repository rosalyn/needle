var extracted_address;
var extracted_tel;

function getSelectionHtml(string) {
  var address_pattern = /(\d+\s+[':.,\s\w]*,\s*[A-Za-z]+\s*\d{5}(-\d{4})?)/i;
  var tel_pattern = /(\b[0-9]{3}[\. -]*[0-9]{3}[\. -]*[0-9]{4}\b)/i;

  extracted_address = address_pattern.exec(string)[1].replace(/^\s+|\s+$/g, "");
  extracted_tel = tel_pattern.exec(string)[1];
  
  console.log(extracted_address);
  console.log(extracted_tel);
}

function autoExtractName() {
  title = document.title;
  console.log(title);
  var name = "";
  var metas = document.getElementsByTagName("meta");
  console.log(metas.length);
  for (var i = 0; i < metas.length; i++) {
    console.log(metas[i].property);
    if (metas[i].property == "og:site_name") {
      name = metas[i].content;
    }
  }
  if (name == "") {
    name = "NOT FOUND!";
  }
  return name;
}

chrome.contextMenus.create({
  'title': 'Send to Factual',
  'contexts': ['selection'],
  //'onclick': function(info, tab) { getSelectionHtml(info.selectionText); }
  'onclick': function(info, tab) { 
    getSelectionHtml(info.selectionText); 
    chrome.tabs.create({url: 'http://www.factual.com/submit-form/t/places/new'}, function(tab) {
      chrome.tabs.executeScript(tab.id, {code: "document.getElementById('tel').value = '"+extracted_tel+"'; document.getElementById('address').value = '"+extracted_address+"'"});
    });
  }
});
