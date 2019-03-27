
import 'jquery';
import app from '../app';

function controller($http, toastr) {
    const vm = this;
    vm.onEdit = false;

    vm.edit = function () {
        vm.onEdit = true;
    };

    vm.save = function () {
        $http.post(`api/reservations/pricing`, vm.item)
            .then(function (resp) {
                toastr.success('Pricing updated', 'Pricing', {
                    timeOut: 0, onHidden: function () {
                        vm.onEdit = false;
                        vm.init();
                    }
                });
            }, function (err) {
                toastr.error('Error occured', 'Pricing', { timeOut: 0 });
            });

    };
    vm.init = function () {
        $http.get('api/reservations/pricing')
            .then(function (resp) {
                vm.item = resp.data;
            }, function (err) {
                toastr.error('Error occured');
            });
    };

    vm.init();
}

controller.$inject = ['$http', 'toastr'];

app.controller('pricingController', controller);