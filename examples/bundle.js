/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const Vast = __webpack_require__(1)
	const vast = new Vast();
	
	const circle = new Vast.Circle(10);
	const circle2 = new Vast.Circle(20);
	const rectangle = new Vast.Rectangle(100, 100);
	const spiral = new Vast.Path();
	
	spiral.color = '#888';
	circle.color = 'rgba(200, 80, 80, 1)';
	circle2.color = 'rgba(70, 160, 230, 0.8)'
	
	vast.add(circle)
	vast.add(circle2)
	vast.add(spiral)
	
	let time = 0;
	
	const render = () => {
	    requestAnimationFrame(render);
	    time++;
	    circle.position.x = Math.cos(time/10) * 40;
	    circle.position.y = Math.sin(time/10) * 40;
	    circle2.position.x = Math.sin(time/20) * 100;
	    circle2.position.y = Math.cos(time/20) * 20;
	    spiral.addPoint({ x: Math.sin(time/30) * time, y: Math.cos(time/30) * time})
	}
	
	// Drawing
	let drawingPath = null;
	window.addEventListener('mousedown', e => {
	    drawingPath = new Vast.Path([{x: vast.__deCalcX(e.offsetX), y: vast.__deCalcY(e.offsetY)}]);
	    drawingPath.smooth = true;
	    vast.add(drawingPath)
	})
	window.addEventListener('mousemove', e => {
	    if (drawingPath && !e.altKey) {
	        drawingPath.addPoint({x: vast.__deCalcX(e.offsetX), y: vast.__deCalcY(e.offsetY)})
	        console.log(drawingPath.export())
	    }
	})
	window.addEventListener('mouseup', () => {
	    drawingPath = null;
	})
	
	render();
	
	document.body.appendChild(vast.view);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Circle = __webpack_require__(2);
	var Rectangle = __webpack_require__(4);
	var Path = __webpack_require__(5);
	
	var Vast = function () {
	    function Vast() {
	        _classCallCheck(this, Vast);
	
	        this.camera = { x: 0, y: 0, zoom: 1 };
	        this.mouse = { x: 0, y: 0, down: false, onDragInfo: {} };
	        this.objects = [];
	        this.grids = true;
	
	        this.__createView();
	        this.__trackMouse();
	        this.__draggableScreen();
	        this.__zoomableScreen();
	        this.__render();
	    }
	
	    // Private Methods
	
	    _createClass(Vast, [{
	        key: '__trackMouse',
	        value: function __trackMouse() {
	            var _this = this;
	
	            this.view.addEventListener('mousemove', function (e) {
	                _this.mouse.x = e.clientX;
	                _this.mouse.y = e.clientY;
	            });
	        }
	    }, {
	        key: '__draggableScreen',
	        value: function __draggableScreen() {
	            var _this2 = this;
	
	            this.view.addEventListener('mousedown', function () {
	                _this2.mouse.down = true;
	                _this2.mouse.onDragInfo.x = _this2.mouse.x;
	                _this2.mouse.onDragInfo.y = _this2.mouse.y;
	                _this2.mouse.onDragInfo.cameraX = _this2.camera.x;
	                _this2.mouse.onDragInfo.cameraY = _this2.camera.y;
	            });
	            this.view.addEventListener('mousemove', function (e) {
	                if (_this2.mouse.down && !e.altKey) {
	                    _this2.mouse.onDragInfo.x = _this2.mouse.x;
	                    _this2.mouse.onDragInfo.y = _this2.mouse.y;
	                    _this2.mouse.onDragInfo.cameraX = _this2.camera.x;
	                    _this2.mouse.onDragInfo.cameraY = _this2.camera.y;
	                }
	                if (_this2.mouse.down && e.altKey) {
	                    _this2.camera.x = _this2.mouse.onDragInfo.cameraX + (_this2.mouse.onDragInfo.x - _this2.mouse.x) / _this2.camera.zoom;
	                    _this2.camera.y = _this2.mouse.onDragInfo.cameraY + (_this2.mouse.onDragInfo.y - _this2.mouse.y) / _this2.camera.zoom;
	                }
	            });
	            this.view.addEventListener('mouseup', function () {
	                _this2.mouse.down = false;
	            });
	        }
	    }, {
	        key: '__zoomableScreen',
	        value: function __zoomableScreen() {
	            var _this3 = this;
	
	            window.addEventListener('mousewheel', function (e) {
	                _this3.camera.zoom += e.deltaY / 500;
	                _this3.camera.zoom = Math.max(_this3.camera.zoom, 0.2);
	                _this3.camera.zoom = Math.min(_this3.camera.zoom, 5);
	            });
	        }
	    }, {
	        key: '__drawGrids',
	        value: function __drawGrids() {
	            this.ctx.strokeStyle = '#EEE';
	            var size = 50 * this.camera.zoom;
	            var gridBiasX = this.width / 2 % size;
	            var gridBiasY = this.height / 2 % size;
	            for (var i = -this.camera.x * this.camera.zoom % size + gridBiasX; i < this.width; i += size) {
	                this.ctx.beginPath();
	                this.ctx.moveTo(i, 0);
	                this.ctx.lineTo(i, this.height);
	                this.ctx.closePath();
	                this.ctx.stroke();
	            }
	            for (var _i = -this.camera.y * this.camera.zoom % size + gridBiasY; _i < this.height; _i += size) {
	                this.ctx.beginPath();
	                this.ctx.moveTo(0, _i);
	                this.ctx.lineTo(this.width, _i);
	                this.ctx.closePath();
	                this.ctx.stroke();
	            }
	        }
	    }, {
	        key: '__createView',
	        value: function __createView() {
	            this.view = document.createElement('canvas');
	            this.ctx = this.view.getContext('2d');
	            this.__setSize();
	            window.addEventListener('resize', this.__setSize.bind(this));
	        }
	    }, {
	        key: '__setSize',
	        value: function __setSize() {
	            this.view.width = this.width = window.innerWidth;
	            this.view.height = this.height = window.innerHeight;
	        }
	    }, {
	        key: '__render',
	        value: function __render() {
	            var _this4 = this;
	
	            // re-calling render function in the next frame
	            requestAnimationFrame(function () {
	                return _this4.__render();
	            });
	
	            // re-clearing all the canvas
	            this.ctx.clearRect(0, 0, this.width, this.height);
	
	            // Drawing helper grids if it was supposed to be drawn
	            if (this.grids) this.__drawGrids();
	
	            // rendering all vast objects
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var object = _step.value;
	                    object.__changes();
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;
	
	            try {
	                for (var _iterator2 = this.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var _object = _step2.value;
	                    _object.__draw();
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }
	    }, {
	        key: '__calcX',
	        value: function __calcX(x) {
	            return (x - this.camera.x) * this.camera.zoom + this.width / 2;
	        }
	    }, {
	        key: '__calcY',
	        value: function __calcY(y) {
	            return (y - this.camera.y) * this.camera.zoom + this.height / 2;
	        }
	    }, {
	        key: '__deCalcX',
	        value: function __deCalcX(x) {
	            return (x - this.width / 2) / this.camera.zoom + this.camera.x;
	        }
	    }, {
	        key: '__deCalcY',
	        value: function __deCalcY(y) {
	            return (y - this.height / 2) / this.camera.zoom + this.camera.y;
	        }
	
	        // Public Methods
	
	    }, {
	        key: 'add',
	        value: function add(object) {
	            object.__setVast(this);
	            this.objects.push(object);
	        }
	    }]);
	
	    return Vast;
	}();
	
	Vast.Circle = Circle;
	Vast.Rectangle = Rectangle;
	Vast.Path = Path;
	exports.default = Vast;
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VastObject = __webpack_require__(3);
	
	var Circle = function (_VastObject) {
	    _inherits(Circle, _VastObject);
	
	    function Circle(radius) {
	        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	
	        _classCallCheck(this, Circle);
	
	        var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));
	
	        _this.radius = radius;
	        _this.color = '#000';
	        _this.position = { x: x, y: y };
	        return _this;
	    }
	
	    _createClass(Circle, [{
	        key: '__draw',
	        value: function __draw() {
	            var ctx = this.ctx;
	
	            // circle styles
	            ctx.fillStyle = this.color;
	
	            // x, y calculations
	            var x = this.vast.__calcX(this.position.x);
	            var y = this.vast.__calcY(this.position.y);
	            var radius = this.radius * this.vast.camera.zoom;
	
	            // drawing a circle in ctx
	            ctx.beginPath();
	            ctx.arc(x, y, radius, 0, Math.PI * 2);
	            ctx.closePath();
	            ctx.fill();
	        }
	    }]);
	
	    return Circle;
	}(VastObject);
	
	module.exports = Circle;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var VastObject = function () {
	    function VastObject() {
	        _classCallCheck(this, VastObject);
	    }
	
	    _createClass(VastObject, [{
	        key: "__setVast",
	        value: function __setVast(vast) {
	            this.vast = vast;
	            this.ctx = vast.ctx;
	        }
	    }, {
	        key: "__changes",
	        value: function __changes() {}
	    }, {
	        key: "__draw",
	        value: function __draw() {}
	    }]);
	
	    return VastObject;
	}();
	
	module.exports = VastObject;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VastObject = __webpack_require__(3);
	
	var Rectangle = function (_VastObject) {
	    _inherits(Rectangle, _VastObject);
	
	    function Rectangle(width, height) {
	        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	
	        _classCallCheck(this, Rectangle);
	
	        var _this = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this));
	
	        _this.width = width;
	        _this.height = height;
	        _this.color = '#000';
	        _this.position = { x: x, y: y };
	        return _this;
	    }
	
	    // private methods
	
	    _createClass(Rectangle, [{
	        key: '__draw',
	        value: function __draw() {
	            var ctx = this.ctx;
	
	            // rectangle styles
	            ctx.fillStyle = this.color;
	
	            // x, y calculations
	            var x = this.vast.__calcX(this.position.x);
	            var y = this.vast.__calcY(this.position.y);
	            var width = this.width * this.vast.camera.zoom;
	            var height = this.height * this.vast.camera.zoom;
	
	            // drawing a rectangle in ctx
	            ctx.fillRect(x, y, width, height);
	        }
	
	        // public methods
	
	    }, {
	        key: 'export',
	        value: function _export() {
	            var exported = '';
	            exported += 'type=Rectangle\n';
	            exported += 'color=' + this.color + '\n';
	            exported += 'height=' + this.height + '\n';
	            exported += 'width=' + this.width + '\n';
	            exported += 'position=' + this.position.x + '|' + this.position.y;
	            return exported;
	        }
	    }]);
	
	    return Rectangle;
	}(VastObject);
	
	module.exports = Rectangle;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VastObject = __webpack_require__(3);
	
	var Path = function (_VastObject) {
	    _inherits(Path, _VastObject);
	
	    function Path(points) {
	        var tickness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	
	        _classCallCheck(this, Path);
	
	        var _this = _possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this));
	
	        _this.points = points || [];
	        _this.tickness = tickness;
	        _this.smooth = false;
	        _this.color = '#000';
	        return _this;
	    }
	
	    // private methods
	
	    _createClass(Path, [{
	        key: '__smoothDraw',
	        value: function __smoothDraw() {
	            var ctx = this.ctx;
	            var points = this.points;
	
	            // path styles
	            ctx.strokeStyle = this.color;
	            ctx.lineWidth = this.tickness;
	
	            ctx.beginPath();
	
	            if (points == undefined || points.length == 0) {
	                return true;
	            }
	            if (points.length == 1) {
	                ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	                ctx.lineTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	                return true;
	            }
	            if (points.length == 2) {
	                ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	                ctx.lineTo(this.vast.__calcX(points[1].x), this.vast.__calcY(points[1].y));
	                return true;
	            }
	            ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	            for (var i = 1; i < points.length - 2; i++) {
	                var xc = (this.vast.__calcX(points[i].x) + this.vast.__calcX(points[i + 1].x)) / 2;
	                var yc = (this.vast.__calcY(points[i].y) + this.vast.__calcY(points[i + 1].y)) / 2;
	                ctx.quadraticCurveTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y), xc, yc);
	            }
	            ctx.quadraticCurveTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y), this.vast.__calcX(points[i + 1].x), this.vast.__calcY(points[i + 1].y));
	            ctx.stroke();
	        }
	    }, {
	        key: '__hardDraw',
	        value: function __hardDraw() {
	            var ctx = this.ctx;
	            var points = this.points;
	
	            // path styles
	            this.ctx.strokeStyle = this.color;
	            this.ctx.lineWidth = this.tickness;
	
	            // drawing a path in ctx
	
	            ctx.beginPath();
	
	            ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	
	            for (var i = 1; i < points.length; i++) {
	                ctx.lineTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y));
	            }
	            ctx.stroke();
	        }
	    }, {
	        key: '__draw',
	        value: function __draw() {
	
	            // choosing between hard or smooth draw
	            return this.smooth ? this.__smoothDraw() : this.__hardDraw();
	        }
	
	        // public methods
	
	    }, {
	        key: 'export',
	        value: function _export() {
	            var exported = '';
	            exported += 'type=Path\n';
	            exported += 'color=' + this.color + '\n';
	            exported += 'tickness=' + this.tickness + '\n';
	            exported += 'smooth=' + this.smooth + '\n';
	            exported += 'points=' + this.points.map(function (point) {
	                return point.x + ',' + point.y;
	            }).join('|');
	            return exported;
	        }
	    }, {
	        key: 'addPoint',
	        value: function addPoint(point) {
	            this.points.push(point);
	        }
	    }]);
	
	    return Path;
	}(VastObject);
	
	module.exports = Path;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTFkNDVkMDJiMTBmMDViOTliNDQiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvVmFzdE9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvUGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsMERBQTBEO0FBQy9FOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQywyREFBMkQ7QUFDN0Y7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBO0FBQ0EsK0JBQThCLDJEQUEyRDtBQUN6RjtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQSxFQUFDOztBQUVEOztBQUVBLHNDOzs7Ozs7QUMvQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQsaUNBQWdDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFB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QixrREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SixrREFBaUQsYUFBYSx1RkFBdUYsRUFBRSx1RkFBdUY7O0FBRTlPLDJDQUEwQywrREFBK0QscUdBQXFHLEVBQUUseUVBQXlFLGVBQWUseUVBQXlFLEVBQUUsRUFBRSx1SEFBdUg7O0FBRTVlOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLDRCQUEyQixtQkFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLEVBQUM7O0FBRUQsdUIiLCJmaWxlIjoiLi9leGFtcGxlcy9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhMWQ0NWQwMmIxMGYwNWI5OWI0NCIsImNvbnN0IFZhc3QgPSByZXF1aXJlKCcuLi8uLi9saWIvaW5kZXgnKVxuY29uc3QgdmFzdCA9IG5ldyBWYXN0KCk7XG5cbmNvbnN0IGNpcmNsZSA9IG5ldyBWYXN0LkNpcmNsZSgxMCk7XG5jb25zdCBjaXJjbGUyID0gbmV3IFZhc3QuQ2lyY2xlKDIwKTtcbmNvbnN0IHJlY3RhbmdsZSA9IG5ldyBWYXN0LlJlY3RhbmdsZSgxMDAsIDEwMCk7XG5jb25zdCBzcGlyYWwgPSBuZXcgVmFzdC5QYXRoKCk7XG5cbnNwaXJhbC5jb2xvciA9ICcjODg4JztcbmNpcmNsZS5jb2xvciA9ICdyZ2JhKDIwMCwgODAsIDgwLCAxKSc7XG5jaXJjbGUyLmNvbG9yID0gJ3JnYmEoNzAsIDE2MCwgMjMwLCAwLjgpJ1xuXG52YXN0LmFkZChjaXJjbGUpXG52YXN0LmFkZChjaXJjbGUyKVxudmFzdC5hZGQoc3BpcmFsKVxuXG5sZXQgdGltZSA9IDA7XG5cbmNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICB0aW1lKys7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnggPSBNYXRoLmNvcyh0aW1lLzEwKSAqIDQwO1xuICAgIGNpcmNsZS5wb3NpdGlvbi55ID0gTWF0aC5zaW4odGltZS8xMCkgKiA0MDtcbiAgICBjaXJjbGUyLnBvc2l0aW9uLnggPSBNYXRoLnNpbih0aW1lLzIwKSAqIDEwMDtcbiAgICBjaXJjbGUyLnBvc2l0aW9uLnkgPSBNYXRoLmNvcyh0aW1lLzIwKSAqIDIwO1xuICAgIHNwaXJhbC5hZGRQb2ludCh7IHg6IE1hdGguc2luKHRpbWUvMzApICogdGltZSwgeTogTWF0aC5jb3ModGltZS8zMCkgKiB0aW1lfSlcbn1cblxuLy8gRHJhd2luZ1xubGV0IGRyYXdpbmdQYXRoID0gbnVsbDtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICBkcmF3aW5nUGF0aCA9IG5ldyBWYXN0LlBhdGgoW3t4OiB2YXN0Ll9fZGVDYWxjWChlLm9mZnNldFgpLCB5OiB2YXN0Ll9fZGVDYWxjWShlLm9mZnNldFkpfV0pO1xuICAgIGRyYXdpbmdQYXRoLnNtb290aCA9IHRydWU7XG4gICAgdmFzdC5hZGQoZHJhd2luZ1BhdGgpXG59KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xuICAgIGlmIChkcmF3aW5nUGF0aCAmJiAhZS5hbHRLZXkpIHtcbiAgICAgICAgZHJhd2luZ1BhdGguYWRkUG9pbnQoe3g6IHZhc3QuX19kZUNhbGNYKGUub2Zmc2V0WCksIHk6IHZhc3QuX19kZUNhbGNZKGUub2Zmc2V0WSl9KVxuICAgICAgICBjb25zb2xlLmxvZyhkcmF3aW5nUGF0aC5leHBvcnQoKSlcbiAgICB9XG59KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgZHJhd2luZ1BhdGggPSBudWxsO1xufSlcblxucmVuZGVyKCk7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmFzdC52aWV3KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4YW1wbGVzL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIENpcmNsZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9DaXJjbGUnKTtcbnZhciBSZWN0YW5nbGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUmVjdGFuZ2xlJyk7XG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9QYXRoJyk7XG5cbnZhciBWYXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZhc3QoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWYXN0KTtcblxuICAgICAgICB0aGlzLmNhbWVyYSA9IHsgeDogMCwgeTogMCwgem9vbTogMSB9O1xuICAgICAgICB0aGlzLm1vdXNlID0geyB4OiAwLCB5OiAwLCBkb3duOiBmYWxzZSwgb25EcmFnSW5mbzoge30gfTtcbiAgICAgICAgdGhpcy5vYmplY3RzID0gW107XG4gICAgICAgIHRoaXMuZ3JpZHMgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuX19jcmVhdGVWaWV3KCk7XG4gICAgICAgIHRoaXMuX190cmFja01vdXNlKCk7XG4gICAgICAgIHRoaXMuX19kcmFnZ2FibGVTY3JlZW4oKTtcbiAgICAgICAgdGhpcy5fX3pvb21hYmxlU2NyZWVuKCk7XG4gICAgICAgIHRoaXMuX19yZW5kZXIoKTtcbiAgICB9XG5cbiAgICAvLyBQcml2YXRlIE1ldGhvZHNcblxuICAgIF9jcmVhdGVDbGFzcyhWYXN0LCBbe1xuICAgICAgICBrZXk6ICdfX3RyYWNrTW91c2UnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX190cmFja01vdXNlKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS55ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fZHJhZ2dhYmxlU2NyZWVuJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZHJhZ2dhYmxlU2NyZWVuKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnggPSBfdGhpczIubW91c2UueDtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby55ID0gX3RoaXMyLm1vdXNlLnk7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWCA9IF90aGlzMi5jYW1lcmEueDtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFZID0gX3RoaXMyLmNhbWVyYS55O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMyLm1vdXNlLmRvd24gJiYgIWUuYWx0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnggPSBfdGhpczIubW91c2UueDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueSA9IF90aGlzMi5tb3VzZS55O1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFYID0gX3RoaXMyLmNhbWVyYS54O1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFZID0gX3RoaXMyLmNhbWVyYS55O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMyLm1vdXNlLmRvd24gJiYgZS5hbHRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLmNhbWVyYS54ID0gX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWCArIChfdGhpczIubW91c2Uub25EcmFnSW5mby54IC0gX3RoaXMyLm1vdXNlLngpIC8gX3RoaXMyLmNhbWVyYS56b29tO1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuY2FtZXJhLnkgPSBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFZICsgKF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnkgLSBfdGhpczIubW91c2UueSkgLyBfdGhpczIuY2FtZXJhLnpvb207XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2UuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fem9vbWFibGVTY3JlZW4nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX196b29tYWJsZVNjcmVlbigpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmNhbWVyYS56b29tICs9IGUuZGVsdGFZIC8gNTAwO1xuICAgICAgICAgICAgICAgIF90aGlzMy5jYW1lcmEuem9vbSA9IE1hdGgubWF4KF90aGlzMy5jYW1lcmEuem9vbSwgMC4yKTtcbiAgICAgICAgICAgICAgICBfdGhpczMuY2FtZXJhLnpvb20gPSBNYXRoLm1pbihfdGhpczMuY2FtZXJhLnpvb20sIDUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fZHJhd0dyaWRzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZHJhd0dyaWRzKCkge1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnI0VFRSc7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IDUwICogdGhpcy5jYW1lcmEuem9vbTtcbiAgICAgICAgICAgIHZhciBncmlkQmlhc1ggPSB0aGlzLndpZHRoIC8gMiAlIHNpemU7XG4gICAgICAgICAgICB2YXIgZ3JpZEJpYXNZID0gdGhpcy5oZWlnaHQgLyAyICUgc2l6ZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAtdGhpcy5jYW1lcmEueCAqIHRoaXMuY2FtZXJhLnpvb20gJSBzaXplICsgZ3JpZEJpYXNYOyBpIDwgdGhpcy53aWR0aDsgaSArPSBzaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKGksIDApO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IC10aGlzLmNhbWVyYS55ICogdGhpcy5jYW1lcmEuem9vbSAlIHNpemUgKyBncmlkQmlhc1k7IF9pIDwgdGhpcy5oZWlnaHQ7IF9pICs9IHNpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgX2kpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLndpZHRoLCBfaSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fY3JlYXRlVmlldycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2NyZWF0ZVZpZXcoKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy52aWV3LmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICB0aGlzLl9fc2V0U2l6ZSgpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX19zZXRTaXplLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX3NldFNpemUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19zZXRTaXplKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LndpZHRoID0gdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy52aWV3LmhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3JlbmRlcigpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyByZS1jYWxsaW5nIHJlbmRlciBmdW5jdGlvbiBpbiB0aGUgbmV4dCBmcmFtZVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM0Ll9fcmVuZGVyKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gcmUtY2xlYXJpbmcgYWxsIHRoZSBjYW52YXNcbiAgICAgICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgICAgIC8vIERyYXdpbmcgaGVscGVyIGdyaWRzIGlmIGl0IHdhcyBzdXBwb3NlZCB0byBiZSBkcmF3blxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZHMpIHRoaXMuX19kcmF3R3JpZHMoKTtcblxuICAgICAgICAgICAgLy8gcmVuZGVyaW5nIGFsbCB2YXN0IG9iamVjdHNcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IHRoaXMub2JqZWN0c1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuX19jaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjIgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IHRoaXMub2JqZWN0c1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwMjsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IChfc3RlcDIgPSBfaXRlcmF0b3IyLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX29iamVjdCA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgX29iamVjdC5fX2RyYXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yMiA9IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiAmJiBfaXRlcmF0b3IyLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yMi5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcjIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19jYWxjWCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2NhbGNYKHgpIHtcbiAgICAgICAgICAgIHJldHVybiAoeCAtIHRoaXMuY2FtZXJhLngpICogdGhpcy5jYW1lcmEuem9vbSArIHRoaXMud2lkdGggLyAyO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2NhbGNZJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fY2FsY1koeSkge1xuICAgICAgICAgICAgcmV0dXJuICh5IC0gdGhpcy5jYW1lcmEueSkgKiB0aGlzLmNhbWVyYS56b29tICsgdGhpcy5oZWlnaHQgLyAyO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RlQ2FsY1gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kZUNhbGNYKHgpIHtcbiAgICAgICAgICAgIHJldHVybiAoeCAtIHRoaXMud2lkdGggLyAyKSAvIHRoaXMuY2FtZXJhLnpvb20gKyB0aGlzLmNhbWVyYS54O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RlQ2FsY1knLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kZUNhbGNZKHkpIHtcbiAgICAgICAgICAgIHJldHVybiAoeSAtIHRoaXMuaGVpZ2h0IC8gMikgLyB0aGlzLmNhbWVyYS56b29tICsgdGhpcy5jYW1lcmEueTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1YmxpYyBNZXRob2RzXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2FkZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3QuX19zZXRWYXN0KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5vYmplY3RzLnB1c2gob2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBWYXN0O1xufSgpO1xuXG5WYXN0LkNpcmNsZSA9IENpcmNsZTtcblZhc3QuUmVjdGFuZ2xlID0gUmVjdGFuZ2xlO1xuVmFzdC5QYXRoID0gUGF0aDtcbmV4cG9ydHMuZGVmYXVsdCA9IFZhc3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIFZhc3RPYmplY3QgPSByZXF1aXJlKCcuL1Zhc3RPYmplY3QnKTtcblxudmFyIENpcmNsZSA9IGZ1bmN0aW9uIChfVmFzdE9iamVjdCkge1xuICAgIF9pbmhlcml0cyhDaXJjbGUsIF9WYXN0T2JqZWN0KTtcblxuICAgIGZ1bmN0aW9uIENpcmNsZShyYWRpdXMpIHtcbiAgICAgICAgdmFyIHggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gICAgICAgIHZhciB5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDaXJjbGUpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChDaXJjbGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihDaXJjbGUpKS5jYWxsKHRoaXMpKTtcblxuICAgICAgICBfdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJyMwMDAnO1xuICAgICAgICBfdGhpcy5wb3NpdGlvbiA9IHsgeDogeCwgeTogeSB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKENpcmNsZSwgW3tcbiAgICAgICAga2V5OiAnX19kcmF3JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZHJhdygpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSB0aGlzLmN0eDtcblxuICAgICAgICAgICAgLy8gY2lyY2xlIHN0eWxlc1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG5cbiAgICAgICAgICAgIC8vIHgsIHkgY2FsY3VsYXRpb25zXG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMudmFzdC5fX2NhbGNYKHRoaXMucG9zaXRpb24ueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMudmFzdC5fX2NhbGNZKHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICB2YXIgcmFkaXVzID0gdGhpcy5yYWRpdXMgKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSBjaXJjbGUgaW4gY3R4XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDaXJjbGU7XG59KFZhc3RPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9jb21wb25lbnRzL0NpcmNsZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFZhc3RPYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmFzdE9iamVjdCgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZhc3RPYmplY3QpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhWYXN0T2JqZWN0LCBbe1xuICAgICAgICBrZXk6IFwiX19zZXRWYXN0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3NldFZhc3QodmFzdCkge1xuICAgICAgICAgICAgdGhpcy52YXN0ID0gdmFzdDtcbiAgICAgICAgICAgIHRoaXMuY3R4ID0gdmFzdC5jdHg7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJfX2NoYW5nZXNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fY2hhbmdlcygpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX19kcmF3XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYXcoKSB7fVxuICAgIH1dKTtcblxuICAgIHJldHVybiBWYXN0T2JqZWN0O1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZhc3RPYmplY3Q7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9WYXN0T2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgVmFzdE9iamVjdCA9IHJlcXVpcmUoJy4vVmFzdE9iamVjdCcpO1xuXG52YXIgUmVjdGFuZ2xlID0gZnVuY3Rpb24gKF9WYXN0T2JqZWN0KSB7XG4gICAgX2luaGVyaXRzKFJlY3RhbmdsZSwgX1Zhc3RPYmplY3QpO1xuXG4gICAgZnVuY3Rpb24gUmVjdGFuZ2xlKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICAgIHZhciB5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZWN0YW5nbGUpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChSZWN0YW5nbGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihSZWN0YW5nbGUpKS5jYWxsKHRoaXMpKTtcblxuICAgICAgICBfdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBfdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJyMwMDAnO1xuICAgICAgICBfdGhpcy5wb3NpdGlvbiA9IHsgeDogeCwgeTogeSB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBfY3JlYXRlQ2xhc3MoUmVjdGFuZ2xlLCBbe1xuICAgICAgICBrZXk6ICdfX2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgICAgICAgICAvLyByZWN0YW5nbGUgc3R5bGVzXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblxuICAgICAgICAgICAgLy8geCwgeSBjYWxjdWxhdGlvbnNcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy52YXN0Ll9fY2FsY1godGhpcy5wb3NpdGlvbi54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy52YXN0Ll9fY2FsY1kodGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGggKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSByZWN0YW5nbGUgaW4gY3R4XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdleHBvcnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2V4cG9ydCgpIHtcbiAgICAgICAgICAgIHZhciBleHBvcnRlZCA9ICcnO1xuICAgICAgICAgICAgZXhwb3J0ZWQgKz0gJ3R5cGU9UmVjdGFuZ2xlXFxuJztcbiAgICAgICAgICAgIGV4cG9ydGVkICs9ICdjb2xvcj0nICsgdGhpcy5jb2xvciArICdcXG4nO1xuICAgICAgICAgICAgZXhwb3J0ZWQgKz0gJ2hlaWdodD0nICsgdGhpcy5oZWlnaHQgKyAnXFxuJztcbiAgICAgICAgICAgIGV4cG9ydGVkICs9ICd3aWR0aD0nICsgdGhpcy53aWR0aCArICdcXG4nO1xuICAgICAgICAgICAgZXhwb3J0ZWQgKz0gJ3Bvc2l0aW9uPScgKyB0aGlzLnBvc2l0aW9uLnggKyAnfCcgKyB0aGlzLnBvc2l0aW9uLnk7XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0ZWQ7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmVjdGFuZ2xlO1xufShWYXN0T2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWN0YW5nbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBWYXN0T2JqZWN0ID0gcmVxdWlyZSgnLi9WYXN0T2JqZWN0Jyk7XG5cbnZhciBQYXRoID0gZnVuY3Rpb24gKF9WYXN0T2JqZWN0KSB7XG4gICAgX2luaGVyaXRzKFBhdGgsIF9WYXN0T2JqZWN0KTtcblxuICAgIGZ1bmN0aW9uIFBhdGgocG9pbnRzKSB7XG4gICAgICAgIHZhciB0aWNrbmVzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMjtcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGF0aCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFBhdGguX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQYXRoKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgX3RoaXMucG9pbnRzID0gcG9pbnRzIHx8IFtdO1xuICAgICAgICBfdGhpcy50aWNrbmVzcyA9IHRpY2tuZXNzO1xuICAgICAgICBfdGhpcy5zbW9vdGggPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuY29sb3IgPSAnIzAwMCc7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIF9jcmVhdGVDbGFzcyhQYXRoLCBbe1xuICAgICAgICBrZXk6ICdfX3Ntb290aERyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19zbW9vdGhEcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgICAgICAgICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgICAgICAgICAvLyBwYXRoIHN0eWxlc1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLnRpY2tuZXNzO1xuXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIGlmIChwb2ludHMgPT0gdW5kZWZpbmVkIHx8IHBvaW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvaW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzWzBdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbMF0ueSkpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzWzBdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbMF0ueSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvaW50cy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzWzBdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbMF0ueSkpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzWzFdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbMV0ueSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbMF0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1swXS55KSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeGMgPSAodGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2ldLngpICsgdGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2kgKyAxXS54KSkgLyAyO1xuICAgICAgICAgICAgICAgIHZhciB5YyA9ICh0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaV0ueSkgKyB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaSArIDFdLnkpKSAvIDI7XG4gICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2ldLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaV0ueSksIHhjLCB5Yyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbaV0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1tpXS55KSwgdGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2kgKyAxXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzW2kgKyAxXS55KSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19faGFyZERyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19oYXJkRHJhdygpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICAgICAgICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50cztcblxuICAgICAgICAgICAgLy8gcGF0aCBzdHlsZXNcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMudGlja25lc3M7XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSBwYXRoIGluIGN0eFxuXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIGN0eC5tb3ZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzWzBdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbMF0ueSkpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2ldLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaV0ueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3KCkge1xuXG4gICAgICAgICAgICAvLyBjaG9vc2luZyBiZXR3ZWVuIGhhcmQgb3Igc21vb3RoIGRyYXdcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNtb290aCA/IHRoaXMuX19zbW9vdGhEcmF3KCkgOiB0aGlzLl9faGFyZERyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2V4cG9ydCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZXhwb3J0KCkge1xuICAgICAgICAgICAgdmFyIGV4cG9ydGVkID0gJyc7XG4gICAgICAgICAgICBleHBvcnRlZCArPSAndHlwZT1QYXRoXFxuJztcbiAgICAgICAgICAgIGV4cG9ydGVkICs9ICdjb2xvcj0nICsgdGhpcy5jb2xvciArICdcXG4nO1xuICAgICAgICAgICAgZXhwb3J0ZWQgKz0gJ3RpY2tuZXNzPScgKyB0aGlzLnRpY2tuZXNzICsgJ1xcbic7XG4gICAgICAgICAgICBleHBvcnRlZCArPSAnc21vb3RoPScgKyB0aGlzLnNtb290aCArICdcXG4nO1xuICAgICAgICAgICAgZXhwb3J0ZWQgKz0gJ3BvaW50cz0nICsgdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludC54ICsgJywnICsgcG9pbnQueTtcbiAgICAgICAgICAgIH0pLmpvaW4oJ3wnKTtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnRlZDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnYWRkUG9pbnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkUG9pbnQocG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFBhdGg7XG59KFZhc3RPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9QYXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=