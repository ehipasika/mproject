class Grid extends EntityNode {

	create() {

		var tmp = osg.createGridGeometry(
			-5, -5, 0,		// center
			10, 0, 0,	// width
			0, 10, 0,	// height
			9, 9		// resolution (segments)
		);

		this.addChild(tmp);
	}

}