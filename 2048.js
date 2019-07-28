// Initialize game

var gridSize = 4;
var tileSize = 60;

var numbers = [];
var saved = [];
var score = 0;
var currScore = 0;
var bestScore = 0;

// Genenetic Algorithm
var cycles = 1;
var score = 0;
var highScore = 0;
var generation = 1; 

var population = 100;
var latest;
var generationHighest;
var highest;

var generationAverage = 0;
var dataLimit = 1000;

// The Brain
class Brain {
  constructor(index, numbers) {
    this.network = new NeuralNetwork(gridSize*gridSize, 4, 4);

    this.alive = true;
    this.index = index;
    this.score = 0;
    this.fitness = 0;

    this.numbers = numbers;
    this.previousNumbers = [];
    this.moves = [];
  }

  think(data, index) {
    while (this.alive) {
      // Neural network
      /*var inputs = []
      for (var i = 0; i < data.length; i++) {
        inputs.push(data[i] || 0);
      }

      var outputs = this.network.feedForward(inputs)

      var directionIndex = indexOfMax(outputs);*/

      // Pure randomness
      var directionIndex = Math.floor(Math.random() * 4);
      var direction = undefined;
      switch (directionIndex) {
        case 0: // Left
          direction = "left"
        break;
        case 1: // Up
          direction = "up"
        break;
        case 2: // Right
          direction = "right"
        break;
        case 3: // Down
          direction = "down"
        break;
      }

      this.moves.push(direction)
      this.updateGame(direction);
    }
  }

  mutate() {
    this.network.mutate(0.01);
  }

