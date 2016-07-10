(function( autopoke, undefined ) {

    "use strict;"

    var handle = null;

    var connections = {};

    var pokeHandler = function(div) {
        var pokes = [];

        for (var i = div.length - 1; i >= 0; i--) {
            if (div[i].className.indexOf("hidden_elem") == -1) {
                pokes.push(div[i]);
            };
        };

        for (var i = pokes.length - 1; i >= 0; i--) {
            var children = pokes[i].getElementsByTagName("a");

            for (var j = children.length - 1; j >= 0; j--) {
                if (children[j].innerText.indexOf("Poke back") > -1 || children[j].innerText.indexOf("Poke Back") > -1) {

                    children[j].click();

                    console.info("Poked " + children[3].innerText);

                    chrome.runtime.sendMessage({poked: children[3].innerText}, function(){});

                }
            };
        };
    }

    autopoke.start = function() {

        console.info("Auto poker starting!");

        try {
            var preDivs = document.getElementById("contentArea").childNodes[0].childNodes[0].childNodes[2].childNodes;
            pokeHandler(preDivs);
        } catch (err) {
            console.info("No previous pokes detected, skipping.");
        }

        clearInterval(handle);

        handle = setInterval(function() {
            var divs = document.getElementById("poke_live_new").childNodes;

            pokeHandler(divs);
        }, 1000);
    }

    autopoke.stop = function() {
        console.info("Auto poker stopping!");

        clearInterval(handle);
    }

    autopoke.init = function() {
        console.info("Auto poker content script loaded!");

        var titles = document.getElementsByClassName("uiHeaderTitle");

        for (var i = titles.length - 1; i >= 0; i--) {
            if (titles[i].innerText.indexOf("Pokes") > -1) {
                titles[i].innerHTML += "<br><small style='font-size: smaller; font-weight: 200; color: #888888;'>Click the extension icon to launch autopoke!</small>"
            };
        };

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {

                if (request.cmd == "start") {
                    autopoke.start();
                } else if (request.cmd == "stop") {
                    autopoke.stop();
                } else {
                    console.log("Unrecognised command: " + request.cmd);
                }

                sendResponse("Request acknowledged.");
        });

    }

}( window.autopoke = window.autopoke || {}));

autopoke.init();