function Stack() {
	this.stac = new Array();

	this.pop = function() {
		return this.stac.pop();
	}

	this.push = function() {
		return this.stac.push();
	}
}