  updateGame(key) {
    var addScore = 0;
    // Save previous tiles
    for (var x = 0; x < gridSize; x++) {
      this.previousNumbers[x] = [];
      for (var y = 0; y < gridSize; y++) {
        this.previousNumbers[x][y] = {value: this.numbers[x][y].value};
      }
    }
    // Move this.numbers
    if (key === "left") {
      // Move all to left
      for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
          for (var i = x; i >= 0; i--) {
            if (i > 0/* && this.numbers[x][y].value*/) {
              if (!this.numbers[i-1][y].value) {
                this.numbers[i-1][y].value = this.numbers[i][y].value;
                this.numbers[i][y].value = undefined;
              }
            }
          }
        }
      }
      // Merge this.numbers if possible to left
      for (var y = 0; y < gridSize; y++) {
        var prevNumber = undefined;
        for (var x = 0; x < gridSize; x++) {
          if (x === 0) {
            prevNumber = this.numbers[x][y].value;
          } else if (this.numbers[x][y].value && prevNumber === this.numbers[x][y].value) {
            this.numbers[x-1][y].value = prevNumber * 2;
            addScore += prevNumber*2;
            this.numbers[x][y].value = undefined;
            prevNumber = undefined;
          } else {
            prevNumber = this.numbers[x][y].value;
          }
        }
      }
      // Move merged this.numbers to left
      for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
          for (var i = x; i >= 0; i--) {
            if (i > 0/* && this.numbers[x][y].value*/) {
              if (!this.numbers[i-1][y].value) {
                this.numbers[i-1][y].value = this.numbers[i][y].value;
                this.numbers[i][y].value = undefined;
              }
            }
          }
        }
      }
    } else if (key === "right") {
      // Move all to right
      for (var y = gridSize-1; y >= 0; y--) {
        for (var x = gridSize-1; x >= 0; x--) {
          // unefficient
          for (var i = x; i <= gridSize-1; i++) {
            if (i < gridSize-1/* && this.numbers[x][y].value*/) {
              if (!this.numbers[i+1][y].value) {
                this.numbers[i+1][y].value = this.numbers[i][y].value;
                this.numbers[i][y].value = undefined;
              }
            }
          }
        }
      }
      // Merge this.numbers if possible to right
      for (var y = 0; y < gridSize; y++) {
        var prevNumber = undefined;
        for (var x = gridSize-1; x >= 0; x--) {
          if (x === gridSize-1) {
            prevNumber = this.numbers[x][y].value;
          } else if (this.numbers[x][y].value && prevNumber === this.numbers[x][y].value) {
            this.numbers[x+1][y].value = prevNumber * 2;
            addScore += prevNumber*2;
            this.numbers[x][y].value = undefined;
            prevNumber = undefined;
          } else {
            prevNumber = this.numbers[x][y].value;
          }
        }
      }
      // Move merged this.numbers to right
      for (var y = gridSize-1; y >= 0; y--) {
        for (var x = gridSize-1; x >= 0; x--) {
          for (var i = x; i <= gridSize-1; i++) {
            if (i < gridSize-1/* && this.numbers[x][y].value*/) {
              if (!this.numbers[i+1][y].value) {
                this.numbers[i+1][y].value = this.numbers[i][y].value;
                this.numbers[i][y].value = undefined;
              }
            }
          }
        }
      }
    } else if (key === "up") {
      // Move all to top
      for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
          for (var i = y; i >= 0; i--) {
            if (i > 0/* && this.numbers[x][y].value*/) {
              if (!this.numbers[x][i-1].value) {
                this.numbers[x][i-1].value = this.numbers[x][i].value;
                this.numbers[x][i].value = undefined;
              }
            }
          }
        }
      }
      // Merge this.numbers if possible to top
      for (var x = 0; x < gridSize; x++) {
        var prevNumber = undefined;
        for (var y = 0; y < gridSize; y++) {
          if (y === 0) {
            prevNumber = this.numbers[x][y].value;
          } else if (this.numbers[x][y].value && prevNumber === this.numbers[x][y].value) {
            this.numbers[x][y-1].value = prevNumber * 2;
            addScore += prevNumber*2;
            this.numbers[x][y].value = undefined;
            prevNumber = undefined;
          } else {
            prevNumber = this.numbers[x][y].value;
          }
        }
      }
      // Move merged this.numbers to top
      for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
          for (var i = y; i >= 0; i--) {
            if (i > 0/* && this.numbers[x][y].value*/) {
              if (!this.numbers[x][i-1].value) {
                this.numbers[x][i-1].value = this.numbers[x][i].value;
                this.numbers[x][i].value = undefined;
              }
            }
          }
        }
      }
    } else if (key === "down") {
      // Move all to bottom
      for (var x = gridSize-1; x >= 0; x--) {
        for (var y = gridSize-1; y >= 0; y--) {
          for (var i = y; i <= gridSize-1; i++) {
            if (i < gridSize-1/* && this.numbers[x][y].value*/) {
              if (!this.numbers[x][i+1].value) {
                this.numbers[x][i+1].value = this.numbers[x][i].value;
                this.numbers[x][i].value = undefined;
              }
            }
          }
        }
      }
      // Merge this.numbers if possible to bottom
      for (var x = 0; x < gridSize; x++) {
        var prevNumber = undefined;
        for (var y = gridSize-1; y >= 0; y--) {
          if (y === gridSize-1) {
            prevNumber = this.numbers[x][y].value;
          } else if (this.numbers[x][y].value && prevNumber === this.numbers[x][y].value) {
            this.numbers[x][y+1].value = prevNumber * 2;
            addScore += prevNumber*2;
            this.numbers[x][y].value = undefined;
            prevNumber = undefined;
          } else {
            prevNumber = this.numbers[x][y].value;
          }
        }
      }
      // Move to bottom
      for (var x = gridSize-1; x >= 0; x--) {
        for (var y = gridSize-1; y >= 0; y--) {
          for (var i = y; i <= gridSize-1; i++) {
            if (i < gridSize-1/* && this.numbers[x][y].value*/) {
              if (!this.numbers[x][i+1].value) {
                this.numbers[x][i+1].value = this.numbers[x][i].value;
                this.numbers[x][i].value = undefined;
              }
            }
          }
        }
      }
    }

    if (!this.gridFull() && !arraysIdentical(this.previousNumbers, this.numbers)) {
      newNumber(this.numbers);
    } else if (!moveAvailable(this.numbers) && arraysIdentical(this.previousNumbers, this.numbers)) {
      saved.push(brains[this.index])
      this.alive = false;
    }

    // Change score
    this.score += addScore;
  }

  gridFull() {
    var full = true;
    for (var y = 0; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        if (!this.numbers[x][y].value) {
          full = false;
        }
      }
    }
    return full;
  }

  draw(score) {
    $("div").remove('.tileBox');
    brainIndex = this.index;
    if (score) {console.log(this.score)}

    // Draw numbers
    for (var y = 0; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        if (this.numbers[x][y].value) {
          var t = this.numbers[x][y].value;
          var color;
          if (t === 2) {
            color = "#fff2dd";
          } else if (t === 4) {
            color = "#ffe4ba";
          } else if (t === 8) {
            color = "#ffb138";
          } else if (t === 16) {
            color = "#ff9b00";
          } else if (t === 32) {
            color = "#ff5537";
          } else if (t === 64) {
            color = "#ef2300";
          } else if (t === 128) {
            color = "#fff76b";
          } else if (t === 256) {
            color = "#fff53f";
          } else if (t === 512) {
            color = "#fff323";
          } else if (t === 1024) {
            color = "#fff20a";
          } else if (t === 2048) {
            color = "#fff100";
          }
          var tile = $('<div class="tileBox" style="background-color: ' + color + '; left: ' + (x * tileSize) + 'px; top: ' + (y * tileSize) + 'px; width: ' + tileSize + 'px; height: ' + tileSize + 'px; line-height: ' + tileSize + 'px;">' + this.numbers[x][y].value + '</div>')
          tile.appendTo("#container");
        }
      }
    }
  }

  spit() {
    for (var y = 0; y < gridSize; y++) {
      var string = "";
      for (var x = 0; x < gridSize; x++) {
        string += (this.numbers[x][y].value || 0) + " ";
      }
      console.log(string);
    }
  }
}

