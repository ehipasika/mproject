///<reference path="entity_node.ts"/>

module EntityLine {
	export interface params extends EntityNode.params {
		v0?: osg.Vec3;
		v1?: osg.Vec3;
	}
}

class EntityLine extends EntityNode {

	private _verts: Float32Array;
	private _geom: osg.Geometry;

	constructor(params: EntityLine.params = {}) {

		// defaults
		params = $.extend(true, {
			v0: osg.Vec3.createAndSet(0, 0, 0),
			v1: osg.Vec3.createAndSet(0, 0, 1)
		}, params);

		super(params);
	}

	params(): EntityLine.params {
		return <EntityLine.params>super.params();
	}

	create() {

		var p: EntityLine.params = this.params();

		this._geom = new osg.Geometry();

		this._verts = new Float32Array(6);
		this._verts[0] = p.v0[0];
		this._verts[1] = p.v0[1];
		this._verts[2] = p.v0[2];
		this._verts[3] = p.v1[0];
		this._verts[4] = p.v1[1];
		this._verts[5] = p.v1[2];

		this._geom.getAttributes().Vertex = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, this._verts, 3);

		var primitive = new osg.DrawArrays(osg.PrimitiveSet.LINES, 0, 2);
		this._geom.getPrimitives().push(primitive);

		this.addChild(this._geom);
	}

	setPosition(v0: osg.Vec3, v1: osg.Vec3) {
		this._verts[0] = v0[0];
		this._verts[1] = v0[1];
		this._verts[2] = v0[2];
		this._verts[3] = v1[0];
		this._verts[4] = v1[1];
		this._verts[5] = v1[2];

		this._geom.getAttributes().Vertex.dirty();
	}
}
