var prevTime = Date.now();
var fpsArray = [];

function nextGeneration(organism, Mutation, saved) {
	// Update generation

	generation++;

	//calculateFitness();

	var move = pickMove(saved, move);

	saved = [];
	latest = undefined;
	generation++;

	var fps = 1000/(Date.now() - prevTime);
	fpsArray.push(fps);

	var averageFps = fpsArray.reduce((a, b) => a + b, 0)/fpsArray.length;

	if (fpsArray.length > 1000) {
		fpsArray.shift();
	}
	$("#fps").text("FPS: " + Math.floor(averageFps));
	prevTime = Date.now();

	return move;
}

// OPTIMIZATION PICK THE BEST SCORING LIST OF MOVES (ex. Up then Left, or Down then Down)
function pickMove(results, move) {
	var directions = []
	for (var i = 0; i < 16; i++) {
		directions.push({
			score: 0,
			counter: 0
		})
	}

	for (var i = 0; i < results.length; i++) {
		if (results[i].moves[0] == "left") {
			if (results[i].moves[1] == "left") {
				directions[0].score += results[i].score;
				directions[0].counter += 1;
			} else if (results[i].moves[1] == "up") {
				directions[1].score += results[i].score;
				directions[1].counter += 1;
			} else if (results[i].moves[1] == "right") {
				directions[2].score += results[i].score;
				directions[2].counter += 1;
			} else if (results[i].moves[1] == "down") {
				directions[3].score += results[i].score;
				directions[3].counter += 1;
			}
		} else if (results[i].moves[0] == "up") {
			if (results[i].moves[1] == "left") {
				directions[4].score += results[i].score;
				directions[4].counter += 1;
			} else if (results[i].moves[1] == "up") {
				directions[5].score += results[i].score;
				directions[5].counter += 1;
			} else if (results[i].moves[1] == "right") {
				directions[6].score += results[i].score;
				directions[6].counter += 1;
			} else if (results[i].moves[1] == "down") {
				directions[7].score += results[i].score;
				directions[7].counter += 1;
			}
		} else if (results[i].moves[0] == "right") {
			if (results[i].moves[1] == "left") {
				directions[8].score += results[i].score;
				directions[8].counter += 1;
			} else if (results[i].moves[1] == "up") {
				directions[9].score += results[i].score;
				directions[9].counter += 1;
			} else if (results[i].moves[1] == "right") {
				directions[10].score += results[i].score;
				directions[10].counter += 1;
			} else if (results[i].moves[1] == "down") {
				directions[11].score += results[i].score;
				directions[11].counter += 1;
			}
		} else if (results[i].moves[0] == "down") {
			if (results[i].moves[1] == "left") {
				directions[12].score += results[i].score;
				directions[12].counter += 1;
			} else if (results[i].moves[1] == "up") {
				directions[13].score += results[i].score;
				directions[13].counter += 1;
			} else if (results[i].moves[1] == "right") {
				directions[14].score += results[i].score;
				directions[14].counter += 1;
			} else if (results[i].moves[1] == "down") {
				directions[15].score += results[i].score;
				directions[15].counter += 1;
			}
		}
	}

	for (var i = 0; i < 16; i++) {
		directions[i].average = directions[i].score/directions[i].counter;
	}

	var maxIndex = undefined;
	var maxAverage = -1;
	for (var i = 0; i < 16; i++) {
		if (directions[i].average > maxAverage) {
			maxAverage = directions[i].average;
			maxIndex = i;
		}
	}

	//console.log(maxIndex + " " + Math.floor(maxIndex/4))
	switch (Math.floor((maxIndex || 0)/4)) {
	    case 0: // Left
	      move = "left"
	    break;
	    case 1: // Up
	      move = "up"
	    break;
	    case 2: // Right
	      move = "right"
	    break;
	    case 3: // Down
	      move = "down"
	    break;
	}
	return move;
}

function indexOfSmallest(a) {
 	var lowest = 0;
 	for (var i = 1; i < a.length; i++) {
  		if (a[i] < a[lowest]) lowest = i;
 	}
 	return lowest;
}


function calculateFitness() {
	var sum = 0;
	for (var organism of saved) {
		sum += organism.score;
	}

	for (var organism of saved) {
		organism.fitness = organism.score / sum;
	}
}

function pickTop(Mutation, index) {
	var top = [];
	var topScores = [];
	var savedScores = [];

	for (var i = 0; i < saved.length; i++) {
		savedScores.push(saved[i].score);
	}

	// Get the top ten scores
	for (var i = 0; i < saved.length; i++) {
		if (top.length < 10) {
			top.push(saved[i]);
			topScores.push(saved[i].score);
		} else {
			var smallestIndex = indexOfSmallest(topScores);
			if (saved[i].score > topScores[smallestIndex]) {
				topScores[smallestIndex] = saved[i].score;
			}
		}
	}

	// Get the top ten brains
	for (var i = 0; i < brains.length; i++) {
		for (var j = 0; j < topScores.length; j++) {
			if (brains[i].score === topScores[j].score) {
				top.push(brains[i]);
			}
		}
	}

	 var random = Math.floor(Math.random() * top.length-1);
	 var organism = top[random];

	 var child;

	if (organism) {
		child = new Mutation(index, organism.network);
	} else {
		child = new Mutation(index);
	}
	child.mutate();
	return child;
}

function pickOne(Mutation, i) {
	var index = 0;
	var r = Math.random() * 1;

	while (r > 0) {
		if (index >= population) {
			break;
		} else if (saved[index]) {
			r -= saved[index].fitness;
		}
		index++;
	}

	index--;

	var organism = saved[index];
	var child = new Mutation(i, organism.network);
	child.mutate();
	return child;
}
