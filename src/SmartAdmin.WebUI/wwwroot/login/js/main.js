$(function() {
    'use strict';

    $('.form-control').on('input', function() {
        var $field = $(this).closest('.form-group');
        if (this.value) {
            $field.addClass('field--not-empty');
        } else {
            $field.removeClass('field--not-empty');
        }
    });

    let location = window.location.host;
    if (location == "training.i-kom.id") {
        $(".header-title").text("LOGIN (Training)");
        $(".banner-title").text("Ini adalah server training. Anda dapat membuat project dengan data dummy melalui i-KOM Server Training");
        $('.dev-check').checked = true;
        $("#dev-checked").addClass("active");
    } else if (location == "i-kom.id") {
        $('.prod-check').checked = true;
        $("#prod-checked").addClass("active");
        $(".header-title").text("LOGIN");
        $(".banner-title").text("Halo, Selamat datang di i-Kom Eksekusi !");
    } else {
        $(".header-title").text("LOGIN");
        $(".banner-title").text("Halo, Selamat datang di i-Kom Eksekusi !");
    }

    $('input[type="radio"]').on("change", function(e) {
        let target = e.target.value;
        let beforeUrl = window.location.host;
        if (target == "dev") {
            $("#dev-checked").addClass("active");
            beforeUrl = "http://training-execution.i-kom.id";
        } else {
            $("#prod-checked").addClass("active");
            beforeUrl = "https://execution.i-kom.id";
        }

        window.location.replace(beforeUrl);
    });
});