
import angular from 'angular';
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls';

const app = angular.module('app', [require('angular-animate'), require('angular-toastr'), 'ui.bootstrap']);

function controller() {
    const vm = this;
    const pagePrefix = 'app/clientapp/administrator/templates/';
    vm.page = `${pagePrefix}/reservations.html`;

    vm.setPage = function (page, event) {
        //debugger;
        var ar = arguments;
        vm.page = `${pagePrefix}/${page}`;

        event.preventDefault();
    };

}

controller.$inject = [];

app.controller('mainController', controller);

export default app;