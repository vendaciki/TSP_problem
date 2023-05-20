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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.connectPoints = undefined;

	var _mapPoint = __webpack_require__(1);

	var _mapPoint2 = _interopRequireDefault(_mapPoint);

	var _traveling_salesman_algorithm = __webpack_require__(2);

	var _coords = __webpack_require__(3);

	var _coords2 = _interopRequireDefault(_coords);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	$(function () {
	  //canvas setup
	  var canvas = document.getElementById("canvas");
	  var ctx = canvas.getContext("2d");

	  var points = [];

	  // map setup
	  var map = initMap();
	  var markers = _coords2.default[1].map(function (c) {
	    return new google.maps.Marker({ position: c, map: map });
	  });
	  // markers = stateCoords.map(c => new google.maps.Marker({position: c, map: map}));
	  var pathData = [];
	  var currentPath = void 0;

	  // setup tabs
	  $('#route-tab').click(function () {
	    $('#paint').css("display", "none");
	    $('#route').css("display", "block");
	    $(this).addClass("active");
	  });

	  // add points to the canvas
	  $("#canvas").mousedown(function (e) {
	    var pos = getMousePos(canvas, e);
	    points.push(new _mapPoint2.default(pos.x, pos.y));
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    points.forEach(function (point) {
	      ctx.beginPath();
	      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
	      ctx.stroke();
	      ctx.beginPath();
	    });
	    // ctx.beginPath();
	    // ctx.arc(pos.x,pos.y,10,0,2*Math.PI);
	    // ctx.stroke();
	    // points = algo(points);
	    // connectPoints(ctx, points);
	  });

	  // $('#draw').click(() => {
	  //   $('#canvas').hover((evt) => {
	  //     console.log(evt.clientX);
	  //   });
	  //   $('#canvas').mousemove(evt => console.log(evt.clientX))
	  // });

	  // toggle display of map markers
	  $("#hide-markers").click(function () {
	    var currentMap = void 0;
	    if (markers[0].map) {
	      currentMap = null;
	    } else {
	      currentMap = map;
	    }
	    markers.forEach(function (mark) {
	      return mark.setMap(currentMap);
	    });
	  });

	  // run algorithm for canvas
	  $('#run').click(function () {
	    var routes = (0, _traveling_salesman_algorithm.algo)(points, ctx);
	    // ctx.clearRect(0,0, canvas.width, canvas.height);
	    // for (var i = 0; i < routes.length; i++) {
	    //   setTimeout(connectPoints, i*250, ctx, routes[i])
	    // }
	    // connectPoints(ctx, points);
	    connectPoints(ctx, routes[routes.length - 1]);
	  });

	  $('#clear-map').click(function () {
	    markers.forEach(function (mark) {
	      return mark.setMap(null);
	    });
	    markers = [];
	    currentPath ? currentPath.setMap(null) : null;
	  });

	  $('#presets').change(function () {
	    markers.forEach(function (mark) {
	      return mark.setMap(null);
	    });
	    if ($(this).val() == 0) {
	      markers = [];
	    } else {
	      markers = _coords2.default[$(this).val()].map(function (c) {
	        return new google.maps.Marker({ position: c, map: map });
	      });
	    }
	    currentPath ? currentPath.setMap(null) : null;
	    if ($(this).val() == 1) {
	      map.setZoom(6);map.setCenter({ lat: 49.105, lng: 16.36 });
	    } else {
	      map.setZoom(2);
	    }
	  });

	  // run algorithm for points on the map
	  $('#runGoog').click(function () {

	    // diasable button until animation is complete
	    if (markers.length > 0) {
	      (function () {
	        $(":input").attr("disabled", true);
	        // $("")

	        currentPath ? currentPath.setMap(null) : null;
	        var p = markers.map(function (mark) {
	          return { lat: mark.position.lat(), lng: mark.position.lng() };
	        });
	        markers.forEach(function (mark) {
	          return mark.setMap(null);
	        });
	        p.push({ lat: markers[0].position.lat(), lng: markers[0].position.lng() });
	        var route = new google.maps.Polyline({
	          path: p,
	          geodesic: true,
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        // route.setMap(map);
	        var thePath = route.getPath();
	        var algoAnswer = (0, _traveling_salesman_algorithm.googAlgo)(thePath.getArray(), parseInt($('#display-num-evals').html()));
	        var paths = algoAnswer.routes;
	        var distances = algoAnswer.distances;
	        //console.log(distances[distances.length-1]/ 1609.34);
					document.getElementById("vzdalenost").innerHTML=distances[distances.length-1];

	        var _loop = function _loop(i) {
	          var poly = new google.maps.Polyline({
	            path: paths[i],
	            geodesic: true,
	            strokeColor: '#FF0000',
	            strokeOpacity: 1.0,
	            strokeWeight: 2
	          });
	          setTimeout(function () {
	            poly.setMap(map);setTimeout(function () {
	              poly.setMap(null);
	            }, 2);
	          }, i * 2);
	        };

	        for (var i = 0; i < paths.length; i++) {
	          _loop(i);
	        }

	        // route.setMap(null);
	        var bestRoute = paths[paths.length - 1];
	        bestRoute.push(bestRoute[0]);
	        var bestPath = new google.maps.Polyline({
	          path: bestRoute,
	          geodesic: true,
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        currentPath = bestPath;

	        // set best path onto the map and reenable the button to run again
	        // if ($('#presets').val() == 2) {
	        //   bestPath = new google.maps.Polyline({
	        //     path: coords[2],
	        //     geodesic: true,
	        //     strokeColor: '#FF0000',
	        //     strokeOpacity: 1.0,
	        //     strokeWeight: 2
	        //   });
	        //   currentPath = bestPath;
	        // }

	        setTimeout(function () {
	          bestPath.setMap(map);$(":input").attr("disabled", false);
	        }, paths.length * 2);
	      })();
	    }
	  });

	  $('#num-evals').change(function () {
	    var scale = (Math.log(100000) - Math.log(100)) / 100;
	    var value = Math.floor(Math.exp(Math.log(100) + scale * $(this).val()) + 1);
	    $('#display-num-evals').html(value);
	  });

	  // click listener to add points to the map
	  google.maps.event.addListener(map, 'click', function (event) {
	    var marker = new google.maps.Marker({ position: event.latLng, map: map });
	    markers.push(marker);
	    // let it = ""
	    // markers.forEach(m => it += `{lat: ${m.position.lat()}, lng: ${m.position.lng()}},`)
	    // console.log(it)
	  });
	});

	function getMousePos(canvas, evt) {
	  var rect = canvas.getBoundingClientRect();
	  return {
	    x: evt.clientX - rect.left,
	    y: evt.clientY - rect.top
	  };
	}

	function initMap() {
	  var geocoder = new window.google.maps.Geocoder();

	  var map = new window.google.maps.Map(document.getElementById('map'), {
	    zoom: 10,
	    center: { lat: 37.75334401310656, lng: -122.4203 },
	    scrollwheel: true
	  });
	  return map;
	}

	var connectPoints = exports.connectPoints = function connectPoints(context, points) {
	  // context.clearRect(0,0, canvas.width, canvas.height);
	  // context.beginPath();
	  context.fillStyle = randColor();
	  var currPoints = points.slice(0);
	  currPoints.push(points[0]);
	  context.moveTo(currPoints[0].x, currPoints[0].y);
	  for (var i = 1; i < currPoints.length - 1; i++) {
	    var p2 = currPoints[i];
	    context.lineTo(p2.x, p2.y);
	    context.fill();
	  }
	  context.stroke();
	  // context.closePath();
	};

	var randHex = function randHex() {
	  return '0123456789ABCDEF'[Math.floor(16 * Math.random())];
	};
	var randColor = function randColor() {
	  return '#' + [1, 2, 3, 4, 5, 6].map(randHex).join('');
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mapPoint = function mapPoint(x, y) {
	  _classCallCheck(this, mapPoint);

	  this.x = x;
	  this.y = y;
	};

	exports.default = mapPoint;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var connectPoints = exports.connectPoints = function connectPoints(context, points) {
	  // context.beginPath()
	  for (var i = 0; i < points.length - 1; i++) {
	    var p1 = points[i];
	    var p2 = points[i + 1];
	    context.moveTo(p1.x, p1.y);
	    context.lineTo(p2.x, p2.y);
	    context.stroke();
	  }
	};

	var distance = exports.distance = function distance(pointOne, pointTwo) {
	  return Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2));
	};

	var tourDistance = exports.tourDistance = function tourDistance(tour) {
	  var d = 0;
	  tour.forEach(function (a, i) {
	    if (i < tour.length - 1) {
	      d += distance(a, tour[i + 1]);
	    }
	  });
	  return d + distance(tour[0], tour[tour.length - 1]);
	};

	function shuffle(array) {
	  var i = 0,
	      j = 0,
	      temp = null;

	  for (i = array.length - 1; i > 0; i -= 1) {
	    j = Math.floor(Math.random() * (i + 1));
	    temp = array[i];
	    array[i] = array[j];
	    array[j] = temp;
	  }
	}

	var algo = exports.algo = function algo(tour, context) {
	  var ans = [];
	  var routes = [];
	  shuffle(tour);
	  var nfe = 100000;
	  var temp = 10;
	  var bestD = tourDistance(tour);
	  var bestTour = tour;
	  var prob = void 0;
	  for (var i = 0; i < nfe; i++) {
	    var newTour = bestTour.slice(0);
	    var idxA = Math.floor(Math.random() * tour.length);
	    var idxB = Math.floor(Math.random() * tour.length);
	    var low = Math.min(idxA, idxB);
	    var high = Math.max(idxA, idxB);
	    // let a = newTour[idxA];
	    // let b = newTour[idxB];
	    newTour.splice.apply(newTour, [low, high - low].concat(_toConsumableArray(newTour.slice(low, high).reverse())));
	    // newTour[idxA] = b;
	    // newTour[idxB] = a;
	    var newTourDistance = tourDistance(newTour);
	    if (temp > .001) {
	      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance) / temp));
	    } else {
	      prob = 0;
	    }
	    var rand = Math.random();
	    if (newTourDistance < bestD || rand < prob) {
	      bestTour = newTour;
	      bestD = newTourDistance;
	      ans.push(bestD);
	      if (i % 10 === 0) {
	        // context.clearRect(0,0, 1000, 1000);
	        // connectPoints(context, bestTour);
	        routes.push(bestTour);
	      }
	    }
	    temp = 100 * Math.pow(.95, i);
	  }
	  routes.push(bestTour);
	  return routes;
	};

	var googAlgo = exports.googAlgo = function googAlgo(tour, nfe) {
	  var distances = [];
	  var routes = [];
	  shuffle(tour);
	  var count = 0;
	  nfe = 20000;
	  var temp = 10000;
	  var measureTour = tour.slice(0);
	  measureTour.push(measureTour[0]);
	  var bestD = google.maps.geometry.spherical.computeLength(measureTour);
	  var bestTour = tour;
	  var prob = void 0;
	  for (var i = 0; i < nfe; i++) {
	    var newTour = bestTour.slice(0);
	    var idxA = Math.floor(Math.random() * tour.length);
	    var idxB = Math.floor(Math.random() * tour.length);
	    var low = Math.min(idxA, idxB);
	    var high = Math.max(idxA, idxB);
	    newTour.splice.apply(newTour, [low, high - low].concat(_toConsumableArray(newTour.slice(low, high).reverse())));
	    var measureNewTour = newTour.slice(0);
	    measureNewTour.push(measureNewTour[0]);
	    var newTourDistance = google.maps.geometry.spherical.computeLength(measureNewTour);
	    if (temp > .0001) {
	      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance) / temp));
	    } else {
	      prob = 0;
	    }
	    var rand = Math.random();
	    if (rand < prob) {
	      count++;
	    }
	    if ((newTourDistance < bestD || rand < prob) && newTourDistance !== bestD) {
	      // debugger
	      bestTour = newTour;
	      bestD = newTourDistance;
	      distances.push(bestD);
	      if (i % 10 === 0) {
	        routes.push(bestTour);
	      }
	    }
	    temp = 100 * Math.pow(.99, i);
	  }
	  routes.push(bestTour);
	  distances.push(bestD);


	  return { routes: routes, distances: distances };
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  1: [{lng:	 16.639754	,	lat:	49.282749	},
				{lng:	 17.307629	,	lat:	48.924666	},
				{lng:	 17.028592	,	lat:	49.356792	},
				{lng:	 17.264158	,	lat:	49.618849	},
				{lng:	 16.795277	,	lat:	49.572561	},
				{lng:	 16.695289	,	lat:	49.764875	},
				{lng:	 16.571011	,	lat:	50.010845	},
				{lng:	 16.348833	,	lat:	50.112282	},
				{lng:	 16.003491	,	lat:	50.473997	},
				{lng:	 15.873441	,	lat:	50.177299	},
				{lng:	 15.771948	,	lat:	49.91628	},
				{lng:	 15.143466	,	lat:	50.130146	},
				{lng:	 14.883953	,	lat:	50.460566	},
				{lng:	 15.125505	,	lat:	50.728147	},
				{lng:	 14.729119	,	lat:	50.655587	},
				{lng:	 14.475107	,	lat:	50.626949	},
				{lng:	 14.022283	,	lat:	50.803992	},
				{lng:	 14.162855	,	lat:	50.449564	},
				{lng:	 14.366153	,	lat:	50.170426	},
				{lng:	 14.228432	,	lat:	50.132996	},
				{lng:	 13.738028	,	lat:	50.204658	},
				{lng:	 12.851422	,	lat:	50.190975	},
				{lng:	 12.748658	,	lat:	50.308409	},
				{lng:	 12.223599	,	lat:	50.231363	},
				{lng:	 13.129238	,	lat:	49.609874	},
				{lng:	 12.868389	,	lat:	49.399566	},
				{lng:	 13.083779	,	lat:	49.407962	},
				{lng:	 13.145758	,	lat:	49.492146	},
				{lng:	 13.382179	,	lat:	49.518876	},
				{lng:	 13.664874	,	lat:	49.859345	},
				{lng:	 13.792674	,	lat:	49.913814	},
				{lng:	 14.029799	,	lat:	50.006865	},
				{lng:	 14.438033	,	lat:	49.791908	},
				{lng:	 14.501133	,	lat:	49.314582	},
				{lng:	 14.557355	,	lat:	48.997165	},
				{lng:	 14.392309	,	lat:	48.963948	},
				{lng:	 14.459499	,	lat:	48.791859	},
				{lng:	 14.735594	,	lat:	48.843083	},
				{lng:	 14.77171	,	lat:	48.990025	},
				{lng:	 16.310222	,	lat:	49.559326	}
				],
	  2: [{lng:	12.280247	,	lat:	52.794875	},
{lng:	12.772221	,	lat:	51.000665	},
{lng:	 13.256056	,	lat:	52.473408	},
{lng:	 12.369749	,	lat:	48.878933	},
{lng:	 13.384172	,	lat:	48.717375	},
{lng:	 13.481125	,	lat:	52.494791	},
{lng:	 12.22266	,	lat:	49.929361	},
{lng:	 14.258396	,	lat:	51.752929	},
{lng:	 12.426377	,	lat:	49.230466	},
{lng:	 12.020471	,	lat:	49.789961	},
{lng:	 13.79737	,	lat:	52.303076	},
{lng:	 12.626423	,	lat:	48.396293	},
{lng:	 13.669906	,	lat:	52.89806	},
{lng:	 12.560814	,	lat:	53.134426	},
{lng:	14.216728	,	lat:	51.037698	},
{lng:	 12.193125	,	lat:	48.623864	},
{lng:	 13.22097	,	lat:	52.550696	},
{lng:	12.776016	,	lat:	53.327759	},
{lng:	12.922745	,	lat:	50.720428	},
{lng:	13.34126	,	lat:	52.218577	},
{lng:	 13.876005	,	lat:	53.201915	},
{lng:	12.722969	,	lat:	53.224296	},
{lng:	 13.255373	,	lat:	52.69655	},
{lng:	12.608108	,	lat:	50.872993	},
{lng:	 14.273505	,	lat:	50.980476	},
{lng:	 12.97658	,	lat:	48.263258	},
{lng:	13.793074	,	lat:	52.485079	},
{lng:	12.69403	,	lat:	49.000649	},
{lng:	13.46291	,	lat:	52.733659	},
{lng:	13.460464	,	lat:	52.860161	},
{lng:	12.811904	,	lat:	51.091443	},
{lng:	 12.208427	,	lat:	53.914027	},
{lng:	12.142266	,	lat:	49.113308	},
{lng:	12.785872	,	lat:	50.584027	},
{lng:	13.201816	,	lat:	48.477643	},
{lng:	13.436872	,	lat:	51.484843	},
{lng:	13.550315	,	lat:	52.921258	},
{lng:	13.655596	,	lat:	52.394712	},
{lng:	 13.27682	,	lat:	48.722495	},
{lng:	13.458164	,	lat:	50.808566	}
],

	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
