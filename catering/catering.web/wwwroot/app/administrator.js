/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"administrator": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/app/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./ClientApp/administrator/main.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ClientApp/administrator/app.css":
/*!*****************************************!*\
  !*** ./ClientApp/administrator/app.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./ClientApp/administrator/app.css?");

/***/ }),

/***/ "./ClientApp/administrator/app.js":
/*!****************************************!*\
  !*** ./ClientApp/administrator/app.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var angular_ui_bootstrap_dist_ui_bootstrap_tpls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-ui-bootstrap/dist/ui-bootstrap-tpls */ \"./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js\");\n/* harmony import */ var angular_ui_bootstrap_dist_ui_bootstrap_tpls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angular_ui_bootstrap_dist_ui_bootstrap_tpls__WEBPACK_IMPORTED_MODULE_1__);\n﻿\r\n\r\n\r\n\r\nconst app = angular__WEBPACK_IMPORTED_MODULE_0___default.a.module('app', [__webpack_require__(/*! angular-animate */ \"./node_modules/angular-animate/index.js\"), __webpack_require__(/*! angular-toastr */ \"./node_modules/angular-toastr/index.js\"), 'ui.bootstrap']);\r\n\r\napp.controller('mainController', function () {\r\n    const vm = this;\r\n    const pagePrefix = 'app/clientapp/administrator/templates/';\r\n    vm.page = `${pagePrefix}/pricing.html`;\r\n\r\n    vm.setPage = function (page, event) {\r\n        //debugger;\r\n        var ar = arguments;\r\n        vm.page = `${pagePrefix}/${page}`;\r\n\r\n        event.preventDefault();\r\n    };\r\n\r\n});\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./ClientApp/administrator/app.js?");

/***/ }),

/***/ "./ClientApp/administrator/controllers/customersController.js":
/*!********************************************************************!*\
  !*** ./ClientApp/administrator/controllers/customersController.js ***!
  \********************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/administrator/app.js\");\n﻿\r\n\r\n\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('customersController', function ($http, toastr) {\r\n    const vm = this;\r\n\r\n    vm.selectedItem = null;\r\n\r\n    vm.setSelectedItem = function (item) {\r\n        if (item === vm.selectedItem) {\r\n            vm.selectedItem = null;\r\n            return;\r\n        }\r\n\r\n        vm.selectedItem = item;\r\n    };\r\n\r\n    vm.init = function () {\r\n        $http.get('api/administrator/customers')\r\n            .then(function (resp) {\r\n                vm.items = resp.data;\r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n    vm.init();\r\n});\n\n//# sourceURL=webpack:///./ClientApp/administrator/controllers/customersController.js?");

/***/ }),

/***/ "./ClientApp/administrator/controllers/dashboardController.js":
/*!********************************************************************!*\
  !*** ./ClientApp/administrator/controllers/dashboardController.js ***!
  \********************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/administrator/app.js\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ \"./node_modules/moment/moment.js\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);\n﻿\r\n\r\n\r\n\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('dashboardController', function ($http, toastr) {\r\n    const vm = this;\r\n\r\n\r\n    vm.init = function () {\r\n        $http.get('api/administrator/dashboard')\r\n            .then(function (resp) {\r\n                vm.data = resp.data;\r\n\r\n                let events = [];\r\n\r\n                for (let n = 0; n < vm.data.upcoming.length; n++) {\r\n                    let item1 = resp.data.upcoming[n];\r\n                    item1.fromNow = moment__WEBPACK_IMPORTED_MODULE_2___default()(item1.dateStart).fromNow();\r\n                }\r\n\r\n                for (let n = 0; n < vm.data.overdue.length; n++) {\r\n                    let item1 = resp.data.overdue[n];\r\n                    item1.toNow = moment__WEBPACK_IMPORTED_MODULE_2___default()(item1.dateStart).fromNow();\r\n                }\r\n\r\n                var overDue = [];\r\n                var upcoming = [];\r\n\r\n                var now = moment__WEBPACK_IMPORTED_MODULE_2___default()();\r\n                \r\n                for (let i = 0; i < resp.data.reservations.length; i++) {\r\n                    let item = resp.data.reservations[i];\r\n                    \r\n                    var evt = {\r\n                        title: item.title,\r\n                        start: moment__WEBPACK_IMPORTED_MODULE_2___default()(item.dateStart),\r\n                        end: moment__WEBPACK_IMPORTED_MODULE_2___default()(item.dateEnd)\r\n                    };\r\n\r\n                    if (evt.end < now) {\r\n                        overDue.push(evt);\r\n                    }\r\n                    else {\r\n                        upcoming.push(evt);\r\n                    }\r\n                }\r\n\r\n                jquery__WEBPACK_IMPORTED_MODULE_0___default()('#calendar').fullCalendar({\r\n                    header: { center: 'month,agendaWeek' },\r\n                    defaultView: 'month',\r\n                    //minTime: '07:00:00',\r\n                    //maxTime: '22:59:00',\r\n                    eventSources: [\r\n                        {\r\n                            events: overDue,\r\n                            color: 'red'\r\n                        },\r\n                        {\r\n                            events: upcoming,\r\n                            color: 'green'\r\n                        }\r\n                    ]                    \r\n                });\r\n            }, function (err) {\r\n                toastr.error('error occured');\r\n            });\r\n    };\r\n\r\n    vm.init();\r\n    \r\n});\n\n//# sourceURL=webpack:///./ClientApp/administrator/controllers/dashboardController.js?");

/***/ }),

