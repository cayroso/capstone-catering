
import angular from 'angular';
import app from '../app';

app.controller('myReservationsController', function ($http, toastr, $uibModal) {
    const vm = this;

    vm.selectedItem = null;

    vm.setSelectedItem = function (item) {
        vm.selectedItem = item;
    };

    vm.setPayment = function() {

        var modalInst = $uibModal.open({
            animation: true,
            //appendTo: angular.element(document).find('aside'),
            templateUrl: 'modalPayment.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                paymentDetail: function() {
                    return {
                        totalPrice: vm.selectedItem.totalPrice,
                        amountPaid: vm.selectedItem.amountPaid,
                        referenceNumber: vm.selectedItem.referenceNumber
                    };
                }
            }
        });

        modalInst.result.then(function (resp) {

            var payload = {
                id: vm.selectedItem.reservationId,
                amountPaid: resp.amountPaid,
                referenceNumber: resp.referenceNumber
            };

            $http.post(`api/customer/reservation/pay`, payload)
                .then(function (resp) {
                    toastr.success('Reservation paid', 'Payment Success');
                    getReservations();
                }, function (err) {
                    toastr.danger('An error occured while updating reservation', 'Payment Failed');
                });
        });


    };

    vm.viewReservation = function () {

        var modalInst = $uibModal.open({
            animation: true,
            //appendTo: angular.element(document).find('aside'),
            templateUrl: 'modalViewReservation.html',
            controller: 'viewReservationModalController',
            size: 'lg',
            resolve: {
                reservation: function () {
                    return vm.selectedItem;
                }
            }
        });
        
    };

    vm.cancelReservation = function() {

        $http.post(`api/customer/cancelReservation/${vm.selectedItem.reservationId}`)
            .then(function (resp) {
                toastr.warning('Reservation cancelled', 'Cancellation');
                getReservations();
            }, function (err) {
                toastr.danger('An error occured while updating reservation', 'Cancellation Failed');
            });
    };

    function getReservations() {
        $http.get('api/customer/reservations')
            .then(function (resp) {
                vm.items = resp.data;

                for (var i = 0; i < vm.items.length; i++) {
                    var item = vm.items[i];

                    if (item.reservationStatus === 0) {
                        item.reservationStatusText = 'Pending';
                    }
                    if (item.reservationStatus === 1) {
                        item.reservationStatusText = 'Paid';
                    }

                    if (item.reservationStatus === 2) {
                        item.reservationStatusText = 'Complete';
                    }

                    if (item.reservationStatus === 3) {
                        item.reservationStatusText = 'Cancelled';
                    }
                }
            }, function (err) {
                alert('error occured');
            });
    }


    getReservations();
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $filter, toastr, paymentDetail) {

    $scope.payment = angular.copy(paymentDetail);
    //$scope.payment.totalPrice = Number.pars $filter('number')($scope.payment.totalPrice, 2);
    $scope.payment.amountPaid = $scope.payment.totalPrice;
    $scope.ok = function () {
        if ($scope.payment.amountPaid < $scope.payment.totalPrice) {
            toastr.warning('Amount Paid is less that Total price', 'Really?');
            return;
        }
        $uibModalInstance.close($scope.payment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('viewReservationModalController', function ($scope, $uibModalInstance, toastr, reservation) {

    $scope.reservation = angular.copy(reservation);

    $scope.ok = function () {        
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});