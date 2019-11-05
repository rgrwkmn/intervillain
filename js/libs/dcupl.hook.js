define(
	'dcupl.hook',
	['dcupl'],
	function(d) {
		var e = 'dcupl.hook requires the dcupl publish method or similar be present';
		if (typeof d === 'undefined') {
			throw new Error(e);
			return;
		} else if (typeof d.publish !== 'function') {
			throw new Error(e);
			return;
		}
		
		d.hook = function(o, name, before, after) {
			name = name+'.';
			before = (!before) ? function(){} : d.publish;
			after = (typeof after === 'undefined' || after) ? d.publish : function(){};
			function hook(f, fName) {
				var fn = fName[0].toUpperCase()+fName.substr(1),
					beforeName = name+'before'+fn,
					afterName = name+'after'+fn;
					console.log(beforeName+', '+afterName);

					return function() {
						console.log(name+fn);
						f.call(o, arguments);
						after(afterName, this);
					}
			}
			for (f in o) {
				if (o.hasOwnProperty(f) && typeof o[f] === 'function') {
					o[f] = hook(o[f], f);
				}
			}
			return o;
		}

		return d;
	}
);
