///<reference path="entity_node.ts"/>

module EntityPlane {
	export interface params extends EntityNode.params {
		w?: number;
		l?: number;
	}
}

class EntityPlane extends EntityNode {

	constructor(params: EntityPlane.params = {}) {

		// defaults
		params = $.extend(true, {
			w: 1,
			l: 1
		}, params);

		super(params);
	}

	params(): EntityPlane.params {
		return <EntityPlane.params>super.params();
	}

	create() {

		var p: EntityPlane.params = this.params();

		var tmp = osg.createTexturedQuadGeometry(
			-p.w/2, -p.l/2, 0,
			p.w, 0, 0,
			0,p.l,0
		);

		this.pivot().addChild(tmp);
	}
}