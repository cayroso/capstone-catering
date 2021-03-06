﻿
import $ from 'jquery';
import app from '../app';

function indexController($http) {
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
                        title: item.title,
                        start: $.fullCalendar.moment(item.dateStart),
                        end: $.fullCalendar.moment(item.dateEnd),

                    });
                }

                $('#calendar').fullCalendar({
                    header: { center: 'month,agendaWeek' },
                    defaultView: 'month',
                    minTime: '07:00:00',
                    maxTime: '22:59:00',
                    events: events
                });

            }, function (err) {
                debugger;
            })
    }


    init();
}

indexController.$inject = ['$http'];

app.controller('indexController', indexController);

