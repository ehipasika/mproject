class zFrustum {

	/*
		view_x and view_y are normalized view coordinates
	*/
	static calcNearFarPoints(cam: osg.Camera, view_x: number, view_y: number, near_result: osg.Vec3, far_result: osg.Vec3) {

		var matView: osg.Matrix = cam.getViewMatrix();
		var matProj: osg.Matrix = cam.getProjectionMatrix();

		var MVP: osg.Matrix = osg.Matrix.create();
		osg.Matrix.mult(matProj, matView, MVP);

		var inverseMVP: osg.Matrix = osg.Matrix.create();
		osg.Matrix.inverse(MVP, inverseMVP);

		osg.Vec3.set(view_x, view_y, 0, near_result);
		osg.Vec3.set(view_x, view_y, 1, far_result);

		osg.Matrix.transformVec3(inverseMVP, near_result, near_result);
		osg.Matrix.transformVec3(inverseMVP, far_result, far_result);
	}
}