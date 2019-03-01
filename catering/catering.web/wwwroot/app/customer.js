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
/******/ 		"customer": 0
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
/******/ 	deferredModules.push(["./ClientApp/customer/main.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ClientApp/customer/app.css":
/*!************************************!*\
  !*** ./ClientApp/customer/app.css ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./ClientApp/customer/app.css?");

/***/ }),

/***/ "./ClientApp/customer/app.js":
/*!***********************************!*\
  !*** ./ClientApp/customer/app.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var angular_ui_bootstrap_dist_ui_bootstrap_tpls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-ui-bootstrap/dist/ui-bootstrap-tpls */ \"./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js\");\n/* harmony import */ var angular_ui_bootstrap_dist_ui_bootstrap_tpls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angular_ui_bootstrap_dist_ui_bootstrap_tpls__WEBPACK_IMPORTED_MODULE_1__);\n﻿\r\n\r\n\r\n\r\nconst app = angular__WEBPACK_IMPORTED_MODULE_0___default.a.module('app', [__webpack_require__(/*! angular-animate */ \"./node_modules/angular-animate/index.js\"), __webpack_require__(/*! angular-toastr */ \"./node_modules/angular-toastr/index.js\"), 'ui.bootstrap']);\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./ClientApp/customer/app.js?");

/***/ }),

/***/ "./ClientApp/customer/controllers/indexController.js":
/*!***********************************************************!*\
  !*** ./ClientApp/customer/controllers/indexController.js ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/customer/app.js\");\n﻿\r\n\r\n\r\n\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('indexController', function ($http) {\r\n    const vm = this;\r\n\r\n\r\n    vm.hi = function () {\r\n        alert('index controller');\r\n    };\r\n\r\n    var url = 'Home/Index/?handler=Reservations';\r\n\r\n\r\n    function init() {\r\n        $http.get(url)\r\n            .then(function (resp) {\r\n                //debugger;\r\n\r\n                let events = [];\r\n\r\n                for (var i = 0; i < resp.data.length; i++) {\r\n                    var item = resp.data[i];\r\n\r\n                    events.push({\r\n                        title: item.package.name,\r\n                        start: jquery__WEBPACK_IMPORTED_MODULE_0___default.a.fullCalendar.moment(item.dateStart),\r\n                        end: jquery__WEBPACK_IMPORTED_MODULE_0___default.a.fullCalendar.moment(item.dateEnd),\r\n                    })\r\n                }\r\n\r\n                jquery__WEBPACK_IMPORTED_MODULE_0___default()('#calendar').fullCalendar({\r\n                    header: { center: 'month,agendaWeek' },\r\n                    defaultView: 'agendaWeek',\r\n                    minTime: '07:00:00',\r\n                    maxTime: '22:59:00',\r\n                    events: events\r\n                });\r\n\r\n            }, function (err) {\r\n                debugger;\r\n            })\r\n    }\r\n\r\n\r\n    init();\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./ClientApp/customer/controllers/indexController.js?");

/***/ }),

/***/ "./ClientApp/customer/controllers/mainController.js":
/*!**********************************************************!*\
  !*** ./ClientApp/customer/controllers/mainController.js ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/customer/app.js\");\n﻿\r\n\r\n\r\nconst signalR = __webpack_require__(/*! @aspnet/signalr */ \"./node_modules/@aspnet/signalr/dist/esm/index.js\");\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('mainController', function (toastr) {\r\n    const vm = this;\r\n\r\n    vm.Ok = function () {\r\n        vm.connection.invoke(\"SendMessage\", {\r\n            receiverId: 'administrator',\r\n            messageType: 'info',\r\n            title: 'For your information',\r\n            content: 'the quick brown foxs'\r\n        });\r\n    };\r\n\r\n    vm.connection = new signalR.HubConnectionBuilder().withUrl(\"/notificationHub\").build();\r\n\r\n    vm.connection.on('OnReceiveMessage', function (messageType, title, content) {\r\n        toastr[messageType](content, title);\r\n    });\r\n\r\n    vm.connection.start()\r\n        .then(function (resp) {\r\n            //debugger;\r\n        })\r\n        .catch(function (err) {\r\n            toastr.error(err.toString());\r\n            //return console.error(err.toString());\r\n        });\r\n\r\n\r\n    function init() {\r\n        //$(document).ready(function () {\r\n        //$('body').bootstrapMaterialDesign();\r\n\r\n        //toastr.success('oye');\r\n        //}); \r\n    }\r\n\r\n    init();\r\n});\n\n//# sourceURL=webpack:///./ClientApp/customer/controllers/mainController.js?");

