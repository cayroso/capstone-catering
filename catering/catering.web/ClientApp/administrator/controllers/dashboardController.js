
import $ from 'jquery';
import app from '../app';

app.controller('dashboardController', function ($http, toastr) {
    const vm = this;


    vm.init = function () {
        $http.get('api/administrator/dashboard')
            .then(function (resp) {
                vm.data = resp.data;

                let events = [];

                for (var i = 0; i < resp.data.reservations.length; i++) {
                    var item = resp.data.reservations[i];

                    events.push({
                        title: item.package.name,
                        start: $.fullCalendar.moment(item.dateStart),
                        end: $.fullCalendar.moment(item.dateEnd)
                    });
                }

                $('#calendar').fullCalendar({
                    //header: { center: 'month,agendaWeek' },
                    defaultView: 'month',
                    //minTime: '07:00:00',
                    //maxTime: '22:59:00',
                    events: events
                });
            }, function (err) {
                toastr.error('error occured');
            });
    };

    vm.init();
    
});