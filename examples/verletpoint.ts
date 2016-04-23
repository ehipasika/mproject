class VerletPoint extends EntityNode {

	private _grid: EntityGrid = null;
	private _cube: EntityCube = null;
	private _cubeLen: number = 10;
	private _sphereradius: number = 0.5;
	private _bounce_friction_coefficient = 0.9;
	private _friction_coeficient = 0.99;
	private _gravity: number = -0.05;

	private _points = [
		{
			pos: osg.Vec3.createAndSet(5, 5, 5),
			pos_old: osg.Vec3.createAndSet(4.9, 4.8, 4.7),

			/*
			pos: osg.Vec3.createAndSet(0, 0, 5),
			pos_old: osg.Vec3.createAndSet(0, 0, 4.7),
			*/

			sphere: null
		}
	];

	create() {
		this._grid = new EntityGrid({
			position: osg.Vec3.createAndSet(0, 0, -this._cubeLen / 2)
		});
		this._grid.create();
		this.pivot().addChild(this._grid);

		this._cube = new EntityCube({
			len: this._cubeLen,
			inverse_normals: true
		});
		this._cube.create();
			this.pivot().addChild(this._cube);

		osg.Matrix.preMultScale(this._cube.getMatrix(), osg.Vec3.createAndSet(-1, -1, -1));

		this._cube.dirtyBound();

		// create points
		for (var i = 0; i < this._points.length; i++) {
			var point: any = this._points[i];

			var sphere: EntitySphere = new EntitySphere({
				radius: this._sphereradius
			});
			sphere.create();
			this.pivot().addChild(sphere);
			point.sphere = sphere;
		}

		this.addUpdateCallback(new UpdateCallback((node, nodeVisitor) => {
			this.update();
		}));
	}

	protected update() {

		// update points - verlet
		for (var i = 0; i < this._points.length; i++) {
			var p = this._points[i];

			// calc velocity based on previous position
			var vel: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(p.pos, p.pos_old, vel);
			osg.Vec3.mult(vel, this._friction_coeficient, vel);	// friction

			// save the current position as old position
			osg.Vec3.copy(p.pos, p.pos_old);

			// add velocity to current position
			osg.Vec3.add(p.pos, vel, p.pos);
			p.pos[2] += this._gravity;

			// check for collision and adjust
			var c: number = (this._cubeLen / 2) - this._sphereradius;

			if (p.pos[0] > c) {	// reflect x at boundry right
				p.pos[0] = c;		
				p.pos_old[0] = p.pos[0] + vel[0] * this._bounce_friction_coefficient;
			}

			if (p.pos[0] < -c) { // reflect x at boundry left
				p.pos[0] = -c;	
				p.pos_old[0] = p.pos[0] + vel[0] * this._bounce_friction_coefficient;
			}

			if (p.pos[1] > c) {	// reflect y at boundry back
				p.pos[1] = c - (p.pos[1] - c);	
				p.pos_old[1] = p.pos[1] + vel[1] * this._bounce_friction_coefficient;
			}

			if (p.pos[1] < -c) { // reflect y at boundry front
				p.pos[1] = -c;			
				p.pos_old[1] = p.pos[1] + vel[1] * this._bounce_friction_coefficient;
			}
			
			if (p.pos[2] > c) {	// reflect z at boundry top
				p.pos[2] = c					
				p.pos_old[2] = p.pos[2] + vel[2] * this._bounce_friction_coefficient;
			}

			if (p.pos[2] < -c) { // reflect z at boundry bottom
				p.pos[2] = -c;
				p.pos_old[2] = p.pos[2] + vel[2] * this._bounce_friction_coefficient;
			}

			// update sphere
			p.sphere.setPositionFromVec3(p.pos);
		}

	}
}


