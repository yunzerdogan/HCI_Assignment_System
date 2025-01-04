const courseList = [];
const assignmentList = [];

const assignmentTable = document.getElementById('AssignmentTable');

window.onload = async function() {
    console.log("Page loaded");
    const student_id = 1; // Replace with actual student ID
    await populateAssignmentList(student_id);
    renderAssignmentTable();
};

const populateAssignmentList = async (student_id) => {
    const response = await fetch(`/myassignments?student_id=${student_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    data.forEach((assignment) => {
        assignmentList.push(assignment);
    });
};

const renderAssignmentTable = () => {
    assignmentList.forEach((assignment) => {
        const row = assignmentTable.insertRow();
        row.insertCell(0).innerHTML = assignment.assignment_name;
        row.insertCell(1).innerHTML = assignment.assignment_due_date;
        row.insertCell(2).innerHTML = `${assignment.assignment_actual_points}/${assignment.assignment_possible_points}`;
        row.insertCell(3).innerHTML = "⬇️";
    });
};