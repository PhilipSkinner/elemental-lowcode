module.exports = function(petsRepository) {
	return (req, res, next) => {
		petsRepository.addPet(req.body);
		res.json({});
		next();
	};
};