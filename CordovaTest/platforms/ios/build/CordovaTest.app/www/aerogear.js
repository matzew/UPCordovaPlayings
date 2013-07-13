/*! AeroGear JavaScript Library - v1.2.0-dev - 2013-07-13
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
    The AeroGear namespace provides a way to encapsulate the library's properties and methods away from the global namespace
    @namespace
 */
this.AeroGear = {};

/**
    AeroGear.Core is a base for all of the library modules to extend. It is not to be instantiated and will throw an error when attempted
    @class
    @private
 */
AeroGear.Core = function() {
    // Prevent instantiation of this base class
    if ( this instanceof AeroGear.Core ) {
        throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
        This function is used by the different parts of AeroGear to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current );
                } else {
                    collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings || {} );
                }
            }
        } else {
            // config is an object so use that signature
            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings || {} );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by pipeline, datamanager, etc. to remove an Object (pipe, store, etc.) from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( typeof config === "string" ) {
            // config is a string so delete that item by name
            delete collection[ config ];
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    delete collection[ current ];
                } else {
                    delete collection[ current.name ];
                }
            }
        } else if ( config ) {
            // config is an object so use that signature
            delete collection[ config.name ];
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
};

/**
    Utility function to test if an object is an Array
    @private
    @method
    @param {Object} obj - This can be any object to test
*/
AeroGear.isArray = function( obj ) {
    return ({}).toString.call( obj ) === "[object Array]";
};

/**
    This callback is executed when an HTTP request completes whether it was successful or not.
    @callback AeroGear~completeCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
 */
/**
    This callback is executed when an HTTP error is encountered during a request.
    @callback AeroGear~errorCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
 */
/**
    This callback is executed when an HTTP success message is returned during a request.
    @callback AeroGear~successCallbackREST
    @param {Object} data - The data, if any, returned in the response
    @param {String} textStatus - The text status message returned from the server
    @param {Object} jqXHR - The jQuery specific XHR object
 */
/**
    This callback is executed when an error is encountered saving to local or session storage.
    @callback AeroGear~errorCallbackStorage
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
    @param {Object|Array} data - An object or array of objects representing the data for the failed save attempt.
 */
/**
    This callback is executed when data is successfully saved to session or local storage.
    @callback AeroGear~successCallbackStorage
    @param {Object} data - The updated data object after the new saved data has been added
 */

//     node-uuid/uuid.js
//
//     Copyright (c) 2010 Robert Kieffer
//     Dual licensed under the MIT and GPL licenses.
//     Documentation and details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator, but
  // Math.random() does not guarantee "cryptographic quality".  So we feature
  // detect for more robust APIs, normalizing each method to return 128-bits
  // (16 bytes) of random data.
  var mathRNG, nodeRNG, whatwgRNG;

  // Math.random()-based RNG.  All platforms, very fast, unknown quality
  var _rndBytes = new Array(16);
  mathRNG = function() {
    var r, b = _rndBytes, i = 0;

    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      b[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return b;
  }

  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // WebKit only (currently), moderately fast, high quality
  if (_global.crypto && crypto.getRandomValues) {
    var _rnds = new Uint32Array(4);
    whatwgRNG = function() {
      crypto.getRandomValues(_rnds);

      for (var c = 0 ; c < 16; c++) {
        _rndBytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
      }
      return _rndBytes;
    }
  }

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  // Node.js only, moderately fast, high quality
  try {
    var _rb = require('crypto').randomBytes;
    nodeRNG = _rb && function() {
      return _rb(16);
    };
  } catch (e) {}

  // Select RNG with best quality
  var _rng = nodeRNG || whatwgRNG || mathRNG;

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(byte) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[byte];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  // Export RNG options
  uuid.mathRNG = mathRNG;
  uuid.nodeRNG = nodeRNG;
  uuid.whatwgRNG = whatwgRNG;

  if (typeof(module) != 'undefined') {
    // Play nice with node.js
    module.exports = uuid;
  } else {
    // Play nice with browsers
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    }
    _global.uuid = uuid;
  }
}());

