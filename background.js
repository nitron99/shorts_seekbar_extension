
// ---------------------- message functions ------------------------
chrome.runtime.onMessage.addListener((obj, sender, response) => {
  return true;
});

// ---------------------- detection function -----------------------
chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.tabs.get(tabId, (info) => {
    test(info);
  }) 
})

chrome.tabs.onActivated.addListener((info) => {
  chrome.tabs.get(info.tabId, (info) => {
    test(info);
  }) 
});

// ---------------------- testing functions ------------------------
const test = (info) => {
  if(info.url.includes("www.youtube.com/shorts")){
    // url dectected => check if content script exists there of not.
    executeScript(info.id, true, (response) => {
      chrome.tabs.sendMessage(info.id, { id: "SHOW_SEEKBAR" });
    })
  }
}

// ---------------------- miscellaneous ----------------------------
const executeScript = async (tabId, allFrames, callback) => {
  // get all scripts with tag -> block-script
  const scripts = await chrome.scripting.getRegisteredContentScripts({ids: ["seekbar-script"]});

  console.log(scripts);

  if(scripts.length > 0){
    // means script already exists no need to execute again
    callback(true);
  }else{
    // first register the script
    const seekbarScript = {
      id: "seekbar-script",
      js: ["content.js"],
      matches: ["https://www.youtube.com/shorts/*"],
    };
    try {
      await chrome.scripting.registerContentScripts([seekbarScript]);
      chrome.scripting.executeScript({
        injectImmediately: true,
        target: { tabId: tabId, allFrames: allFrames },
        files: [ "content.js" ]
      })
      .then(() => {
        console.log("script injected in all frames from background script")
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
    } catch (err) {
      console.log(`failed to register content scripts: ${err}`);
    }
  }
}