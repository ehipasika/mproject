///<reference path="entity_node.ts"/>

module EntityAxis {
	export interface params extends EntityNode.params {
		size?: number;
	}
}

class EntityAxis extends EntityNode {

	constructor(params: EntityAxis.params = {}) {

		// defaults
		params = $.extend(true, {
			size: 1
		}, params);

		super(params);
	}

	params(): EntityAxis.params {
		return <EntityAxis.params>super.params();
	}

	create() {

		var p: EntityAxis.params = this.params();

		var tmp = osg.createAxisGeometry(
			p.size
		);

		this.pivot().addChild(tmp);
	}
}