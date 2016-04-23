
class zCanvas {

	// normalize mouse to -1 to +1
	static pointToView(x: number, y: number, canvas: HTMLElement): osg.Vec2 {
		// adjust mouse positions to canvas coordinates
		var clientRect = canvas.getBoundingClientRect();
		x -= clientRect.left;
		y -= clientRect.top;

		// transform mouse coordinates into normalized screen space
		var clientW = canvas.clientWidth;
		var clientH = canvas.clientHeight;
		x = (x / clientW) * 2 - 1;
		y = -((y / clientH) * 2 - 1);

		return osg.Vec2.createAndSet( x, y );
	}
}
