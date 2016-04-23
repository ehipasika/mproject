/// <reference path="../osgjs.d.ts" />

// https://groups.google.com/forum/#!forum/osgjs


class test extends osgViewer.Viewer {
	public run() {
       this.render();
	}

	private render() {

		if (!this.done()) {

			if (this._useVR)
				this._requestID = this._hmd.requestAnimationFrame(this.render);
			else
				this._requestID = window.requestAnimationFrame( () => this.render() );
		
			this.frame();

			if (this._useVR)
				this._hmd.submitFrame(this._eventProxy.WebVR._lastPose);
		}
	};
}

class zSystem {

	private _viewer: osgViewer.Viewer = null;
	private _canvas: HTMLCanvasElement = null;

	constructor() {
		//this.createRender();
		this._canvas = <HTMLCanvasElement>document.getElementById("mycanvas");
		this._viewer = this.createViewer(this._canvas);
	}

	canvas(): HTMLCanvasElement {
		return this._canvas;
	}

	viewer(): osgViewer.Viewer {
		return this._viewer;
	}
	
	createViewer(canvas: HTMLCanvasElement) {
		var viewer = new test(canvas);
		viewer.init();
		viewer.setupManipulator();
		viewer.run();
		return viewer;
	}
}