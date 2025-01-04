const defaultsDeep = require('lodash/defaultsDeep');

class Model {
    constructor(attributes = {}) {
        defaultsDeep(this, attributes, this.defaults);
    }
}

module.exports = { Model };