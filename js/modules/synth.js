define('synth', [], function() {
    // patch up prefixes
    window.AudioContext=window.AudioContext||window.webkitAudioContext;

    var context = new AudioContext();
    var midiAccess=null;    // the MIDIAccess object.
    var oscillator=null;    // the single oscillator
    var envelope=null;      // the envelope for the single oscillator
    var attack=0.05;            // attack speed
    var release=0.05;       // release speed
    var portamento=0.01;    // portamento/glide speed
    var activeNotes = [];   // the stack of actively-pressed keys

    // set up the basic oscillator chain, muted to begin with.
    oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(110, 0);
    envelope = context.createGain();
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    envelope.gain.value = 0.0;  // Mute the sound

    return {
        play: function(pitch) {
            try {
                oscillator.start(0);
            } catch (e) {}
            oscillator.frequency.cancelScheduledValues(0);
            oscillator.frequency.setTargetAtTime(pitch, 0, portamento);
            envelope.gain.cancelScheduledValues(0);
            envelope.gain.setTargetAtTime(1.0, 0, attack);
        },
        stop: function() {
            envelope.gain.setTargetAtTime(0, 0, attack);
        }
    };
});