;(function () {

  var
    object = typeof window != 'undefined' ? window : exports,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

(function( AeroGear, $, undefined ) {
    /**
        DESCRIPTION
        @constructs AeroGear.UnifiedPushClient
        @param {String} variantID - the id representing the mobile application variant
        @param {String} variantSecret - the secret for the mobile application variant
        @param {String} [pushServerURL="http://" + window.location.hostname + ":8080/ag-push/rest/registry/device"] - location of the unified push server
        @returns {Object} The created unified push server client
     */
    AeroGear.UnifiedPushClient = function( variantID, variantSecret, pushServerURL ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.UnifiedPushClient ) ) {
            return new AeroGear.UnifiedPushClient( variantID, variantSecret, pushServerURL );
        }

        this.registerWithPushServer = function( messageType, endpoint, alias ) {
            var RegistrationError,
                url = pushServerURL || "http://" + window.location.hostname + ":8080/ag-push/rest/registry/device";

            if ( messageType !== "broadcast" && !alias ) {
                throw "UnifiedPushRegistrationException";
            }

            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "POST",
				crossDomain: true,
                url: url,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify({
                    category: messageType,
                    deviceToken: endpoint.channelID,
                    alias: alias
                })
            });
        };

        this.unregisterWithPushServer = function( endpoint ) {
            var url = pushServerURL || "http://" + window.location.hostname + ":8080/ag-push/rest/registry/device";
            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "DELETE",
                url: url + "/" + endpoint.channelID,
                headers: {
                    "ag-mobile-variant": variantID
                },
                data: JSON.stringify({
                    deviceToken: endpoint.channelID
                })
            });
        };
    };

})( AeroGear, jQuery );

(function( AeroGear, undefined ) {
    /**
        The AeroGear.Notifier namespace provides a messaging API. Through the use of adapters, this library provides common methods like connect, disconnect, subscribe, unsubscribe and publish.
        @class
        @augments AeroGear.Core
        @param {String|Array|Object} [config] - A configuration for the client(s) being created along with the notifier. If an object or array containing objects is used, the objects can have the following properties:
        @param {String} config.name - the name that the client will later be referenced by
        @param {String} [config.type="vertx"] - the type of client as determined by the adapter used
        @param {Object} [config.settings={}] - the settings to be passed to the adapter
        @returns {Object} The created notifier containing any messaging clients that may have been created
        @example
        // Create an empty notifier
        var notifier = AeroGear.Notifier();

        // Create a single client using the default adapter
        var notifier2 = AeroGear.Notifier( "myNotifier" );

        // Create multiple clients using the default adapter
        var notifier3 = AeroGear.Notifier( [ "someNotifier", "anotherNotifier" ] );

        // Create a default adapter with settings
        var notifier4 = AeroGear.Notifier({
            name: "vertxNotifier",
            type: "vertx",
            settings: { ... }
        });

        // Create a stompws adapter with settings
        var notifier5 = AeroGear.Notifier({
            name: "STOMPNotifier",
            type: "stompws",
            settings: { ... }
        });

        // Create a vertx and stompws adapter with settings
        var notifier6 = AeroGear.Notifier([
            {
                name: "vertxNotifier",
                type: "vertx",
                settings: { ... }
            },
            {
                name: "STOMPNotifier",
                type: "stompws",
                settings: { ... }
            }
        ]);
     */
    AeroGear.Notifier = function( config ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.Notifier ) ) {
            return new AeroGear.Notifier( config );
        }
        // Super Constructor
        AeroGear.Core.call( this );

        this.lib = "Notifier";
        this.type = config ? config.type || "vertx" : "vertx";

        /**
            The name used to reference the collection of notifier client instances created from the adapters
            @memberOf AeroGear.Notifier
            @type Object
            @default modules
         */
        this.collectionName = "clients";

        this.add( config );
    };

    AeroGear.Notifier.prototype = AeroGear.Core;
    AeroGear.Notifier.constructor = AeroGear.Notifier;

    /**
        The adapters object is provided so that adapters can be added to the AeroGear.Notifier namespace dynamically and still be accessible to the add method
        @augments AeroGear.Notifier
     */
    AeroGear.Notifier.adapters = {};

    /**
        A set of constants used to track the state of a client connection.
     */
    AeroGear.Notifier.CONNECTING = 0;
    AeroGear.Notifier.CONNECTED = 1;
    AeroGear.Notifier.DISCONNECTING = 2;
    AeroGear.Notifier.DISCONNECTED = 3;
})( AeroGear );

