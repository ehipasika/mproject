///<reference path="../examples/screenplaneintersection.ts"/>

class EasingToMouse extends Easing {

	private _eventMouseMove;

	protected createListerners() {
		document.getElementById("mycanvas").addEventListener("mousemove", this._eventMouseMove = (event) => { this.onMouseMove(event); });
	}

	protected onMouseMove(event) {
		this.calcIntersection(event.clientX, event.clientY);
	}

}