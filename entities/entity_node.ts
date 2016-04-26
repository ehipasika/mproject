module EntityNode {
	export interface params {
		show_pivot?: boolean;
		create?: boolean;
		position?: osg.Vec3;
	}
}

//abstract class EntityNode extends osg.Node {
abstract class EntityNode extends osg.MatrixTransform {

	protected _params: EntityNode.params = {};
	private _pivot: osg.MatrixTransform = new osg.MatrixTransform;

	constructor(params: EntityNode.params = {}) {
		super();

		params.show_pivot = params.show_pivot || false;
		params.create = params.create || false;
		params.position = params.position || osg.Vec3.create();
		

		/*
		// defaults
		params = $.extend(true, {
			show_pivot: false,
			create: false,
			position: osg.Vec3.create()
		}, params);
		*/

		this._params = params;

		if ( !(this instanceof EntityAxis) && this._params.show_pivot) {
			this.addChild(new EntityAxis({size:2, create:true}));
		}

		this.addChild(this._pivot);

		if (this._params.create) {
			this.create();
		}

		this.setPositionFromVec3(this._params.position);
	}

	setRotationFromQuat(q: osg.Quat) {
		osg.Matrix.setRotateFromQuat(this.getMatrix(), q);
	}

	rotation(): osg.Quat {
		var q: osg.Quat = osg.Quat.create();
		osg.Matrix.getRotate(this.getMatrix(), q);
		return q;
	}

	setPositionXY(x: number, y: number) {
		var m: osg.Matrix = this.getMatrix();
		m[12] = x;
		m[13] = y;
	}

	setPositionFromVec3(pos: osg.Vec3) {
		osg.Matrix.setTrans(this.getMatrix(), pos[0], pos[1], pos[2]);
	}

	position(result?: osg.Vec3): osg.Vec3 {
		if (result == undefined) {
			result = osg.Vec3.create();
		}

		osg.Matrix.getTrans(this.getMatrix(), result);
		return result;
	}

	setPivotY(v: number) {
		osg.Matrix.makeTranslate(0, v, 0, this._pivot.getMatrix());
	}

	pivot(): osg.MatrixTransform {
		return this._pivot;
	}

	params(): EntityNode.params {
		return this._params;
	}

	abstract create();
}