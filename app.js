var sys = null;
OSG.globalify();
var UpdateCallback = (function () {
    function UpdateCallback(cb) {
        this._cb = null;
        this._cb = cb;
    }
    UpdateCallback.prototype.update = function (node, nodeVisitor) {
        this._cb(node, nodeVisitor);
    };
    return UpdateCallback;
})();
window.onload = function () {
    sys = new zSystem;
    var cur = null;
    $("input").click(function (event) {
        var name = $(event.target).attr("name");
        console.log(name);
        cur = new window[name];
        cur.create();
        sys.viewer().setSceneData(cur);
    });
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var test = (function (_super) {
    __extends(test, _super);
    function test() {
        _super.apply(this, arguments);
    }
    test.prototype.run = function () {
        this.render();
    };
    test.prototype.render = function () {
        var _this = this;
        if (!this.done()) {
            if (this._useVR)
                this._requestID = this._hmd.requestAnimationFrame(this.render);
            else
                this._requestID = window.requestAnimationFrame(function () { return _this.render(); });
            this.frame();
            if (this._useVR)
                this._hmd.submitFrame(this._eventProxy.WebVR._lastPose);
        }
    };
    ;
    return test;
})(osgViewer.Viewer);
var zSystem = (function () {
    function zSystem() {
        this._viewer = null;
        this._canvas = null;
        this._canvas = document.getElementById("mycanvas");
        this._viewer = this.createViewer(this._canvas);
    }
    zSystem.prototype.canvas = function () {
        return this._canvas;
    };
    zSystem.prototype.viewer = function () {
        return this._viewer;
    };
    zSystem.prototype.createViewer = function (canvas) {
        var viewer = new test(canvas);
        viewer.init();
        viewer.setupManipulator();
        viewer.run();
        return viewer;
    };
    return zSystem;
})();
var EntityNode = (function (_super) {
    __extends(EntityNode, _super);
    function EntityNode(params) {
        if (params === void 0) { params = {}; }
        _super.call(this);
        this._params = {};
        this._pivot = new osg.MatrixTransform;
        params = $.extend(true, {
            show_pivot: false,
            create: false,
            position: osg.Vec3.create()
        }, params);
        this._params = params;
        if (!(this instanceof EntityAxis) && this._params.show_pivot) {
            this.addChild(new EntityAxis({ size: 2, create: true }));
        }
        this.addChild(this._pivot);
        if (this._params.create) {
            this.create();
        }
        this.setPositionFromVec3(this._params.position);
    }
    EntityNode.prototype.setRotationFromQuat = function (q) {
        osg.Matrix.setRotateFromQuat(this.getMatrix(), q);
    };
    EntityNode.prototype.rotation = function () {
        var q = osg.Quat.create();
        osg.Matrix.getRotate(this.getMatrix(), q);
        return q;
    };
    EntityNode.prototype.setPositionXY = function (x, y) {
        var m = this.getMatrix();
        m[12] = x;
        m[13] = y;
    };
    EntityNode.prototype.setPositionFromVec3 = function (pos) {
        osg.Matrix.setTrans(this.getMatrix(), pos[0], pos[1], pos[2]);
    };
    EntityNode.prototype.position = function (result) {
        if (result == undefined) {
            result = osg.Vec3.create();
        }
        osg.Matrix.getTrans(this.getMatrix(), result);
        return result;
    };
    EntityNode.prototype.setPivotY = function (v) {
        osg.Matrix.makeTranslate(0, v, 0, this._pivot.getMatrix());
    };
    EntityNode.prototype.pivot = function () {
        return this._pivot;
    };
    EntityNode.prototype.params = function () {
        return this._params;
    };
    return EntityNode;
})(osg.MatrixTransform);
var EntityAxis = (function (_super) {
    __extends(EntityAxis, _super);
    function EntityAxis(params) {
        if (params === void 0) { params = {}; }
        params = $.extend(true, {
            size: 1
        }, params);
        _super.call(this, params);
    }
    EntityAxis.prototype.params = function () {
        return _super.prototype.params.call(this);
    };
    EntityAxis.prototype.create = function () {
        var p = this.params();
        var tmp = osg.createAxisGeometry(p.size);
        this.pivot().addChild(tmp);
    };
    return EntityAxis;
})(EntityNode);
var EntityCuboid = (function (_super) {
    __extends(EntityCuboid, _super);
    function EntityCuboid(params) {
        if (params === void 0) { params = {}; }
        params = $.extend(true, {
            cx: 0,
            cy: 0,
            cz: 0,
            sx: 1,
            sy: 10,
            sz: 1,
            inverse_normals: false
        }, params);
        _super.call(this, params);
    }
    EntityCuboid.prototype.params = function () {
        return _super.prototype.params.call(this);
    };
    EntityCuboid.prototype.create = function () {
        var p = this.params();
        var inv_norm = p.inverse_normals ? -1 : 1;
        var centerx = p.cx;
        var centery = p.cy;
        var centerz = p.cz;
        var sizex = p.sx;
        var sizey = p.sy;
        var sizez = p.sz;
        var g = new osg.Geometry();
        var dx, dy, dz;
        dx = sizex / 2.0;
        dy = sizey / 2.0;
        dz = sizez / 2.0;
        var vertexes = new Float32Array(72);
        var uv = new Float32Array(48);
        var normal = new Float32Array(72);
        vertexes[0] = centerx - dx;
        vertexes[1] = centery - dy;
        vertexes[2] = centerz + dz;
        normal[0] = 0.0;
        normal[1] = -1.0 * inv_norm;
        normal[2] = 0.0;
        uv[0] = 0.0;
        uv[1] = 1.0;
        vertexes[3] = centerx - dx;
        vertexes[4] = centery - dy;
        vertexes[5] = centerz - dz;
        normal[3] = 0.0;
        normal[4] = -1.0 * inv_norm;
        normal[5] = 0.0;
        uv[2] = 0.0;
        uv[3] = 0.0;
        vertexes[6] = centerx + dx;
        vertexes[7] = centery - dy;
        vertexes[8] = centerz - dz;
        normal[6] = 0.0;
        normal[7] = -1.0 * inv_norm;
        normal[8] = 0.0;
        uv[4] = 1.0;
        uv[5] = 0.0;
        vertexes[9] = centerx + dx;
        vertexes[10] = centery - dy;
        vertexes[11] = centerz + dz;
        normal[9] = 0.0;
        normal[10] = -1.0 * inv_norm;
        normal[11] = 0.0;
        uv[6] = 1.0;
        uv[7] = 1.0;
        vertexes[12] = centerx + dx;
        vertexes[13] = centery + dy;
        vertexes[14] = centerz + dz;
        normal[12] = 0.0;
        normal[13] = 1.0 * inv_norm;
        normal[14] = 0.0;
        uv[8] = 0.0;
        uv[9] = 1.0;
        vertexes[15] = centerx + dx;
        vertexes[16] = centery + dy;
        vertexes[17] = centerz - dz;
        normal[15] = 0.0;
        normal[16] = 1.0 * inv_norm;
        normal[17] = 0.0;
        uv[10] = 0.0;
        uv[11] = 0.0;
        vertexes[18] = centerx - dx;
        vertexes[19] = centery + dy;
        vertexes[20] = centerz - dz;
        normal[18] = 0.0;
        normal[19] = 1.0 * inv_norm;
        normal[20] = 0.0;
        uv[12] = 1.0;
        uv[13] = 0.0;
        vertexes[21] = centerx - dx;
        vertexes[22] = centery + dy;
        vertexes[23] = centerz + dz;
        normal[21] = 0.0;
        normal[22] = 1.0 * inv_norm;
        normal[23] = 0.0;
        uv[14] = 1.0;
        uv[15] = 1.0;
        vertexes[24] = centerx + dx;
        vertexes[25] = centery - dy;
        vertexes[26] = centerz + dz;
        normal[24] = 1.0 * inv_norm;
        normal[25] = 0.0;
        normal[26] = 0.0;
        uv[16] = 0.0;
        uv[17] = 1.0;
        vertexes[27] = centerx + dx;
        vertexes[28] = centery - dy;
        vertexes[29] = centerz - dz;
        normal[27] = 1.0 * inv_norm;
        normal[28] = 0.0;
        normal[29] = 0.0;
        uv[18] = 0.0;
        uv[19] = 0.0;
        vertexes[30] = centerx + dx;
        vertexes[31] = centery + dy;
        vertexes[32] = centerz - dz;
        normal[30] = 1.0 * inv_norm;
        normal[31] = 0.0;
        normal[32] = 0.0;
        uv[20] = 1.0;
        uv[21] = 0.0;
        vertexes[33] = centerx + dx;
        vertexes[34] = centery + dy;
        vertexes[35] = centerz + dz;
        normal[33] = 1.0 * inv_norm;
        normal[34] = 0.0;
        normal[35] = 0.0;
        uv[22] = 1.0;
        uv[23] = 1.0;
        vertexes[36] = centerx - dx;
        vertexes[37] = centery + dy;
        vertexes[38] = centerz + dz;
        normal[36] = -1.0 * inv_norm;
        normal[37] = 0.0;
        normal[38] = 0.0;
        uv[24] = 0.0;
        uv[25] = 1.0;
        vertexes[39] = centerx - dx;
        vertexes[40] = centery + dy;
        vertexes[41] = centerz - dz;
        normal[39] = -1.0 * inv_norm;
        normal[40] = 0.0;
        normal[41] = 0.0;
        uv[26] = 0.0;
        uv[27] = 0.0;
        vertexes[42] = centerx - dx;
        vertexes[43] = centery - dy;
        vertexes[44] = centerz - dz;
        normal[42] = -1.0 * inv_norm;
        normal[43] = 0.0;
        normal[44] = 0.0;
        uv[28] = 1.0;
        uv[29] = 0.0;
        vertexes[45] = centerx - dx;
        vertexes[46] = centery - dy;
        vertexes[47] = centerz + dz;
        normal[45] = -1.0 * inv_norm;
        normal[46] = 0.0;
        normal[47] = 0.0;
        uv[30] = 1.0;
        uv[31] = 1.0;
        vertexes[48] = centerx - dx;
        vertexes[49] = centery + dy;
        vertexes[50] = centerz + dz;
        normal[48] = 0.0;
        normal[49] = 0.0;
        normal[50] = 1.0 * inv_norm;
        uv[32] = 0.0;
        uv[33] = 1.0;
        vertexes[51] = centerx - dx;
        vertexes[52] = centery - dy;
        vertexes[53] = centerz + dz;
        normal[51] = 0.0;
        normal[52] = 0.0;
        normal[53] = 1.0 * inv_norm;
        uv[34] = 0.0;
        uv[35] = 0.0;
        vertexes[54] = centerx + dx;
        vertexes[55] = centery - dy;
        vertexes[56] = centerz + dz;
        normal[54] = 0.0;
        normal[55] = 0.0;
        normal[56] = 1.0 * inv_norm;
        uv[36] = 1.0;
        uv[37] = 0.0;
        vertexes[57] = centerx + dx;
        vertexes[58] = centery + dy;
        vertexes[59] = centerz + dz;
        normal[57] = 0.0;
        normal[58] = 0.0;
        normal[59] = 1.0 * inv_norm;
        uv[38] = 1.0;
        uv[39] = 1.0;
        vertexes[60] = centerx + dx;
        vertexes[61] = centery + dy;
        vertexes[62] = centerz - dz;
        normal[60] = 0.0;
        normal[61] = 0.0;
        normal[62] = -1.0 * inv_norm;
        uv[40] = 0.0;
        uv[41] = 1.0;
        vertexes[63] = centerx + dx;
        vertexes[64] = centery - dy;
        vertexes[65] = centerz - dz;
        normal[63] = 0.0;
        normal[64] = 0.0;
        normal[65] = -1.0 * inv_norm;
        uv[42] = 0.0;
        uv[43] = 0.0;
        vertexes[66] = centerx - dx;
        vertexes[67] = centery - dy;
        vertexes[68] = centerz - dz;
        normal[66] = 0.0;
        normal[67] = 0.0;
        normal[68] = -1.0 * inv_norm;
        uv[44] = 1.0;
        uv[45] = 0.0;
        vertexes[69] = centerx - dx;
        vertexes[70] = centery + dy;
        vertexes[71] = centerz - dz;
        normal[69] = 0.0;
        normal[70] = 0.0;
        normal[71] = -1.0 * inv_norm;
        uv[46] = 1.0;
        uv[47] = 1.0;
        var indexes = new Uint16Array(36);
        indexes[0] = 0;
        indexes[1] = 1;
        indexes[2] = 2;
        indexes[3] = 0;
        indexes[4] = 2;
        indexes[5] = 3;
        indexes[6] = 4;
        indexes[7] = 5;
        indexes[8] = 6;
        indexes[9] = 4;
        indexes[10] = 6;
        indexes[11] = 7;
        indexes[12] = 8;
        indexes[13] = 9;
        indexes[14] = 10;
        indexes[15] = 8;
        indexes[16] = 10;
        indexes[17] = 11;
        indexes[18] = 12;
        indexes[19] = 13;
        indexes[20] = 14;
        indexes[21] = 12;
        indexes[22] = 14;
        indexes[23] = 15;
        indexes[24] = 16;
        indexes[25] = 17;
        indexes[26] = 18;
        indexes[27] = 16;
        indexes[28] = 18;
        indexes[29] = 19;
        indexes[30] = 20;
        indexes[31] = 21;
        indexes[32] = 22;
        indexes[33] = 20;
        indexes[34] = 22;
        indexes[35] = 23;
        g.getAttributes().Vertex = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, vertexes, 3);
        g.getAttributes().Normal = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, normal, 3);
        g.getAttributes().TexCoord0 = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, uv, 2);
        var primitive = new osg.DrawElements(osg.PrimitiveSet.TRIANGLES, new osg.BufferArray(osg.BufferArray.ELEMENT_ARRAY_BUFFER, indexes, 1));
        g.getPrimitives().push(primitive);
        this.pivot().addChild(g);
    };
    return EntityCuboid;
})(EntityNode);
var EntityBone = (function (_super) {
    __extends(EntityBone, _super);
    function EntityBone(params) {
        params = $.extend(true, {
            parent_bone: null
        }, params);
        params.sy = params.len;
        _super.call(this, params);
        this._childBone = null;
        this.setParentBone(params.parent_bone);
        this.setPivotY(params.len / 2);
    }
    EntityBone.prototype.params = function () {
        return _super.prototype.params.call(this);
    };
    EntityBone.prototype.length = function () {
        return this.params().len;
    };
    EntityBone.prototype.rootBone = function () {
        var bone = this;
        while (bone._parentBone) {
            bone = bone._parentBone;
        }
        return bone;
    };
    EntityBone.prototype.effectorBone = function () {
        var bone = this;
        while (bone._childBone) {
            bone = bone._childBone;
        }
        return bone;
    };
    EntityBone.prototype.setParentBone = function (bone) {
        this._parentBone = bone;
        if (this._parentBone) {
            this._parentBone._childBone = this;
        }
    };
    EntityBone.prototype.childBone = function () {
        return this._childBone;
    };
    EntityBone.prototype.parentBone = function () {
        return this._parentBone;
    };
    return EntityBone;
})(EntityCuboid);
var EntityCube = (function (_super) {
    __extends(EntityCube, _super);
    function EntityCube(params) {
        if (params === void 0) { params = {}; }
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
        _super.call(this, params);
    }
    return EntityCube;
})(EntityCuboid);
var EntityGrid = (function (_super) {
    __extends(EntityGrid, _super);
    function EntityGrid() {
        _super.apply(this, arguments);
    }
    EntityGrid.prototype.create = function () {
        var tmp = osg.createGridGeometry(-5, -5, 0, 10, 0, 0, 0, 10, 0, 9, 9);
        this.addChild(tmp);
    };
    return EntityGrid;
})(EntityNode);
var EntityLine = (function (_super) {
    __extends(EntityLine, _super);
    function EntityLine(params) {
        if (params === void 0) { params = {}; }
        params = $.extend(true, {
            v0: osg.Vec3.createAndSet(0, 0, 0),
            v1: osg.Vec3.createAndSet(0, 0, 1)
        }, params);
        _super.call(this, params);
    }
    EntityLine.prototype.params = function () {
        return _super.prototype.params.call(this);
    };
    EntityLine.prototype.create = function () {
        var p = this.params();
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
    };
    EntityLine.prototype.setPosition = function (v0, v1) {
        this._verts[0] = v0[0];
        this._verts[1] = v0[1];
        this._verts[2] = v0[2];
        this._verts[3] = v1[0];
        this._verts[4] = v1[1];
        this._verts[5] = v1[2];
        this._geom.getAttributes().Vertex.dirty();
    };
    return EntityLine;
})(EntityNode);
var EntityPlane = (function (_super) {
    __extends(EntityPlane, _super);
    function EntityPlane(params) {
        if (params === void 0) { params = {}; }
        params = $.extend(true, {
            w: 1,
            l: 1
        }, params);
        _super.call(this, params);
    }
    EntityPlane.prototype.params = function () {
        return _super.prototype.params.call(this);
    };
    EntityPlane.prototype.create = function () {
        var p = this.params();
        var tmp = osg.createTexturedQuadGeometry(-p.w / 2, -p.l / 2, 0, p.w, 0, 0, 0, p.l, 0);
        this.pivot().addChild(tmp);
    };
    return EntityPlane;
})(EntityNode);
var EntitySphere = (function (_super) {
    __extends(EntitySphere, _super);
    function EntitySphere(params) {
        if (params === void 0) { params = {}; }
        params = $.extend(true, {
            radius: 1
        }, params);
        _super.call(this, params);
    }
    EntitySphere.prototype.params = function () {
        return _super.prototype.params.call(this);
    };
    EntitySphere.prototype.create = function () {
        var p = this.params();
        var tmp = osg.createTexturedSphereGeometry(p.radius, 8 * 4, 6 * 4);
        this.pivot().addChild(tmp);
    };
    return EntitySphere;
})(EntityNode);
var ScreenPlaneIntersection = (function (_super) {
    __extends(ScreenPlaneIntersection, _super);
    function ScreenPlaneIntersection() {
        _super.apply(this, arguments);
        this._grid = null;
        this._plane = null;
        this._sphere = null;
    }
    ScreenPlaneIntersection.prototype.create = function () {
        this._plane = osg.Plane.createAndSet(0, 0, 1, 0);
        this._grid = new EntityGrid;
        this._grid.create();
        this.pivot().addChild(this._grid);
        this._sphere = new EntitySphere;
        this._sphere.create();
        this.pivot().addChild(this._sphere);
        this.createListerners();
    };
    ScreenPlaneIntersection.prototype.createListerners = function () {
        var _this = this;
        document.getElementById("mycanvas").addEventListener("mousedown", this._eventMouseDown = function (event) { _this.onMouseDown(event); });
    };
    ScreenPlaneIntersection.prototype.onMouseDown = function (event) {
        this.calcIntersection(event.clientX, event.clientY);
    };
    ScreenPlaneIntersection.prototype.calcIntersection = function (mouse_x, mouse_y) {
        var canvas = document.getElementById("mycanvas");
        var normalizedMouseCoord = zCanvas.pointToView(mouse_x, mouse_y, canvas);
        var x = normalizedMouseCoord[0];
        var y = normalizedMouseCoord[1];
        var cam = sys.viewer().getCamera();
        var nearPoint = osg.Vec3.create();
        var farPoint = osg.Vec3.create();
        zFrustum.calcNearFarPoints(cam, x, y, nearPoint, farPoint);
        var intersect = osg.Vec3.create();
        zIntersectPlane.lineSegment(nearPoint, farPoint, this._plane, intersect);
        this.updateTargetPosition(intersect);
    };
    ScreenPlaneIntersection.prototype.updateTargetPosition = function (pos) {
        var m = this._sphere.getMatrix();
        osg.Matrix.setTrans(m, pos[0], pos[1], pos[2]);
    };
    return ScreenPlaneIntersection;
})(EntityNode);
var Easing = (function (_super) {
    __extends(Easing, _super);
    function Easing() {
        _super.apply(this, arguments);
        this._targetPos = null;
    }
    Easing.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        this.addUpdateCallback(new UpdateCallback(function (node, nodeVisitor) {
            _this.update();
        }));
    };
    Easing.prototype.updateTargetPosition = function (pos) {
        this._targetPos = pos;
    };
    Easing.prototype.update = function () {
        if (this._targetPos) {
            var m = this._sphere.getMatrix();
            var curPos = osg.Vec3.create();
            osg.Matrix.getTrans(m, curPos);
            var v = osg.Vec3.create();
            osg.Vec3.sub(this._targetPos, curPos, v);
            var ease = 0.1;
            osg.Vec3.mult(v, ease, v);
            osg.Vec3.add(curPos, v, v);
            osg.Matrix.setTrans(m, v[0], v[1], v[2]);
        }
    };
    return Easing;
})(ScreenPlaneIntersection);
var EasingToMouse = (function (_super) {
    __extends(EasingToMouse, _super);
    function EasingToMouse() {
        _super.apply(this, arguments);
    }
    EasingToMouse.prototype.createListerners = function () {
        var _this = this;
        document.getElementById("mycanvas").addEventListener("mousemove", this._eventMouseMove = function (event) { _this.onMouseMove(event); });
    };
    EasingToMouse.prototype.onMouseMove = function (event) {
        this.calcIntersection(event.clientX, event.clientY);
    };
    return EasingToMouse;
})(Easing);
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
    }
    Grid.prototype.create = function () {
        var tmp = osg.createGridGeometry(-5, -5, 0, 10, 0, 0, 0, 10, 0, 9, 9);
        this.addChild(tmp);
    };
    return Grid;
})(EntityNode);
var IkDrag = (function (_super) {
    __extends(IkDrag, _super);
    function IkDrag() {
        _super.apply(this, arguments);
        this._rootBone = null;
        this._segmentCount = 5;
    }
    IkDrag.prototype.create = function () {
        _super.prototype.create.call(this);
        this._rootBone = this.createBones();
    };
    IkDrag.prototype.createBones = function () {
        var len = 2;
        var bone = null;
        for (var i = 0; i < this._segmentCount; i++) {
            len += 1;
            bone = new EntityBone({
                show_pivot: true,
                parent_bone: bone,
                len: len
            });
            bone.create();
            this.pivot().addChild(bone);
        }
        return bone.rootBone();
    };
    IkDrag.prototype.update = function () {
        _super.prototype.update.call(this);
        var last_pos = osg.Vec3.create();
        this._sphere.position(last_pos);
        var bone = this._rootBone.effectorBone();
        while (bone) {
            var from = osg.Vec3.createAndSet(0, 1, 0);
            var to = osg.Vec3.create();
            osg.Vec3.sub(last_pos, bone.position(), to);
            osg.Vec3.normalize(to, to);
            var rot = osg.Quat.create();
            osg.Quat.makeRotateFromTo(from, to, rot);
            var newPos = osg.Vec3.create();
            var vLen = osg.Vec3.create();
            osg.Vec3.mult(to, bone.length(), vLen);
            osg.Vec3.sub(last_pos, vLen, newPos);
            bone.setRotationFromQuat(rot);
            bone.setPositionFromVec3(newPos);
            last_pos = bone.position();
            bone = bone.parentBone();
        }
    };
    return IkDrag;
})(EasingToMouse);
var IkReach = (function (_super) {
    __extends(IkReach, _super);
    function IkReach() {
        _super.call(this);
        this._segmentCount = 3;
    }
    IkReach.prototype.update = function () {
        _super.prototype.update.call(this);
        var last_pos = osg.Vec3.create();
        var bone = this._rootBone;
        while (bone) {
            bone.setPositionFromVec3(last_pos);
            var vLen = osg.Vec3.createAndSet(0, bone.length(), 0);
            osg.Quat.transformVec3(bone.rotation(), vLen, vLen);
            osg.Vec3.add(last_pos, vLen, last_pos);
            bone = bone.childBone();
        }
    };
    return IkReach;
})(IkDrag);
var VerletParticle = (function () {
    function VerletParticle(pos, pos_old, entity) {
        this._pos = osg.Vec3.create();
        this._pos_old = osg.Vec3.create();
        osg.Vec3.copy(pos, this._pos);
        osg.Vec3.copy(pos_old, this._pos_old);
        this._entity = entity;
    }
    return VerletParticle;
})();
var VerletParticleIntegration = (function (_super) {
    __extends(VerletParticleIntegration, _super);
    function VerletParticleIntegration() {
        _super.apply(this, arguments);
        this._grid = null;
        this._cube = null;
        this._cubeLen = 10;
        this._sphereradius = 0.5;
        this._bounce_friction_coefficient = 1;
        this._friction_coeficient = 1;
        this._gravity = 0;
        this._points = [];
    }
    VerletParticleIntegration.prototype.create = function () {
        var _this = this;
        this._grid = new EntityGrid({
            position: osg.Vec3.createAndSet(0, 0, -this._cubeLen / 2)
        });
        this._grid.create();
        this.pivot().addChild(this._grid);
        this._cube = new EntityCube({
            len: this._cubeLen,
            inverse_normals: true
        });
        this._cube.create();
        this.pivot().addChild(this._cube);
        osg.Matrix.preMultScale(this._cube.getMatrix(), osg.Vec3.createAndSet(-1, -1, -1));
        this._cube.dirtyBound();
        this.createParticles();
        this.addUpdateCallback(new UpdateCallback(function (node, nodeVisitor) {
            _this.update();
        }));
    };
    VerletParticleIntegration.prototype.particle = function (index) {
        return this._points[index];
    };
    VerletParticleIntegration.prototype.createParticles = function () {
        this.addParticle(osg.Vec3.createAndSet(5, 5, 5), osg.Vec3.createAndSet(4.9, 4.8, 4.7));
    };
    VerletParticleIntegration.prototype.addParticle = function (pos, pos_old) {
        var sphere = new EntitySphere({
            radius: this._sphereradius
        });
        sphere.create();
        this.pivot().addChild(sphere);
        this._points.push(new VerletParticle(pos, pos_old, sphere));
    };
    VerletParticleIntegration.prototype.constrainParticles = function () {
        for (var i = 0; i < this._points.length; i++) {
            var p = this._points[i];
            var vel = osg.Vec3.create();
            osg.Vec3.sub(p._pos, p._pos_old, vel);
            osg.Vec3.mult(vel, this._friction_coeficient, vel);
            var c = (this._cubeLen / 2) - this._sphereradius;
            if (p._pos[0] > c) {
                p._pos[0] = c;
                p._pos_old[0] = p._pos[0] + vel[0] * this._bounce_friction_coefficient;
            }
            if (p._pos[0] < -c) {
                p._pos[0] = -c;
                p._pos_old[0] = p._pos[0] + vel[0] * this._bounce_friction_coefficient;
            }
            if (p._pos[1] > c) {
                p._pos[1] = c;
                p._pos_old[1] = p._pos[1] + vel[1] * this._bounce_friction_coefficient;
            }
            if (p._pos[1] < -c) {
                p._pos[1] = -c;
                p._pos_old[1] = p._pos[1] + vel[1] * this._bounce_friction_coefficient;
            }
            if (p._pos[2] > c) {
                p._pos[2] = c;
                p._pos_old[2] = p._pos[2] + vel[2] * this._bounce_friction_coefficient;
            }
            if (p._pos[2] < -c) {
                p._pos[2] = -c;
                p._pos_old[2] = p._pos[2] + vel[2] * this._bounce_friction_coefficient;
            }
        }
    };
    VerletParticleIntegration.prototype.updateParticles = function () {
        for (var i = 0; i < this._points.length; i++) {
            var p = this._points[i];
            var vel = osg.Vec3.create();
            osg.Vec3.sub(p._pos, p._pos_old, vel);
            osg.Vec3.mult(vel, this._friction_coeficient, vel);
            osg.Vec3.copy(p._pos, p._pos_old);
            osg.Vec3.add(p._pos, vel, p._pos);
            p._pos[2] += this._gravity;
        }
    };
    VerletParticleIntegration.prototype.updateRender = function () {
        for (var i = 0; i < this._points.length; i++) {
            var p = this._points[i];
            p._entity.setPositionFromVec3(p._pos);
        }
    };
    VerletParticleIntegration.prototype.update = function () {
        this.updateParticles();
        this.constrainParticles();
        this.updateRender();
    };
    return VerletParticleIntegration;
})(EntityNode);
var VerletStick = (function () {
    function VerletStick(p0, p1) {
        this._p0 = p0;
        this._p1 = p1;
        this._dist = osg.Vec3.distance(p0._pos, p1._pos);
    }
    return VerletStick;
})();
var VerletStickIntegration = (function (_super) {
    __extends(VerletStickIntegration, _super);
    function VerletStickIntegration() {
        _super.apply(this, arguments);
        this._sticks = [];
    }
    VerletStickIntegration.prototype.create = function () {
        _super.prototype.create.call(this);
        this.addStick(this.particle(0), this.particle(1));
    };
    VerletStickIntegration.prototype.createParticles = function () {
        this.addParticle(osg.Vec3.createAndSet(0, 0, 4), osg.Vec3.createAndSet(0, 0, 3.9));
        this.addParticle(osg.Vec3.createAndSet(4, 0, 5), osg.Vec3.createAndSet(4, 0, 4.7));
    };
    VerletStickIntegration.prototype.addStick = function (p0, p1) {
        this._sticks.push(new VerletStick(p0, p1));
    };
    VerletStickIntegration.prototype.updateSticks = function () {
        for (var i = 0; i < this._sticks.length; i++) {
            var s = this._sticks[i];
            var dist = osg.Vec3.distance(s._p0._pos, s._p1._pos);
            var diff = s._dist - dist;
            var adjust_vec = osg.Vec3.create();
            osg.Vec3.sub(s._p0._pos, s._p1._pos, adjust_vec);
            osg.Vec3.normalize(adjust_vec, adjust_vec);
            osg.Vec3.mult(adjust_vec, diff / 2, adjust_vec);
            osg.Vec3.add(s._p0._pos, adjust_vec, s._p0._pos);
            osg.Vec3.sub(s._p1._pos, adjust_vec, s._p1._pos);
        }
    };
    VerletStickIntegration.prototype.update = function () {
        this.updateParticles();
        this.updateSticks();
        this.constrainParticles();
        this.updateRender();
    };
    return VerletStickIntegration;
})(VerletParticleIntegration);
var PointTo = (function (_super) {
    __extends(PointTo, _super);
    function PointTo() {
        _super.apply(this, arguments);
        this._cuboids = [];
        this._mapPos = [
            { x: 0, y: 0 },
            { x: -6, y: 0 },
            { x: 6, y: 0 }
        ];
    }
    PointTo.prototype.createListerners = function () {
        var _this = this;
        document.getElementById("mycanvas").addEventListener("mousemove", this._eventMouseMove = function (event) { _this.onMouseMove(event); });
    };
    PointTo.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        for (var i = 0; i < this._mapPos.length; i++) {
            var cuboid = new EntityCuboid({
                sy: 4,
                create: true
            });
            cuboid.setPivotY(2);
            cuboid.setPositionXY(this._mapPos[i].x, this._mapPos[i].y);
            this.pivot().addChild(cuboid);
            this._cuboids.push(cuboid);
        }
        this.addUpdateCallback(new UpdateCallback(function (node, nodeVisitor) {
            _this.update();
        }));
    };
    PointTo.prototype.onMouseMove = function (event) {
        this.calcIntersection(event.clientX, event.clientY);
    };
    PointTo.prototype.update = function () {
        _super.prototype.update.call(this);
        for (var i = 0; i < this._mapPos.length; i++) {
            var cuboid = this._cuboids[i];
            var from = osg.Vec3.createAndSet(0, 1, 0);
            var to = this._sphere.position();
            var pos = cuboid.position();
            osg.Vec3.sub(to, pos, to);
            osg.Vec3.normalize(to, to);
            var rot = osg.Quat.create();
            osg.Quat.makeRotateFromTo(from, to, rot);
            cuboid.setRotationFromQuat(rot);
        }
    };
    return PointTo;
})(Easing);
var zCanvas = (function () {
    function zCanvas() {
    }
    zCanvas.pointToView = function (x, y, canvas) {
        var clientRect = canvas.getBoundingClientRect();
        x -= clientRect.left;
        y -= clientRect.top;
        var clientW = canvas.clientWidth;
        var clientH = canvas.clientHeight;
        x = (x / clientW) * 2 - 1;
        y = -((y / clientH) * 2 - 1);
        return osg.Vec2.createAndSet(x, y);
    };
    return zCanvas;
})();
var zFrustum = (function () {
    function zFrustum() {
    }
    zFrustum.calcNearFarPoints = function (cam, view_x, view_y, near_result, far_result) {
        var matView = cam.getViewMatrix();
        var matProj = cam.getProjectionMatrix();
        var MVP = osg.Matrix.create();
        osg.Matrix.mult(matProj, matView, MVP);
        var inverseMVP = osg.Matrix.create();
        osg.Matrix.inverse(MVP, inverseMVP);
        osg.Vec3.set(view_x, view_y, 0, near_result);
        osg.Vec3.set(view_x, view_y, 1, far_result);
        osg.Matrix.transformVec3(inverseMVP, near_result, near_result);
        osg.Matrix.transformVec3(inverseMVP, far_result, far_result);
    };
    return zFrustum;
})();
var zIntersectPlane = (function () {
    function zIntersectPlane() {
    }
    zIntersectPlane.lineSegment = function (v0, v1, plane, intersect) {
        var u;
        var A, B, C, D;
        var x1, x2, y1, y2, z1, z2;
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
            var dir = osg.Vec3.create();
            osg.Vec3.sub(v1, v0, dir);
            osg.Vec3.mult(dir, u, dir);
            osg.Vec3.add(v0, dir, intersect);
        }
        if (u < 0 || u > 1) {
            return false;
        }
        return true;
    };
    return zIntersectPlane;
})();
//# sourceMappingURL=app.js.map