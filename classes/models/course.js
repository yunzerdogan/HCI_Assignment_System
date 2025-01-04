const { Model } = require('../base');

class Course extends Model{
    get defaults(){
        return {
            id: Date.now() + Math.floor(Math.random() * 10),
            course_name: '',
            course_name_eng: ''
        }
    }
}

module.exports = {Course};