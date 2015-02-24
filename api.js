var swisseph = require ('swisseph');

swisseph.swe_set_ephe_path (process.env.SWISSEPH_EPHEMERIS_PATH || (__dirname + '/ephe'));

module.exports = api;

function api (server) {
	io = require('socket.io') (server);
	io.on ('connection', function (socket) {
  		socket.on('swisseph', function (data) {
  			handler (socket, data);
  		});
	});
};

function handler (socket, args) {
	var i;

	for (i = 0; i < args.length; i ++) {
	    socket.emit ('swisseph result', swisseph [args [i].func].apply (this, args [i].args));
	};
};
