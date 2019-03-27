
import 'jquery';
import app from '../app';

function controller($http, toastr) {
    const vm = this;

    vm.selectedItem = null;

    vm.setSelectedItem = function (item) {
        if (item === vm.selectedItem) {
            //vm.selectedItem = null;
            return;
        }

        vm.selectedItem = item;
    };

    vm.resend = function (id) {
        $http.post(`api/message/resend/${id}`)
            .then(function (resp) {
                toastr.success('Message ready to be send', 'Resend', {
                    timeOut: 0, onHidden: function () {
                        vm.init();
                    }
                });
            }, function (err) {
                toastr.error('Error occured', 'Resend', { timeOut: 0 });
            });

    };
    vm.init = function () {
        $http.get('api/message')
            .then(function (resp) {
                vm.items = resp.data;
            }, function (err) {
                toastr.error('Error occured');
            });
    };

    vm.init();
}

controller.$inject = ['$http', 'toastr'];

app.controller('messagesController', controller);