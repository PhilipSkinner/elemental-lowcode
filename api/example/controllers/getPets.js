module.exports = function(petsRepository) {
	return (req, res, next) => {		
		res.json(petsRepository.getPets());		
		next();
	};
};