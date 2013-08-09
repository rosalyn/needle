var extracted_address;
var extracted_tel;
var extracted_website;
var src_url;

function getSelectionHtml(string,url) {
  console.log(string);
  var address_pattern = /(\d+\s+[':.,\(\)\s\w]*,\s*[A-Za-z]+\s*\d{5}(-\d{4})?)/i;
  var tel_pattern = /([\(\)0-9]{3,5}[\. \-\/]*[0-9]{3}[\. \-\/]*[0-9]{4})/i;
  var website_pattern = /((?:https?:\/\/)?(?:[a-z]+\.)?[a-z0-9\-]+\.(?:com|org|net))/i;
  src_url = url;

  match_address = address_pattern.exec(string)
  if (match_address) {
    extracted_address = match_address[1].replace(/^\s+|\s+$/g, "");
  }
  else {
    extracted_address = "";
  }
  
  match_tel = tel_pattern.exec(string)
  if (match_tel) {
    extracted_tel = match_tel[1];
  }
  else {
    extracted_tel = "";
  }

  match_website = website_pattern.exec(string)
  if (match_website) {
    extracted_website = match_website[1];
  }
  else {
    extracted_website = "";  
  }
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
  'onclick': function(info, tab) { 
    getSelectionHtml(info.selectionText,info.pageUrl); 
    chrome.tabs.create({url: 'http://www.factual.com/submit-form/t/places/new'}, function(tab) {
      chrome.tabs.executeScript(tab.id, {code: "\
      document.getElementById('tel').setAttribute('class', 'check-dirty dirty-field');\
      document.getElementById('tel').setAttribute('name', 'tel');\
      document.getElementById('tel').value = '"+extracted_tel+"';\
      document.getElementById('address').setAttribute('class', 'check-dirty dirty-field');\
      document.getElementById('address').setAttribute('name', 'address');\
      document.getElementById('address').value = '"+extracted_address+"';\
      document.getElementById('country').setAttribute('class', 'check-dirty dirty-field');\
      document.getElementById('country').setAttribute('name', 'country');\
      document.getElementById('country').value = 'us';\
      document.getElementById('website').setAttribute('class', 'check-dirty dirty-field');\
      document.getElementById('website').setAttribute('name', 'website');\
      document.getElementById('website').value = '"+extracted_website+"';\
      document.getElementById('submit_form_reference').value = '"+src_url+"'"});
      });
  }
});
