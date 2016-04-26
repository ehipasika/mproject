class IkReach extends IkDrag {

	constructor() {
		super();
		this._segmentCount = 3;
	}

	update() : boolean {

		// call super IkDrag update (inverse pass)
		super.update();

		// apply forward pass
		var last_pos: osg.Vec3 = osg.Vec3.create();
		var bone:EntityBone = this._rootBone;
		while (bone) {
			// reposition bone
			bone.setPositionFromVec3(last_pos);

			// calc next position for bone
			var vLen: osg.Vec3 = osg.Vec3.createAndSet(0, bone.length(), 0);
			osg.Quat.transformVec3(bone.rotation(), vLen, vLen);
			osg.Vec3.add(last_pos, vLen, last_pos);

			bone = bone.childBone();
		}

		return true;
	}
}
