define(
	'dcupl.tests',
	['dcupl', 'dcupl.hook'],
	function(d) {
		d.dbug = true;

		//test latecomer and multi-args
		d.publish('test.latecomer', 'latecomer', 'args');
		var late = function(t, a) {
			console.log('callback: test.latecomer with '+t+', '+a);
		}
		d.subscribe('test.latecomer another.event', late, true);
		d.unsubscribe('test.latecomer another.event', late);

		//test ancestors
		d.subscribe('test.ancestor.tree', function() {
			console.log('callback: test.ancestor.tree');
		});
		d.subscribe('test.ancestor', function() {
			console.log('callback: test.ancestor');
		});
		d.subscribe('test', function() {
			console.log('callback: test');
		});
		//should trigger all three callbacks above.
		d.publish('test.ancestor.tree');

		d.dbug = false;
	}
);