/***/ "./ClientApp/administrator/controllers/messagesController.js":
/*!*******************************************************************!*\
  !*** ./ClientApp/administrator/controllers/messagesController.js ***!
  \*******************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/administrator/app.js\");\n﻿\r\n\r\n\r\n\r\nfunction controller($http, toastr) {\r\n    const vm = this;\r\n\r\n    vm.selectedItem = null;\r\n\r\n    vm.setSelectedItem = function (item) {\r\n        if (item === vm.selectedItem) {\r\n            //vm.selectedItem = null;\r\n            return;\r\n        }\r\n\r\n        vm.selectedItem = item;\r\n    };\r\n\r\n    vm.resend = function (id) {\r\n        $http.post(`api/message/resend/${id}`)\r\n            .then(function (resp) {\r\n                toastr.success('Message ready to be send', 'Resend', {\r\n                    timeOut: 0, onHidden: function () {\r\n                        vm.init();\r\n                    }\r\n                });\r\n            }, function (err) {\r\n                toastr.error('Error occured', 'Resend', { timeOut: 0 });\r\n            });\r\n\r\n    };\r\n    vm.init = function () {\r\n        $http.get('api/message')\r\n            .then(function (resp) {\r\n                vm.items = resp.data;\r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n    vm.init();\r\n}\r\n\r\ncontroller.$inject = ['$http', 'toastr'];\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('messagesController', controller);\n\n//# sourceURL=webpack:///./ClientApp/administrator/controllers/messagesController.js?");

/***/ }),

