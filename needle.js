function getSelectionHtml(e) {
  console.log("STARTING NOW");
  var html = "";
  if (window.getSelection) {
    var currSelection = window.getSelection();
    if (currSelection.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0; i < currSelection.rangeCount; i++) {
        container.appendChild(currSelection.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
    console.log(html);
    currSelection.removeAllRanges();
  } else {
    console.log("Your browser does not support!");
  }
  return html;
}

document.addEventListener("mouseup", getSelectionHtml, false);
