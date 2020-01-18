module.exports = function(dbConnection) {
	const petsRepository = function() {
		this.pets = [];
	};

	petsRepository.prototype.addPet = function(pet) {
		this.pets.push(pet);
	}

	petsRepository.prototype.getPets = function() {		
		return this.pets;
	};

	return new petsRepository();
};