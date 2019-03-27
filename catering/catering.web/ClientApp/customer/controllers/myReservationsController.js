
import angular from 'angular';
import app from '../app';
import $ from 'jquery';
import { setInterval } from 'timers';
import moment from 'moment';
import { debug } from 'util';

app.controller('myReservationsController', function ($http, toastr, $uibModal, $timeout) {
    const vm = this;

    vm.selectedItem = null;

    vm.setSelectedItem = function (item) {
        //if (vm.selectedItem === item) {
        //    vm.selectedItem = null;
        //}
        //else {
        //    vm.selectedItem = item;
        //}
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

    vm.setCreditCardPayment = function () {

        var modalInst = $uibModal.open({
            animation: true,
            //appendTo: angular.element(document).find('aside'),
            templateUrl: 'modalCreditCardPayment.html',
            controller: 'ModalInstanceCtrlCreditCardPayment',
            size: 'lg',
            resolve: {
                paymentDetail: function () {
                    return {
                        reservationId: vm.selectedItem.reservationId,
                        totalPrice: vm.selectedItem.totalPrice,
                        amountPaid: vm.selectedItem.amountPaid,
                        referenceNumber: vm.selectedItem.referenceNumber
                    };
                }
            }
        });
        modalInst.opened.then(function () {
            $timeout(133);
        });
        //modalInst.result.then(function (resp) {

        //    var payload = {
        //        id: vm.selectedItem.reservationId,
        //        amountPaid: resp.amountPaid,
        //        referenceNumber: resp.referenceNumber
        //    };

        //    $http.post(`api/customer/reservation/pay`, payload)
        //        .then(function (resp) {
        //            toastr.success('Reservation paid', 'Payment Success');
        //            getReservations();
        //        }, function (err) {
        //            toastr.danger('An error occured while updating reservation', 'Payment Failed');
        //        });
        //});


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
        var resp = confirm('Are you sure you want to cancel this reservation?');

        if (!resp) {
            return;
        }

        $http.post(`api/customer/cancelReservation/${vm.selectedItem.reservationId}`)
            .then(function (resp) {
                toastr.info('Reservation cancelled', 'Cancellation');
                getReservations();
            }, function (err) {
                toastr.warning('An error occured while updating reservation', 'Cancellation Failed');
            });
    };

    function getReservations() {
        $http.get('api/customer/reservations')
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


app.controller('ModalInstanceCtrlCreditCardPayment', function ($scope, $uibModalInstance, $filter, $http, toastr, paymentDetail) {

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

   

    $scope.init = function () {
        
        var stripe = Stripe('pk_test_yzpzINlD1C0NHX8O1Qjaos6o');
        var elements = stripe.elements();

        var style = {
            base: {
                // Add your base input styles here. For example:
                fontSize: '16px',
                color: "#32325d",
            }
        };

        // Create an instance of the card Element.
        var card = elements.create('card', { style: style });

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount(angular.element('#card-element')[0]);

        card.addEventListener('change', function (event) {
            var displayError = angular.element('#card-errors')[0];
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        var form = document.getElementById('payment-form');
        //debugger;
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            //debugger;
            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    // Inform the customer that there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server.
                    stripeTokenHandler(result.token);
                }
            });
        });

        function stripeTokenHandler(token) {
            debugger;
            $http.post(`api/customer/reservations/pay-with-stripe/?token=${token.id}&amount=${$scope.payment.totalPrice}&reservationId=${$scope.payment.reservationId}`)
                .then(function (resp) {
                    debugger;
                }, function (err) {
                    debugger;
                })
            //// Insert the token ID into the form so it gets submitted to the server
            //var form = document.getElementById('payment-form');
            //var hiddenInput = document.createElement('input');
            //hiddenInput.setAttribute('type', 'hidden');
            //hiddenInput.setAttribute('name', 'stripeToken');
            //hiddenInput.setAttribute('value', token.id);
            //form.appendChild(hiddenInput);

            //// Submit the form
            //form.submit();
        }
    };
});