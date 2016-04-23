class PointTo extends Easing {

	private _eventMouseMove;
	private _cuboids: EntityCuboid[] = [];
	private _mapPos = [
		{ x: 0, y: 0 },
		{ x: -6, y: 0 },
		{ x: 6, y: 0 }
	];
	
	protected createListerners() {
		document.getElementById("mycanvas").addEventListener("mousemove", this._eventMouseMove = (event) => { this.onMouseMove(event); });
	}

	create() {
		super.create();

		for (var i = 0; i <this._mapPos.length; i++) {
			var cuboid = new EntityCuboid({
				sy: 4,
				create: true
			});
			cuboid.setPivotY(2);
			cuboid.setPositionXY( this._mapPos[i].x, this._mapPos[i].y );
			this.pivot().addChild(cuboid);
			this._cuboids.push(cuboid);
		}

		this.addUpdateCallback(new UpdateCallback((node, nodeVisitor) => {
			this.update();
		}));
	}

	protected onMouseMove(event) {
		this.calcIntersection(event.clientX, event.clientY);
	}

	protected update() {
		super.update();

		for (var i = 0; i < this._mapPos.length; i++) {
			var cuboid: EntityCuboid = this._cuboids[i];

			// calc (from) vector
			var from: osg.Vec3 = osg.Vec3.createAndSet(0, 1, 0);

			// calc (to) vector
			var to: osg.Vec3 = this._sphere.position();
			var pos: osg.Vec3 = cuboid.position();
			osg.Vec3.sub(to, pos, to);
			osg.Vec3.normalize(to, to);

			// calc rotation needed
			var rot: osg.Quat = osg.Quat.create();
			osg.Quat.makeRotateFromTo(from, to, rot);

			// rotate cuboid
			cuboid.setRotationFromQuat(rot);
		}
	}

}