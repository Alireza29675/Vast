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
	
	    _createClass(Path, [{
	        key: 'addPoint',
	        value: function addPoint(point) {
	            this.points.push(point);
	        }
	    }, {
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
	    }]);
	
	    return Path;
	}(VastObject);
	
	module.exports = Path;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGQzZDlhZDQxZDk1MjEwZGNlNTgiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvVmFzdE9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvUGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsMERBQTBEO0FBQy9FOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQywyREFBMkQ7QUFDN0Y7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBO0FBQ0EsK0JBQThCLDJEQUEyRDtBQUN6RjtBQUNBLEVBQUM7QUFDRDtBQUNBO0FBQ0EsRUFBQzs7QUFFRDs7QUFFQSxzQzs7Ozs7O0FDOUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOztBQUVELGlDQUFnQywyQ0FBMkMsZ0JBQWdCLGtCQUFrQixPQUFPLDJCQUEyQix3REFBd0QsZ0NBQWdDLHVEQUF1RCwyREFBMkQsRUFBRSxFQUFFLHlEQUF5RCxxRUFBcUUsNkRBQTZELG9C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QywrREFBK0QscUdBQXFHLEVBQUUseUVBQXlFLGVBQWUseUVBQXlFLEVBQUUsRUFBRSx1SEFBdUg7O0FBRTVlOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLDRCQUEyQixtQkFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsRUFBQzs7QUFFRCx1QiIsImZpbGUiOiIuL2V4YW1wbGVzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDRkM2Q5YWQ0MWQ5NTIxMGRjZTU4IiwiY29uc3QgVmFzdCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pbmRleCcpXG5jb25zdCB2YXN0ID0gbmV3IFZhc3QoKTtcblxuY29uc3QgY2lyY2xlID0gbmV3IFZhc3QuQ2lyY2xlKDEwKTtcbmNvbnN0IGNpcmNsZTIgPSBuZXcgVmFzdC5DaXJjbGUoMjApO1xuY29uc3QgcmVjdGFuZ2xlID0gbmV3IFZhc3QuUmVjdGFuZ2xlKDEwMCwgMTAwKTtcbmNvbnN0IHNwaXJhbCA9IG5ldyBWYXN0LlBhdGgoKTtcblxuc3BpcmFsLmNvbG9yID0gJyM4ODgnO1xuY2lyY2xlLmNvbG9yID0gJ3JnYmEoMjAwLCA4MCwgODAsIDEpJztcbmNpcmNsZTIuY29sb3IgPSAncmdiYSg3MCwgMTYwLCAyMzAsIDAuOCknXG5cbnZhc3QuYWRkKGNpcmNsZSlcbnZhc3QuYWRkKGNpcmNsZTIpXG52YXN0LmFkZChzcGlyYWwpXG5cbmxldCB0aW1lID0gMDtcblxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgIHRpbWUrKztcbiAgICBjaXJjbGUucG9zaXRpb24ueCA9IE1hdGguY29zKHRpbWUvMTApICogNDA7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnkgPSBNYXRoLnNpbih0aW1lLzEwKSAqIDQwO1xuICAgIGNpcmNsZTIucG9zaXRpb24ueCA9IE1hdGguc2luKHRpbWUvMjApICogMTAwO1xuICAgIGNpcmNsZTIucG9zaXRpb24ueSA9IE1hdGguY29zKHRpbWUvMjApICogMjA7XG4gICAgc3BpcmFsLmFkZFBvaW50KHsgeDogTWF0aC5zaW4odGltZS8zMCkgKiB0aW1lLCB5OiBNYXRoLmNvcyh0aW1lLzMwKSAqIHRpbWV9KVxufVxuXG4vLyBEcmF3aW5nXG5sZXQgZHJhd2luZ1BhdGggPSBudWxsO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgIGRyYXdpbmdQYXRoID0gbmV3IFZhc3QuUGF0aChbe3g6IHZhc3QuX19kZUNhbGNYKGUub2Zmc2V0WCksIHk6IHZhc3QuX19kZUNhbGNZKGUub2Zmc2V0WSl9XSk7XG4gICAgZHJhd2luZ1BhdGguc21vb3RoID0gdHJ1ZTtcbiAgICB2YXN0LmFkZChkcmF3aW5nUGF0aClcbn0pXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZSA9PiB7XG4gICAgaWYgKGRyYXdpbmdQYXRoICYmICFlLmFsdEtleSkge1xuICAgICAgICBkcmF3aW5nUGF0aC5hZGRQb2ludCh7eDogdmFzdC5fX2RlQ2FsY1goZS5vZmZzZXRYKSwgeTogdmFzdC5fX2RlQ2FsY1koZS5vZmZzZXRZKX0pXG4gICAgfVxufSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgIGRyYXdpbmdQYXRoID0gbnVsbDtcbn0pXG5cbnJlbmRlcigpO1xuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZhc3Qudmlldyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leGFtcGxlcy9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBDaXJjbGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ2lyY2xlJyk7XG52YXIgUmVjdGFuZ2xlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1JlY3RhbmdsZScpO1xudmFyIFBhdGggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGF0aCcpO1xuXG52YXIgVmFzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWYXN0KCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVmFzdCk7XG5cbiAgICAgICAgdGhpcy5jYW1lcmEgPSB7IHg6IDAsIHk6IDAsIHpvb206IDEgfTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IHsgeDogMCwgeTogMCwgZG93bjogZmFsc2UsIG9uRHJhZ0luZm86IHt9IH07XG4gICAgICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWRzID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9fY3JlYXRlVmlldygpO1xuICAgICAgICB0aGlzLl9fdHJhY2tNb3VzZSgpO1xuICAgICAgICB0aGlzLl9fZHJhZ2dhYmxlU2NyZWVuKCk7XG4gICAgICAgIHRoaXMuX196b29tYWJsZVNjcmVlbigpO1xuICAgICAgICB0aGlzLl9fcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgLy8gUHJpdmF0ZSBNZXRob2RzXG5cbiAgICBfY3JlYXRlQ2xhc3MoVmFzdCwgW3tcbiAgICAgICAga2V5OiAnX190cmFja01vdXNlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fdHJhY2tNb3VzZSgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgX3RoaXMubW91c2UueSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RyYWdnYWJsZVNjcmVlbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYWdnYWJsZVNjcmVlbigpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5kb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby54ID0gX3RoaXMyLm1vdXNlLng7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueSA9IF90aGlzMi5tb3VzZS55O1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVggPSBfdGhpczIuY2FtZXJhLng7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWSA9IF90aGlzMi5jYW1lcmEueTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzMi5tb3VzZS5kb3duICYmICFlLmFsdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby54ID0gX3RoaXMyLm1vdXNlLng7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnkgPSBfdGhpczIubW91c2UueTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWCA9IF90aGlzMi5jYW1lcmEueDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWSA9IF90aGlzMi5jYW1lcmEueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzMi5tb3VzZS5kb3duICYmIGUuYWx0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5jYW1lcmEueCA9IF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVggKyAoX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueCAtIF90aGlzMi5tb3VzZS54KSAvIF90aGlzMi5jYW1lcmEuem9vbTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLmNhbWVyYS55ID0gX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWSArIChfdGhpczIubW91c2Uub25EcmFnSW5mby55IC0gX3RoaXMyLm1vdXNlLnkpIC8gX3RoaXMyLmNhbWVyYS56b29tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLmRvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX3pvb21hYmxlU2NyZWVuJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fem9vbWFibGVTY3JlZW4oKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF90aGlzMy5jYW1lcmEuem9vbSArPSBlLmRlbHRhWSAvIDUwMDtcbiAgICAgICAgICAgICAgICBfdGhpczMuY2FtZXJhLnpvb20gPSBNYXRoLm1heChfdGhpczMuY2FtZXJhLnpvb20sIDAuMik7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmNhbWVyYS56b29tID0gTWF0aC5taW4oX3RoaXMzLmNhbWVyYS56b29tLCA1KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RyYXdHcmlkcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYXdHcmlkcygpIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJyNFRUUnO1xuICAgICAgICAgICAgdmFyIHNpemUgPSA1MCAqIHRoaXMuY2FtZXJhLnpvb207XG4gICAgICAgICAgICB2YXIgZ3JpZEJpYXNYID0gdGhpcy53aWR0aCAvIDIgJSBzaXplO1xuICAgICAgICAgICAgdmFyIGdyaWRCaWFzWSA9IHRoaXMuaGVpZ2h0IC8gMiAlIHNpemU7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gLXRoaXMuY2FtZXJhLnggKiB0aGlzLmNhbWVyYS56b29tICUgc2l6ZSArIGdyaWRCaWFzWDsgaSA8IHRoaXMud2lkdGg7IGkgKz0gc2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhpLCAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8oaSwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAtdGhpcy5jYW1lcmEueSAqIHRoaXMuY2FtZXJhLnpvb20gJSBzaXplICsgZ3JpZEJpYXNZOyBfaSA8IHRoaXMuaGVpZ2h0OyBfaSArPSBzaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIF9pKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy53aWR0aCwgX2kpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2NyZWF0ZVZpZXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19jcmVhdGVWaWV3KCkge1xuICAgICAgICAgICAgdGhpcy52aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICB0aGlzLmN0eCA9IHRoaXMudmlldy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgdGhpcy5fX3NldFNpemUoKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9fc2V0U2l6ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19zZXRTaXplJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc2V0U2l6ZSgpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy53aWR0aCA9IHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIHRoaXMudmlldy5oZWlnaHQgPSB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19yZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19yZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICAgICAgLy8gcmUtY2FsbGluZyByZW5kZXIgZnVuY3Rpb24gaW4gdGhlIG5leHQgZnJhbWVcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzNC5fX3JlbmRlcigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHJlLWNsZWFyaW5nIGFsbCB0aGUgY2FudmFzXG4gICAgICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgICAgICAvLyBEcmF3aW5nIGhlbHBlciBncmlkcyBpZiBpdCB3YXMgc3VwcG9zZWQgdG8gYmUgZHJhd25cbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWRzKSB0aGlzLl9fZHJhd0dyaWRzKCk7XG5cbiAgICAgICAgICAgIC8vIHJlbmRlcmluZyBhbGwgdmFzdCBvYmplY3RzXG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSB0aGlzLm9iamVjdHNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Ll9fY2hhbmdlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IyID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IyID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIgPSB0aGlzLm9iamVjdHNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDI7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSAoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9vYmplY3QgPSBfc3RlcDIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIF9vYmplY3QuX19kcmF3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjIgPSBlcnI7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgJiYgX2l0ZXJhdG9yMi5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjIucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fY2FsY1gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19jYWxjWCh4KSB7XG4gICAgICAgICAgICByZXR1cm4gKHggLSB0aGlzLmNhbWVyYS54KSAqIHRoaXMuY2FtZXJhLnpvb20gKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19jYWxjWScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2NhbGNZKHkpIHtcbiAgICAgICAgICAgIHJldHVybiAoeSAtIHRoaXMuY2FtZXJhLnkpICogdGhpcy5jYW1lcmEuem9vbSArIHRoaXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19kZUNhbGNYJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZGVDYWxjWCh4KSB7XG4gICAgICAgICAgICByZXR1cm4gKHggLSB0aGlzLndpZHRoIC8gMikgLyB0aGlzLmNhbWVyYS56b29tICsgdGhpcy5jYW1lcmEueDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19kZUNhbGNZJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZGVDYWxjWSh5KSB7XG4gICAgICAgICAgICByZXR1cm4gKHkgLSB0aGlzLmhlaWdodCAvIDIpIC8gdGhpcy5jYW1lcmEuem9vbSArIHRoaXMuY2FtZXJhLnk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQdWJsaWMgTWV0aG9kc1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6ICdhZGQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0Ll9fc2V0VmFzdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gVmFzdDtcbn0oKTtcblxuVmFzdC5DaXJjbGUgPSBDaXJjbGU7XG5WYXN0LlJlY3RhbmdsZSA9IFJlY3RhbmdsZTtcblZhc3QuUGF0aCA9IFBhdGg7XG5leHBvcnRzLmRlZmF1bHQgPSBWYXN0O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBWYXN0T2JqZWN0ID0gcmVxdWlyZSgnLi9WYXN0T2JqZWN0Jyk7XG5cbnZhciBDaXJjbGUgPSBmdW5jdGlvbiAoX1Zhc3RPYmplY3QpIHtcbiAgICBfaW5oZXJpdHMoQ2lyY2xlLCBfVmFzdE9iamVjdCk7XG5cbiAgICBmdW5jdGlvbiBDaXJjbGUocmFkaXVzKSB7XG4gICAgICAgIHZhciB4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgICAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2lyY2xlKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQ2lyY2xlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ2lyY2xlKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgX3RoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgX3RoaXMucG9zaXRpb24gPSB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhDaXJjbGUsIFt7XG4gICAgICAgIGtleTogJ19fZHJhdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYXcoKSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICAgICAgICAgIC8vIGNpcmNsZSBzdHlsZXNcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuXG4gICAgICAgICAgICAvLyB4LCB5IGNhbGN1bGF0aW9uc1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLnZhc3QuX19jYWxjWCh0aGlzLnBvc2l0aW9uLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLnZhc3QuX19jYWxjWSh0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgdmFyIHJhZGl1cyA9IHRoaXMucmFkaXVzICogdGhpcy52YXN0LmNhbWVyYS56b29tO1xuXG4gICAgICAgICAgICAvLyBkcmF3aW5nIGEgY2lyY2xlIGluIGN0eFxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQ2lyY2xlO1xufShWYXN0T2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBWYXN0T2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZhc3RPYmplY3QoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWYXN0T2JqZWN0KTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoVmFzdE9iamVjdCwgW3tcbiAgICAgICAga2V5OiBcIl9fc2V0VmFzdFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19zZXRWYXN0KHZhc3QpIHtcbiAgICAgICAgICAgIHRoaXMudmFzdCA9IHZhc3Q7XG4gICAgICAgICAgICB0aGlzLmN0eCA9IHZhc3QuY3R4O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX19jaGFuZ2VzXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2NoYW5nZXMoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIl9fZHJhd1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3KCkge31cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gVmFzdE9iamVjdDtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWYXN0T2JqZWN0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2NvbXBvbmVudHMvVmFzdE9iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIFZhc3RPYmplY3QgPSByZXF1aXJlKCcuL1Zhc3RPYmplY3QnKTtcblxudmFyIFJlY3RhbmdsZSA9IGZ1bmN0aW9uIChfVmFzdE9iamVjdCkge1xuICAgIF9pbmhlcml0cyhSZWN0YW5nbGUsIF9WYXN0T2JqZWN0KTtcblxuICAgIGZ1bmN0aW9uIFJlY3RhbmdsZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciB4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwO1xuICAgICAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogMDtcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVjdGFuZ2xlKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUmVjdGFuZ2xlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUmVjdGFuZ2xlKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgX3RoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgX3RoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBfdGhpcy5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgX3RoaXMucG9zaXRpb24gPSB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhSZWN0YW5nbGUsIFt7XG4gICAgICAgIGtleTogJ19fZHJhdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYXcoKSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICAgICAgICAgIC8vIHJlY3RhbmdsZSBzdHlsZXNcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuXG4gICAgICAgICAgICAvLyB4LCB5IGNhbGN1bGF0aW9uc1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLnZhc3QuX19jYWxjWCh0aGlzLnBvc2l0aW9uLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLnZhc3QuX19jYWxjWSh0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gdGhpcy53aWR0aCAqIHRoaXMudmFzdC5jYW1lcmEuem9vbTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodCAqIHRoaXMudmFzdC5jYW1lcmEuem9vbTtcblxuICAgICAgICAgICAgLy8gZHJhd2luZyBhIHJlY3RhbmdsZSBpbiBjdHhcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBSZWN0YW5nbGU7XG59KFZhc3RPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY3RhbmdsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9jb21wb25lbnRzL1JlY3RhbmdsZS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIFZhc3RPYmplY3QgPSByZXF1aXJlKCcuL1Zhc3RPYmplY3QnKTtcblxudmFyIFBhdGggPSBmdW5jdGlvbiAoX1Zhc3RPYmplY3QpIHtcbiAgICBfaW5oZXJpdHMoUGF0aCwgX1Zhc3RPYmplY3QpO1xuXG4gICAgZnVuY3Rpb24gUGF0aChwb2ludHMpIHtcbiAgICAgICAgdmFyIHRpY2tuZXNzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAyO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQYXRoKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUGF0aC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFBhdGgpKS5jYWxsKHRoaXMpKTtcblxuICAgICAgICBfdGhpcy5wb2ludHMgPSBwb2ludHMgfHwgW107XG4gICAgICAgIF90aGlzLnRpY2tuZXNzID0gdGlja25lc3M7XG4gICAgICAgIF90aGlzLnNtb290aCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQYXRoLCBbe1xuICAgICAgICBrZXk6ICdhZGRQb2ludCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRQb2ludChwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaChwb2ludCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fc21vb3RoRHJhdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3Ntb290aERyYXcoKSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG4gICAgICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG5cbiAgICAgICAgICAgIC8vIHBhdGggc3R5bGVzXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMudGlja25lc3M7XG5cbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgICAgICAgICAgaWYgKHBvaW50cyA9PSB1bmRlZmluZWQgfHwgcG9pbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbMF0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1swXS55KSk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbMF0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1swXS55KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbMF0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1swXS55KSk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbMV0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1sxXS55KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHgubW92ZVRvKHRoaXMudmFzdC5fX2NhbGNYKHBvaW50c1swXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzWzBdLnkpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB4YyA9ICh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbaV0ueCkgKyB0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbaSArIDFdLngpKSAvIDI7XG4gICAgICAgICAgICAgICAgdmFyIHljID0gKHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1tpXS55KSArIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1tpICsgMV0ueSkpIC8gMjtcbiAgICAgICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbaV0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1tpXS55KSwgeGMsIHljKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHRoaXMudmFzdC5fX2NhbGNYKHBvaW50c1tpXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzW2ldLnkpLCB0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbaSArIDFdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaSArIDFdLnkpKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19oYXJkRHJhdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2hhcmREcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgICAgICAgICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgICAgICAgICAvLyBwYXRoIHN0eWxlc1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gdGhpcy50aWNrbmVzcztcblxuICAgICAgICAgICAgLy8gZHJhd2luZyBhIHBhdGggaW4gY3R4XG5cbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbMF0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1swXS55KSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh0aGlzLnZhc3QuX19jYWxjWChwb2ludHNbaV0ueCksIHRoaXMudmFzdC5fX2NhbGNZKHBvaW50c1tpXS55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fZHJhdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYXcoKSB7XG5cbiAgICAgICAgICAgIC8vIGNob29zaW5nIGJldHdlZW4gaGFyZCBvciBzbW9vdGggZHJhd1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc21vb3RoID8gdGhpcy5fX3Ntb290aERyYXcoKSA6IHRoaXMuX19oYXJkRHJhdygpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFBhdGg7XG59KFZhc3RPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9QYXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=