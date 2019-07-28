var Vector = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype.getMag = function () {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vector.prototype.setMag = function (magnitude) {
	var direction = this.getDir();
	this.x = Math.cos(direction) * magnitude;
	this.y = Math.sin(direction) * magnitude;
}

Vector.prototype.getDir = function () {
  return Math.atan2(this.y, this.x);
}

Vector.prototype.add = function (a, b) {
	if (b) {
    return new Vector(a.x + b.x, a.y + b.y);
  } else {
    this.x = this.x + a.x;
	  this.y = this.y -+ a.y
  }
}

Vector.prototype.sub = function (a, b) {
  if (b) {
    return new Vector(a.x - b.x, a.y - b.y);
  } else {
    this.x = this.x - a.x;
	  this.y = this.y - a.y
  }
}

Vector.prototype.mult = function (scalar) {
	this.x = this.x * scalar;
	this.y = this.y * scalar;
}

Vector.prototype.div = function (scalar) {
	this.x = this.x / scalar;
	this.y = this.y / scalar;
}

Vector.prototype.getDot = function (b) {
	return this.x * b.x + this.y * b.y;
}

Vector.prototype.dist = function (a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

Vector.prototype.normalize = function () {
	if (this.getMag() != 0) {
		this.div(this.getMag());
	}
}

Vector.prototype.limit = function (max) {
	if (this.getMag() > max) {
		this.normalize();
		this.mult(max);
	}
}

Vector.prototype.copy = function () {
	return new Vector(this.x, this.y);
}