/***/ }),

/***/ "./ClientApp/customer/controllers/myReservationsController.js":
/*!********************************************************************!*\
  !*** ./ClientApp/customer/controllers/myReservationsController.js ***!
  \********************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ \"./node_modules/angular/index.js\");\n/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/customer/app.js\");\n﻿\r\n\r\n\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('myReservationsController', function ($http, toastr, $uibModal) {\r\n    const vm = this;\r\n\r\n    vm.selectedItem = null;\r\n\r\n    vm.setSelectedItem = function (item) {\r\n        vm.selectedItem = item;\r\n    };\r\n\r\n    vm.setPayment = function() {\r\n\r\n        var modalInst = $uibModal.open({\r\n            animation: true,\r\n            //appendTo: angular.element(document).find('aside'),\r\n            templateUrl: 'modalPayment.html',\r\n            controller: 'ModalInstanceCtrl',\r\n            size: 'lg',\r\n            resolve: {\r\n                paymentDetail: function() {\r\n                    return {\r\n                        totalPrice: vm.selectedItem.totalPrice,\r\n                        amountPaid: vm.selectedItem.amountPaid,\r\n                        referenceNumber: vm.selectedItem.referenceNumber,\r\n                    };\r\n                }\r\n            }\r\n        });\r\n\r\n        modalInst.result.then(function (resp) {\r\n\r\n            var payload = {\r\n                id: vm.selectedItem.reservationId,\r\n                amountPaid: resp.amountPaid,\r\n                referenceNumber: resp.referenceNumber\r\n            };\r\n\r\n            $http.post(`api/customer/reservation/pay`, payload)\r\n                .then(function (resp) {\r\n                    toastr.success('Reservation paid', 'Payment Success');\r\n                    getReservations();\r\n                }, function (err) {\r\n                    toastr.danger('An error occured while updating reservation', 'Payment Failed');\r\n                });\r\n        });\r\n\r\n\r\n    };\r\n\r\n    vm.cancelReservation = function() {\r\n\r\n        $http.post(`api/customer/cancelReservation/${vm.selectedItem.reservationId}`)\r\n            .then(function (resp) {\r\n                toastr.warning('Reservation cancelled', 'Cancellation');\r\n                getReservations();\r\n            }, function (err) {\r\n                toastr.danger('An error occured while updating reservation', 'Cancellation Failed');\r\n            });\r\n    };\r\n\r\n    function getReservations() {\r\n        $http.get('api/customer/reservations')\r\n            .then(function (resp) {\r\n                vm.items = resp.data;\r\n            }, function (err) {\r\n                debugger;\r\n            });\r\n    }\r\n\r\n\r\n    getReservations();\r\n});\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, toastr, paymentDetail) {\r\n\r\n    $scope.payment = angular__WEBPACK_IMPORTED_MODULE_0___default.a.copy(paymentDetail);\r\n\r\n    $scope.ok = function () {\r\n        if ($scope.payment.amountPaid < $scope.payment.totalPrice) {\r\n            toastr.warning('Amount Paid is less that Total price', 'Really?');\r\n            return;\r\n        }\r\n        $uibModalInstance.close($scope.payment);\r\n    };\r\n\r\n    $scope.cancel = function () {\r\n        $uibModalInstance.dismiss('cancel');\r\n    };\r\n});\n\n//# sourceURL=webpack:///./ClientApp/customer/controllers/myReservationsController.js?");

/***/ }),

