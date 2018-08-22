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
	const path = new Vast.Path();
	
	path.color = '#888';
	circle.color = 'rgba(200, 80, 80, 1)';
	circle2.color = 'rgba(70, 160, 230, 0.8)'
	
	vast.add(circle)
	vast.add(circle2)
	vast.add(path)
	
	let time = 0;
	
	const render = () => {
	    requestAnimationFrame(render);
	    time++;
	    circle.position.x = Math.cos(time/10) * 40;
	    circle.position.y = Math.sin(time/10) * 40;
	    circle2.position.x = Math.sin(time/20) * 100;
	    circle2.position.y = Math.cos(time/20) * 20;
	    path.addPoint({ x: Math.sin(time/30) * time, y: Math.cos(time/30) * time})
	}
	
	// Drawing
	let drawingPath = null;
	window.addEventListener('mousedown', e => {
	    drawingPath = new Vast.Path([{x: vast.__deCalcX(e.offsetX), y: vast.__deCalcY(e.offsetY)}]);
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
	        _this.color = '#000';
	        return _this;
	    }
	
	    _createClass(Path, [{
	        key: 'addPoint',
	        value: function addPoint(point) {
	            // if (!point.x) throw Error ('Point must have { x: Number } property');
	            // if (!point.y) throw Error ('Point must have { x: Number } property');
	            this.points.push(point);
	        }
	    }, {
	        key: '__draw',
	        value: function __draw() {
	            var ctx = this.ctx;
	            var points = this.points;
	
	            // path styles
	            ctx.strokeStyle = this.color;
	            ctx.lineWidth = this.tickness;
	
	            // drawing a path in ctx
	
	            ctx.beginPath();
	
	            ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	
	            for (var i = 1; i < points.length; i++) {
	                ctx.lineTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y));
	            }
	
	            ctx.stroke();
	        }
	    }]);
	
	    return Path;
	}(VastObject);
	
	module.exports = Path;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzRjZDkyNWNlYjc5MjMzODZlOWQiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvVmFzdE9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvUGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsMERBQTBEO0FBQzdFOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQywyREFBMkQ7QUFDN0Y7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBLCtCQUE4QiwyREFBMkQ7QUFDekY7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7O0FBRUEsc0M7Ozs7OztBQzdDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRCxpQ0FBZ0MsMkNBQTJDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQsMkRBQTJELEVBQUUsRUFBRSx5REFBeUQscUVBQXFFLDZEQUE2RCxvQkFBb0Is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QStELHFHQUFxRyxFQUFFLHlFQUF5RSxlQUFlLHlFQUF5RSxFQUFFLEVBQUUsdUhBQXVIOztBQUU1ZTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2REFBNEQsWUFBWTtBQUN4RSw2REFBNEQsWUFBWTtBQUN4RTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSw0QkFBMkIsbUJBQW1CO0FBQzlDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxFQUFDOztBQUVELHVCIiwiZmlsZSI6Ii4vZXhhbXBsZXMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzRjZDkyNWNlYjc5MjMzODZlOWQiLCJjb25zdCBWYXN0ID0gcmVxdWlyZSgnLi4vLi4vbGliL2luZGV4JylcbmNvbnN0IHZhc3QgPSBuZXcgVmFzdCgpO1xuXG5jb25zdCBjaXJjbGUgPSBuZXcgVmFzdC5DaXJjbGUoMTApO1xuY29uc3QgY2lyY2xlMiA9IG5ldyBWYXN0LkNpcmNsZSgyMCk7XG5jb25zdCByZWN0YW5nbGUgPSBuZXcgVmFzdC5SZWN0YW5nbGUoMTAwLCAxMDApO1xuY29uc3QgcGF0aCA9IG5ldyBWYXN0LlBhdGgoKTtcblxucGF0aC5jb2xvciA9ICcjODg4JztcbmNpcmNsZS5jb2xvciA9ICdyZ2JhKDIwMCwgODAsIDgwLCAxKSc7XG5jaXJjbGUyLmNvbG9yID0gJ3JnYmEoNzAsIDE2MCwgMjMwLCAwLjgpJ1xuXG52YXN0LmFkZChjaXJjbGUpXG52YXN0LmFkZChjaXJjbGUyKVxudmFzdC5hZGQocGF0aClcblxubGV0IHRpbWUgPSAwO1xuXG5jb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgdGltZSsrO1xuICAgIGNpcmNsZS5wb3NpdGlvbi54ID0gTWF0aC5jb3ModGltZS8xMCkgKiA0MDtcbiAgICBjaXJjbGUucG9zaXRpb24ueSA9IE1hdGguc2luKHRpbWUvMTApICogNDA7XG4gICAgY2lyY2xlMi5wb3NpdGlvbi54ID0gTWF0aC5zaW4odGltZS8yMCkgKiAxMDA7XG4gICAgY2lyY2xlMi5wb3NpdGlvbi55ID0gTWF0aC5jb3ModGltZS8yMCkgKiAyMDtcbiAgICBwYXRoLmFkZFBvaW50KHsgeDogTWF0aC5zaW4odGltZS8zMCkgKiB0aW1lLCB5OiBNYXRoLmNvcyh0aW1lLzMwKSAqIHRpbWV9KVxufVxuXG4vLyBEcmF3aW5nXG5sZXQgZHJhd2luZ1BhdGggPSBudWxsO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgIGRyYXdpbmdQYXRoID0gbmV3IFZhc3QuUGF0aChbe3g6IHZhc3QuX19kZUNhbGNYKGUub2Zmc2V0WCksIHk6IHZhc3QuX19kZUNhbGNZKGUub2Zmc2V0WSl9XSk7XG4gICAgdmFzdC5hZGQoZHJhd2luZ1BhdGgpXG59KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xuICAgIGlmIChkcmF3aW5nUGF0aCAmJiAhZS5hbHRLZXkpIHtcbiAgICAgICAgZHJhd2luZ1BhdGguYWRkUG9pbnQoe3g6IHZhc3QuX19kZUNhbGNYKGUub2Zmc2V0WCksIHk6IHZhc3QuX19kZUNhbGNZKGUub2Zmc2V0WSl9KVxuICAgIH1cbn0pXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICBkcmF3aW5nUGF0aCA9IG51bGw7XG59KVxuXG5yZW5kZXIoKTtcblxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2YXN0LnZpZXcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXhhbXBsZXMvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgQ2lyY2xlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0NpcmNsZScpO1xudmFyIFJlY3RhbmdsZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9SZWN0YW5nbGUnKTtcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhdGgnKTtcblxudmFyIFZhc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmFzdCgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZhc3QpO1xuXG4gICAgICAgIHRoaXMuY2FtZXJhID0geyB4OiAwLCB5OiAwLCB6b29tOiAxIH07XG4gICAgICAgIHRoaXMubW91c2UgPSB7IHg6IDAsIHk6IDAsIGRvd246IGZhbHNlLCBvbkRyYWdJbmZvOiB7fSB9O1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5ncmlkcyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fX2NyZWF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5fX3RyYWNrTW91c2UoKTtcbiAgICAgICAgdGhpcy5fX2RyYWdnYWJsZVNjcmVlbigpO1xuICAgICAgICB0aGlzLl9fem9vbWFibGVTY3JlZW4oKTtcbiAgICAgICAgdGhpcy5fX3JlbmRlcigpO1xuICAgIH1cblxuICAgIC8vIFByaXZhdGUgTWV0aG9kc1xuXG4gICAgX2NyZWF0ZUNsYXNzKFZhc3QsIFt7XG4gICAgICAgIGtleTogJ19fdHJhY2tNb3VzZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3RyYWNrTW91c2UoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19kcmFnZ2FibGVTY3JlZW4nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmFnZ2FibGVTY3JlZW4oKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2UuZG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueCA9IF90aGlzMi5tb3VzZS54O1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnkgPSBfdGhpczIubW91c2UueTtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFYID0gX3RoaXMyLmNhbWVyYS54O1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVkgPSBfdGhpczIuY2FtZXJhLnk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpczIubW91c2UuZG93biAmJiAhZS5hbHRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueCA9IF90aGlzMi5tb3VzZS54O1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mby55ID0gX3RoaXMyLm1vdXNlLnk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVggPSBfdGhpczIuY2FtZXJhLng7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVkgPSBfdGhpczIuY2FtZXJhLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChfdGhpczIubW91c2UuZG93biAmJiBlLmFsdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuY2FtZXJhLnggPSBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFYICsgKF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnggLSBfdGhpczIubW91c2UueCkgLyBfdGhpczIuY2FtZXJhLnpvb207XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5jYW1lcmEueSA9IF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVkgKyAoX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueSAtIF90aGlzMi5tb3VzZS55KSAvIF90aGlzMi5jYW1lcmEuem9vbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX196b29tYWJsZVNjcmVlbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3pvb21hYmxlU2NyZWVuKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMuY2FtZXJhLnpvb20gKz0gZS5kZWx0YVkgLyA1MDA7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoX3RoaXMzLmNhbWVyYS56b29tLCAwLjIpO1xuICAgICAgICAgICAgICAgIF90aGlzMy5jYW1lcmEuem9vbSA9IE1hdGgubWluKF90aGlzMy5jYW1lcmEuem9vbSwgNSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19kcmF3R3JpZHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3R3JpZHMoKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjRUVFJztcbiAgICAgICAgICAgIHZhciBzaXplID0gNTAgKiB0aGlzLmNhbWVyYS56b29tO1xuICAgICAgICAgICAgdmFyIGdyaWRCaWFzWCA9IHRoaXMud2lkdGggLyAyICUgc2l6ZTtcbiAgICAgICAgICAgIHZhciBncmlkQmlhc1kgPSB0aGlzLmhlaWdodCAvIDIgJSBzaXplO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IC10aGlzLmNhbWVyYS54ICogdGhpcy5jYW1lcmEuem9vbSAlIHNpemUgKyBncmlkQmlhc1g7IGkgPCB0aGlzLndpZHRoOyBpICs9IHNpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oaSwgMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKGksIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gLXRoaXMuY2FtZXJhLnkgKiB0aGlzLmNhbWVyYS56b29tICUgc2l6ZSArIGdyaWRCaWFzWTsgX2kgPCB0aGlzLmhlaWdodDsgX2kgKz0gc2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCBfaSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMud2lkdGgsIF9pKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19jcmVhdGVWaWV3JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fY3JlYXRlVmlldygpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgdGhpcy5jdHggPSB0aGlzLnZpZXcuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIHRoaXMuX19zZXRTaXplKCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fX3NldFNpemUuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fc2V0U2l6ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3NldFNpemUoKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcud2lkdGggPSB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB0aGlzLnZpZXcuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fcmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHJlLWNhbGxpbmcgcmVuZGVyIGZ1bmN0aW9uIGluIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczQuX19yZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyByZS1jbGVhcmluZyBhbGwgdGhlIGNhbnZhc1xuICAgICAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgLy8gRHJhd2luZyBoZWxwZXIgZ3JpZHMgaWYgaXQgd2FzIHN1cHBvc2VkIHRvIGJlIGRyYXduXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkcykgdGhpcy5fX2RyYXdHcmlkcygpO1xuXG4gICAgICAgICAgICAvLyByZW5kZXJpbmcgYWxsIHZhc3Qgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdGhpcy5vYmplY3RzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5fX2NoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMiA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMiA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyID0gdGhpcy5vYmplY3RzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAyOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gKF9zdGVwMiA9IF9pdGVyYXRvcjIubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfb2JqZWN0ID0gX3N0ZXAyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBfb2JqZWN0Ll9fZHJhdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IyID0gZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yICYmIF9pdGVyYXRvcjIucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IyLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2NhbGNYJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fY2FsY1goeCkge1xuICAgICAgICAgICAgcmV0dXJuICh4IC0gdGhpcy5jYW1lcmEueCkgKiB0aGlzLmNhbWVyYS56b29tICsgdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fY2FsY1knLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19jYWxjWSh5KSB7XG4gICAgICAgICAgICByZXR1cm4gKHkgLSB0aGlzLmNhbWVyYS55KSAqIHRoaXMuY2FtZXJhLnpvb20gKyB0aGlzLmhlaWdodCAvIDI7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fZGVDYWxjWCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RlQ2FsY1goeCkge1xuICAgICAgICAgICAgcmV0dXJuICh4IC0gdGhpcy53aWR0aCAvIDIpIC8gdGhpcy5jYW1lcmEuem9vbSArIHRoaXMuY2FtZXJhLng7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fZGVDYWxjWScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RlQ2FsY1koeSkge1xuICAgICAgICAgICAgcmV0dXJuICh5IC0gdGhpcy5oZWlnaHQgLyAyKSAvIHRoaXMuY2FtZXJhLnpvb20gKyB0aGlzLmNhbWVyYS55O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHVibGljIE1ldGhvZHNcblxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnYWRkJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdC5fX3NldFZhc3QodGhpcyk7XG4gICAgICAgICAgICB0aGlzLm9iamVjdHMucHVzaChvYmplY3QpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFZhc3Q7XG59KCk7XG5cblZhc3QuQ2lyY2xlID0gQ2lyY2xlO1xuVmFzdC5SZWN0YW5nbGUgPSBSZWN0YW5nbGU7XG5WYXN0LlBhdGggPSBQYXRoO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmFzdDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgVmFzdE9iamVjdCA9IHJlcXVpcmUoJy4vVmFzdE9iamVjdCcpO1xuXG52YXIgQ2lyY2xlID0gZnVuY3Rpb24gKF9WYXN0T2JqZWN0KSB7XG4gICAgX2luaGVyaXRzKENpcmNsZSwgX1Zhc3RPYmplY3QpO1xuXG4gICAgZnVuY3Rpb24gQ2lyY2xlKHJhZGl1cykge1xuICAgICAgICB2YXIgeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICAgICAgdmFyIHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG5cbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENpcmNsZSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKENpcmNsZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKENpcmNsZSkpLmNhbGwodGhpcykpO1xuXG4gICAgICAgIF90aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgX3RoaXMuY29sb3IgPSAnIzAwMCc7XG4gICAgICAgIF90aGlzLnBvc2l0aW9uID0geyB4OiB4LCB5OiB5IH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQ2lyY2xlLCBbe1xuICAgICAgICBrZXk6ICdfX2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgICAgICAgICAvLyBjaXJjbGUgc3R5bGVzXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblxuICAgICAgICAgICAgLy8geCwgeSBjYWxjdWxhdGlvbnNcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy52YXN0Ll9fY2FsY1godGhpcy5wb3NpdGlvbi54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy52YXN0Ll9fY2FsY1kodGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIHZhciByYWRpdXMgPSB0aGlzLnJhZGl1cyAqIHRoaXMudmFzdC5jYW1lcmEuem9vbTtcblxuICAgICAgICAgICAgLy8gZHJhd2luZyBhIGNpcmNsZSBpbiBjdHhcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5hcmMoeCwgeSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENpcmNsZTtcbn0oVmFzdE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2lyY2xlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2NvbXBvbmVudHMvQ2lyY2xlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgVmFzdE9iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWYXN0T2JqZWN0KCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVmFzdE9iamVjdCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFZhc3RPYmplY3QsIFt7XG4gICAgICAgIGtleTogXCJfX3NldFZhc3RcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fc2V0VmFzdCh2YXN0KSB7XG4gICAgICAgICAgICB0aGlzLnZhc3QgPSB2YXN0O1xuICAgICAgICAgICAgdGhpcy5jdHggPSB2YXN0LmN0eDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIl9fY2hhbmdlc1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19jaGFuZ2VzKCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJfX2RyYXdcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fZHJhdygpIHt9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFZhc3RPYmplY3Q7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmFzdE9iamVjdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9jb21wb25lbnRzL1Zhc3RPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBWYXN0T2JqZWN0ID0gcmVxdWlyZSgnLi9WYXN0T2JqZWN0Jyk7XG5cbnZhciBSZWN0YW5nbGUgPSBmdW5jdGlvbiAoX1Zhc3RPYmplY3QpIHtcbiAgICBfaW5oZXJpdHMoUmVjdGFuZ2xlLCBfVmFzdE9iamVjdCk7XG5cbiAgICBmdW5jdGlvbiBSZWN0YW5nbGUod2lkdGgsIGhlaWdodCkge1xuICAgICAgICB2YXIgeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcbiAgICAgICAgdmFyIHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDA7XG5cbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJlY3RhbmdsZSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFJlY3RhbmdsZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFJlY3RhbmdsZSkpLmNhbGwodGhpcykpO1xuXG4gICAgICAgIF90aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIF90aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgX3RoaXMuY29sb3IgPSAnIzAwMCc7XG4gICAgICAgIF90aGlzLnBvc2l0aW9uID0geyB4OiB4LCB5OiB5IH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoUmVjdGFuZ2xlLCBbe1xuICAgICAgICBrZXk6ICdfX2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgICAgICAgICAvLyByZWN0YW5nbGUgc3R5bGVzXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblxuICAgICAgICAgICAgLy8geCwgeSBjYWxjdWxhdGlvbnNcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy52YXN0Ll9fY2FsY1godGhpcy5wb3NpdGlvbi54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy52YXN0Ll9fY2FsY1kodGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGggKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSByZWN0YW5nbGUgaW4gY3R4XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmVjdGFuZ2xlO1xufShWYXN0T2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWN0YW5nbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBWYXN0T2JqZWN0ID0gcmVxdWlyZSgnLi9WYXN0T2JqZWN0Jyk7XG5cbnZhciBQYXRoID0gZnVuY3Rpb24gKF9WYXN0T2JqZWN0KSB7XG4gICAgX2luaGVyaXRzKFBhdGgsIF9WYXN0T2JqZWN0KTtcblxuICAgIGZ1bmN0aW9uIFBhdGgocG9pbnRzKSB7XG4gICAgICAgIHZhciB0aWNrbmVzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMjtcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGF0aCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFBhdGguX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQYXRoKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgX3RoaXMucG9pbnRzID0gcG9pbnRzIHx8IFtdO1xuICAgICAgICBfdGhpcy50aWNrbmVzcyA9IHRpY2tuZXNzO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQYXRoLCBbe1xuICAgICAgICBrZXk6ICdhZGRQb2ludCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRQb2ludChwb2ludCkge1xuICAgICAgICAgICAgLy8gaWYgKCFwb2ludC54KSB0aHJvdyBFcnJvciAoJ1BvaW50IG11c3QgaGF2ZSB7IHg6IE51bWJlciB9IHByb3BlcnR5Jyk7XG4gICAgICAgICAgICAvLyBpZiAoIXBvaW50LnkpIHRocm93IEVycm9yICgnUG9pbnQgbXVzdCBoYXZlIHsgeDogTnVtYmVyIH0gcHJvcGVydHknKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgICAgICAgICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgICAgICAgICAvLyBwYXRoIHN0eWxlc1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLnRpY2tuZXNzO1xuXG4gICAgICAgICAgICAvLyBkcmF3aW5nIGEgcGF0aCBpbiBjdHhcblxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgICAgICBjdHgubW92ZVRvKHRoaXMudmFzdC5fX2NhbGNYKHBvaW50c1swXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzWzBdLnkpKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHRoaXMudmFzdC5fX2NhbGNYKHBvaW50c1tpXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzW2ldLnkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFBhdGg7XG59KFZhc3RPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9QYXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=