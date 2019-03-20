
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

    vm.completeReservation = function () {
        $http.post(`api/administrator/reservations/${vm.selectedItem.reservationId}/complete`)
            .then(function (resp) {
                toastr.success('Reservation was set to complete');
                vm.init();
            }, function (err) {
                toastr.success('Error Occured');
            });
    };

    vm.cancelReservation = function () {
        $http.post(`api/administrator/reservations/${vm.selectedItem.reservationId}/cancel`)
            .then(function (resp) {
                toastr.success('Reservation was set to Cancelled');
                vm.init();
            }, function (err) {
                toastr.success('Error Occured');
            });
    };


    vm.init = function () {
        $http.get('api/administrator/reservations')
            .then(function (resp) {
                vm.items = resp.data;          
                for (var i = 0; i < vm.items.length; i++) {
                    var item = vm.items[i];

                    if (item.reservationStatus === 0) {
                        item.reservationStatusText = 'Pending';
                    }
                    if (item.reservationStatus === 1) {
                        item.reservationStatusText = 'Payment Sent';
                    }
                    if (item.reservationStatus === 2) {
                        item.reservationStatusText = 'Payment Accepted';
                    }
                    if (item.reservationStatus === 3) {
                        item.reservationStatusText = 'Payment Rejected';
                    }
                    if (item.reservationStatus === 4) {
                        item.reservationStatusText = 'Complete';
                    }
                    if (item.reservationStatus === 5) {
                        item.reservationStatusText = 'Cancelled';
                    }
                }
            }, function (err) {
                toastr.error('Error occured');
            });
    };

   
    vm.init();
    
});