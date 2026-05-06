const gradeValues = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'E': 0.0,
    'W': 0.0 // Withdrawal
};

const addRowBtn = document.getElementById('addRowBtn');
const saveTotalBtn = document.getElementById('saveTotalBtn');
const saveTranscriptBtn = document.getElementById('saveTranscriptBtn');
const loadTranscriptBtn = document.getElementById('loadTranscriptBtn');
const transcriptInput = document.getElementById('transcriptInput');
const gradesBody = document.getElementById('gradesBody');
const mshValue = document.getElementById('mshValue');
const mhpValue = document.getElementById('mhpValue');
const gpaValue = document.getElementById('gpaValue');
const semestersBody = document.getElementById('semestersBody');
const overallGPA = document.getElementById('overallGPA');

let semesters = [];
let totalAllMHP = 0;
let totalAllMSH = 0;

// Add event listeners
addRowBtn.addEventListener('click', addRow);
saveTotalBtn.addEventListener('click', saveSemester);
saveTranscriptBtn.addEventListener('click', saveTranscript);
loadTranscriptBtn.addEventListener('click', loadTranscript);

function addRow() {
    const newRow = document.createElement('tr');
    newRow.className = 'grade-row';
    newRow.innerHTML = `
        <td><input type="text" class="class-name" placeholder="e.g., Math 101"></td>
        <td><input type="number" class="credit-hours" min="0" step="0.5" placeholder="Credits"></td>
        <td>
            <select class="letter-grade">
                <option value="">Select Grade</option>
                <option value="A+">A+ / A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="E">E (F)</option>
                <option value="W">W (Withdrawal)</option>
            </select>
        </td>
        <td><button class="remove-btn">Remove</button></td>
    `;
    
    gradesBody.appendChild(newRow);
    updateRemoveButtons();
    attachRowListeners();
}

function removeRow(event) {
    const row = event.target.closest('tr');
    row.remove();
    updateRemoveButtons();
    calculateGPA();
}

function updateRemoveButtons() {
    const rows = document.querySelectorAll('.grade-row');
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    // Only show remove button if there's more than one row
    removeButtons.forEach(button => {
        button.style.display = rows.length > 1 ? 'block' : 'none';
    });
}

function attachRowListeners() {
    const creditInputs = document.querySelectorAll('.credit-hours');
    const gradeSelects = document.querySelectorAll('.letter-grade');
    const removeButtons = document.querySelectorAll('.remove-btn');

    creditInputs.forEach(input => {
        input.removeEventListener('input', calculateGPA);
        input.addEventListener('input', calculateGPA);
    });

    gradeSelects.forEach(select => {
        select.removeEventListener('change', calculateGPA);
        select.addEventListener('change', calculateGPA);
    });

    removeButtons.forEach(button => {
        button.removeEventListener('click', removeRow);
        button.addEventListener('click', removeRow);
    });
}

function calculateGPA() {
    const rows = document.querySelectorAll('.grade-row');
    let totalMHP = 0;
    let totalMSH = 0;

    rows.forEach(row => {
        const creditHours = parseFloat(row.querySelector('.credit-hours').value) || 0;
        const grade = row.querySelector('.letter-grade').value;

        // Handle withdrawal case
        if (grade === 'W') {
            return; // Skip this class
        }

        // For normal grades, calculate MHP for this row
        if (grade && creditHours > 0) {
            const gradeValue = gradeValues[grade];
            totalMHP += gradeValue * creditHours;
            totalMSH += creditHours;
        }
    });

    // Update display values - truncate to 3 decimal places
    mshValue.textContent = totalMSH.toFixed(1);
    mhpValue.textContent = (Math.floor(totalMHP * 1000) / 1000).toFixed(3);
    
    // Calculate and display GPA - truncate to 3 decimal places
    const gpa = totalMSH > 0 ? (Math.floor((totalMHP / totalMSH) * 1000) / 1000).toFixed(3) : '0.000';
    gpaValue.textContent = gpa;
}

