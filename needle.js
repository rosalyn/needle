var extracted_name;
var extracted_address;
var extracted_tel;
var src_url;
var head_html;

function extract_happens(string) {
  var address_pattern = /(\d+\s+[':.,\(\)\s\w]*,\s*[A-Za-z]+\s*\d{5}(-\d{4})?)/i;
  var tel_pattern = /([\(\)0-9]{3,5}[\. -]*[0-9]{3}[\. -]*[0-9]{4}\b)/i;

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
}

function populate_form() {
  chrome.tabs.create({url: 'http://www.factual.com/submit-form/t/places/new'}, function(tab) {
    chrome.tabs.executeScript(tab.id, {code: "document.getElementById('name').setAttribute('class', 'check-dirty dirty-field'); document.getElementById('name').value = '"+extracted_name+"'; document.getElementById('tel').setAttribute('class', 'check-dirty dirty-field'); document.getElementById('address').setAttribute('class', 'check-dirty dirty-field'); document.getElementById('country').setAttribute('class', 'check-dirty dirty-field'); document.getElementById('tel').value = '"+extracted_tel+"'; document.getElementById('address').value = '"+extracted_address+"'; document.getElementById('submit_form_reference').value = '"+src_url+"'; document.getElementById('country').value = 'us'"});
  });
}

function getHTML(string) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {method: "getHTML"}, function(response) {
      if(response.method="getHTML") {
        head_html = response.html;  
		autoExtractAttributes(head_html);
        extract_happens(string);
        populate_form();
      }
    });
  });
}

function getSelectionHtml(string,url) {
  src_url = url;
  getHTML(string);
}

function autoExtractAttributes(stuff) {
  var htmlObject = document.createElement('div');
  htmlObject.innerHTML = stuff;
  var metas = htmlObject.getElementsByTagName('meta');
  for (var i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('property') == "og:title") {
      extracted_name = metas[i].content;
    }
    if (extracted_name == null && metas[i].getAttribute('property') == "og:site_name") {
      extracted_name = metas[i].content;
    }
  }
}

chrome.contextMenus.create({
  'title': 'Send to Factual',
  'contexts': ['selection'],
  'onclick': function(info, tab) { 
    getSelectionHtml(info.selectionText,info.pageUrl); 
  }
});
