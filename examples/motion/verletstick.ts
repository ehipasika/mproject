class VerletStick {
	public _p0: VerletParticle;
	public _p1: VerletParticle;
	public _dist: number; // distance between particles (p0 and p1)

	constructor(p0: VerletParticle, p1: VerletParticle) {
		this._p0 = p0;
		this._p1 = p1;
		this._dist = osg.Vec3.distance(p0._pos, p1._pos);
	}
}