/***/ "./ClientApp/administrator/controllers/packagesController.js":
/*!*******************************************************************!*\
  !*** ./ClientApp/administrator/controllers/packagesController.js ***!
  \*******************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/administrator/app.js\");\n﻿\r\n\r\n\r\n\r\nfunction controller1($http, $uibModal, toastr) {\r\n    const vm = this;\r\n\r\n    vm.selectedItem = null;\r\n\r\n    vm.setSelectedItem = function (item) {\r\n        if (item === vm.selectedItem) {\r\n            vm.selectedItem = null;\r\n            return;\r\n        }\r\n\r\n        vm.selectedItem = item;\r\n    };\r\n\r\n    vm.dlgOpenAddPackageItem = function (pkg) {\r\n        //debugger;\r\n        var modalInst = $uibModal.open({\r\n            animation: true,\r\n            templateUrl: 'modalAddPackageItem.html',\r\n            controller: 'ModalAddPackageItemInstanceCtrl',\r\n            size: 'lg',\r\n            backdrop: 'static',\r\n            resolve: {\r\n                packageId: function () {\r\n                    return pkg.packageId;\r\n                }\r\n            }\r\n        });\r\n\r\n        modalInst.result.then(function (resp) {\r\n            vm.init();\r\n        });\r\n    };\r\n\r\n    vm.dlgOpenEditPackageItem = function (pkg) {\r\n        //debugger;\r\n        var modalInst = $uibModal.open({\r\n            animation: true,\r\n            templateUrl: 'modalEditPackageItem.html',\r\n            controller: 'ModalEditPackageItemInstanceCtrl',\r\n            size: 'lg',\r\n            backdrop: 'static',\r\n            resolve: {\r\n                pkg: function () {\r\n                    return pkg;\r\n                }\r\n            }\r\n        });\r\n\r\n        modalInst.result.then(function (resp) {\r\n            vm.init();\r\n        });\r\n    };\r\n\r\n    vm.dlgOpenAddPackageItemImage = function (packageItem) {\r\n        //debugger;\r\n        var modalInst = $uibModal.open({\r\n            animation: true,\r\n            templateUrl: 'modalAddPackageItemImage.html',\r\n            controller: 'ModalAddPackageItemImageInstanceCtrl',\r\n            size: 'lg',\r\n            resolve: {\r\n                packageItem: function () {\r\n                    return packageItem;\r\n                }\r\n            }\r\n        });\r\n\r\n        modalInst.result.then(function (resp) {\r\n            vm.init();\r\n        });\r\n    };\r\n\r\n    vm.removePackageItem = function (packageItem) {\r\n        $http.post(`api/administrator/packages/item/${packageItem.packageImageId}/remove`)\r\n            .then(function (resp) {\r\n                vm.init();\r\n                toastr.success('Package Item removed');\r\n            }, function (err) {\r\n                toastr.error('error occured');\r\n            });\r\n    };\r\n\r\n    vm.init = function () {\r\n        $http.get('api/administrator/packages')\r\n            .then(function (resp) {\r\n                vm.items = resp.data;\r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n    vm.init();\r\n}\r\n\r\ncontroller1.$inject = ['$http', '$uibModal', 'toastr'];\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('packagesController', controller1);\r\n\r\n\r\nfunction controller2($scope, $http, $uibModalInstance, toastr, packageId) {\r\n\r\n    $scope.packageItem = {\r\n        packageId: packageId,\r\n        name: '',\r\n        description: ''\r\n    };\r\n\r\n    $scope.ok = function () {\r\n        $http.post('api/administrator/packages/itemAdd', $scope.packageItem)\r\n            .then(function (resp) {\r\n                toastr.success('Package Item saved', 'Add Item', {\r\n                    //tapToDismiss: true,\r\n                    timeOut: 0,\r\n                    onHidden: function () {\r\n                        $uibModalInstance.close($scope.package);\r\n                    }\r\n                });\r\n\r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n    $scope.cancel = function () {\r\n        $uibModalInstance.dismiss('cancel');\r\n    };\r\n}\r\n\r\ncontroller2.$inject = ['$scope', '$http', '$uibModalInstance', 'toastr', 'packageId'];\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('ModalAddPackageItemInstanceCtrl', controller2);\r\n\r\n\r\nfunction controller2a($scope, $http, $uibModalInstance, toastr, pkg) {\r\n\r\n    $scope.packageItem = angular.copy(pkg);\r\n\r\n    $scope.ok = function () {\r\n        $http.post('api/administrator/packages/itemEdit', $scope.packageItem)\r\n            .then(function (resp) {\r\n                toastr.success('Package Item Updated', 'Edit', {\r\n                    timeOut: 0,\r\n                    onHidden: function () {\r\n                        $uibModalInstance.close($scope.package);\r\n                    }\r\n                });                \r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n    $scope.cancel = function () {\r\n        $uibModalInstance.dismiss('cancel');\r\n    };\r\n}\r\n\r\ncontroller2a.$inject = ['$scope', '$http', '$uibModalInstance', 'toastr', 'pkg'];\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('ModalEditPackageItemInstanceCtrl', controller2a);\r\n\r\n\r\nfunction controller3($scope, $http, $uibModalInstance, toastr, packageItem) {\r\n    $scope.isDone = false;\r\n    $scope.packageItem = packageItem;\r\n\r\n    $scope.ok = function () {\r\n        var fileProgress = jquery__WEBPACK_IMPORTED_MODULE_0___default()(\"#fileProgress\")[0];\r\n        var message = angular.element(document).find(\"#lblMessage\");\r\n\r\n        fileProgress.style.display = \"block\";\r\n        var formData = new FormData();\r\n        formData.append('file', document.getElementById(\"file\").files[0]);\r\n        //debugger\r\n        var post = $http({\r\n            method: \"POST\",\r\n            url: `api/administrator/packages/item/${$scope.packageItem.packageImageId}/image`,\r\n            data: formData,\r\n            transformRequest: angular.identity,\r\n            headers: { 'Content-Type': undefined },\r\n            uploadEventHandlers: {\r\n                progress: function (e) {\r\n                    if (e.lengthComputable) {\r\n                        fileProgress.setAttribute(\"value\", e.loaded);\r\n                        fileProgress.setAttribute(\"max\", e.total);\r\n                    }\r\n                }\r\n            }\r\n        });\r\n\r\n        post.then(function (data, status) {\r\n            $scope.isDone = true;\r\n            //debugger;\r\n            toastr.success('Image has been uploaded.', 'Image Uploaded', {\r\n                timeOut: 0,\r\n                onHidden: function () {\r\n                    $uibModalInstance.close();\r\n                }\r\n            });           \r\n        }, function (data, status) {\r\n            //debugger;\r\n            toastr.error(data.Message, 'Error', { timeOut: 0 });\r\n        });\r\n\r\n\r\n    };\r\n\r\n    $scope.cancel = function () {\r\n        $uibModalInstance.dismiss('cancel');\r\n    };\r\n    $scope.close = function () {\r\n        $uibModalInstance.close();\r\n    };\r\n}\r\n\r\ncontroller3.$inject = ['$scope', '$http', '$uibModalInstance', 'toastr', 'packageItem'];\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('ModalAddPackageItemImageInstanceCtrl', controller3);\n\n//# sourceURL=webpack:///./ClientApp/administrator/controllers/packagesController.js?");

/***/ }),

/***/ "./ClientApp/administrator/controllers/pricingController.js":
/*!******************************************************************!*\
  !*** ./ClientApp/administrator/controllers/pricingController.js ***!
  \******************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/administrator/app.js\");\n﻿\r\n\r\n\r\n\r\nfunction controller($http, toastr) {\r\n    const vm = this;\r\n    vm.onEdit = false;\r\n\r\n    vm.edit = function () {\r\n        vm.onEdit = true;\r\n    };\r\n\r\n    vm.save = function () {\r\n        $http.post(`api/reservations/pricing`, vm.item)\r\n            .then(function (resp) {\r\n                toastr.success('Pricing updated', 'Pricing', {\r\n                    timeOut: 0, onHidden: function () {\r\n                        vm.onEdit = false;\r\n                        vm.init();\r\n                    }\r\n                });\r\n            }, function (err) {\r\n                toastr.error('Error occured', 'Pricing', { timeOut: 0 });\r\n            });\r\n\r\n    };\r\n    vm.init = function () {\r\n        $http.get('api/reservations/pricing')\r\n            .then(function (resp) {\r\n                vm.item = resp.data;\r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n    vm.init();\r\n}\r\n\r\ncontroller.$inject = ['$http', 'toastr'];\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('pricingController', controller);\n\n//# sourceURL=webpack:///./ClientApp/administrator/controllers/pricingController.js?");

/***/ }),

