const { Model } = require('../base');


class Assignment extends Model{
    get defaults(){
        return {
            id: Date.now() + Math.floor(Math.random() * 10),
            assignment_name: '',
            assignment_due_date: '',
            assignmnent_possible_points: 0,
            assignment_actual_points: 0,
            assignment_tutor_id: 0,
            assignment_student_id: 0,
            course_id: 0 
        }
    }
}

module.exports = {Assignment};