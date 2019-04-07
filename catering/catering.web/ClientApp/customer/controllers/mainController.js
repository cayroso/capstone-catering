
//import $ from 'jquery';
import app from '../app';
//const signalR = require('@aspnet/signalr');

function mainController(toastr) {
    const vm = this;

    //vm.Ok = function () {
    //    vm.connection.invoke("SendMessage", {
    //        receiverId: 'administrator',
    //        messageType: 'info',
    //        title: 'For your information',
    //        content: 'the quick brown foxs'
    //    });
    //};

    //vm.connection = new signalR.HubConnectionBuilder().withUrl("/notificationHub").build();

    //vm.connection.on('OnReceiveMessage', function (messageType, title, content) {
    //    toastr[messageType](content, title);
    //});

    //vm.connection.start()
    //    .then(function (resp) {
    //        //debugger;
    //    })
    //    .catch(function (err) {
    //        toastr.error(err.toString());
    //        //return console.error(err.toString());
    //    });


    function init() {
        //$(document).ready(function () {
        //$('body').bootstrapMaterialDesign();

        //toastr.success('oye');
        //}); 
    }

    init();
}

mainController.$inject = ['toastr'];

app.controller('mainController', mainController);