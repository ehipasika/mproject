class ScreenPlaneIntersection extends EntityNode {

	private _grid: EntityGrid = null;
	private _plane: osg.Plane = null;
	private _eventMouseDown;
	protected _sphere: EntitySphere = null;

	create() {
		this._plane = osg.Plane.createAndSet(0,0,1,0);
		
		this._grid = new EntityGrid;
		this._grid.create();
		this.pivot().addChild(this._grid);

		this._sphere = new EntitySphere;
		this._sphere.create();
		this.pivot().addChild(this._sphere);

		this.createListerners();
	}

	protected createListerners() {
		document.getElementById("mycanvas").addEventListener("mousedown", this._eventMouseDown = (event) => { this.onMouseDown(event); });
	}

	protected onMouseDown(event) {
		this.calcIntersection(event.clientX, event.clientY);
	}

	protected calcIntersection(mouse_x: number, mouse_y: number) {
		// normalize mouse into screen space
		var canvas = document.getElementById("mycanvas");
		var normalizedMouseCoord: osg.Vec2 = zCanvas.pointToView(mouse_x, mouse_y, canvas);
		var x: number = normalizedMouseCoord[0];
		var y: number = normalizedMouseCoord[1];

		// create two points for line segment in view frustum
		var cam: osg.Camera = sys.viewer().getCamera();
		var nearPoint: osg.Vec3 = osg.Vec3.create();
		var farPoint: osg.Vec3 = osg.Vec3.create();
		zFrustum.calcNearFarPoints(cam, x, y, nearPoint, farPoint);

		// find point on line seqment that intersects on plane
		var intersect: osg.Vec3 = osg.Vec3.create();
		zIntersectPlane.lineSegment(nearPoint, farPoint, this._plane, intersect);

		// move sphere to line intersection
		this.updateTargetPosition(intersect);
	}

	protected updateTargetPosition( pos:osg.Vec3 ) {
		var m: osg.Matrix = this._sphere.getMatrix();
		osg.Matrix.setTrans(m, pos[0], pos[1], pos[2]);
	}

}