function saveSemester() {
    const currentGPA = parseFloat(gpaValue.textContent);
    const currentMHP = parseFloat(mhpValue.textContent);
    const currentMSH = parseFloat(mshValue.textContent);
    
    if (isNaN(currentGPA) || currentGPA === 0) {
        alert('Please enter at least one class with a grade and credit hours to save.');
        return;
    }

    const semesterNumber = semesters.length + 1;
    semesters.push({
        number: semesterNumber,
        gpa: currentGPA,
        mhp: currentMHP,
        msh: currentMSH
    });

    // Add to running totals
    totalAllMHP += currentMHP;
    totalAllMSH += currentMSH;

    // Add row to semesters table - truncate GPA to 3 decimal places
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>Semester ${semesterNumber}</td>
        <td>${(Math.floor(currentGPA * 1000) / 1000).toFixed(3)}</td>
    `;
    semestersBody.appendChild(newRow);

    // Update overall GPA
    updateOverallGPA();

    // Clear current semester data
    gradesBody.innerHTML = `
        <tr class="grade-row">
            <td><input type="text" class="class-name" placeholder="e.g., Math 101"></td>
            <td><input type="number" class="credit-hours" min="0" step="0.5" placeholder="Credits"></td>
            <td>
                <select class="letter-grade">
                    <option value="">Select Grade</option>
                    <option value="A+">A+ / A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="D-">D-</option>
                    <option value="E">E (F)</option>
                    <option value="W">W (Withdrawal)</option>
                </select>
            </td>
            <td><button class="remove-btn" style="display:none;">Remove</button></td>
        </tr>
    `;
    
    attachRowListeners();
    updateRemoveButtons();
    calculateGPA();
}

function updateOverallGPA() {
    if (totalAllMSH === 0) {
        overallGPA.textContent = '0.000';
        return;
    }

    // Calculate overall GPA as running total: totalAllMHP / totalAllMSH
    const overallGPAValue = totalAllMHP / totalAllMSH;
    // Truncate to 3 decimal places
    overallGPA.textContent = (Math.floor(overallGPAValue * 1000) / 1000).toFixed(3);
}

function saveTranscript() {
    if (semesters.length === 0) {
        alert('No semesters to save. Please save at least one semester first.');
        return;
    }

    let transcript = 'GPA CALCULATOR TRANSCRIPT\n';
    transcript += 'Generated: ' + new Date().toLocaleString() + '\n\n';

    semesters.forEach((semester, index) => {
        transcript += `SEMESTER ${semester.number}:\n`;
        transcript += `GPA: ${semester.gpa}\n`;
        transcript += `Credit Hours: ${semester.msh}\n`;
        transcript += `Grade Points: ${semester.mhp}\n\n`;
    });

    transcript += `OVERALL GPA: ${(Math.floor((totalAllMHP / totalAllMSH) * 1000) / 1000).toFixed(3)}\n`;
    transcript += `Total Credit Hours: ${totalAllMSH}\n`;
    transcript += `Total Grade Points: ${(Math.floor(totalAllMHP * 1000) / 1000).toFixed(3)}\n`;

    // Copy to clipboard and show in alert
    navigator.clipboard.writeText(transcript).then(() => {
        alert('Transcript copied to clipboard!\n\n' + transcript);
    }).catch(() => {
        // Fallback: show in prompt for manual copy
        const userCopied = prompt('Copy this transcript:', transcript);
        if (userCopied) {
            alert('Transcript ready to save!');
        }
    });
}

function loadTranscript() {
    const transcriptText = transcriptInput.value.trim();
    
    if (!transcriptText) {
        alert('Please paste a transcript to load.');
        return;
    }

    try {
        // Parse the transcript
        const lines = transcriptText.split('\n');
        const newSemesters = [];
        let parsingSemester = false;
        let currentSemester = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('SEMESTER ')) {
                // Save previous semester if exists
                if (currentSemester) {
                    newSemesters.push(currentSemester);
                }
                
                // Start new semester
                const semesterNum = parseInt(trimmedLine.split(' ')[1].replace(':', ''));
                currentSemester = { number: semesterNum };
                parsingSemester = true;
            } else if (parsingSemester && trimmedLine.includes(':')) {
                const [key, value] = trimmedLine.split(':').map(s => s.trim());
                
                if (key === 'GPA') {
                    currentSemester.gpa = parseFloat(value);
                } else if (key === 'Credit Hours') {
                    currentSemester.msh = parseFloat(value);
                } else if (key === 'Grade Points') {
                    currentSemester.mhp = parseFloat(value);
                }
            }
        }
        
        // Add the last semester
        if (currentSemester) {
            newSemesters.push(currentSemester);
        }

        if (newSemesters.length === 0) {
            throw new Error('No valid semester data found in transcript.');
        }

        // Validate data
        for (const sem of newSemesters) {
            if (!sem.gpa || !sem.msh || !sem.mhp) {
                throw new Error('Incomplete semester data in transcript.');
            }
        }

        // Load the semesters
        semesters = newSemesters;
        
        // Recalculate totals
        totalAllMHP = semesters.reduce((sum, sem) => sum + sem.mhp, 0);
        totalAllMSH = semesters.reduce((sum, sem) => sum + sem.msh, 0);

        // Update the UI
        updateSemestersTable();
        updateOverallGPA();
        
        // Clear the input
        transcriptInput.value = '';
        
        alert(`Successfully loaded ${semesters.length} semester(s)!`);

    } catch (error) {
        alert('Error loading transcript: ' + error.message + '\n\nPlease check that the transcript format is correct.');
    }
}

function updateSemestersTable() {
    semestersBody.innerHTML = '';
    
    semesters.forEach(semester => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>Semester ${semester.number}</td>
            <td>${(Math.floor(semester.gpa * 1000) / 1000).toFixed(3)}</td>
        `;
        semestersBody.appendChild(newRow);
    });
}

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', function() {
    attachRowListeners();
    updateRemoveButtons();
    calculateGPA();
});