class VerletStickIntegration extends VerletParticleIntegration {

	private _sticks:VerletStick[] = [];

	create() {
		super.create();

		this.addStick(
			this.particle(0),
			this.particle(1)
		);
	}

	protected createParticles() {
		this.addParticle(
			osg.Vec3.createAndSet(0, 0, 4),
			osg.Vec3.createAndSet(0, 0, 3.9)
		);

		this.addParticle(
			/*
			osg.Vec3.createAndSet(5, 5, 5),
			osg.Vec3.createAndSet(4.9, 4.8, 4.7)
			*/

			
			osg.Vec3.createAndSet(4, 0, 5),
			osg.Vec3.createAndSet(4, 0, 4.7)
			
		);
	}

	protected addStick(p0: VerletParticle, p1: VerletParticle) {
		this._sticks.push(new VerletStick(
			p0, p1
		));
	}

	protected updateSticks() {

		for (var i = 0; i < this._sticks.length; i++) {
			var s: VerletStick = this._sticks[i];

			var dist: number = osg.Vec3.distance(s._p0._pos, s._p1._pos);
			var diff: number = s._dist - dist;

			var adjust_vec: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(s._p0._pos, s._p1._pos, adjust_vec);
			osg.Vec3.normalize(adjust_vec, adjust_vec);
			osg.Vec3.mult(adjust_vec, diff / 2, adjust_vec);

			osg.Vec3.add(s._p0._pos, adjust_vec, s._p0._pos);
			osg.Vec3.sub(s._p1._pos, adjust_vec, s._p1._pos);
		}
	}

	protected update() {
		this.updateParticles();
		this.updateSticks();
		this.constrainParticles();
		this.updateRender();
	}


}