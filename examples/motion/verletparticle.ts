class VerletParticle {
	public _entity: EntityNode;		// object used for visualizing the point eg. a EntitySphere
	public _pos: osg.Vec3 = osg.Vec3.create();
	public _pos_old: osg.Vec3 = osg.Vec3.create();
	public _pinned: boolean = false;

	constructor(pos: osg.Vec3, pos_old: osg.Vec3, entity?:EntityNode) {
		osg.Vec3.copy(pos, this._pos);
		osg.Vec3.copy(pos_old, this._pos_old);
		this._entity = entity;
	}

	setPinned(pinned: boolean) {
		this._pinned = pinned;
	}
}