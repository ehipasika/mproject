class zIntersectPlane {

	static lineSegment(v0: osg.Vec3, v1: osg.Vec3, plane: osg.Plane, intersect?: osg.Vec3): boolean {

		var u: number;
		var A: number, B: number, C: number, D: number;
		var x1: number, x2: number, y1: number, y2: number, z1: number, z2: number;

		A = plane[0];
		B = plane[1];
		C = plane[2];
		D = plane[3];

		x1 = v0[0];
		y1 = v0[1];
		z1 = v0[2];

		x2 = v1[0];
		y2 = v1[1];
		z2 = v1[2];

		u = (A * x1 + B * y1 + C * z1 + D) / (A * (x1 - x2) + B * (y1 - y2) + C * (z1 - z2));

		if (intersect) {
			// (*pOut) = (v0) + (((v1) - (v0)) * u);
			var dir: osg.Vec3 = osg.Vec3.create();
			osg.Vec3.sub(v1, v0, dir);
			osg.Vec3.mult(dir, u, dir);
			osg.Vec3.add(v0, dir, intersect);
		}

		if (u < 0 || u > 1) {
			return false;
		}

		return true;
	}

}
