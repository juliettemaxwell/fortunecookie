"use strict";
var platform_1 = require("platform");
var SocketIO = (function () {
    function SocketIO() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        switch (args.length) {
            case 2:
                var keys = Object.keys(args[1]);
                var keysNS = new NSMutableArray();
                var valuesNS = new NSMutableArray();
                for (var i = 0; i < keys.length; i++) {
                    keysNS.addObject(keys[i]);
                    if (typeof args[1][keys[i]] == 'object') {
                        var obj = args[1][keys[i]];
                        var key = new NSMutableArray();
                        key.addObject(obj[0]);
                        var val = new NSMutableArray();
                        val.addObject(obj[1]);
                        valuesNS.addObject(NSDictionary.dictionaryWithObjectsForKeys(val, key));
                    }
                    else {
                        valuesNS.addObject(args[1][keys[i]]);
                    }
                }
                var opts = NSDictionary.dictionaryWithObjectsForKeys(valuesNS, keysNS);
                if (parseInt(platform_1.device.osVersion) >= 10) {
                    this.socket = SocketIOClient.alloc().initWithSocketURLConfig(NSURL.URLWithString(args[0]), opts);
                }
                else {
                    this.socket = SocketIOClient.alloc().initWithSocketURLOptions(NSURL.URLWithString(args[0]), opts);
                }
                break;
            case 3:
                this.instance = args.pop();
                break;
        }
    }
    SocketIO.prototype.on = function (event, callback) {
        this.socket.onCallback(event, function (data, ack) {
            if (ack) {
                callback(data, ack);
            }
            else {
                callback(data);
            }
        });
    };
    ;
    SocketIO.prototype.connect = function () {
        this.socket.connect();
    };
    SocketIO.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (!args) {
            return console.error('Emit Failed: No arguments');
        }
        var event = args[0];
        var payload = Array.prototype.slice.call(args, 1);
        var ack = payload.pop();
        if (ack && typeof ack !== 'function') {
            payload.push(ack);
            ack = null;
        }
        if (ack) {
            var emit = this.socket.emitWithAckWithItems(event, payload);
            emit(0, function (args) {
                var marshalledArgs = [];
                for (var i = 0; i < args.count; i++) {
                    marshalledArgs.push(args.objectAtIndex(i));
                }
                ack.apply(null, marshalledArgs);
            });
        }
        else {
            this.socket.emitWithItems(event, payload);
        }
    };
    SocketIO.prototype.disconnect = function () {
        this.socket.disconnect();
    };
    Object.defineProperty(SocketIO.prototype, "instance", {
        get: function () {
            return this.socket;
        },
        set: function (instance) {
            this.socket = instance;
        },
        enumerable: true,
        configurable: true
    });
    SocketIO.prototype.joinNamespace = function (nsp) {
        this.socket.joinNamespace(nsp);
    };
    SocketIO.prototype.leaveNamespace = function () {
        this.socket.leaveNamespace();
    };
    return SocketIO;
}());
exports.SocketIO = SocketIO;
//# sourceMappingURL=socketio.js.map