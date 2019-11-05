define('intervillain', ['dcupl'], function(dcupl) {

    var Intervillain = function() {

    };

    Intervillain.prototype = {
        pitch: 440,
        delay: 100,
        floor: 250,
        ceiling: 3000,
        nom: 3,
        den: 4,
        mult: 1.444,
        // reverse, sawtooth
        wrapMethod: 'reverse',
        running: false,
        processing: false,
        start: function() {
            if (this.running) {
                return;
            }
            dcupl.publish('intervillain.start');
            this.running = true;
            this._play();
        },
        stop: function() {
            dcupl.publish('intervillain.stop');
            this.running = false;
        },
        setDelay: function(d) {
            this.delay = d;
        },
        setFloor: function(f) {
            this.floor = f;
        },
        setCeiling: function(c) {
            this.ceiling = c;
        },
        setMult: function(n, d) {
            this.nom = n;
            this.den = d;
        },
        _play: function() {
            if (!this.running) {
                return;
            }
            this.processing = true;

            // don't play again until processing is complete
            var iv = this;
            this._setTimeout(function() {
                iv._play();
            }, this.delay);

            dcupl.publish('intervillain.play', this);

            // var c = this.ceiling;
            // if (c < this.floor) {
            //     this.ceiling = this.floor;
            //     this.floor = c;
            // }
            var f = this.floor;
            if (f > this.ceiling) {
                this.floor = this.ceiling;
                this.ceiling = f;
            }

            this._changePitch();


            var scale = 40;
            f = Math.round(this.floor / scale);
            var p = Math.round(this.pitch / scale);
            c = Math.round(this.ceiling / scale);
            var log = '';

            if (p < f) {
                f = f - p;
                c = c - f - p;

                if (p <= 0) {
                    p = 1;
                }
                if (f <= 0) {
                    f = 1;
                }
                if (c <= 0) {
                    c = 1;
                }

                p = new Array(p);
                f = new Array(f);
                c = new Array(c);

                log = p.join(' ')+'♦'+f.join(' ')+'<'+c.join(' ')+'>';
            } else if (p > c) {
                c = c - f;
                p = p - c - f;

                if (p <= 0) {
                    p = 1;
                }
                if (f <= 0) {
                    f = 1;
                }
                if (c <= 0) {
                    c = 1;
                }

                p = new Array(p);
                f = new Array(f);
                c = new Array(c);

                log = f.join(' ')+'<'+c.join(' ')+'>'+p.join(' ')+'♦';
            } else {
                p = p - f;
                c = c - p - f;

                if (p <= 0) {
                    p = 1;
                }
                if (f <= 0) {
                    f = 1;
                }
                if (c <= 0) {
                    c = 1;
                }

                p = new Array(p);
                f = new Array(f);
                c = new Array(c);

                log = f.join(' ')+'<'+p.join(' ')+'♦'+c.join(' ')+'>';
            }
            console.log(log);

            this.processing = false;
        },
        getMult: function() {
            return this.nom / this.den;
            // return this.mult;
        },
        _changePitch: function() {
            this.pitch = this.getNextPitch();
            this._validatePitch();
        },
        getNextPitch: function() {
            return Math.round(this.pitch * this.getMult());
        },
        movePitchInRange: function() {
            if (this.pitch < this.floor) {
                this._movePitchUpIntoRange();
            } else if (this.pitch > this.ceiling) {
                this._movePitchDownIntoRange();
            }
        },
        _movePitchUpIntoRange: function() {
            var pitch = 0;
            var reversed = false;

            if (this.getMult() < 1) {
                this._reverse();
                reversed = true;
            }

            while (this.pitch < this.floor) {
                this.pitch = this.getNextPitch();
                if (this.pitch === 0) {
                    this.pitch = pitch = this.floor;
                }
                // console.log('up', this.getMult(), this.pitch);
            }

            if (reversed) {
                this._reverse();
            }
        },
        _movePitchDownIntoRange: function() {
            var pitch = 0;
            var reversed = false;

            if (this.getMult() > 1) {
                this._reverse();
                reversed = true;
            }

            while (this.pitch > this.ceiling) {
                this.pitch = this.getNextPitch();
                // console.log('down', this.getMult(), this.pitch);
            }

            if (reversed) {
                this._reverse();
            }
        },
        _validatePitch: function() {
            var nextPitch = this.getNextPitch();
            if (nextPitch > this.ceiling) {
                this['_'+this.wrapMethod](1);
            } else if (nextPitch < this.floor) {
                this['_'+this.wrapMethod](-1);
            }
            this.movePitchInRange();
        },
        _reverse: function() {
            var den = this.den;
            var nom = this.nom;
            this.nom = den;
            this.den = nom;
            // var d;
            // if (this.mult > 1) {
            //     d = this.mult - 1;
            //     this.mult = 1 - d;
            // } else {
            //     d = 1 - this.mult;
            //     this.mult = 1 + d;
            // }
            // if (this.mult <= 0) {
            //     this.mult = 0.1;
            // }
        },
        _sawtooth: function(direction) {
            this._reverse();
            // var pitch = 0;
            while (this.pitch > this.floor && this.pitch < this.ceiling) {
                pitch = this.pitch;
                this.pitch = this.getNextPitch();
            }
            // this.pitch = pitch;
            this._reverse();
        },
        // don't execute callback until processing is complete
        _setTimeout: function(cb, ms) {
            var iv = this;
            setTimeout(function() {
                if (iv.processing) {
                    iv._setTimeout(1);
                } else {
                    cb();
                }
            }, ms);
        }
    };

    window.intervillain = new Intervillain();

    return window.intervillain;
});