function BlazeClient() {
    var methods = {
        /**
         * Performs initialization operations necessary to get Blaze ready for operation. Includes initialising the 
         * API SDK, and checking auth tokens.
         */
        init: function() {
            var key = this.api.keys.getActiveRequestKey();
            if(key) {
                SE.init({
                    clientId: this.api.clientId,
                    key: key,
                    channelUrl: location.protocol + "//" + location.hostname + "/blank.html",
                    complete: function(data) {
                        
                    }
                });
            }
            else {
                this.ui.showErrorMessage("There is no request key associated with this domain. Blaze cannot run "
                    + "without a key.", 0);
            }
            return this;
        },
        
        /**
         * Partner to .ready() (see next). Used internally to store any callbacks that need to be fired on ready, so
         * they can be accessed when they need to be called. SHOULD NOT be used in external code. This gets set to 
         * false when ready state is achieved and all callbacks are fired, so that .ready() knows to just call any
         * functions it's given after that.
         */
        _callbacks: [],
        
        /**
         * Just another ready function - like $(document).ready(function() { ... }). This one will call any assigned
         * callbacks when init() has done its work. Callbacks attached via this method will be called with the 
         * BLazeClient object as this.
         */
        ready: function(callback) {
            if(typeof(callback) === "function") {
                if(this._callbacks === false) {
                    callback.call(this);
                }
                else {
                    this._callbacks.push(callback);
                }
            }
        },
        
        /**
         * Contains methods for working with the API, and some data you'll need to do it.
         */
        api: {
            /**
             * The SE API client ID. Come on, do you really need me to document this?
             */
            clientId: 2670,
            
            /**
             * Contains key objects, and methods for dealing with those objects (and the keys contained in them).
             * Each key object contains a key and a list of domains (hostnames, technically) on which that key
             * should be used. Use `getActiveRequestKey()` to get the key that can be used on the current domain.
             */
            keys: {
                'blaze_default': {
                    'key': 'p3YZ1qDutpcBd7Bte2mcDw((',
                    'domains': ['erwaysoftware.com']
                },
                'test_env_art': {
                    'key': '2WQ5ksCzcYLeeYJ0qM4kHw((',
                    'domains': ['localhost', '82.69.87.121']
                },
                
                /**
                 * Finds a request key from those listed above (and any extras added by userscripting or console
                 * interaction) that can be used for the current domain. Returns false if there isn't one, so you
                 * can use if(getActiveRequestKey()).
                 */
                getActiveRequestKey: function() {
                    var objectKeys = Object.keys(this);
                    for(var i = 0; i < objectKeys.length; i++) {
                        var keyDetails = this[objectKeys[i]];
                        
                        // Check this so we don't enumerate this function too.
                        if(typeof(keyDetails) !== "object") return false;
                        
                        for(var j = 0; j < keyDetails['domains'].length; j++) {
                            if(keyDetails['domains'][j] == location.hostname) {
                                return keyDetails['key'];
                            }
                        }
                    }
                    return false;
                }
            },
            
            /**
             * Used to make requests to the API. Give it a route (i.e. '/questions' or '/answers') and a data object
             * with whatever data the request needs to have in it. You don't have to include request key; that's added
             * automatically. You ARE, however, responsible for putting an auth token in if it needs one.
             *
             * Returns a jQuery Deferred promise; to do things with the result of the AJAX call you'll need to attachEvent
             * .done(), .fail(), or .always() handlers. See: http://api.jquery.com/category/deferred-object/
             */
            makeRequest: function(route, data) {
                var baseUrl = "https://api.stackexchange.com/2.2";
                var url = baseUrl + route;
                
                data["key"] = this.keys.getActiveRequestKey();
                
                return $.ajax({
                    'type': 'POST',
                    'url': url,
                    'data': data
                });
            }
        },
        
        /**
         * Contains all the stuff that deals with authorising individual users and handling their auth tokens. There
         * was enough in this to warrant splitting it off from the api object.
         */
        auth: {
            getNewAuthToken: function() {
                
            },
            checkExistingTokenValid: function(token) {
                
            }
        },
        
        /**
         * This has the methods used to classify posts - answers only, currently, because that's all the classification
         * code I ever wrote back when I wrote it. Gives access to the post highlights. I may have added a couple new
         * checks, too, based on what I've been flagging.
         */
        classifier: {
            
        },
        
        /**
         * Contains solely those methods which are used to sort things before displaying them. I expect by the time
         * this object is populated, it'll be mostly a direct copy of the old sorting methods.
         */
        sorting: {
            
        },
        
        /**
         * Contains methods for dealing with the UI of the application. Everything to do with the UI. I could have 
         * split this more into further sub-objects, but I'm not sure it's worth it. Basically, if it does something
         * visible, it's in here.
         */
        ui: {
            /**
             * Displays an error-styled message to the user, optionally for the specified duration. Leave `duration`
             * blank or set to 0 for infinite duration (dismissed by user click).
             */
            showErrorMessage: function(message, duration) {
                this.showMessage(message, "rgb(241,62,66)", duration);
            },
            
            /**
             * Ditto, but styled as a warning.
             */
            showWarningMessage: function(message, duration) {
                this.showMessage(message, "rgb(248,198,77)", duration);
            },
            
            /**
             * Shows a generic message to the user, with the given background color. The `background` parameter should
             * be a valid CSS color value.
             */
            showMessage: function(message, background, duration) {
                var container = $("<div></div>");
                
                container.text(message);
                container.addClass("blaze-modal-message");
                container.css("background", background);
                container.click(function() { $(this).slideUp(200); });
                container.hide().appendTo("body").slideDown(200);
                
                if(duration && typeof(duration) === "number" && duration > 0) {
                    setTimeout(function() {
                        container.trigger('click');
                    }, duration);
                }
            },
            
            /**
             * Closes all currently-open message dialogs opened by one of the above showMessage functions.
             */
            closeMessageDialogs: function() {
                $(".blaze-modal-message").each(function() {
                    $(this).slideUp(200);
                });
            }
        },
    };
    return methods.init();
}

window.blaze = new BlazeClient();