// Setup the html
$("#container").width(gridSize * tileSize);
$("#container").height(gridSize * tileSize);
//$("#container").css({"line-height": gridSize*40})


// Initialize the grid
for (var y = 0; y < gridSize; y++) {
  numbers.push([]);
  for (var x = 0; x < gridSize; x++) {
    var grid = $('<div id="gridBox" style="left: ' + (x * tileSize) + 'px; top: ' + (y * tileSize) + 'px; width: ' + tileSize + 'px; height: ' + tileSize + 'px; line-height: ' + tileSize + 'px;"></div>')
    grid.appendTo('#container');
    numbers[y].push({
      value: undefined
    });
  }
}
newNumber(numbers);
newNumber(numbers);

var previousNumbers = [];

function updateGame(key) {
  var addScore = 0;
  // Save previous tiles
  for (var x = 0; x < gridSize; x++) {
    previousNumbers[x] = [];
    for (var y = 0; y < gridSize; y++) {
      previousNumbers[x][y] = {value: numbers[x][y].value};
    }
  }
  // Move numbers
  if (key === "left") {
    // Move all to left
    for (var y = 0; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        for (var i = x; i >= 0; i--) {
          if (i > 0/* && numbers[x][y].value*/) {
            if (!numbers[i-1][y].value) {
              numbers[i-1][y].value = numbers[i][y].value;
              numbers[i][y].value = undefined;
            }
          }
        }
      }
    }
    // Merge numbers if possible to left
    for (var y = 0; y < gridSize; y++) {
      var prevNumber = undefined;
      for (var x = 0; x < gridSize; x++) {
        if (x === 0) {
          prevNumber = numbers[x][y].value;
        } else if (numbers[x][y].value && prevNumber === numbers[x][y].value) {
          numbers[x-1][y].value = prevNumber * 2;
          addScore += prevNumber*2;
          numbers[x][y].value = undefined;
          prevNumber = undefined;
        } else {
          prevNumber = numbers[x][y].value;
        }
      }
    }
    // Move merged numbers to left
    for (var y = 0; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        for (var i = x; i >= 0; i--) {
          if (i > 0/* && numbers[x][y].value*/) {
            if (!numbers[i-1][y].value) {
              numbers[i-1][y].value = numbers[i][y].value;
              numbers[i][y].value = undefined;
            }
          }
        }
      }
    }
  } else if (key === "right") {
    // Move all to right
    for (var y = gridSize-1; y >= 0; y--) {
      for (var x = gridSize-1; x >= 0; x--) {
        // unefficient
        for (var i = x; i <= gridSize-1; i++) {
          if (i < gridSize-1/* && numbers[x][y].value*/) {
            if (!numbers[i+1][y].value) {
              numbers[i+1][y].value = numbers[i][y].value;
              numbers[i][y].value = undefined;
            }
          }
        }
      }
    }
    // Merge numbers if possible to right
    for (var y = 0; y < gridSize; y++) {
      var prevNumber = undefined;
      for (var x = gridSize-1; x >= 0; x--) {
        if (x === gridSize-1) {
          prevNumber = numbers[x][y].value;
        } else if (numbers[x][y].value && prevNumber === numbers[x][y].value) {
          numbers[x+1][y].value = prevNumber * 2;
          addScore += prevNumber*2;
          numbers[x][y].value = undefined;
          prevNumber = undefined;
        } else {
          prevNumber = numbers[x][y].value;
        }
      }
    }
    // Move merged numbers to right
    for (var y = gridSize-1; y >= 0; y--) {
      for (var x = gridSize-1; x >= 0; x--) {
        for (var i = x; i <= gridSize-1; i++) {
          if (i < gridSize-1/* && numbers[x][y].value*/) {
            if (!numbers[i+1][y].value) {
              numbers[i+1][y].value = numbers[i][y].value;
              numbers[i][y].value = undefined;
            }
          }
        }
      }
    }
  } else if (key === "up") {
    // Move all to top
    for (var x = 0; x < gridSize; x++) {
      for (var y = 0; y < gridSize; y++) {
        for (var i = y; i >= 0; i--) {
          if (i > 0/* && numbers[x][y].value*/) {
            if (!numbers[x][i-1].value) {
              numbers[x][i-1].value = numbers[x][i].value;
              numbers[x][i].value = undefined;
            }
          }
        }
      }
    }
    // Merge numbers if possible to top
    for (var x = 0; x < gridSize; x++) {
      var prevNumber = undefined;
      for (var y = 0; y < gridSize; y++) {
        if (y === 0) {
          prevNumber = numbers[x][y].value;
        } else if (numbers[x][y].value && prevNumber === numbers[x][y].value) {
          numbers[x][y-1].value = prevNumber * 2;
          addScore += prevNumber*2;
          numbers[x][y].value = undefined;
          prevNumber = undefined;
        } else {
          prevNumber = numbers[x][y].value;
        }
      }
    }
    // Move merged numbers to top
    for (var x = 0; x < gridSize; x++) {
      for (var y = 0; y < gridSize; y++) {
        for (var i = y; i >= 0; i--) {
          if (i > 0/* && numbers[x][y].value*/) {
            if (!numbers[x][i-1].value) {
              numbers[x][i-1].value = numbers[x][i].value;
              numbers[x][i].value = undefined;
            }
          }
        }
      }
    }
  } else if (key === "down") {
    // Move all to bottom
    for (var x = gridSize-1; x >= 0; x--) {
      for (var y = gridSize-1; y >= 0; y--) {
        for (var i = y; i <= gridSize-1; i++) {
          if (i < gridSize-1/* && numbers[x][y].value*/) {
            if (!numbers[x][i+1].value) {
              numbers[x][i+1].value = numbers[x][i].value;
              numbers[x][i].value = undefined;
            }
          }
        }
      }
    }
    // Merge numbers if possible to bottom
    for (var x = 0; x < gridSize; x++) {
      var prevNumber = undefined;
      for (var y = gridSize-1; y >= 0; y--) {
        if (y === gridSize-1) {
          prevNumber = numbers[x][y].value;
        } else if (numbers[x][y].value && prevNumber === numbers[x][y].value) {
          numbers[x][y+1].value = prevNumber * 2;
          addScore += prevNumber*2;
          numbers[x][y].value = undefined;
          prevNumber = undefined;
        } else {
          prevNumber = numbers[x][y].value;
        }
      }
    }
    // Move to bottom
    for (var x = gridSize-1; x >= 0; x--) {
      for (var y = gridSize-1; y >= 0; y--) {
        for (var i = y; i <= gridSize-1; i++) {
          if (i < gridSize-1/* && numbers[x][y].value*/) {
            if (!numbers[x][i+1].value) {
              numbers[x][i+1].value = numbers[x][i].value;
              numbers[x][i].value = undefined;
            }
          }
        }
      }
    }
  }
  if (!gridFull() && !arraysIdentical(previousNumbers, numbers)) {
    newNumber(numbers);
  } else if (!moveAvailable(numbers)&&arraysIdentical(previousNumbers, numbers)) {
    gameOver();
  }

  // Change score
  score = score + addScore;
  $("#score").text("Score: " + score);
}

