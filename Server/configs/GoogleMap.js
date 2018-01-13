const key = 'AIzaSyArPtL7gTh6ZIN0LNS4fiC7j_HjKkK3-kA';
var axios = require('axios');
var q = require('q');

exports.GetDirection = (origin, destination) => {
	var url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&units=metric&key=${key}`;
	var d = q.defer();

	axios.get(url)
	.then(function(response){
		d.resolve(response);
	})
	.catch(function(error){
		d.reject(error);
	});
	return d.promise;
};