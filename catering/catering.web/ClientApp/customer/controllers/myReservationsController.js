
import app from '../app';

app.controller('myReservationsController', function ($http) {
    const vm = this;

    function getReservations() {
        $http.get('api/reservations/my')
            .then(function (resp) {
                vm.items = resp.data;
            }, function (err) {
                debugger;
            });
    }


    getReservations();
});