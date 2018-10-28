var countLoadMap = false,
	tmout = 0,
	prgs = 1;
function myLoadProgress (){
	var progress = document.getElementById("progress");
	var loader = document.getElementById("loader");
	progress.style.width = "100%";
	loader.classList.add('load');
	clearTimeout(tmout);
	countLoadMap = true;
	setTimeout(function(){
		progress.style.opacity = 0;
		setTimeout(function(){
			progress.style.display = "none";
			loader.style.display = "none";
		}, 500);
	}, 200);
}
window.addEventListener('load', myLoadProgress);
function stepProgressBar(){
	var progress = document.getElementById("progress");
	var par = prgs;
	clearTimeout(tmout);
	if(!countLoadMap){
		var rand = Math.random(),
			width = prgs + 5;
		if(width>90)
			width = 90;
		prgs = width;
		progress.style.width = width + "%";
		console.log(width);
		clearTimeout(tmout);
		var pause = parseInt(Math.random() * 3000 + Math.random() * 4000);
		console.log("pause", pause);
		tmout = setTimeout(stepProgressBar, pause);
	}
}
tmout = setTimeout(stepProgressBar, 1000);