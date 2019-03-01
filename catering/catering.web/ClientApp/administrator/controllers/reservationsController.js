
import 'jquery';
import app from '../app';

app.controller('reservationsController', function ($http, toastr) {
    const vm = this;

    vm.selectedItem = null;

    vm.setSelectedItem = function (item) {
        if (item === vm.selectedItem) {
            vm.selectedItem = null;
            return;
        }

        vm.selectedItem = item;
    };

    vm.init = function () {
        $http.get('api/administrator/reservations')
            .then(function (resp) {
                vm.items = resp.data;                
            }, function (err) {
                toastr.error('Error occured');
            });
    };

    vm.init();
    
});