/***/ "./ClientApp/administrator/controllers/reservationsController.js":
/*!***********************************************************************!*\
  !*** ./ClientApp/administrator/controllers/reservationsController.js ***!
  \***********************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/administrator/app.js\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ \"./node_modules/moment/moment.js\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);\n﻿\r\n\r\n\r\n\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('reservationsController', function ($http, toastr) {\r\n    const vm = this;\r\n\r\n    vm.selectedItem = null;\r\n\r\n    vm.setSelectedItem = function (item) {\r\n        if (item === vm.selectedItem) {\r\n            vm.selectedItem = null;\r\n            return;\r\n        }\r\n\r\n        vm.selectedItem = item;\r\n    };\r\n\r\n    vm.completeReservation = function () {\r\n        $http.post(`api/administrator/reservations/${vm.selectedItem.reservationId}/complete`)\r\n            .then(function (resp) {\r\n                toastr.success('Reservation was set to complete');\r\n                vm.init();\r\n            }, function (err) {\r\n                toastr.success('Error Occured');\r\n            });\r\n    };\r\n\r\n    vm.cancelReservation = function () {\r\n        $http.post(`api/administrator/reservations/${vm.selectedItem.reservationId}/cancel`)\r\n            .then(function (resp) {\r\n                toastr.success('Reservation was set to Cancelled');\r\n                vm.init();\r\n            }, function (err) {\r\n                toastr.success('Error Occured');\r\n            });\r\n    };\r\n\r\n\r\n    vm.init = function () {\r\n        $http.get('api/administrator/reservations')\r\n            .then(function (resp) {\r\n                vm.items = resp.data;          \r\n                for (var i = 0; i < vm.items.length; i++) {\r\n                    var item = vm.items[i];\r\n\r\n                    item.toNow = moment__WEBPACK_IMPORTED_MODULE_2___default()(item.dateStart).fromNow();\r\n\r\n                    if (item.reservationStatus === 0) {\r\n                        item.reservationStatusText = 'Pending';\r\n                    }\r\n                    if (item.reservationStatus === 1) {\r\n                        item.reservationStatusText = 'Payment Sent';\r\n                    }\r\n                    if (item.reservationStatus === 2) {\r\n                        item.reservationStatusText = 'Payment Accepted';\r\n                    }\r\n                    if (item.reservationStatus === 3) {\r\n                        item.reservationStatusText = 'Payment Rejected';\r\n                    }\r\n                    if (item.reservationStatus === 4) {\r\n                        item.reservationStatusText = 'Complete';\r\n                    }\r\n                    if (item.reservationStatus === 5) {\r\n                        item.reservationStatusText = 'Cancelled';\r\n                    }\r\n                }\r\n            }, function (err) {\r\n                toastr.error('Error occured');\r\n            });\r\n    };\r\n\r\n   \r\n    vm.init();\r\n    \r\n});\n\n//# sourceURL=webpack:///./ClientApp/administrator/controllers/reservationsController.js?");

/***/ }),

/***/ "./ClientApp/administrator/main.js":
/*!*****************************************!*\
  !*** ./ClientApp/administrator/main.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.css */ \"./ClientApp/administrator/app.css\");\n/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_css__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fullcalendar_dist_fullcalendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fullcalendar/dist/fullcalendar */ \"./node_modules/fullcalendar/dist/fullcalendar.js\");\n/* harmony import */ var fullcalendar_dist_fullcalendar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fullcalendar_dist_fullcalendar__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bootstrap_dist_js_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap */ \"./node_modules/bootstrap/dist/js/bootstrap.js\");\n/* harmony import */ var bootstrap_dist_js_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var bootstrap_dist_js_bootstrap_bundle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap.bundle */ \"./node_modules/bootstrap/dist/js/bootstrap.bundle.js\");\n/* harmony import */ var bootstrap_dist_js_bootstrap_bundle__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap_bundle__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var startbootstrap_sb_admin_js_sb_admin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! startbootstrap-sb-admin/js/sb-admin */ \"./node_modules/startbootstrap-sb-admin/js/sb-admin.js\");\n/* harmony import */ var startbootstrap_sb_admin_js_sb_admin__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(startbootstrap_sb_admin_js_sb_admin__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app */ \"./ClientApp/administrator/app.js\");\n/* harmony import */ var _controllers_dashboardController__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./controllers/dashboardController */ \"./ClientApp/administrator/controllers/dashboardController.js\");\n/* harmony import */ var _controllers_reservationsController__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controllers/reservationsController */ \"./ClientApp/administrator/controllers/reservationsController.js\");\n/* harmony import */ var _controllers_customersController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./controllers/customersController */ \"./ClientApp/administrator/controllers/customersController.js\");\n/* harmony import */ var _controllers_packagesController__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./controllers/packagesController */ \"./ClientApp/administrator/controllers/packagesController.js\");\n/* harmony import */ var _controllers_messagesController__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./controllers/messagesController */ \"./ClientApp/administrator/controllers/messagesController.js\");\n/* harmony import */ var _controllers_pricingController__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./controllers/pricingController */ \"./ClientApp/administrator/controllers/pricingController.js\");\n﻿\r\n\r\n\r\n\r\n\r\n\r\n\r\n//import 'bootstrap-material-design/dist/js/bootstrap-material-design';\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./ClientApp/administrator/main.js?");

/***/ }),

