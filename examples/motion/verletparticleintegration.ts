﻿module Verlet {
	export interface ParamsParticleIntegration extends EntityNode.params {
		show_particle?: boolean;
		radius?: number;
	}
}

class VerletParticleIntegration extends EntityNode {

	private _grid: EntityGrid = null;
	private _cube: EntityCube = null;
	private _cubeLen: number = 10;
	private _sphereradius: number = 0.5;
	private _bounce_friction_coefficient = 0.9;
	private _friction_coeficient = 0.99;
	private _gravity: number = -0.02;
	private _particles: VerletParticle[] = [];

	constructor(params: Verlet.ParamsParticleIntegration = {}) {
		super(params);

		params.show_particle = params.show_particle || true;
		params.radius = params.radius || 0.5;
	}

	params(): Verlet.ParamsParticleIntegration {
		return <Verlet.ParamsParticleIntegration>super.params();
	}
	
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
		this.createParticles();

		this.addUpdateCallback(new UpdateCallback((node, nodeVisitor) => {
			return this.update();
		}));
	}

	protected particle(index: number) {
		return this._particles[index];
	}

	protected createParticles() {
		this.addParticle(
			osg.Vec3.createAndSet(5, 5, 5),
			osg.Vec3.createAndSet(4.9, 4.8, 4.7)
		);
	}

	protected AddParticleSimplified(x: number, y: number, z: number, x_vel: number = 0, y_vel: number = 0, z_vel: number = 0): VerletParticle{
		return this.addParticle(
			osg.Vec3.createAndSet(x, y, z),
			osg.Vec3.createAndSet(x + x_vel, y + y_vel, z + z_vel)
		);
	}

	protected addParticle(pos: osg.Vec3, pos_old?: osg.Vec3): VerletParticle {

		var params: Verlet.ParamsParticleIntegration = this.params();

		var sphere: EntitySphere = new EntitySphere({
			radius: params.radius
		});
		sphere.create();
		this.pivot().addChild(sphere);

		var p: VerletParticle = new VerletParticle(
			pos, pos_old, sphere
		);

		this._particles.push(p);
		return p;
	}

	protected updateConstrainParticles() {
		this.constrainParticles(this._particles);
	}

	protected constrainParticles(particles: VerletParticle[] ) {
		
		for (var i = 0; i < particles.length; i++) {
			var p: VerletParticle = particles[i];

			// calc velocity based on previous position
			var vel: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(p._pos, p._pos_old, vel);
			osg.Vec3.mult(vel, this._friction_coeficient, vel);	// friction

			// check for collision and adjust
			var c: number = (this._cubeLen / 2) - this._sphereradius;

			if (p._pos[0] > c) {	// reflect x at boundry right
				p._pos[0] = c;
				p._pos_old[0] = p._pos[0] + vel[0] * this._bounce_friction_coefficient;
			}

			if (p._pos[0] < -c) { // reflect x at boundry left
				p._pos[0] = -c;
				p._pos_old[0] = p._pos[0] + vel[0] * this._bounce_friction_coefficient;
			}

			if (p._pos[1] > c) {	// reflect y at boundry back
				p._pos[1] = c;
				p._pos_old[1] = p._pos[1] + vel[1] * this._bounce_friction_coefficient;
			}

			if (p._pos[1] < -c) { // reflect y at boundry front
				p._pos[1] = -c;
				p._pos_old[1] = p._pos[1] + vel[1] * this._bounce_friction_coefficient;
			}

			if (p._pos[2] > c) {	// reflect z at boundry top
				p._pos[2] = c
				p._pos_old[2] = p._pos[2] + vel[2] * this._bounce_friction_coefficient;
			}

			if (p._pos[2] < -c) { // reflect z at boundry bottom
				p._pos[2] = -c;
				p._pos_old[2] = p._pos[2] + vel[2] * this._bounce_friction_coefficient;
			}
		}
	}

	protected updateParticles() {
		// update points - verlet
		for (var i = 0; i < this._particles.length; i++) {
			var p: VerletParticle = this._particles[i];

			if (p._pinned) {
				continue;
			}

			// calc velocity based on previous position
			var vel: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(p._pos, p._pos_old, vel);
			osg.Vec3.mult(vel, this._friction_coeficient, vel);	// friction

			// save the current position as old position
			osg.Vec3.copy(p._pos, p._pos_old);

			// add velocity to current position
			osg.Vec3.add(p._pos, vel, p._pos);
			p._pos[2] += this._gravity;
		}
	}

	protected updateRender() {
		// update sphere
		for (var i = 0; i < this._particles.length; i++) {
			var p: VerletParticle = this._particles[i];
			p._entity.setPositionFromVec3(p._pos);
		}
	}

	protected update() {
		this.updateParticles();
		this.updateConstrainParticles();
		this.updateRender();
		return true;
	}
}


