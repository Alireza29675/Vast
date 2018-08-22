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
	
	const circle = new Vast.Circle(10, 0, 0);
	const rectangle = new Vast.Rectangle(100, 100);
	const path = new Vast.Path([{x: 0, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}]);
	
	vast.add(circle)
	// vast.add(rectangle)
	vast.add(path)
	
	const render = () => {
	    requestAnimationFrame(render);
	    writeInHelper();
	    circle.position.x++;
	}
	
	const helper = document.querySelector('.helper');
	const writeInHelper = () => {
	    helper.innerHTML = `camera: ${ JSON.stringify(vast.camera) }, circle: ${ JSON.stringify(circle.position) }`;
	}
	
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
	
	        this.camera = { x: 0, y: 0, zoom: 0.5 };
	        this.mouse = { x: 0, y: 0, down: false };
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
	                _this2.mouse.onDragInfo = {
	                    x: _this2.mouse.x,
	                    y: _this2.mouse.y,
	                    cameraX: _this2.camera.x,
	                    cameraY: _this2.camera.y
	                };
	            });
	            this.view.addEventListener('mousemove', function (e) {
	                if (_this2.mouse.down) {
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
	                _this3.camera.zoom = Math.max(_this3.camera.zoom, 0.5);
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
	                    object.changes();
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
	                    _object.draw();
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
	
	        // Public Methods
	
	    }, {
	        key: 'add',
	        value: function add(object) {
	            object.setVast(this);
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
	        key: 'draw',
	        value: function draw() {
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
	        key: "setVast",
	        value: function setVast(vast) {
	            this.vast = vast;
	            this.ctx = vast.ctx;
	        }
	    }, {
	        key: "changes",
	        value: function changes() {}
	    }, {
	        key: "draw",
	        value: function draw() {}
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
	        key: 'draw',
	        value: function draw() {
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
	
	        _this.points = points;
	        _this.tickness = tickness;
	        _this.color = '#000';
	        return _this;
	    }
	
	    _createClass(Path, [{
	        key: 'draw',
	        value: function draw() {
	            var ctx = this.ctx;
	            var points = this.points;
	
	            // path styles
	            ctx.strokeStyle = this.color;
	            ctx.lineWidth = this.tickness;
	
	            // drawing a path in ctx
	
	            ctx.beginPath();
	
	            ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
	
	            for (var i = 1; i < points.length - 2; i++) {
	                var xc = (this.vast.__calcX(points[i].x) + this.vast.__calcX(points[i + 1].x)) / 2;
	                var yc = (this.vast.__calcY(points[i].y) + this.vast.__calcY(points[i + 1].y)) / 2;
	                ctx.quadraticCurveTo(this.vast.__calcX(points[i].x), points[i].y, xc, yc);
	            }
	
	            ctx.quadraticCurveTo(this.vast.__calcX(points[points.length - 2].x), this.vast.__calcY(points[points.length - 2].y), this.vast.__calcX(points[points.length - 1].x), this.vast.__calcY(points[points.length - 1].y));
	
	            ctx.stroke();
	        }
	    }]);
	
	    return Path;
	}(VastObject);
	
	module.exports = Path;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTUyOWZhZTgxZThiMDQ1M2QxY2EiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvVmFzdE9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbXBvbmVudHMvUGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBNkIsV0FBVyxHQUFHLGVBQWUsR0FBRyxhQUFhOztBQUUxRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQWtDLDhCQUE4QixZQUFZLGtDQUFrQztBQUM5Rzs7QUFFQTs7QUFFQSxzQzs7Ozs7O0FDeEJBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOztBQUVELGlDQUFnQywyQ0FBMkMsZ0JBQWdCLGtCQUFrQixPQUFPLDJCQUEyQix3REFBd0QsZ0NBQWdDLHVEQUF1RCwyREFBMkQsRUFBRSxFQUFFLHlEQUF5RCxxRUFBcUUsNkRBQTZELG9CQUFvQixHQUFHLEVBQUU7O0FBRWpqQixrREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdCQUF1QjtBQUN2Qix1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LDRCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxFQUFDOztBQUVELHVCIiwiZmlsZSI6Ii4vZXhhbXBsZXMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTUyOWZhZTgxZThiMDQ1M2QxY2EiLCJjb25zdCBWYXN0ID0gcmVxdWlyZSgnLi4vLi4vbGliL2luZGV4JylcbmNvbnN0IHZhc3QgPSBuZXcgVmFzdCgpO1xuXG5jb25zdCBjaXJjbGUgPSBuZXcgVmFzdC5DaXJjbGUoMTAsIDAsIDApO1xuY29uc3QgcmVjdGFuZ2xlID0gbmV3IFZhc3QuUmVjdGFuZ2xlKDEwMCwgMTAwKTtcbmNvbnN0IHBhdGggPSBuZXcgVmFzdC5QYXRoKFt7eDogMCwgeTogMH0sIHt4OiAxMDAsIHk6IDEwMH0sIHt4OiAwLCB5OiAxMDB9XSk7XG5cbnZhc3QuYWRkKGNpcmNsZSlcbi8vIHZhc3QuYWRkKHJlY3RhbmdsZSlcbnZhc3QuYWRkKHBhdGgpXG5cbmNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICB3cml0ZUluSGVscGVyKCk7XG4gICAgY2lyY2xlLnBvc2l0aW9uLngrKztcbn1cblxuY29uc3QgaGVscGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlbHBlcicpO1xuY29uc3Qgd3JpdGVJbkhlbHBlciA9ICgpID0+IHtcbiAgICBoZWxwZXIuaW5uZXJIVE1MID0gYGNhbWVyYTogJHsgSlNPTi5zdHJpbmdpZnkodmFzdC5jYW1lcmEpIH0sIGNpcmNsZTogJHsgSlNPTi5zdHJpbmdpZnkoY2lyY2xlLnBvc2l0aW9uKSB9YDtcbn1cblxucmVuZGVyKCk7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmFzdC52aWV3KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4YW1wbGVzL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIENpcmNsZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9DaXJjbGUnKTtcbnZhciBSZWN0YW5nbGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUmVjdGFuZ2xlJyk7XG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9QYXRoJyk7XG5cbnZhciBWYXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZhc3QoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWYXN0KTtcblxuICAgICAgICB0aGlzLmNhbWVyYSA9IHsgeDogMCwgeTogMCwgem9vbTogMC41IH07XG4gICAgICAgIHRoaXMubW91c2UgPSB7IHg6IDAsIHk6IDAsIGRvd246IGZhbHNlIH07XG4gICAgICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWRzID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9fY3JlYXRlVmlldygpO1xuICAgICAgICB0aGlzLl9fdHJhY2tNb3VzZSgpO1xuICAgICAgICB0aGlzLl9fZHJhZ2dhYmxlU2NyZWVuKCk7XG4gICAgICAgIHRoaXMuX196b29tYWJsZVNjcmVlbigpO1xuICAgICAgICB0aGlzLl9fcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgLy8gUHJpdmF0ZSBNZXRob2RzXG5cbiAgICBfY3JlYXRlQ2xhc3MoVmFzdCwgW3tcbiAgICAgICAga2V5OiAnX190cmFja01vdXNlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fdHJhY2tNb3VzZSgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgX3RoaXMubW91c2UueSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdfX2RyYWdnYWJsZVNjcmVlbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2RyYWdnYWJsZVNjcmVlbigpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5kb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfdGhpczIubW91c2Uub25EcmFnSW5mbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogX3RoaXMyLm1vdXNlLngsXG4gICAgICAgICAgICAgICAgICAgIHk6IF90aGlzMi5tb3VzZS55LFxuICAgICAgICAgICAgICAgICAgICBjYW1lcmFYOiBfdGhpczIuY2FtZXJhLngsXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYVk6IF90aGlzMi5jYW1lcmEueVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpczIubW91c2UuZG93bikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuY2FtZXJhLnggPSBfdGhpczIubW91c2Uub25EcmFnSW5mby5jYW1lcmFYICsgKF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLnggLSBfdGhpczIubW91c2UueCkgLyBfdGhpczIuY2FtZXJhLnpvb207XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5jYW1lcmEueSA9IF90aGlzMi5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVkgKyAoX3RoaXMyLm1vdXNlLm9uRHJhZ0luZm8ueSAtIF90aGlzMi5tb3VzZS55KSAvIF90aGlzMi5jYW1lcmEuem9vbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMi5tb3VzZS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX196b29tYWJsZVNjcmVlbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3pvb21hYmxlU2NyZWVuKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMuY2FtZXJhLnpvb20gKz0gZS5kZWx0YVkgLyA1MDA7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmNhbWVyYS56b29tID0gTWF0aC5tYXgoX3RoaXMzLmNhbWVyYS56b29tLCAwLjUpO1xuICAgICAgICAgICAgICAgIF90aGlzMy5jYW1lcmEuem9vbSA9IE1hdGgubWluKF90aGlzMy5jYW1lcmEuem9vbSwgNSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19kcmF3R3JpZHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3R3JpZHMoKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjRUVFJztcbiAgICAgICAgICAgIHZhciBzaXplID0gNTAgKiB0aGlzLmNhbWVyYS56b29tO1xuICAgICAgICAgICAgdmFyIGdyaWRCaWFzWCA9IHRoaXMud2lkdGggLyAyICUgc2l6ZTtcbiAgICAgICAgICAgIHZhciBncmlkQmlhc1kgPSB0aGlzLmhlaWdodCAvIDIgJSBzaXplO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IC10aGlzLmNhbWVyYS54ICogdGhpcy5jYW1lcmEuem9vbSAlIHNpemUgKyBncmlkQmlhc1g7IGkgPCB0aGlzLndpZHRoOyBpICs9IHNpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oaSwgMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKGksIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gLXRoaXMuY2FtZXJhLnkgKiB0aGlzLmNhbWVyYS56b29tICUgc2l6ZSArIGdyaWRCaWFzWTsgX2kgPCB0aGlzLmhlaWdodDsgX2kgKz0gc2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCBfaSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMud2lkdGgsIF9pKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19jcmVhdGVWaWV3JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fY3JlYXRlVmlldygpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgdGhpcy5jdHggPSB0aGlzLnZpZXcuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIHRoaXMuX19zZXRTaXplKCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fX3NldFNpemUuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fc2V0U2l6ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3NldFNpemUoKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcud2lkdGggPSB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB0aGlzLnZpZXcuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fcmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHJlLWNhbGxpbmcgcmVuZGVyIGZ1bmN0aW9uIGluIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczQuX19yZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyByZS1jbGVhcmluZyBhbGwgdGhlIGNhbnZhc1xuICAgICAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgLy8gRHJhd2luZyBoZWxwZXIgZ3JpZHMgaWYgaXQgd2FzIHN1cHBvc2VkIHRvIGJlIGRyYXduXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkcykgdGhpcy5fX2RyYXdHcmlkcygpO1xuXG4gICAgICAgICAgICAvLyByZW5kZXJpbmcgYWxsIHZhc3Qgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdGhpcy5vYmplY3RzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5jaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvcjIgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IHRoaXMub2JqZWN0c1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwMjsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IChfc3RlcDIgPSBfaXRlcmF0b3IyLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX29iamVjdCA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgX29iamVjdC5kcmF3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjIgPSBlcnI7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgJiYgX2l0ZXJhdG9yMi5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjIucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fY2FsY1gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19jYWxjWCh4KSB7XG4gICAgICAgICAgICByZXR1cm4gKHggLSB0aGlzLmNhbWVyYS54KSAqIHRoaXMuY2FtZXJhLnpvb20gKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19jYWxjWScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX2NhbGNZKHkpIHtcbiAgICAgICAgICAgIHJldHVybiAoeSAtIHRoaXMuY2FtZXJhLnkpICogdGhpcy5jYW1lcmEuem9vbSArIHRoaXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1YmxpYyBNZXRob2RzXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2FkZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3Quc2V0VmFzdCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gVmFzdDtcbn0oKTtcblxuVmFzdC5DaXJjbGUgPSBDaXJjbGU7XG5WYXN0LlJlY3RhbmdsZSA9IFJlY3RhbmdsZTtcblZhc3QuUGF0aCA9IFBhdGg7XG5leHBvcnRzLmRlZmF1bHQgPSBWYXN0O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBWYXN0T2JqZWN0ID0gcmVxdWlyZSgnLi9WYXN0T2JqZWN0Jyk7XG5cbnZhciBDaXJjbGUgPSBmdW5jdGlvbiAoX1Zhc3RPYmplY3QpIHtcbiAgICBfaW5oZXJpdHMoQ2lyY2xlLCBfVmFzdE9iamVjdCk7XG5cbiAgICBmdW5jdGlvbiBDaXJjbGUocmFkaXVzKSB7XG4gICAgICAgIHZhciB4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgICAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2lyY2xlKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQ2lyY2xlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ2lyY2xlKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgX3RoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgX3RoaXMucG9zaXRpb24gPSB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhDaXJjbGUsIFt7XG4gICAgICAgIGtleTogJ2RyYXcnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZHJhdygpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSB0aGlzLmN0eDtcblxuICAgICAgICAgICAgLy8gY2lyY2xlIHN0eWxlc1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG5cbiAgICAgICAgICAgIC8vIHgsIHkgY2FsY3VsYXRpb25zXG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMudmFzdC5fX2NhbGNYKHRoaXMucG9zaXRpb24ueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMudmFzdC5fX2NhbGNZKHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICB2YXIgcmFkaXVzID0gdGhpcy5yYWRpdXMgKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSBjaXJjbGUgaW4gY3R4XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDaXJjbGU7XG59KFZhc3RPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENpcmNsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9jb21wb25lbnRzL0NpcmNsZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFZhc3RPYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmFzdE9iamVjdCgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZhc3RPYmplY3QpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhWYXN0T2JqZWN0LCBbe1xuICAgICAgICBrZXk6IFwic2V0VmFzdFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VmFzdCh2YXN0KSB7XG4gICAgICAgICAgICB0aGlzLnZhc3QgPSB2YXN0O1xuICAgICAgICAgICAgdGhpcy5jdHggPSB2YXN0LmN0eDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNoYW5nZXNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZXMoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImRyYXdcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXcoKSB7fVxuICAgIH1dKTtcblxuICAgIHJldHVybiBWYXN0T2JqZWN0O1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZhc3RPYmplY3Q7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9WYXN0T2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgVmFzdE9iamVjdCA9IHJlcXVpcmUoJy4vVmFzdE9iamVjdCcpO1xuXG52YXIgUmVjdGFuZ2xlID0gZnVuY3Rpb24gKF9WYXN0T2JqZWN0KSB7XG4gICAgX2luaGVyaXRzKFJlY3RhbmdsZSwgX1Zhc3RPYmplY3QpO1xuXG4gICAgZnVuY3Rpb24gUmVjdGFuZ2xlKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICAgIHZhciB5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZWN0YW5nbGUpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChSZWN0YW5nbGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihSZWN0YW5nbGUpKS5jYWxsKHRoaXMpKTtcblxuICAgICAgICBfdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBfdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJyMwMDAnO1xuICAgICAgICBfdGhpcy5wb3NpdGlvbiA9IHsgeDogeCwgeTogeSB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFJlY3RhbmdsZSwgW3tcbiAgICAgICAga2V5OiAnZHJhdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3KCkge1xuICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgICAgICAgICAvLyByZWN0YW5nbGUgc3R5bGVzXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblxuICAgICAgICAgICAgLy8geCwgeSBjYWxjdWxhdGlvbnNcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy52YXN0Ll9fY2FsY1godGhpcy5wb3NpdGlvbi54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy52YXN0Ll9fY2FsY1kodGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGggKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiB0aGlzLnZhc3QuY2FtZXJhLnpvb207XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSByZWN0YW5nbGUgaW4gY3R4XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmVjdGFuZ2xlO1xufShWYXN0T2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWN0YW5nbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9SZWN0YW5nbGUuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBWYXN0T2JqZWN0ID0gcmVxdWlyZSgnLi9WYXN0T2JqZWN0Jyk7XG5cbnZhciBQYXRoID0gZnVuY3Rpb24gKF9WYXN0T2JqZWN0KSB7XG4gICAgX2luaGVyaXRzKFBhdGgsIF9WYXN0T2JqZWN0KTtcblxuICAgIGZ1bmN0aW9uIFBhdGgocG9pbnRzKSB7XG4gICAgICAgIHZhciB0aWNrbmVzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMjtcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGF0aCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFBhdGguX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQYXRoKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgX3RoaXMucG9pbnRzID0gcG9pbnRzO1xuICAgICAgICBfdGhpcy50aWNrbmVzcyA9IHRpY2tuZXNzO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQYXRoLCBbe1xuICAgICAgICBrZXk6ICdkcmF3JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG4gICAgICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG5cbiAgICAgICAgICAgIC8vIHBhdGggc3R5bGVzXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMudGlja25lc3M7XG5cbiAgICAgICAgICAgIC8vIGRyYXdpbmcgYSBwYXRoIGluIGN0eFxuXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgIGN0eC5tb3ZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzWzBdLngpLCB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbMF0ueSkpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeGMgPSAodGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2ldLngpICsgdGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2kgKyAxXS54KSkgLyAyO1xuICAgICAgICAgICAgICAgIHZhciB5YyA9ICh0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaV0ueSkgKyB0aGlzLnZhc3QuX19jYWxjWShwb2ludHNbaSArIDFdLnkpKSAvIDI7XG4gICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW2ldLngpLCBwb2ludHNbaV0ueSwgeGMsIHljKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8odGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXS55KSwgdGhpcy52YXN0Ll9fY2FsY1gocG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXS54KSwgdGhpcy52YXN0Ll9fY2FsY1kocG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXS55KSk7XG5cbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQYXRoO1xufShWYXN0T2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXRoO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2NvbXBvbmVudHMvUGF0aC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9