
import $ from 'jquery';
import app from '../app';
import moment from 'moment';

function dashboardController($http, toastr) {
    const vm = this;


    vm.init = function () {
        $http.get('api/administrator/dashboard')
            .then(function (resp) {
                vm.data = resp.data;

                let events = [];

                for (let n = 0; n < vm.data.upcoming.length; n++) {
                    let item1 = resp.data.upcoming[n];
                    item1.fromNow = moment(item1.dateStart).fromNow();
                }

                for (let n = 0; n < vm.data.overdue.length; n++) {
                    let item1 = resp.data.overdue[n];
                    item1.toNow = moment(item1.dateStart).fromNow();
                }

                var overDue = [];
                var upcoming = [];
                var complete = [];
                var cancelled = [];

                var now = moment();

                for (let i = 0; i < resp.data.reservations.length; i++) {
                    let item = resp.data.reservations[i];

                    var evt = {
                        title: item.title,
                        start: moment(item.dateStart),
                        end: moment(item.dateEnd)
                    };


                    if (evt.end < now) {
                        overDue.push(evt);
                    }
                    else if (item.reservationStatus === 4) {
                        complete.push(evt);
                    }
                    else if (item.reservationStatus === 5) {
                        cancelled.push(evt);
                    }
                    else {
                        upcoming.push(evt);
                    }
                }

                $('#calendar').fullCalendar({
                    header: { center: 'month,agendaWeek' },
                    defaultView: 'month',
                    //minTime: '07:00:00',
                    //maxTime: '22:59:00',
                    eventSources: [
                        {
                            events: overDue,
                            color: 'red'
                        },
                        {
                            events: upcoming,
                            color: 'green'
                        },
                        {
                            events: complete,
                            color: 'blue'
                        },
                        {

                            events: cancelled,
                            color: 'black'
                        }
                    ]
                });
            }, function (err) {
                toastr.error('error occured');
            });
    };

    vm.init();

}

dashboardController.$inject = ['$http', 'toastr'];

app.controller('dashboardController', dashboardController);