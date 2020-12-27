const Repository = require('./repository');

class CardRespository extends Repository {}

module.exports = new CardRespository('cards.json');