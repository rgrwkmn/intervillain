define('lfo', ['jquery'], function($) {
    var LFO = function(o) {
        $.extend(this, {},  o);
        if (this.value > this.high) {
            this.value = this.high;
        } else if (this.value < this.low) {
            this.value = this.low;
        }
    };

    LFO.prototype = {
        speed: 10,
        value: 0,
        low: 0,
        high: 10,
        step: 1,
        running: false,
        start: function() {
            if (this.running) {
                return;
            }
            this.running = true;
            this._osc();
        },
        stop: function() {
            this.running = false;
        },
        _osc: function() {
            if (!this.running) {
                return;
            }

            var lfo = this;
            setTimeout(function() {
                lfo._osc();
            }, this.speed);

            this._step();
        },
        _getNextValue: function() {
            return this.value + this.step;
        },
        _step: function() {
            var nextVal = this._getNextValue();
            var higher = nextVal > this.high;
            var lower = nextVal < this.low;
            if (higher || lower) {
                if (higher) {
                    this.value = this.high;
                } else {
                    this.value = this.low;
                }
                this.step *= -1;
                this.value = this._getNextValue();
            } else {
                this.value = nextVal;
            }
        }
    };

    return LFO;
});