// Choose a new number to spawn
function newNumber(numbers) {
  var chosen = false;

  while (!chosen) {
    var randomX = Math.floor(Math.random() * gridSize);
    var randomY = Math.floor(Math.random() * gridSize);
    var randomValue = Math.floor(Math.random() * 4);

    if (!numbers[randomX][randomY].value) {
      if (randomValue > 0) {
        numbers[randomX][randomY].value = 2;
      } else {
        numbers[randomX][randomY].value = 4;
      }
      chosen = true;
    }
  } 
}

function gridFull() {
  var full = true;
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      if (!numbers[x][y].value) {
        full = false;
      }
    }
  }
  return full;
}

// Clear the whole grid
function clearGrid() {
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      numbers[x][y].value = undefined;
    }
  }
  draw(numbers);
}

// Print the grid to console
function spit() {
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      console.log(numbers[x][y].value);
    }
  }
}

// Check if the grid is moveable
function moveAvailable(numbers) {
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      var itself = numbers[x][y].value;
      if (x-1 != -1 && numbers[x-1][y].value === itself) {
        return true;
      } else if (x+1 != gridSize && numbers[x+1][y] === itself) {
        return true;
      } else if (y-1 != -1 && numbers[x][y-1] === itself) {
        return true;
      } else if (y+1 != gridSize && numbers[x][y+1] === itself) {
        return true;
      } else {
        return false;
      }
    }
  }
}

