
function getSelectionHtml(string) {
  business = autoExtractName();
  console.log(business);
  console.log(string);
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
