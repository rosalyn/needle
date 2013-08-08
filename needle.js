
function getSelectionHtml(string) {
  var extracted_business = autoExtractName();
  var address_pattern = /(\d+\s+[':.,\s\w]*,\s*[A-Za-z]+\s*\d{5}(-\d{4})?)/i;
  var tel_pattern = /(\b[0-9]{3}[\. -]*[0-9]{3}[\. -]*[0-9]{4}\b)/i;

  var extracted_address = address_pattern.exec(string)[1].replace(/^\s+|\s+$/g, "");
  var extracted_tel = tel_pattern.exec(string)[1];
  
  console.log(extracted_business);
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
  'onclick': function(info, tab) { getSelectionHtml(info.selectionText); }
});
