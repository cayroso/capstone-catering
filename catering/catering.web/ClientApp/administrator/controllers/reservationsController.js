
import 'jquery';
import app from '../app';
import moment from 'moment';

function reservationsController($http, $uibModal, toastr) {
    const vm = this;

    vm.selectedItem = null;

    vm.setSelectedItem = function (item) {
        if (item === vm.selectedItem) {
            //vm.selectedItem = null;
            return;
        }

        vm.selectedItem = item;
    };

    vm.viewReservation = function () {

        $uibModal.open({
            animation: true,
            //appendTo: angular.element(document).find('aside'),
            templateUrl: 'modalViewReservation.html',
            controller: 'viewReservationModalController',
            size: 'lg',
            resolve: {
                reservation: function () {
                    //debugger;
                    return vm.selectedItem;
                }
            }
        });

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

    vm.acceptPayment = function () {
        $http.post(`api/administrator/reservations/${vm.selectedItem.reservationId}/accept-payment`)
            .then(function (resp) {
                toastr.success('Reservation payment was accepted');
                vm.init();
            }, function (err) {
                toastr.success('Error Occured');
            });
    };

    vm.rejectPayment = function () {
        $http.post(`api/administrator/reservations/${vm.selectedItem.reservationId}/reject-payment`)
            .then(function (resp) {
                toastr.success('Reservation payment was rejected');
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

                    item.toNow = moment(item.dateStart).fromNow();

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

}

reservationsController.$inject = ['$http', '$uibModal', 'toastr'];

app.controller('reservationsController', reservationsController);


function viewReservationModalController($scope, $uibModalInstance, toastr, reservation) {

    $scope.reservation = angular.copy(reservation);

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

viewReservationModalController.$inject = ['$scope', '$uibModalInstance', 'toastr', 'reservation'];

app.controller('viewReservationModalController', viewReservationModalController);