/***/ "./node_modules/moment/locale sync recursive ^\\.\\/.*$":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./af\": \"./node_modules/moment/locale/af.js\",\n\t\"./af.js\": \"./node_modules/moment/locale/af.js\",\n\t\"./ar\": \"./node_modules/moment/locale/ar.js\",\n\t\"./ar-dz\": \"./node_modules/moment/locale/ar-dz.js\",\n\t\"./ar-dz.js\": \"./node_modules/moment/locale/ar-dz.js\",\n\t\"./ar-kw\": \"./node_modules/moment/locale/ar-kw.js\",\n\t\"./ar-kw.js\": \"./node_modules/moment/locale/ar-kw.js\",\n\t\"./ar-ly\": \"./node_modules/moment/locale/ar-ly.js\",\n\t\"./ar-ly.js\": \"./node_modules/moment/locale/ar-ly.js\",\n\t\"./ar-ma\": \"./node_modules/moment/locale/ar-ma.js\",\n\t\"./ar-ma.js\": \"./node_modules/moment/locale/ar-ma.js\",\n\t\"./ar-sa\": \"./node_modules/moment/locale/ar-sa.js\",\n\t\"./ar-sa.js\": \"./node_modules/moment/locale/ar-sa.js\",\n\t\"./ar-tn\": \"./node_modules/moment/locale/ar-tn.js\",\n\t\"./ar-tn.js\": \"./node_modules/moment/locale/ar-tn.js\",\n\t\"./ar.js\": \"./node_modules/moment/locale/ar.js\",\n\t\"./az\": \"./node_modules/moment/locale/az.js\",\n\t\"./az.js\": \"./node_modules/moment/locale/az.js\",\n\t\"./be\": \"./node_modules/moment/locale/be.js\",\n\t\"./be.js\": \"./node_modules/moment/locale/be.js\",\n\t\"./bg\": \"./node_modules/moment/locale/bg.js\",\n\t\"./bg.js\": \"./node_modules/moment/locale/bg.js\",\n\t\"./bm\": \"./node_modules/moment/locale/bm.js\",\n\t\"./bm.js\": \"./node_modules/moment/locale/bm.js\",\n\t\"./bn\": \"./node_modules/moment/locale/bn.js\",\n\t\"./bn.js\": \"./node_modules/moment/locale/bn.js\",\n\t\"./bo\": \"./node_modules/moment/locale/bo.js\",\n\t\"./bo.js\": \"./node_modules/moment/locale/bo.js\",\n\t\"./br\": \"./node_modules/moment/locale/br.js\",\n\t\"./br.js\": \"./node_modules/moment/locale/br.js\",\n\t\"./bs\": \"./node_modules/moment/locale/bs.js\",\n\t\"./bs.js\": \"./node_modules/moment/locale/bs.js\",\n\t\"./ca\": \"./node_modules/moment/locale/ca.js\",\n\t\"./ca.js\": \"./node_modules/moment/locale/ca.js\",\n\t\"./cs\": \"./node_modules/moment/locale/cs.js\",\n\t\"./cs.js\": \"./node_modules/moment/locale/cs.js\",\n\t\"./cv\": \"./node_modules/moment/locale/cv.js\",\n\t\"./cv.js\": \"./node_modules/moment/locale/cv.js\",\n\t\"./cy\": \"./node_modules/moment/locale/cy.js\",\n\t\"./cy.js\": \"./node_modules/moment/locale/cy.js\",\n\t\"./da\": \"./node_modules/moment/locale/da.js\",\n\t\"./da.js\": \"./node_modules/moment/locale/da.js\",\n\t\"./de\": \"./node_modules/moment/locale/de.js\",\n\t\"./de-at\": \"./node_modules/moment/locale/de-at.js\",\n\t\"./de-at.js\": \"./node_modules/moment/locale/de-at.js\",\n\t\"./de-ch\": \"./node_modules/moment/locale/de-ch.js\",\n\t\"./de-ch.js\": \"./node_modules/moment/locale/de-ch.js\",\n\t\"./de.js\": \"./node_modules/moment/locale/de.js\",\n\t\"./dv\": \"./node_modules/moment/locale/dv.js\",\n\t\"./dv.js\": \"./node_modules/moment/locale/dv.js\",\n\t\"./el\": \"./node_modules/moment/locale/el.js\",\n\t\"./el.js\": \"./node_modules/moment/locale/el.js\",\n\t\"./en-SG\": \"./node_modules/moment/locale/en-SG.js\",\n\t\"./en-SG.js\": \"./node_modules/moment/locale/en-SG.js\",\n\t\"./en-au\": \"./node_modules/moment/locale/en-au.js\",\n\t\"./en-au.js\": \"./node_modules/moment/locale/en-au.js\",\n\t\"./en-ca\": \"./node_modules/moment/locale/en-ca.js\",\n\t\"./en-ca.js\": \"./node_modules/moment/locale/en-ca.js\",\n\t\"./en-gb\": \"./node_modules/moment/locale/en-gb.js\",\n\t\"./en-gb.js\": \"./node_modules/moment/locale/en-gb.js\",\n\t\"./en-ie\": \"./node_modules/moment/locale/en-ie.js\",\n\t\"./en-ie.js\": \"./node_modules/moment/locale/en-ie.js\",\n\t\"./en-il\": \"./node_modules/moment/locale/en-il.js\",\n\t\"./en-il.js\": \"./node_modules/moment/locale/en-il.js\",\n\t\"./en-nz\": \"./node_modules/moment/locale/en-nz.js\",\n\t\"./en-nz.js\": \"./node_modules/moment/locale/en-nz.js\",\n\t\"./eo\": \"./node_modules/moment/locale/eo.js\",\n\t\"./eo.js\": \"./node_modules/moment/locale/eo.js\",\n\t\"./es\": \"./node_modules/moment/locale/es.js\",\n\t\"./es-do\": \"./node_modules/moment/locale/es-do.js\",\n\t\"./es-do.js\": \"./node_modules/moment/locale/es-do.js\",\n\t\"./es-us\": \"./node_modules/moment/locale/es-us.js\",\n\t\"./es-us.js\": \"./node_modules/moment/locale/es-us.js\",\n\t\"./es.js\": \"./node_modules/moment/locale/es.js\",\n\t\"./et\": \"./node_modules/moment/locale/et.js\",\n\t\"./et.js\": \"./node_modules/moment/locale/et.js\",\n\t\"./eu\": \"./node_modules/moment/locale/eu.js\",\n\t\"./eu.js\": \"./node_modules/moment/locale/eu.js\",\n\t\"./fa\": \"./node_modules/moment/locale/fa.js\",\n\t\"./fa.js\": \"./node_modules/moment/locale/fa.js\",\n\t\"./fi\": \"./node_modules/moment/locale/fi.js\",\n\t\"./fi.js\": \"./node_modules/moment/locale/fi.js\",\n\t\"./fo\": \"./node_modules/moment/locale/fo.js\",\n\t\"./fo.js\": \"./node_modules/moment/locale/fo.js\",\n\t\"./fr\": \"./node_modules/moment/locale/fr.js\",\n\t\"./fr-ca\": \"./node_modules/moment/locale/fr-ca.js\",\n\t\"./fr-ca.js\": \"./node_modules/moment/locale/fr-ca.js\",\n\t\"./fr-ch\": \"./node_modules/moment/locale/fr-ch.js\",\n\t\"./fr-ch.js\": \"./node_modules/moment/locale/fr-ch.js\",\n\t\"./fr.js\": \"./node_modules/moment/locale/fr.js\",\n\t\"./fy\": \"./node_modules/moment/locale/fy.js\",\n\t\"./fy.js\": \"./node_modules/moment/locale/fy.js\",\n\t\"./ga\": \"./node_modules/moment/locale/ga.js\",\n\t\"./ga.js\": \"./node_modules/moment/locale/ga.js\",\n\t\"./gd\": \"./node_modules/moment/locale/gd.js\",\n\t\"./gd.js\": \"./node_modules/moment/locale/gd.js\",\n\t\"./gl\": \"./node_modules/moment/locale/gl.js\",\n\t\"./gl.js\": \"./node_modules/moment/locale/gl.js\",\n\t\"./gom-latn\": \"./node_modules/moment/locale/gom-latn.js\",\n\t\"./gom-latn.js\": \"./node_modules/moment/locale/gom-latn.js\",\n\t\"./gu\": \"./node_modules/moment/locale/gu.js\",\n\t\"./gu.js\": \"./node_modules/moment/locale/gu.js\",\n\t\"./he\": \"./node_modules/moment/locale/he.js\",\n\t\"./he.js\": \"./node_modules/moment/locale/he.js\",\n\t\"./hi\": \"./node_modules/moment/locale/hi.js\",\n\t\"./hi.js\": \"./node_modules/moment/locale/hi.js\",\n\t\"./hr\": \"./node_modules/moment/locale/hr.js\",\n\t\"./hr.js\": \"./node_modules/moment/locale/hr.js\",\n\t\"./hu\": \"./node_modules/moment/locale/hu.js\",\n\t\"./hu.js\": \"./node_modules/moment/locale/hu.js\",\n\t\"./hy-am\": \"./node_modules/moment/locale/hy-am.js\",\n\t\"./hy-am.js\": \"./node_modules/moment/locale/hy-am.js\",\n\t\"./id\": \"./node_modules/moment/locale/id.js\",\n\t\"./id.js\": \"./node_modules/moment/locale/id.js\",\n\t\"./is\": \"./node_modules/moment/locale/is.js\",\n\t\"./is.js\": \"./node_modules/moment/locale/is.js\",\n\t\"./it\": \"./node_modules/moment/locale/it.js\",\n\t\"./it-ch\": \"./node_modules/moment/locale/it-ch.js\",\n\t\"./it-ch.js\": \"./node_modules/moment/locale/it-ch.js\",\n\t\"./it.js\": \"./node_modules/moment/locale/it.js\",\n\t\"./ja\": \"./node_modules/moment/locale/ja.js\",\n\t\"./ja.js\": \"./node_modules/moment/locale/ja.js\",\n\t\"./jv\": \"./node_modules/moment/locale/jv.js\",\n\t\"./jv.js\": \"./node_modules/moment/locale/jv.js\",\n\t\"./ka\": \"./node_modules/moment/locale/ka.js\",\n\t\"./ka.js\": \"./node_modules/moment/locale/ka.js\",\n\t\"./kk\": \"./node_modules/moment/locale/kk.js\",\n\t\"./kk.js\": \"./node_modules/moment/locale/kk.js\",\n\t\"./km\": \"./node_modules/moment/locale/km.js\",\n\t\"./km.js\": \"./node_modules/moment/locale/km.js\",\n\t\"./kn\": \"./node_modules/moment/locale/kn.js\",\n\t\"./kn.js\": \"./node_modules/moment/locale/kn.js\",\n\t\"./ko\": \"./node_modules/moment/locale/ko.js\",\n\t\"./ko.js\": \"./node_modules/moment/locale/ko.js\",\n\t\"./ku\": \"./node_modules/moment/locale/ku.js\",\n\t\"./ku.js\": \"./node_modules/moment/locale/ku.js\",\n\t\"./ky\": \"./node_modules/moment/locale/ky.js\",\n\t\"./ky.js\": \"./node_modules/moment/locale/ky.js\",\n\t\"./lb\": \"./node_modules/moment/locale/lb.js\",\n\t\"./lb.js\": \"./node_modules/moment/locale/lb.js\",\n\t\"./lo\": \"./node_modules/moment/locale/lo.js\",\n\t\"./lo.js\": \"./node_modules/moment/locale/lo.js\",\n\t\"./lt\": \"./node_modules/moment/locale/lt.js\",\n\t\"./lt.js\": \"./node_modules/moment/locale/lt.js\",\n\t\"./lv\": \"./node_modules/moment/locale/lv.js\",\n\t\"./lv.js\": \"./node_modules/moment/locale/lv.js\",\n\t\"./me\": \"./node_modules/moment/locale/me.js\",\n\t\"./me.js\": \"./node_modules/moment/locale/me.js\",\n\t\"./mi\": \"./node_modules/moment/locale/mi.js\",\n\t\"./mi.js\": \"./node_modules/moment/locale/mi.js\",\n\t\"./mk\": \"./node_modules/moment/locale/mk.js\",\n\t\"./mk.js\": \"./node_modules/moment/locale/mk.js\",\n\t\"./ml\": \"./node_modules/moment/locale/ml.js\",\n\t\"./ml.js\": \"./node_modules/moment/locale/ml.js\",\n\t\"./mn\": \"./node_modules/moment/locale/mn.js\",\n\t\"./mn.js\": \"./node_modules/moment/locale/mn.js\",\n\t\"./mr\": \"./node_modules/moment/locale/mr.js\",\n\t\"./mr.js\": \"./node_modules/moment/locale/mr.js\",\n\t\"./ms\": \"./node_modules/moment/locale/ms.js\",\n\t\"./ms-my\": \"./node_modules/moment/locale/ms-my.js\",\n\t\"./ms-my.js\": \"./node_modules/moment/locale/ms-my.js\",\n\t\"./ms.js\": \"./node_modules/moment/locale/ms.js\",\n\t\"./mt\": \"./node_modules/moment/locale/mt.js\",\n\t\"./mt.js\": \"./node_modules/moment/locale/mt.js\",\n\t\"./my\": \"./node_modules/moment/locale/my.js\",\n\t\"./my.js\": \"./node_modules/moment/locale/my.js\",\n\t\"./nb\": \"./node_modules/moment/locale/nb.js\",\n\t\"./nb.js\": \"./node_modules/moment/locale/nb.js\",\n\t\"./ne\": \"./node_modules/moment/locale/ne.js\",\n\t\"./ne.js\": \"./node_modules/moment/locale/ne.js\",\n\t\"./nl\": \"./node_modules/moment/locale/nl.js\",\n\t\"./nl-be\": \"./node_modules/moment/locale/nl-be.js\",\n\t\"./nl-be.js\": \"./node_modules/moment/locale/nl-be.js\",\n\t\"./nl.js\": \"./node_modules/moment/locale/nl.js\",\n\t\"./nn\": \"./node_modules/moment/locale/nn.js\",\n\t\"./nn.js\": \"./node_modules/moment/locale/nn.js\",\n\t\"./pa-in\": \"./node_modules/moment/locale/pa-in.js\",\n\t\"./pa-in.js\": \"./node_modules/moment/locale/pa-in.js\",\n\t\"./pl\": \"./node_modules/moment/locale/pl.js\",\n\t\"./pl.js\": \"./node_modules/moment/locale/pl.js\",\n\t\"./pt\": \"./node_modules/moment/locale/pt.js\",\n\t\"./pt-br\": \"./node_modules/moment/locale/pt-br.js\",\n\t\"./pt-br.js\": \"./node_modules/moment/locale/pt-br.js\",\n\t\"./pt.js\": \"./node_modules/moment/locale/pt.js\",\n\t\"./ro\": \"./node_modules/moment/locale/ro.js\",\n\t\"./ro.js\": \"./node_modules/moment/locale/ro.js\",\n\t\"./ru\": \"./node_modules/moment/locale/ru.js\",\n\t\"./ru.js\": \"./node_modules/moment/locale/ru.js\",\n\t\"./sd\": \"./node_modules/moment/locale/sd.js\",\n\t\"./sd.js\": \"./node_modules/moment/locale/sd.js\",\n\t\"./se\": \"./node_modules/moment/locale/se.js\",\n\t\"./se.js\": \"./node_modules/moment/locale/se.js\",\n\t\"./si\": \"./node_modules/moment/locale/si.js\",\n\t\"./si.js\": \"./node_modules/moment/locale/si.js\",\n\t\"./sk\": \"./node_modules/moment/locale/sk.js\",\n\t\"./sk.js\": \"./node_modules/moment/locale/sk.js\",\n\t\"./sl\": \"./node_modules/moment/locale/sl.js\",\n\t\"./sl.js\": \"./node_modules/moment/locale/sl.js\",\n\t\"./sq\": \"./node_modules/moment/locale/sq.js\",\n\t\"./sq.js\": \"./node_modules/moment/locale/sq.js\",\n\t\"./sr\": \"./node_modules/moment/locale/sr.js\",\n\t\"./sr-cyrl\": \"./node_modules/moment/locale/sr-cyrl.js\",\n\t\"./sr-cyrl.js\": \"./node_modules/moment/locale/sr-cyrl.js\",\n\t\"./sr.js\": \"./node_modules/moment/locale/sr.js\",\n\t\"./ss\": \"./node_modules/moment/locale/ss.js\",\n\t\"./ss.js\": \"./node_modules/moment/locale/ss.js\",\n\t\"./sv\": \"./node_modules/moment/locale/sv.js\",\n\t\"./sv.js\": \"./node_modules/moment/locale/sv.js\",\n\t\"./sw\": \"./node_modules/moment/locale/sw.js\",\n\t\"./sw.js\": \"./node_modules/moment/locale/sw.js\",\n\t\"./ta\": \"./node_modules/moment/locale/ta.js\",\n\t\"./ta.js\": \"./node_modules/moment/locale/ta.js\",\n\t\"./te\": \"./node_modules/moment/locale/te.js\",\n\t\"./te.js\": \"./node_modules/moment/locale/te.js\",\n\t\"./tet\": \"./node_modules/moment/locale/tet.js\",\n\t\"./tet.js\": \"./node_modules/moment/locale/tet.js\",\n\t\"./tg\": \"./node_modules/moment/locale/tg.js\",\n\t\"./tg.js\": \"./node_modules/moment/locale/tg.js\",\n\t\"./th\": \"./node_modules/moment/locale/th.js\",\n\t\"./th.js\": \"./node_modules/moment/locale/th.js\",\n\t\"./tl-ph\": \"./node_modules/moment/locale/tl-ph.js\",\n\t\"./tl-ph.js\": \"./node_modules/moment/locale/tl-ph.js\",\n\t\"./tlh\": \"./node_modules/moment/locale/tlh.js\",\n\t\"./tlh.js\": \"./node_modules/moment/locale/tlh.js\",\n\t\"./tr\": \"./node_modules/moment/locale/tr.js\",\n\t\"./tr.js\": \"./node_modules/moment/locale/tr.js\",\n\t\"./tzl\": \"./node_modules/moment/locale/tzl.js\",\n\t\"./tzl.js\": \"./node_modules/moment/locale/tzl.js\",\n\t\"./tzm\": \"./node_modules/moment/locale/tzm.js\",\n\t\"./tzm-latn\": \"./node_modules/moment/locale/tzm-latn.js\",\n\t\"./tzm-latn.js\": \"./node_modules/moment/locale/tzm-latn.js\",\n\t\"./tzm.js\": \"./node_modules/moment/locale/tzm.js\",\n\t\"./ug-cn\": \"./node_modules/moment/locale/ug-cn.js\",\n\t\"./ug-cn.js\": \"./node_modules/moment/locale/ug-cn.js\",\n\t\"./uk\": \"./node_modules/moment/locale/uk.js\",\n\t\"./uk.js\": \"./node_modules/moment/locale/uk.js\",\n\t\"./ur\": \"./node_modules/moment/locale/ur.js\",\n\t\"./ur.js\": \"./node_modules/moment/locale/ur.js\",\n\t\"./uz\": \"./node_modules/moment/locale/uz.js\",\n\t\"./uz-latn\": \"./node_modules/moment/locale/uz-latn.js\",\n\t\"./uz-latn.js\": \"./node_modules/moment/locale/uz-latn.js\",\n\t\"./uz.js\": \"./node_modules/moment/locale/uz.js\",\n\t\"./vi\": \"./node_modules/moment/locale/vi.js\",\n\t\"./vi.js\": \"./node_modules/moment/locale/vi.js\",\n\t\"./x-pseudo\": \"./node_modules/moment/locale/x-pseudo.js\",\n\t\"./x-pseudo.js\": \"./node_modules/moment/locale/x-pseudo.js\",\n\t\"./yo\": \"./node_modules/moment/locale/yo.js\",\n\t\"./yo.js\": \"./node_modules/moment/locale/yo.js\",\n\t\"./zh-cn\": \"./node_modules/moment/locale/zh-cn.js\",\n\t\"./zh-cn.js\": \"./node_modules/moment/locale/zh-cn.js\",\n\t\"./zh-hk\": \"./node_modules/moment/locale/zh-hk.js\",\n\t\"./zh-hk.js\": \"./node_modules/moment/locale/zh-hk.js\",\n\t\"./zh-tw\": \"./node_modules/moment/locale/zh-tw.js\",\n\t\"./zh-tw.js\": \"./node_modules/moment/locale/zh-tw.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./node_modules/moment/locale sync recursive ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack:///./node_modules/moment/locale_sync_^\\.\\/.*$?");

/***/ })

/******/ });