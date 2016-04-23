var sys: zSystem = null;

OSG.globalify();

class UpdateCallback {

	private _cb: (node: osg.Node, nodeVisitor) => any = null;

	constructor(cb: (node: osg.Node, nodeVisitor) => any) {
		this._cb = cb;
	}

	update(node: osg.Node, nodeVisitor) {
		this._cb(node, nodeVisitor);
	}
}

window.onload = () => {
	
	sys = new zSystem;

	var cur: EntityNode = null;

	$("input").click((event: JQueryEventObject) => {

		var name = $(event.target).attr("name");
		console.log(name);
		
		cur = new window[name];
		cur.create();
		sys.viewer().setSceneData(cur);
	});
};
