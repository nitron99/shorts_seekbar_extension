
// ------------------------- message listener -------------------------
chrome.runtime.onMessage.addListener(async (object, sender, response) => {

  if(object.id === "SHOW_SEEKBAR"){
    showSeekbar();
  }

});

function showSeekbar(){
  let player = document.querySelector("#shorts-player > div.html5-video-container > video");
  let container = document.querySelector("#shorts-player > div.html5-video-container");

  if(player && container){
    // console.log(player, container);
    let totalTime = player.duration;
    // console.log(totalTime)
  
    if(totalTime > 0){
      let seekbar = document.createElement('input');
      seekbar.id = "asdf";
      seekbar.type = "range";
      seekbar.min = "0.0";
      seekbar.max = totalTime;
      seekbar.value = "0.0";
      seekbar.step = "0.5";
      seekbar.style = `position: fixed; z-index: 100000; bottom: 52px; width: ${player.clientWidth-5}px` ;
      seekbar.onchange = (e) => { 
          player.currentTime = e.target.value;
          setTimeout(() => {
            player.play();
          }, 400);
        };

      container.style.position = "relative"

      // remove the previous seekbar
      while(container.children.length > 1){
        container.removeChild(container.lastChild);
      }
      
      // add new seekbar
      container.appendChild(seekbar);

      clearInterval();
      setInterval(() => {
        seekbar.value = player.currentTime;
      }, 500);

      // remove the old
      let oldProgressBar = document.querySelector("#progress-bar");
      if(oldProgressBar) oldProgressBar.remove();

      // remove bottom gradient
      let bottomGradient = document.querySelector("#movie_player > div.ytp-gradient-bottom");
      if(bottomGradient) bottomGradient.remove();
    }
  }
}