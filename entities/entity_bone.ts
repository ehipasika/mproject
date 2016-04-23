///<reference path="entity_cuboid.ts"/>

module EntityBone {
	export interface params extends EntityCuboid.params {
		parent_bone: EntityBone;
		len: number;
	}
}

class EntityBone extends EntityCuboid {

	private _parentBone: EntityBone;
	private _childBone: EntityBone;

	constructor( params : EntityBone.params ) {

		// defaults
		params = $.extend(true, {
			parent_bone: null
		}, params);

		params.sy = params.len;

		super(params);

		this._childBone = null;

		this.setParentBone(params.parent_bone);
		this.setPivotY(params.len / 2);
	}

	params(): EntityBone.params {
		return <EntityBone.params>super.params();
	}

	length(): number {
		return this.params().len;
	}

	rootBone(): EntityBone {

		var bone: EntityBone = this;
		while (bone._parentBone) {
			bone = bone._parentBone;
		}
		return bone;
	}

	effectorBone(): EntityBone {
		var bone: EntityBone = this;
		while (bone._childBone) {
			bone = bone._childBone;
		}
		return bone;
	}

	setParentBone(bone: EntityBone) {
		this._parentBone = bone;

		if (this._parentBone) {
			this._parentBone._childBone = this;
		}
	}

	childBone(): EntityBone {
		return this._childBone;
	}

	parentBone(): EntityBone {
		return this._parentBone;
	}
}
