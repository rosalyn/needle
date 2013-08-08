
function getSelectionHtml(string) {
  var extracted_business = autoExtractName();
  var locality_pattern = /([^0-9,]+), [A-Z]{2} [0-9]{5}/i
  var extracted_locality = locality_pattern.exec(string)[1].replace(/^\s+|\s+$/g, "");
  console.log(extracted_business);
  console.log(extracted_locality);
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
