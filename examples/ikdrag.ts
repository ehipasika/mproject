class IkDrag extends EasingToMouse {

	protected _rootBone: EntityBone = null;
	protected _segmentCount: number = 5;

	create() {
		super.create();

		// some bones definitions
		this._rootBone = this.createBones();			// create simple bone structure
	}

	private createBones(): EntityBone {
		var len: number = 2;

		var bone: EntityBone = null;
		for (var i = 0; i < this._segmentCount; i++) {

			// let's make each bone a little longer
			len += 1;

			bone = new EntityBone({
				show_pivot: true,
				parent_bone: bone,
				len: len
			});
			bone.create();
			this.pivot().addChild(bone);
		}

		return bone.rootBone();
	}

	protected update() {
		super.update();

		// position of target (sphere)
		var last_pos: osg.Vec3 = osg.Vec3.create();
		this._sphere.position(last_pos);

		var bone: EntityBone = this._rootBone.effectorBone();
		while (bone) {
			// calc (from) vector
			var from: osg.Vec3 = osg.Vec3.createAndSet(0, 1, 0);

			// calc (to) vector
			var to: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(last_pos, bone.position(), to);
			osg.Vec3.normalize(to, to);

			// calc rotation needed
			var rot: osg.Quat = osg.Quat.create();
			osg.Quat.makeRotateFromTo(from, to, rot);

			// move bone towards target (last_pos) so it touches it
			var newPos: osg.Vec3 = osg.Vec3.create();
			var vLen: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.mult(to, bone.length(), vLen);
			osg.Vec3.sub(last_pos, vLen, newPos);

			// transform bone
			bone.setRotationFromQuat(rot);
			bone.setPositionFromVec3(newPos);

			// prepare for next bone
			last_pos = bone.position();
			bone = bone.parentBone();
		}
	}

}