/***/ "./ClientApp/customer/controllers/reservationController.js":
/*!*****************************************************************!*\
  !*** ./ClientApp/customer/controllers/reservationController.js ***!
  \*****************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ \"./ClientApp/customer/app.js\");\n﻿\r\n\r\n\r\n\r\n_app__WEBPACK_IMPORTED_MODULE_1__[\"default\"].controller('reservationController', function ($http) {\r\n    var vm = this;\r\n\r\n    // we will store all of our form data in this object\r\n    vm.formData = {\r\n        starterCount: 0,\r\n        mainCount: 0,\r\n        drinkCount: 0,\r\n        dateStart: new Date(),// new Date().toDatetimeLocal(),//  $.fullCalendar.moment.utc(new Date()),\r\n        dateEnd: new Date()// $.fullCalendar.moment.local(new Date()),\r\n    };\r\n    vm.lookups = {\r\n        packages: [],\r\n        starters: [],\r\n        mains: [],\r\n        drinks: []\r\n    };\r\n\r\n\r\n    vm.reset = function () {\r\n        vm.pricing = angular.copy(vm.originalPricing);\r\n    };\r\n\r\n    vm.calculate = function () {\r\n\r\n        var pricing = vm.pricing;\r\n        var total = 0;\r\n\r\n        total += pricing.plate * pricing.plateCount || 0;\r\n        total += pricing.spoon * pricing.spoonCount || 0;\r\n        total += pricing.fork * pricing.forkCount || 0;\r\n        total += pricing.glass * pricing.glassCount || 0;\r\n        total += pricing.chair * pricing.chairCount || 0;\r\n        total += pricing.table * pricing.tableCount || 0;\r\n\r\n        if (pricing.hasFlower) {\r\n            total += pricing.flower;\r\n        }\r\n\r\n        if (pricing.hasSoundSystem) {\r\n            total += pricing.soundSystem;\r\n        }\r\n\r\n        pricing.total = total;\r\n    };\r\n\r\n    vm.autoAllocate = function () {\r\n        var pricing = vm.pricing;\r\n        pricing.plateCount = pricing.guestCount;\r\n        pricing.spoonCount = pricing.guestCount;\r\n        pricing.forkCount = pricing.guestCount;\r\n        pricing.glassCount = pricing.guestCount;\r\n        pricing.chairCount = pricing.guestCount;\r\n        pricing.tableCount = Math.ceil(pricing.guestCount / 4);\r\n        pricing.hasFlower = true;\r\n        pricing.hasSoundSystem = true;\r\n\r\n        vm.calculate();\r\n    };\r\n\r\n    vm.processForm = function () {\r\n\r\n        var pricing = vm.pricing;\r\n\r\n        var payload = {\r\n            packageId: vm.formData.package.packageId,\r\n\r\n            guestCount: pricing.guestCount,\r\n\r\n            plateCount: pricing.plateCount,\r\n            platePrice: pricing.plate,\r\n\r\n            spoonCount: pricing.spoonCount,\r\n            spoonPrice: pricing.spoon,\r\n\r\n            forkCount: pricing.forkCount,\r\n            forkPrice: pricing.fork,\r\n\r\n            glassCount: pricing.glassCount,\r\n            glassPrice: pricing.glass,\r\n\r\n            chairCount: pricing.chairCount,\r\n            chairPrice: pricing.chair,\r\n\r\n            tableCount: pricing.tableCount,\r\n            tablePrice: pricing.table,\r\n\r\n            hasFlower: pricing.hasFlower,\r\n            flowerPrice: pricing.flower,\r\n\r\n            hasSoundSystem: pricing.hasSoundSystem,\r\n            soundSystemPrice: pricing.soundSystem,\r\n\r\n\r\n            dateStart: vm.formData.dateStart,\r\n            dateEnd: vm.formData.dateEnd\r\n        };\r\n\r\n        jquery__WEBPACK_IMPORTED_MODULE_0___default.a.ajax({\r\n            url: 'Reservations/?handler=Reservation',\r\n            type: 'POST',\r\n            contentType: 'application/json; charset=utf-8',\r\n            headers: {\r\n                RequestVerificationToken:\r\n                    jquery__WEBPACK_IMPORTED_MODULE_0___default()('input:hidden[name=\"__RequestVerificationToken\"]').val()\r\n            },\r\n            data: JSON.stringify(payload)\r\n        }).done(function (result) {\r\n            //debugger;\r\n            alert('Reservation has been created. Please check your account for more info')\r\n            window.location.reload();\r\n        }).fail(function (err) {\r\n            //debugger;\r\n            var message = err.responseJSON.message;\r\n            alert(message);\r\n            //var conflicts = err.responseJSON.conflicts;\r\n            //alert(message + JSON.stringify( conflicts));\r\n        }).always(function () {\r\n\r\n        });\r\n\r\n    }\r\n\r\n    function getPackages() {\r\n        $http.get('Reservations/?handler=Packages')\r\n            .then(function (resp) {\r\n                vm.lookups.packages = resp.data;\r\n\r\n\r\n                //$scope.formData.package = $scope.lookups.packages[0];\r\n                //$scope.setPackage();\r\n            }, function (err) {\r\n                debugger;\r\n            });\r\n    }\r\n\r\n    function getPricing() {\r\n        $http.get('Reservations/?handler=Pricing')\r\n            .then(function (resp) {\r\n                vm.pricing = resp.data;\r\n                vm.originalPricing = angular.copy(resp.data);\r\n            }, function (err) {\r\n                debugger;\r\n            });\r\n    }\r\n\r\n    getPackages();\r\n    getPricing();\r\n\r\n    var url = 'Reservations/?handler=Reservations';\r\n    //debugger;\r\n    $http.get(url)\r\n        .then(function (resp) {\r\n\r\n            var events = [];\r\n            for (var i = 0; i < resp.data.length; i++) {\r\n                var item = resp.data[i];\r\n\r\n                events.push({\r\n                    title: item.package.name,\r\n                    start: jquery__WEBPACK_IMPORTED_MODULE_0___default.a.fullCalendar.moment(item.dateStart),\r\n                    end: jquery__WEBPACK_IMPORTED_MODULE_0___default.a.fullCalendar.moment(item.dateEnd)\r\n                });\r\n            }\r\n\r\n            jquery__WEBPACK_IMPORTED_MODULE_0___default()('#calendar').fullCalendar({\r\n                // put your options and callbacks here\r\n                header: { center: 'month,agendaWeek' },\r\n                defaultView: 'agendaWeek',\r\n                minTime: '07:00:00',\r\n                maxTime: '22:00:00',\r\n                events: events\r\n            })\r\n\r\n        }, function (err) {\r\n            debugger;\r\n        });\r\n\r\n\r\n});\n\n//# sourceURL=webpack:///./ClientApp/customer/controllers/reservationController.js?");

/***/ }),