(function( AeroGear, $, SockJS, uuid, undefined ) {
    /**
        DESCRIPTION
        @constructs AeroGear.Notifier.adapters.SimplePush
        @param {String} clientName - the name used to reference this particular notifier client
        @param {Object} [settings={}] - the settings to be passed to the adapter
        @param {String} [settings.connectURL=""] - defines the URL for connecting to the messaging service
        @returns {Object} The created notifier client
     */
    AeroGear.Notifier.adapters.SimplePush = function( clientName, settings ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.Notifier.adapters.SimplePush ) ) {
            return new AeroGear.Notifier.adapters.SimplePush( clientName, settings );
        }

        settings = settings || {};

        // Private Instance vars
        var type = "SimplePush",
            name = clientName,
            connectURL = settings.connectURL || "",
            client = null,
            pushStore = JSON.parse( localStorage.getItem("ag-push-store") || '{}' );

        pushStore.channels = pushStore.channels || [];
        for ( var channel in pushStore.channels ) {
            pushStore.channels[ channel ].state = "available";
        }
        localStorage.setItem( "ag-push-store", JSON.stringify( pushStore ) );

        // Privileged methods
        /**
            Returns the value of the private settings var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.getSettings = function() {
            return settings;
        };

        /**
            Returns the value of the private name var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.getName = function() {
            return name;
        };

        /**
            Returns the value of the private connectURL var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.getConnectURL = function() {
            return connectURL;
        };

        /**
            Set the value of the private connectURL var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
            @param {String} url - New connectURL for this client
         */
        this.setConnectURL = function( url ) {
            connectURL = url;
        };

        /**
            Returns the value of the private client var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.getClient = function() {
            return client;
        };

        /**
            Sets the value of the private client var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.setClient = function( newClient ) {
            client = newClient;
        };

        /**
            Returns the value of the private pushStore var
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.getPushStore = function() {
            return pushStore;
        };

        /**
            Sets the value of the private pushStore var as well as the local store
            @private
            @augments AeroGear.Notifier.adapters.SimplePush
         */
        this.setPushStore = function( newStore ) {
            pushStore = newStore;
            localStorage.setItem( "ag-push-store", JSON.stringify( newStore ) );
        };

        /**
         */
        this.processMessage = function( message ) {
            var channel, updates;
            if ( message.messageType === "register" && message.status === 200 ) {
                channel = {
                    channelID: message.channelID,
                    version: message.version,
                    state: "used",
                    registered: false
                };
                pushStore.channels = updateChannel( pushStore.channels, channel );
                this.setPushStore( pushStore );

                $( navigator.push ).trigger( $.Event( message.channelID + "-success", {
                    target: {
                        result: channel
                    }
                }));
            } else if ( message.messageType === "register" ) {
                throw "SimplePushRegistrationError";
            } else if ( message.messageType === "unregister" && message.status === 200 ) {
                pushStore.channels.splice( findChannelIndex( pushStore.channels, "channelID", message.channelID ), 1 );
                this.setPushStore( pushStore );
            } else if ( message.messageType === "unregister" ) {
                throw "SimplePushUnregistrationError";
            } else if ( message.messageType === "notification" ) {
                updates = message.updates;
                for ( var i = 0, updateLength = updates.length; i < updateLength; i++ ) {
                    $( navigator.push ).trigger( $.Event( "push", {
                        message: updates[ i ]
                    }));
                }

                // Acknowledge all updates sent in this notification message
                message.messageType = "ack";
                client.send( JSON.stringify( message ) );
            }
        };

        /**
         */
        this.generateHello = function() {
            var channels = pushStore.channels,
                msg = {
                messageType: "hello",
                uaid: ""
            };

            if ( pushStore.uaid ) {
                msg.uaid = pushStore.uaid;
            }
            if ( channels && msg.uaid !== "" ) {
                msg.channels = [];
                for ( var length = channels.length, i = length - 1; i > -1; i-- ) {
                    if ( pushStore.channels[ i ].state !== "available" ) {
                        msg.channels.push( pushStore.channels[ i ].channelID );
                    }
                }
            }

            return JSON.stringify( msg );
        };
    };

    //Public Methods
    /**
        Connect the client to the messaging service
        @param {Object} options - Options to pass to the connect method
        @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
        @param {Function} [options.onConnect] - callback to be executed when a connection is established and hello message has been acknowledged
        @param {Function} [options.onConnectError] - callback to be executed when connecting to a service is unsuccessful
        @example

     */
    AeroGear.Notifier.adapters.SimplePush.prototype.connect = function( options ) {
        var that = this,
            client = new SockJS( options.url || this.getConnectURL() );

        client.onopen = function() {
            // Immediately send hello message
            client.send( that.generateHello() );
        };

        client.onerror = function( error ) {
            if ( options.onConnectError ) {
                options.onConnectError.apply( this, arguments );
            }
        };

        client.onmessage = function( message ) {
            var pushStore = that.getPushStore();
            message = JSON.parse( message.data );

            if ( message.messageType === "hello" ) {
                if ( message.uaid === pushStore.uaid ) {
                    for ( var channel in pushStore.channels ) {
                        // Trigger the registration event since there will be no register message
                        $( navigator.push ).trigger( $.Event( pushStore.channels[ channel ].channelID + "-success", {
                            target: {
                                result: pushStore.channels[ channel ]
                            }
                        }));
                    }
                } else {
                    // Set uaid to new server provided id
                    pushStore.uaid = message.uaid;
                }

                that.setPushStore( pushStore );

                if ( options.onConnect ) {
                    options.onConnect( message );
                }
            } else {
                that.processMessage( message );
            }
        };

        this.setClient( client );
    };

    /**
        Disconnect the client from the messaging service
        @param {Function} [onDisconnect] - callback to be executed when a connection is terminated
        @example

     */
    AeroGear.Notifier.adapters.SimplePush.prototype.disconnect = function( onDisconnect ) {
        var client = this.getClient();

        client.close();
        if ( onDisconnect ) {
            onDisconnect();
        }
    };

    /**
        Subscribe this client to a new channel
        @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. Each object should have a String address as well as a callback to be executed when a message is received on that channel.
        @param {Boolean} [reset] - if true, remove all channels from the set and replace with the supplied channel(s)
        @example

     */
    AeroGear.Notifier.adapters.SimplePush.prototype.subscribe = function( channels, reset ) {
        var index, response, channelID,
            processed = false,
            client = this.getClient(),
            pushStore = this.getPushStore();

        if ( reset ) {
            this.unsubscribe( this.getChannels() );
        }

        channels = AeroGear.isArray( channels ) ? channels : [ channels ];
        pushStore.channels = pushStore.channels || [];

        for ( var i = 0; i < channels.length; i++ ) {
            if ( client.readyState === SockJS.OPEN ) {
                channelID = uuid();
                bindSubscribeSuccess( channelID, channels[ i ].requestObject );
                client.send( '{"messageType": "register", "channelID": "' + channels[ i ].channelID + '"}');
            } else {
                // check for previously registered channels
                if ( pushStore.channels.length ) {
                    index = findChannelIndex( pushStore.channels, "state", "available" );
                    if ( index !== undefined ) {
                        bindSubscribeSuccess( pushStore.channels[ index ].channelID, channels[ i ].requestObject );
                        channels[ i ].channelID = pushStore.channels[ index ].channelID;
                        channels[ i ].state = "used";
                        channels[ i ].registered = true;
                        pushStore.channels[ index ] = channels[ i ];
                        processed = true;
                    }
                }

                if ( !processed ) {
                    // No previous channels available so add a new one
                    channels[ i ].channelID = uuid();
                    bindSubscribeSuccess( channels[ i ].channelID, channels[ i ].requestObject );
                    channels[ i ].state = "new";
                    pushStore.channels.push( channels[ i ] );
                }
            }

            processed = false;
        }

        this.setPushStore( pushStore );
    };

    /**
        Unsubscribe this client from a channel
        @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe
        @example

     */
    AeroGear.Notifier.adapters.SimplePush.prototype.unsubscribe = function( channels ) {
        var client = this.getClient();

        channels = AeroGear.isArray( channels ) ? channels : [ channels ];
        for ( var i = 0; i < channels.length; i++ ) {
            client.send( '{"messageType": "unregister", "channelID": "' + channels[ i ].channelID + '"}');
        }
    };

    // Utility Functions
    function findChannelIndex( channels, filterField, filterValue ) {
        for ( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ][ filterField ] === filterValue ) {
                return i;
            }
        }
    }

    function updateChannel( channels, channel ) {
        for( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ].channelID === channel.channelID ) {
                channels[ i ].version = channel.version;
                channels[ i ].state = channel.state;
                break;
            }
        }

        return channels;
    }

    function bindSubscribeSuccess( channelID, request ) {
        $( navigator.push ).on( channelID + "-success", function( event ) {
            request.onsuccess( event );
        });
    }

})( AeroGear, jQuery, SockJS, uuid );

