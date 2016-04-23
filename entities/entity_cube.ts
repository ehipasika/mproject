module EntityCube {
	export interface params extends EntityCuboid.params {
		len?: number;
	}
}

class EntityCube extends EntityCuboid {

	constructor(params: EntityCube.params = {}) {

		// defaults
		params = $.extend(true, {
			len: 1
		}, params);

		params = $.extend(true, {
			cx: 0,
			cy: 0,
			cz: 0,
			sx: params.len,
			sy: params.len,
			sz: params.len
		}, params);

		super(params);
	}
}