/***/ "./ClientApp/customer/main.js":
/*!************************************!*\
  !*** ./ClientApp/customer/main.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.css */ \"./ClientApp/customer/app.css\");\n/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_css__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fullcalendar_dist_fullcalendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fullcalendar/dist/fullcalendar */ \"./node_modules/fullcalendar/dist/fullcalendar.js\");\n/* harmony import */ var fullcalendar_dist_fullcalendar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fullcalendar_dist_fullcalendar__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bootstrap_dist_js_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap */ \"./node_modules/bootstrap/dist/js/bootstrap.js\");\n/* harmony import */ var bootstrap_dist_js_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var bootstrap_dist_js_bootstrap_bundle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap.bundle */ \"./node_modules/bootstrap/dist/js/bootstrap.bundle.js\");\n/* harmony import */ var bootstrap_dist_js_bootstrap_bundle__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap_bundle__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app */ \"./ClientApp/customer/app.js\");\n/* harmony import */ var _controllers_indexController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./controllers/indexController */ \"./ClientApp/customer/controllers/indexController.js\");\n/* harmony import */ var _controllers_mainController__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./controllers/mainController */ \"./ClientApp/customer/controllers/mainController.js\");\n/* harmony import */ var _controllers_reservationController__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controllers/reservationController */ \"./ClientApp/customer/controllers/reservationController.js\");\n/* harmony import */ var _controllers_myReservationsController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./controllers/myReservationsController */ \"./ClientApp/customer/controllers/myReservationsController.js\");\n﻿\r\n\r\n\r\n\r\n\r\n\r\n\r\n//import 'bootstrap-material-design/dist/js/bootstrap-material-design';\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./ClientApp/customer/main.js?");

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