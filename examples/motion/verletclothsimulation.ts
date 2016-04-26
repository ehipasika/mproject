/// <reference path="verletstickintegration.ts" />

class VerletClothSimulation extends VerletStickIntegration {

	private _numX: number = 7;
	private _numY: number = 5;
	private _em: EasingToMouse;

	constructor() {
		super({
			radius: 0.1
		});
	}

	create() {
		super.create();
		this._em = new EasingToMouse(false);
		this._em.create();
		this.pivot().addChild(this._em);
	}

	protected createParticles() {

		// center our cloth
		var x_ofs: number = -(this._numX-1) / 2;

		for (var y = 0; y <this._numY; y++) {
			for (var x = 0; x <this._numX; x++) {
				var p: VerletParticle = this.AddParticleSimplified(x + x_ofs, 0, 3-y);

				// pin top corners
				if (y == 0 && (x == 0 || x == this._numX - 1)) {
					p.setPinned(true);
				}
			}
		}
	}

	protected createSticks() {
		// horizontal sticks
		for (var y: number = 0; y < this._numY; y++) {
			for (var x: number = 0; x < this._numX - 1; x++) {

				var i0: number = x + this._numX * y;
				var i1: number = i0 + 1;
				this.addStickSimplified(i0, i1);
			}
		}

		// vertical sticks
		for (var y: number = 0; y < this._numY-1; y++) {
			for (var x: number = 0; x < this._numX; x++) {

				var i0: number = x + this._numX * y;
				var i1: number = x + this._numX * (y + 1);
				this.addStickSimplified(i0,i1);
			}
		}
	}

	protected constrainParticles(particles: VerletParticle[]) {
		// we do not call super constrainParticles because it only checks if the cloth hits the walls (we ignore this right now)

		var vec: osg.Vec3 = osg.Vec3.create();
		var spherePos = this._em.spherePosition();

		// check collision against sphere
		for (var i = 0; i < particles.length; i++) {
			var p: VerletParticle = particles[i];

			// calc velocity based on previous position
			var vel: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(p._pos, p._pos_old, vel);
			//osg.Vec3.mult(vel, this._friction_coeficient, vel);	// friction (FIXME)

			var dist: number = osg.Vec3.distance(spherePos, p._pos);	
			if (dist < 1) {
				osg.Vec3.sub(spherePos, p._pos, vec);
				osg.Vec3.normalize(vec, vec);
				osg.Vec3.mult(vec, 1 - dist, vec);
				osg.Vec3.sub(p._pos, vec, p._pos);
				osg.Vec3.add(p._pos_old, vec, p._pos_old);
			}

		}
	}

	// FIXME: this should be a parameter controller update in the stick integrator
	protected update() {
		this.updateParticles();

		// add some relaxation
		for (var i = 0; i < 1; i++) {
			this.updateSticks();
			this.updateConstrainParticles();
		}

		this.updateRender();

		return true;
	}

}