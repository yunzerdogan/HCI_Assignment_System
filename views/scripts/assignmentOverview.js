const pointsHistory = JSON.parse(localStorage.getItem('pointsHistory')) || {
    student1: { "Assignment 01 - HCI": 6, "Assignment 02 - HCI": 6, "Assignment 03 - HCI": 5, "Assignment 04 - HCI": 8, "Assignment 05 - HCI": 0 },
    student2: { "Assignment 01 - HCI": 0, "Assignment 02 - HCI": 0, "Assignment 03 - HCI": 0, "Assignment 04 - HCI": 0, "Assignment 05 - HCI": 0 },
    student3: { "Assignment 01 - HCI": 0, "Assignment 02 - HCI": 0, "Assignment 03 - HCI": 0, "Assignment 04 - HCI": 0, "Assignment 05 - HCI": 0 },
    student4: { "Assignment 01 - HCI": 0, "Assignment 02 - HCI": 0, "Assignment 03 - HCI": 0, "Assignment 04 - HCI": 0, "Assignment 05 - HCI": 0 }
};

const annonStatus = JSON.parse(localStorage.getItem('annonStatus')) || {
    student1: false,
    student2: false,
    student3: false,
    student4: false
};

function updatePoints(button) {
    const container = button.parentElement;
    const input = container.querySelector('.points-input');
    const display = container.querySelector('.points-display');
    const maxPoints = input.max;
    const assignmentName = container.closest('tr').querySelector('td').textContent;
    const student = document.querySelector('.student-dropdown').value;
    pointsHistory[student][assignmentName] = input.value;
    display.textContent = `${input.value}/${maxPoints}`;
    localStorage.setItem('pointsHistory', JSON.stringify(pointsHistory));
}

function loadPoints() {
    document.querySelectorAll('.points-container').forEach(container => {
        const assignmentName = container.closest('tr').querySelector('td').textContent;
        const display = container.querySelector('.points-display');
        const maxPoints = display.getAttribute('data-max-points');
        const points = pointsHistory[userName][assignmentName];
        display.textContent = `${points}/${maxPoints}`;
    });
}

function toggleAnnon() {
    const student = document.querySelector('.student-dropdown').value;
    const button = document.querySelector('.annon-button');
    annonStatus[student] = !annonStatus[student];
    button.textContent = annonStatus[student] ? 'Anonimität aufheben' : 'Bleibe Annonym';
    button.classList.toggle('active', annonStatus[student]);
    localStorage.setItem('annonStatus', JSON.stringify(annonStatus));
}

function loadAnnonStatus() {
    const student = document.querySelector('.student-dropdown').value;
    const button = document.querySelector('.annon-button');
    button.textContent = annonStatus[student] ? 'Anonimität aufheben' : 'Bleibe Annonym';
    button.classList.toggle('active', annonStatus[student]);
}

document.querySelector('.student-dropdown').addEventListener('change', loadPoints);
document.querySelector('.annon-button').addEventListener('click', toggleAnnon);
document.querySelector('.student-dropdown').addEventListener('change', loadAnnonStatus);

function startCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(element => {
        const endTime = new Date();
        const timeParts = element.textContent.split(':');
        endTime.setDate(endTime.getDate() + parseInt(timeParts[0]));
        endTime.setHours(endTime.getHours() + parseInt(timeParts[1]));
        endTime.setMinutes(endTime.getMinutes() + parseInt(timeParts[2]));
        endTime.setSeconds(endTime.getSeconds() + parseInt(timeParts[3]));

        function updateCountdown() {
            const now = new Date();
            const timeLeft = endTime - now;
            if (timeLeft <= 0) {
                element.textContent = "00:00:00:00";
                return;
            }
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            element.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPoints();
    startCountdown();
    loadAnnonStatus();

    const dropZone = document.getElementById('drop-zone');

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.innerHTML = '';
        dropZone.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    function handleFiles(files) {

        console.log('File(s) dropped:', file.name);
        const fileItem = document.createElement('div');
        fileItem.textContent = file.name;
        dropZone.appendChild(fileItem);
        validFile = true; // Ensure this updates the correct variable
    }
});
