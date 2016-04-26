/// <reference path="verletparticleintegration.ts"/>

class VerletStickIntegration extends VerletParticleIntegration {

	private _sticks:VerletStick[] = [];

	create() {
		super.create();
		this.createSticks();
	}

	protected createParticles() {
		this.addParticle(
			osg.Vec3.createAndSet(3, 3, 3),
			osg.Vec3.createAndSet(3, 3, 3)
		);

		this.addParticle(
			osg.Vec3.createAndSet(5, 5, 5),
			osg.Vec3.createAndSet(4.9, 4.8, 4.7)
		);
	}

	protected createSticks() {
		this.addStick(
			this.particle(0),
			this.particle(1)
		);
	}

	protected addStickSimplified(particle_index0: number, particle_index1: number) {
		this.addStick(
			this.particle(particle_index0),
			this.particle(particle_index1)
		);
	}

	protected addStick(p0: VerletParticle, p1: VerletParticle) {
		var line: EntityLine = new EntityLine();
		line.create();
		this.pivot().addChild(line);
		
		this._sticks.push(new VerletStick(
			p0, p1, line
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

			if (!s._p0._pinned) {
				osg.Vec3.add(s._p0._pos, adjust_vec, s._p0._pos);
			}

			if (!s._p1._pinned) {
				osg.Vec3.sub(s._p1._pos, adjust_vec, s._p1._pos);
			}
		}
	}

	protected updateRender() {
		super.updateRender();

		// update rendered lines
		for (var i = 0; i < this._sticks.length; i++) {
			var s: VerletStick = this._sticks[i];
			s._line.setPosition(s._p0._pos, s._p1._pos);
		}
	}

	protected update() {
		this.updateParticles();

		// add some relaxation
		for (var i = 0; i < 3; i++) {
			this.updateSticks();
			this.updateConstrainParticles();
		}

		this.updateRender();

		return true;
	}


}
