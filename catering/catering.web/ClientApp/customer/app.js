import './app.css'

import $ from 'jquery'

//import moment from 'moment'
import 'angular'

import 'bootstrap'

import 'bootstrap-material-design/dist/js/bootstrap-material-design'

require('jquery');
require('fullcalendar/dist/fullcalendar');

$(document).ready(function () {
    var foo = $('body');
    foo.bootstrapMaterialDesign();
    //debugger;
});

var ng = angular.module('app', []);


ng.controller('indexController', function ($http) {
    const vm = this;


    vm.hi = function () {
        alert('index controller');
    };

    var url = 'Home/Index/?handler=Reservations';


    function init() {
        $http.get(url)
            .then(function (resp) {
                //debugger;

                let events = [];

                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];

                    events.push({
                        title: 'sddd',
                        start: $.fullCalendar.moment(item.dateStart),
                        end: $.fullCalendar.moment(item.dateEnd),
                    })
                }

                $('#calendar').fullCalendar({
                    header: { center: 'month,agendaWeek' },
                    defaultView: 'agendaWeek',
                    minTime: '07:00:00',
                    maxTime: '22:59:00',
                    events: events
                });

            }, function (err) {
                debugger;
            })
    }


    init();
});


ng.controller('mainController', function () {
    const vm = this;


    vm.hi = function () {
        alert('main controller');
    };

    
});
