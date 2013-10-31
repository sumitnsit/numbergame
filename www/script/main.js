var empty = 15;
var clickCount = 0;
var tileSize = 77;

var eventController = document.createElement("DIV");

eventController.addEventListener("changeUsername", function(){
	storage.setUser(this.innerHTML);
}, false);

eventController.addEventListener("tileMoved", function(t){				
	if(won()){
		this.dispatchEvent(new Event("GaveOver"));
	}
}, false);

eventController.addEventListener("GaveOver", function(t){	

	var fastestScore = storage.getFasttestScore();
	var clickCount = parseInt(document.getElementById("clickCount").innerHTML);

	if(fastestScore > clickCount){
		$$("fastest").innerHTML = clickCount;
		storage.setFastestScore(clickCount);
	}  
}, false);


var randomTiles = (function(){
	var tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	var randNum = 0;
	var temp = 0;

	for(var x = 13; x >= 0; x--) {
		randNum = Math.floor((Math.random()*x));
		temp = tiles[randNum];
		tiles[randNum] = tiles[x+1];
		tiles[x+1] = temp;
	}

	return {
		getTiles: function(){
			return tiles;
		}
	}
})();

var storage = (function(){

	var userName = localStorage.getItem("kapour/numbergame/LastUser");
	var fasttestScore = localStorage.getItem("kapour/numbergame/FastestScore");

	if(!userName){
		userName = "Your Name";
		fasttestScore = 100000;
		localStorage.setItem("kapour/numbergame/LastUser", "Your Name");
		localStorage.setItem("kapour/numbergame/FastestScore", fasttestScore);
	}

	return {
		getUser: function(){
			return userName;
		},

		getFasttestScore: function(){
			return parseInt(fasttestScore);
		}, 

		setUser: function(newUser){
			userName = newUser;
			localStorage.setItem("kapour/numbergame/LastUser", newUser);
		},

		setFastestScore: function(newScore){
			fasttestScore = newScore;
			localStorage.setItem("kapour/numbergame/FastestScore", newScore);
		}
	};

})();

var init = function(){
	alert('Starting');
	var game = document.getElementById("game");		
			
	$$("playerName").addEventListener("blur", function(){
		storage.setUser(this.innerText);
	}, false);

	$$("playerName").innerText = storage.getUser();

	$$("fastest").innerHTML = storage.getFasttestScore() > 99999 ? "Not Yet" : storage.getFasttestScore();
	
	for(var j = 0; j < 4; j++){
		for (var i = 0; i < 4; i++){
			if(j === 3 && i === 3) return;
			var tile = document.createElement("div");
			tile.id = "tile-" + (j*4 + i);
			tile.className = "tile";
			tile.style.left = i*tileSize + "px";
			tile.left = (i*tileSize);
			tile.top = j*tileSize;
			tile.dataset.index = (j*4 + i);
			tile.style.top = j*tileSize + "px";				
			tile.innerHTML = randomTiles.getTiles()[j*4 + i];

			tile.addEventListener("touchstart", (function(t){
				return function(){
					console.log("calling tap");
					tap(t);
				}
			})(tile), false);

			game.appendChild(tile);
		}
	}
}

function won(){
	if(empty != 15) return false;

	for(var index = 0; index < 15; index++){
		 if(parseInt($$("tile-" + index).dataset.index) != parseInt($$("tile-" + index).innerHTML) - 1) return false;
	}
	
	return true;
}

function $$(id){
	return document.getElementById(id);
}

function tap(item){
	var index = parseInt(item.dataset.index);
	var temp = empty;

	document.getElementById("clickCount").innerHTML = ++clickCount;

	if(empty-4 === index){
		item.top = item.top + tileSize;
		item.style.top = item.top + "px";
		empty = index;
		item.dataset.index = temp;
	} else if(empty+4 === index){
		item.top = item.top - tileSize;
		item.style.top = item.top + "px";
		empty = index;
		item.dataset.index = temp;
	} else if(empty-1 === index && empty%4 != 0){
		item.left = item.left + tileSize;
		item.style.left = item.left + "px";
		empty = index;
		item.dataset.index = temp;
	} else if(empty+1 === index && index%4 != 0){
		item.left = item.left - tileSize;
		item.style.left = item.left + "px";
		empty = index;
		item.dataset.index = temp;
	}

	if(parseInt(item.dataset.index) === parseInt(item.innerHTML) - 1){
		item.style.color = "rgb(38, 142, 182)";
	} else {
		item.style.color = "#E7E7E7";
	}

	eventController.dispatchEvent(new Event("tileMoved"));
}