///<reference path="../examples/screenplaneintersection.ts"/>

class Easing extends ScreenPlaneIntersection {

	private _targetPos: osg.Vec3 = null;

	create() {
		super.create();

		this.addUpdateCallback(new UpdateCallback((node, nodeVisitor) => {
			return this.update();
		}));
	}

	protected updateTargetPosition(pos: osg.Vec3) {
		this._targetPos = pos;
	}
	
	protected update() : boolean {

		// apply easing
		if (this._targetPos) {

			// get current position of sphere
			var m: osg.Matrix = this._sphere.getMatrix();
			var curPos: osg.Vec3 = osg.Vec3.create();
			osg.Matrix.getTrans(m, curPos);

			// calc delta vector from sphere to target
			var v: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(this._targetPos, curPos, v);

			// calc new position
			var ease = 0.1;
			osg.Vec3.mult(v, ease, v);
			osg.Vec3.add(curPos, v, v);

			// update sphere position
			osg.Matrix.setTrans(m, v[0], v[1], v[2]);
		}

		return true;
	}

}