// Check if arrays are the same
function arraysIdentical(a, b) {
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      if (a[x][y].value !== b[x][y].value) {
        return false;
      }
    }
  }
  return true;
};

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
        max = arr[i];
    }
  }

  return maxIndex;
}

// Convert array to object
function convertArrayToObject(array) {
  var object = {}
  for (var x = 0; x < gridSize; x++) {
    object[x] = {};
    for (var y = 0; y < gridSize; y++) {
      if (array[x][y].value) {
        object[x][y] = array[x][y].value;
      } else {
        object[x][y] = "undefined"
      }
    }
  }
  return object;
}

function convertObjectToArray(object) {
  var array = [];
  for (var x = 0; x < gridSize; x++) {
    array[x] = [];
    for (var y = 0; y < gridSize; y++) {
      if (object[x][y] === "undefined") {
        array[x][y] = {
          value: undefined
        }
      } else {
        array[x][y] = {
          value: object[x][y]
        }
      }
    }
  }
  return array;
}

function gameOver() {
  done = true;
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      numbers[x][y].value = undefined;
    }
  }
  newNumber(numbers);
  newNumber(numbers);
  if (score > bestScore) {
    bestScore = score;
    $("#bestScore").text("Best: " + bestScore);
  }
  
  score = 0;

  console.log("Game Over")
}

function draw(numbers) {
  $("div").remove('.tileBox');

  // Draw numbers
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      if (numbers[x][y].value) {
        var t = numbers[x][y].value;
        var color;
        if (t === 2) {
          color = "#fff2dd";
        } else if (t === 4) {
          color = "#ffe4ba";
        } else if (t === 8) {
          color = "#ffb138";
        } else if (t === 16) {
          color = "#ff9b00";
        } else if (t === 32) {
          color = "#ff5537";
        } else if (t === 64) {
          color = "#ef2300";
        } else if (t === 128) {
          color = "#fff76b";
        } else if (t === 256) {
          color = "#fff53f";
        } else if (t === 512) {
          color = "#fff323";
        } else if (t === 1024) {
          color = "#fff20a";
        } else if (t === 2048) {
          color = "#fff100";
        }
        var tile = $('<div class="tileBox" style="background-color: ' + color + '; left: ' + (x * tileSize) + 'px; top: ' + (y * tileSize) + 'px; width: ' + tileSize + 'px; height: ' + tileSize + 'px; line-height: ' + tileSize + 'px;">' + numbers[x][y].value + '</div>')
        tile.appendTo("#container");
      }
    }
  }
}

// Detect keypress

$(document).keydown(function (event) {
  var keyPressed = undefined;
  if (event.keyCode === 37) {
    keyPressed = "left";
  } else if (event.keyCode === 38) {
    keyPressed = "up";
  } else if (event.keyCode === 39) {
    keyPressed = "right";
  } else if (event.keyCode === 40) {
    keyPressed = "down";
  }
  //updateGame(keyPressed);
})

// New Game

$("#newGame").click(function () {
  /*clearGrid();
  initGame();
  score = 0;
  currScore = 0;
  $("#score").text("Score: 0");*/
})