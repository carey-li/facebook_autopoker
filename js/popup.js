(function( autopoke_ui, $, undefined ) {

    "use strict;"

    var db = localStorage,
        button_handle = $("#status-button"),
        table_handle = $("#poked"),
        connections = {};

    autopoke_ui.init = function() {

        $("#easteregg").click(function() {
            $("#imgdiv").toggle();
        })

        if (typeof db['autopoke_enabled'] == "undefined") {
            console.log("First run detected, disabling..");

            db['autopoke_enabled'] = false;
            db['poke_data'] = JSON.stringify({});
        };

        rpc({
            cmd: autopokeEnabled() ? "start" : "stop"
        });

        if (autopokeEnabled()) {
            console.log("Enabling button");

            button_handle.text("Enabled");
            button_handle.addClass("btn-success");
            button_handle.removeClass("btn-danger");
        } else {
            console.log("Disabling button");

            button_handle.text("Disabled");
            button_handle.addClass("btn-danger");
            button_handle.removeClass("btn-success");
        }

        button_handle.click(function() {
            toggleStatus();

            rpc({
                cmd: autopokeEnabled() ? "start" : "stop"
            });
        });

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (typeof request.poked != "undefined") {
                    //table_handle.append('<tr><td>' + request.poked + '</td></tr>')

                    var pokees = JSON.parse(db['poke_data']);

                    if (typeof pokees[request.poked] == "undefined") {
                        pokees[request.poked] = 1
                    } else {
                        pokees[request.poked]++;
                    };

                    db['poke_data'] = JSON.stringify(pokees);
                }
            }
        );

        
    }

    var autopokeEnabled = function() {
        if (JSON.parse(db['autopoke_enabled'])) return true;
 
        return false;
    }

    var toggleStatus = function() {

        db['autopoke_enabled'] = !JSON.parse(db['autopoke_enabled']);

        if (autopokeEnabled()) {
            console.log("Enabling button");

            button_handle.text("Enabled");
            button_handle.addClass("btn-success");
            button_handle.removeClass("btn-danger");
        } else {
            console.log("Disabling button");

            button_handle.text("Disabled");
            button_handle.addClass("btn-danger");
            button_handle.removeClass("btn-success");
        }
    }

    var rpc = function(cmd, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, cmd, function(){});
        });
    }

}( window.autopoke_ui = window.autopoke_ui || {}, $));

autopoke_ui.init();