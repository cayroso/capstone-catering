
import $ from 'jquery';
import app from '../app';
import moment from 'moment';

app.controller('reservationController', function ($http, toastr) {
    var vm = this;

    var n = new Date();
    var start = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, n.getHours());
    var end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, n.getHours());

    // we will store all of our form data in this object
    vm.formData = {
        title: '',
        venue: '',
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

        var s1 = vm.formData.startDate;
        var t1 = vm.formData.startTime;
        var start = moment(new Date(s1.getFullYear(), s1.getMonth(), s1.getDate(), t1.getHours(), t1.getMinutes(), 0, 0)).utc().valueOf();
        
        var s2 = vm.formData.startDate;
        var t2 = vm.formData.startTime;
        var end  = moment(new Date(s2.getFullYear(), s2.getMonth(), s2.getDate(), t2.getHours(), t2.getMinutes(), 0, 0)).utc().valueOf();
        
        //var start = moment(vm.formData.startDate.getUTCDate())
        //    .add(vm.formData.startTime.getHours(), 'hours')
        //    .add(vm.formData.startTime.getMinutes(), 'minutes')
        //    //.utc()
        //    .valueOf()
        //    //.format('YYYY-MM-DD HH:mm:ss')
        //    ;

        //var end = moment(vm.formData.endDate)
        //    .add(vm.formData.endTime.getHours(), 'hours')
        //    .add(vm.formData.endTime.getMinutes(), 'minutes')
        //    //.utc()
        //    .valueOf()
        //    //.format('YYYY-MM-DD HH:mm:ss')
        //    ;

        var url = `api/reservations/availability/?startTicks=${start}&endTicks=${end}`;

        $http.get(url)
            .then(function (resp) {
                toastr.info('Dates are Available', 'Succes', { timeOut: 0 });
            }, function (err) {
                toastr.warning(err.data, 'Failed', { timeOut: 0 });

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
        total += pricing.fixedCost + pricing.fixedLabor;

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

        var frm = vm.formData;

        if (frm.title === '') {
            toastr.warning('Enter title for event', 'Validation Error', { timeOut: 0 });
            return;
        }
        if (frm.venue === '') {
            toastr.warning('Enter venue for event', 'Validation Error', { timeOut: 0 });
            return;
        }

        var pricing = vm.pricing;

        var packageImageIds = [];

        for (var i = 0; i < vm.formData.package.images.length; i++) {
            var image = vm.formData.package.images[i];

            if (image.selected === true) {
                packageImageIds.push(image.packageImageId);
            }
        }

        var s1 = vm.formData.startDate;
        var t1 = vm.formData.startTime;
        var start = moment(new Date(s1.getFullYear(), s1.getMonth(), s1.getDate(), t1.getHours(), t1.getMinutes(), 0, 0)).utc().valueOf();

        var s2 = vm.formData.endDate;
        var t2 = vm.formData.endTime;
        var end = moment(new Date(s2.getFullYear(), s2.getMonth(), s2.getDate(), t2.getHours(), t2.getMinutes(), 0, 0)).utc().valueOf();

        var payload = {
            packageId: vm.formData.package.packageId,
            title: frm.title,
            venue: frm.venue,

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

            fixedCost: pricing.fixedCost,
            fixedLabor: pricing.fixedLabor,

            dateStartTicks: start,
            dateEndTicks: end,

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
            //alert('Reservation has been created. Please check your account for more info');
            toastr.success('Reservation has been created. Please check your account for more info',
                'Reservation', {
                    timeOut: 0,
                    onTap: function () {
                        window.location.reload();
                    }
                });
        }).fail(function (err) {
            //debugger;
            var message = err.responseJSON.message;
            //alert(message);
            toastr.error(message,
                'Reservation', {
                    timeOut: 0,
                    onTap: function () {
                        //window.location.reload();
                    }
                });
            //var conflicts = err.responseJSON.conflicts;
            //alert(message + JSON.stringify( conflicts));
        }).always(function () {

        });

    };

    function getPackages() {
        $http.get('Reservations/?handler=Packages')
            .then(function (resp) {
                vm.lookups.packages = resp.data;


                //$scope.formData.package = $scope.lookups.packages[0];
                //$scope.setPackage();
            }, function (err) {
                toastr.error(JSON.stringify(err), 'Contact Administrator');
            });
    }

    function getPricing() {
        $http.get('Reservations/?handler=Pricing')
            .then(function (resp) {
                vm.pricing = resp.data;
                vm.originalPricing = angular.copy(resp.data);
            }, function (err) {
                toastr.error(JSON.stringify(err), 'Contact Administrator');
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
                    title: item.title,
                    //start: (item.dateStart),
                    //end: (item.dateEnd)
                    start: $.fullCalendar.moment(item.dateStart),
                    end: $.fullCalendar.moment(item.dateEnd)
                });
            }

            $('#calendar').fullCalendar({
                // put your options and callbacks here
                header: { center: 'month,agendaWeek' },
                defaultView: 'month',
                minTime: '06:00:00',
                maxTime: '24:00:00',
                events: events
            });

        }, function (err) {
            toastr.error(JSON.stringify(err), 'Contact Administrator');
        });


});