(function( AeroGear, $, undefined ) {
    var simpleNotifier, nativePush;
    // Use browser push implementation when available
    // TODO: Test for browser-prefixed implementations
    // TODO: Actually use the native version when present
    if ( navigator.push ) {
        nativePush = navigator.push;
    }

    // SimplePush Default Config
    AeroGear.SimplePush = window.AeroGearSimplePush;
    AeroGear.SimplePush.simplePushServerURL = window.AeroGearSimplePush.simplePushServerURL || "http://" + window.location.hostname + ":7777/simplepush";

    // Add push to the navigator object
    navigator.push = (function() {
        return {
            register: nativePush ? nativePush.register : function() {
                var request = {
                    onsuccess: function( event ) {}
                };

                if ( !simpleNotifier ) {
                    throw "SimplePushConnectionError";
                }

                simpleNotifier.subscribe({
                    requestObject: request,
                    callback: function( message ) {
                        $( navigator.push ).trigger({
                            type: "push",
                            message: message
                        });
                    }
                });

                return request;
            },

            unregister: nativePush ? nativePush.unregister : function( endpoint ) {
                simpleNotifier.unsubscribe( endpoint );
            }
        };
    })();

    navigator.setMessageHandler = function( messageType, callback ) {
        var handler;
        // TODO: Check for other browser implementations
        if ( navigator.mozSetMessageHandler ) {
            navigator.mozSetMessageHandler.apply( arguments );
            return;
        }

        handler = function( event ) {
            var message = event.message;
            callback.call( this, message );
        };

        $( navigator.push ).on( messageType, handler );
    };

    // Create a Notifier connection to the Push Network
    simpleNotifier = AeroGear.Notifier({
        name: "agPushNetwork",
        type: "SimplePush",
        settings: {
            connectURL: AeroGear.SimplePush.simplePushServerURL
        }
    }).clients.agPushNetwork;

    simpleNotifier.connect({
        onConnect: function( data ) {
            var pushStore = JSON.parse( localStorage.getItem("ag-push-store") || '{}' ),
                channels = pushStore.channels || [];

            // Subscribe to any new channels
            for ( var channel in channels ) {
                if ( channels[ channel ].state === "new" ) {
                    simpleNotifier.subscribe({
                        channelID: channels[ channel ].channelID,
                        callback: function( message ) {
                            $( navigator.push ).trigger({
                                type: "push",
                                message: message
                            });
                        }
                    });
                }
            }
        }
    });
})( AeroGear, jQuery );
