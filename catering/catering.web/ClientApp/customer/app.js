
import angular from 'angular';
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls';

const app = angular.module('app', [require('angular-animate'), require('angular-toastr'), 'ui.bootstrap']);

app.config(function () {
    //debugger;
    //window.Stripe.setPublishableKey('pk_test_yzpzINlD1C0NHX8O1Qjaos6o');
});

export default app;





