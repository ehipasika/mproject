/// <reference path="../easingtomouse.ts" />

// F = kX

class SpringPull extends EasingToMouse {

	private _sphereEnd: EntitySphere;
	private _line: EntityLine;
	private _k: number = 0.03;
	private _vel: osg.Vec3 = osg.Vec3.create();
	private _friction: number = 0.95;

	create() {
		super.create();

		this._sphereEnd = new EntitySphere;
		this._sphereEnd.create();
		this.pivot().addChild(this._sphereEnd);

		this._line = new EntityLine;
		this._line.create();
		this.pivot().addChild(this._line);
	}

	protected update(): boolean {
		super.update();

		var pos: osg.Vec3 = this._sphereEnd.position();

		this._line.setPosition(this._sphere.position(), pos);

		var F: osg.Vec3 = osg.Vec3.create();
		osg.Vec3.sub(this._sphere.position(), this._sphereEnd.position(), F);
		osg.Vec3.mult(F, this._k, F);

		osg.Vec3.add(this._vel, F, this._vel);
		osg.Vec3.mult(this._vel, this._friction, this._vel);

		osg.Vec3.add(pos, this._vel, pos);
		this._sphereEnd.setPositionFromVec3(pos);		

		return true;
	}

}