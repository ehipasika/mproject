///<reference path="entity_node.ts"/>

module EntitySphere {
	export interface params extends EntityNode.params {
		radius?: number;
	}
}

class EntitySphere extends EntityNode {


	constructor(params: EntitySphere.params = {}) {

		// defaults
		params = $.extend(true, {
			radius: 1
		}, params);

		super(params);
	}

	params(): EntitySphere.params {
		return <EntitySphere.params>super.params();
	}

	create() {

		var p: EntitySphere.params = this.params();

		var tmp = osg.createTexturedSphereGeometry(
			p.radius,
			8 * 4,
			6 * 4
		);

		this.pivot().addChild(tmp);
	}
}