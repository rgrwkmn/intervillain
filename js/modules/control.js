define('control', ['intervillain', 'lfo', 'dcupl', 'synth'], function(IV, LFO, dcupl, synth) {
    var floorLfo = new LFO({
        value: 250,
        low: 250,
        high: 2000,
        step: 10,
        speed: 10
    });

    var ceilingLfo = new LFO({
        value: 3000,
        low: 500,
        high: 3000,
        step: 10,
        speed: 5
    });

    dcupl.subscribe('intervillain.play', function(iv) {
        iv.setFloor(floorLfo.value);
        iv.setCeiling(ceilingLfo.value);
        synth.play(iv.pitch);
    });

    dcupl.subscribe('intervillain.start', function() {
        floorLfo.start();
        ceilingLfo.start();
    });

    dcupl.subscribe('intervillain.stop', function() {
        floorLfo.stop();
        ceilingLfo.stop();
        synth.stop();
    });

    window.floorLfo = floorLfo;
    window.ceilingLfo = ceilingLfo;
});