
import $ from 'jquery';
import app from '../app';
import moment from 'moment';

app.controller('reservationController', function ($http, toastr) {
    var vm = this;

    var n = new Date();
    var start = new Date(n.getFullYear(), n.getMonth(), n.getDate()+1, n.getHours());
    var end = new Date(n.getFullYear(), n.getMonth(), n.getDate()+1, n.getHours());
    
    // we will store all of our form data in this object
    vm.formData = {
        starterCount: 0,
        mainCount: 0,
        drinkCount: 0,
        startDate: new Date(start),
        startTime: new Date(start),
        endDate: new Date(end),
        endTime: new Date(end)
        //dateStart: new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDay()+1, n.getUTCHours()),// new Date().toDatetimeLocal(),//  $.fullCalendar.moment.utc(new Date()),
        //dateEnd: new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDay()+2, n.getUTCHours())// $.fullCalendar.moment.local(new Date()),
    };
    vm.lookups = {
        packages: [],
        starters: [],
        mains: [],
        drinks: []
    };

    vm.setPackage = function (pkg) {        
        if (vm.formData.package !== pkg) {
            vm.reset();
        }
    };
    vm.reset = function () {
        vm.pricing = angular.copy(vm.originalPricing);
       
    };
    vm.checkAvailability = function () {

        var start = moment(vm.formData.startDate)
            .add(vm.formData.startTime.getHours(), 'hours')
            .add(vm.formData.startTime.getMinutes(),'minutes')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        var end = moment(vm.formData.endDate)
            .add(vm.formData.endTime.getHours(), 'hours')
            .add(vm.formData.endTime.getMinutes(), 'minutes')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        
        var url = `api/reservations/availability/${start}/${end}`;
        //debugger
        $http.get(url)
            .then(function (resp) {
                toastr.info('Dates are Available', 'Succes');
            }, function (err) {
                toastr.warning(err.data, 'Failed');

            });
    };
    vm.calculate = function () {

        var pricing = vm.pricing;
        var total = 0;

        total += pricing.plate * pricing.plateCount || 0;
        total += pricing.spoon * pricing.spoonCount || 0;
        total += pricing.fork * pricing.forkCount || 0;
        total += pricing.glass * pricing.glassCount || 0;
        total += pricing.chair * pricing.chairCount || 0;
        total += pricing.table * pricing.tableCount || 0;

        if (pricing.hasFlower) {
            total += pricing.flower;
        }

        if (pricing.hasSoundSystem) {
            total += pricing.soundSystem;
        }

        pricing.total = total;
    };

    vm.autoAllocate = function () {
        var pricing = vm.pricing;
        pricing.plateCount = pricing.guestCount;
        pricing.spoonCount = pricing.guestCount;
        pricing.forkCount = pricing.guestCount;
        pricing.glassCount = pricing.guestCount;
        pricing.chairCount = pricing.guestCount;
        pricing.tableCount = Math.ceil(pricing.guestCount / 4);
        pricing.hasFlower = true;
        pricing.hasSoundSystem = true;

        vm.calculate();
    };

    vm.processForm = function (formType) {

        var pricing = vm.pricing;

        var packageImageIds = [];

        for (var i = 0; i < vm.formData.package.images.length; i++) {
            var image = vm.formData.package.images[i];

            if (image.selected === true) {
                packageImageIds.push(image.packageImageId);
            }
        }
        
        var start = moment(vm.formData.startDate)
            .add(vm.formData.startTime.getHours(), 'hours')
            .add(vm.formData.startTime.getMinutes(), 'minutes')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        var end = moment(vm.formData.endDate)
            .add(vm.formData.endTime.getHours(), 'hours')
            .add(vm.formData.endTime.getMinutes(), 'minutes')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        
        var payload = {
            packageId: vm.formData.package.packageId,

            guestCount: pricing.guestCount,

            plateCount: pricing.plateCount,
            platePrice: pricing.plate,

            spoonCount: pricing.spoonCount,
            spoonPrice: pricing.spoon,

            forkCount: pricing.forkCount,
            forkPrice: pricing.fork,

            glassCount: pricing.glassCount,
            glassPrice: pricing.glass,

            chairCount: pricing.chairCount,
            chairPrice: pricing.chair,

            tableCount: pricing.tableCount,
            tablePrice: pricing.table,

            hasFlower: pricing.hasFlower,
            flowerPrice: pricing.flower,

            hasSoundSystem: pricing.hasSoundSystem,
            soundSystemPrice: pricing.soundSystem,


            dateStart: start,
            dateEnd: end,

            packageImageIds: packageImageIds,
            notes: vm.formData.notes
        };

        $.ajax({
            url: 'Reservations/?handler=Reservation',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            headers: {
                RequestVerificationToken:
                    $('input:hidden[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(payload)
        }).done(function (result) {
            //debugger;
            alert('Reservation has been created. Please check your account for more info');
            window.location.reload();
        }).fail(function (err) {
            //debugger;
            var message = err.responseJSON.message;
            alert(message);
            //var conflicts = err.responseJSON.conflicts;
            //alert(message + JSON.stringify( conflicts));
        }).always(function () {

        });

    }

    function getPackages() {
        $http.get('Reservations/?handler=Packages')
            .then(function (resp) {
                vm.lookups.packages = resp.data;


                //$scope.formData.package = $scope.lookups.packages[0];
                //$scope.setPackage();
            }, function (err) {
                debugger;
            });
    }

    function getPricing() {
        $http.get('Reservations/?handler=Pricing')
            .then(function (resp) {
                vm.pricing = resp.data;
                vm.originalPricing = angular.copy(resp.data);
            }, function (err) {
                debugger;
            });
    }

    getPackages();
    getPricing();

    var url = 'Reservations/?handler=Reservations';
    //debugger;
    $http.get(url)
        .then(function (resp) {

            var events = [];
            for (var i = 0; i < resp.data.length; i++) {
                var item = resp.data[i];

                events.push({
                    title: item.package.name,
                    start: $.fullCalendar.moment(item.dateStart),
                    end: $.fullCalendar.moment(item.dateEnd)
                });
            }

            $('#calendar').fullCalendar({
                // put your options and callbacks here
                header: { center: 'month,agendaWeek' },
                defaultView: 'month',
                minTime: '07:00:00',
                maxTime: '22:00:00',
                events: events
            })

        }, function (err) {
            debugger;
        });


});