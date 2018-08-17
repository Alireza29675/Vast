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
	vast.add(circle)
	
	const render = () => {
	    requestAnimationFrame(render);
	    circle.x++;
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
	
	var Vast = function () {
	    function Vast() {
	        _classCallCheck(this, Vast);
	
	        this.camera = { x: 0, y: 0 };
	        this.mouse = { x: 0, y: 0, down: false };
	        this.objects = [];
	        this.grids = true;
	
	        this.__createView();
	        this.__draggableScreen();
	        this.__render();
	    }
	
	    // Private Methods
	
	    _createClass(Vast, [{
	        key: '__draggableScreen',
	        value: function __draggableScreen() {
	            var _this = this;
	
	            this.view.addEventListener('mousedown', function () {
	                _this.mouse.down = true;
	                _this.mouse.onDragInfo = {
	                    x: _this.mouse.x,
	                    y: _this.mouse.y,
	                    cameraX: _this.camera.x,
	                    cameraY: _this.camera.y
	                };
	            });
	            this.view.addEventListener('mousemove', function (e) {
	                _this.mouse.x = e.clientX;
	                _this.mouse.y = e.clientY;
	                if (_this.mouse.down) {
	                    _this.camera.x = _this.mouse.onDragInfo.cameraX + (_this.mouse.onDragInfo.x - _this.mouse.x);
	                    _this.camera.y = _this.mouse.onDragInfo.cameraY + (_this.mouse.onDragInfo.y - _this.mouse.y);
	                }
	            });
	            this.view.addEventListener('mouseup', function () {
	                _this.mouse.down = false;
	            });
	        }
	    }, {
	        key: '__drawGrids',
	        value: function __drawGrids() {
	            this.ctx.strokeStyle = '#EEE';
	            var size = 50;
	            for (var i = -this.camera.x % size; i < this.width; i += size) {
	                this.ctx.beginPath();
	                this.ctx.moveTo(i, 0);
	                this.ctx.lineTo(i, this.height);
	                this.ctx.closePath();
	                this.ctx.stroke();
	            }
	            for (var _i = -this.camera.y % size; _i < this.height; _i += size) {
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
	            var _this2 = this;
	
	            // re-calling render function in the next frame
	            requestAnimationFrame(function () {
	                return _this2.__render();
	            });
	
	            // re-clearing all the canvas
	            this.ctx.clearRect(0, 0, this.width, this.height);
	
	            // Drawing helper grids if it was supposed to be drawn
	            if (this.grids) this.__drawGrids();
	
	            // rendering all vast objects
	            var vastCenterX = -this.camera.x + this.width / 2;
	            var vastCenterY = -this.camera.y + this.height / 2;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var object = _step.value;
	                    object.render(this.ctx, vastCenterX, vastCenterY);
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
	        }
	
	        // Public Methods
	
	    }, {
	        key: 'add',
	        value: function add(object) {
	            this.objects.push(object);
	        }
	    }]);
	
	    return Vast;
	}();
	
	Vast.Circle = Circle;
	exports.default = Vast;
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Circle = function () {
	    function Circle(radius, x, y) {
	        _classCallCheck(this, Circle);
	
	        this.radius = radius;
	        this.x = x;
	        this.y = y;
	    }
	
	    _createClass(Circle, [{
	        key: 'render',
	        value: function render(ctx, vastCenterX, vastCenterY) {
	            ctx.fillStyle = '#000';
	
	            var x = this.x + vastCenterX;
	            var y = this.y + vastCenterY;
	
	            ctx.beginPath();
	            ctx.arc(x, y, this.radius, 0, Math.PI * 2);
	            ctx.closePath();
	            ctx.fill();
	        }
	    }]);
	
	    return Circle;
	}();
	
	module.exports = Circle;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjYxYzI0YWEwNDQ0YTZiNzVkYjEiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNDOzs7Ozs7QUNiQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRCxpQ0FBZ0MsMkNBQTJDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQsMkRBQTJELEVBQUUsRUFBRSx5REFBeUQscUVBQXFFLDZEQUE2RCxvQkFBb0IsR0FBRyxFQUFFOztBQUVqakIsa0RBQWlELDBDQUEwQywwREFBMEQsRUFBRTs7QUFFdko7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdCQUF1QjtBQUN2Qix1QkFBc0I7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MsZ0JBQWdCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFnRCxrQkFBa0I7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkVBQTRFLGdFQUFnRTtBQUM1STtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBLHFDOzs7Ozs7QUNsSkE7O0FBRUEsaUNBQWdDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQsb0JBQW9CLEdBQUcsRUFBRTs7QUFFampCLGtEQUFpRCwwQ0FBMEMsMERBQTBELEVBQUU7O0FBRXZKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsRUFBQzs7QUFFRCx5QiIsImZpbGUiOiIuL2V4YW1wbGVzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY2MWMyNGFhMDQ0NGE2Yjc1ZGIxIiwiY29uc3QgVmFzdCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pbmRleCcpXG5jb25zdCB2YXN0ID0gbmV3IFZhc3QoKTtcblxuY29uc3QgY2lyY2xlID0gbmV3IFZhc3QuQ2lyY2xlKDEwLCAwLCAwKTtcbnZhc3QuYWRkKGNpcmNsZSlcblxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgIGNpcmNsZS54Kys7XG59XG5cbnJlbmRlcigpO1xuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZhc3Qudmlldyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leGFtcGxlcy9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBDaXJjbGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ2lyY2xlJyk7XG5cbnZhciBWYXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZhc3QoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWYXN0KTtcblxuICAgICAgICB0aGlzLmNhbWVyYSA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLm1vdXNlID0geyB4OiAwLCB5OiAwLCBkb3duOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5ncmlkcyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fX2NyZWF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5fX2RyYWdnYWJsZVNjcmVlbigpO1xuICAgICAgICB0aGlzLl9fcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgLy8gUHJpdmF0ZSBNZXRob2RzXG5cbiAgICBfY3JlYXRlQ2xhc3MoVmFzdCwgW3tcbiAgICAgICAga2V5OiAnX19kcmFnZ2FibGVTY3JlZW4nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmFnZ2FibGVTY3JlZW4oKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLm9uRHJhZ0luZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IF90aGlzLm1vdXNlLngsXG4gICAgICAgICAgICAgICAgICAgIHk6IF90aGlzLm1vdXNlLnksXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYVg6IF90aGlzLmNhbWVyYS54LFxuICAgICAgICAgICAgICAgICAgICBjYW1lcmFZOiBfdGhpcy5jYW1lcmEueVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgX3RoaXMubW91c2UueSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMubW91c2UuZG93bikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jYW1lcmEueCA9IF90aGlzLm1vdXNlLm9uRHJhZ0luZm8uY2FtZXJhWCArIChfdGhpcy5tb3VzZS5vbkRyYWdJbmZvLnggLSBfdGhpcy5tb3VzZS54KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2FtZXJhLnkgPSBfdGhpcy5tb3VzZS5vbkRyYWdJbmZvLmNhbWVyYVkgKyAoX3RoaXMubW91c2Uub25EcmFnSW5mby55IC0gX3RoaXMubW91c2UueSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19kcmF3R3JpZHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX19kcmF3R3JpZHMoKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjRUVFJztcbiAgICAgICAgICAgIHZhciBzaXplID0gNTA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gLXRoaXMuY2FtZXJhLnggJSBzaXplOyBpIDwgdGhpcy53aWR0aDsgaSArPSBzaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKGksIDApO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IC10aGlzLmNhbWVyYS55ICUgc2l6ZTsgX2kgPCB0aGlzLmhlaWdodDsgX2kgKz0gc2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCBfaSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMud2lkdGgsIF9pKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnX19jcmVhdGVWaWV3JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fY3JlYXRlVmlldygpIHtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgdGhpcy5jdHggPSB0aGlzLnZpZXcuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIHRoaXMuX19zZXRTaXplKCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fX3NldFNpemUuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fc2V0U2l6ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfX3NldFNpemUoKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcud2lkdGggPSB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB0aGlzLnZpZXcuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ19fcmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9fcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIHJlLWNhbGxpbmcgcmVuZGVyIGZ1bmN0aW9uIGluIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIuX19yZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyByZS1jbGVhcmluZyBhbGwgdGhlIGNhbnZhc1xuICAgICAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICAgICAgLy8gRHJhd2luZyBoZWxwZXIgZ3JpZHMgaWYgaXQgd2FzIHN1cHBvc2VkIHRvIGJlIGRyYXduXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkcykgdGhpcy5fX2RyYXdHcmlkcygpO1xuXG4gICAgICAgICAgICAvLyByZW5kZXJpbmcgYWxsIHZhc3Qgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIHZhc3RDZW50ZXJYID0gLXRoaXMuY2FtZXJhLnggKyB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgICAgIHZhciB2YXN0Q2VudGVyWSA9IC10aGlzLmNhbWVyYS55ICsgdGhpcy5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdGhpcy5vYmplY3RzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0ID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5yZW5kZXIodGhpcy5jdHgsIHZhc3RDZW50ZXJYLCB2YXN0Q2VudGVyWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1YmxpYyBNZXRob2RzXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2FkZCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQob2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdHMucHVzaChvYmplY3QpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFZhc3Q7XG59KCk7XG5cblZhc3QuQ2lyY2xlID0gQ2lyY2xlO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmFzdDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIENpcmNsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDaXJjbGUocmFkaXVzLCB4LCB5KSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDaXJjbGUpO1xuXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhDaXJjbGUsIFt7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoY3R4LCB2YXN0Q2VudGVyWCwgdmFzdENlbnRlclkpIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG5cbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy54ICsgdmFzdENlbnRlclg7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMueSArIHZhc3RDZW50ZXJZO1xuXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguYXJjKHgsIHksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENpcmNsZTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvY29tcG9uZW50cy9DaXJjbGUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==