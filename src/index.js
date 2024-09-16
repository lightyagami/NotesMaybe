const body = document.querySelector("body");

// Function to create decorative hearts
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "fas fa-heart";
    heart.style.left = (Math.random() * 100) + "vw";
    heart.style.animationDuration = (Math.random() * 3) + 2 + "s";
    body.appendChild(heart);
}
setInterval(createHeart, 100);

setInterval(function () {
    const heartArr = document.querySelectorAll(".fa-heart");
    if (heartArr.length > 200) {
        heartArr[0].remove();
    }
}, 100);

// Function to create a new note
function createNote() {
    const noteText = document.getElementById('note-text').value;
    const noteLabelText = document.getElementById('note-label').value;

    if (noteText.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    // Create a new note card element
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.id = 'note-' + Date.now(); // Unique ID for each note

    // Optional label for notes
    if (noteLabelText.trim() !== '') {
        const noteLabel = document.createElement('div');
        noteLabel.className = 'note-label';
        noteLabel.innerText = `${noteLabelText} 🎀`;
        noteCard.appendChild(noteLabel);
    }

    // Note content
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.innerText = noteText;
    noteCard.appendChild(noteContent);

    // Create save button
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save Note';
    saveButton.onclick = function() {
        saveNoteAsImage(noteCard);
    };
    noteCard.appendChild(saveButton);

    // Append the new note to the grid
    const noteGrid = document.getElementById('note-grid');
    noteGrid.appendChild(noteCard);

    // Make the new note draggable
    makeDraggable(noteCard);

    // Save all notes to local storage
    saveAllNotesToLocalStorage();

    // Clear input fields
    document.getElementById('note-text').value = '';
    document.getElementById('note-label').value = '';
}

// Function to save all notes to local storage
function saveAllNotesToLocalStorage() {
    const notes = [];
    document.querySelectorAll('.note-card').forEach(noteCard => {
        const noteData = {
            id: noteCard.id,
            text: noteCard.querySelector('.note-content').innerText,
            label: noteCard.querySelector('.note-label') ? noteCard.querySelector('.note-label').innerText : ''
        };
        notes.push(noteData);
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to save note as an image
function saveNoteAsImage(noteElement) {
    html2canvas(noteElement).then(canvas => {
        // Create an <a> element to trigger the download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'note.png'; // You can customize the file name
        link.click();
    });
}

// Function to load notes from local storage
function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteGrid = document.getElementById('note-grid');
    noteGrid.innerHTML = ''; // Clear the grid before adding notes

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.id = note.id; // Use saved ID

        // Optional label for notes
        if (note.label) {
            const noteLabel = document.createElement('div');
            noteLabel.className = 'note-label';
            noteLabel.innerText = note.label;
            noteCard.appendChild(noteLabel);
        }

        // Note content
        const noteContent = document.createElement('div');
        noteContent.className = 'note-content';
        noteContent.innerText = note.text;
        noteCard.appendChild(noteContent);

        // Create save button
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save Note';
        saveButton.onclick = function() {
            saveNoteAsImage(noteCard);
        };
        noteCard.appendChild(saveButton);

        // Append note card to the grid
        noteGrid.appendChild(noteCard);
        makeDraggable(noteCard);

        // Debugging
        console.log(`Loaded note with ID ${noteCard.id}:`, note);
    });
}

// Function to make an element draggable
function makeDraggable(element) {
    let offsetX, offsetY, isDragging = false;

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            element.style.position = 'absolute';
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// Load notes from local storage when the window loads
window.onload = function() {
    document.getElementById('note-label').value = '';
    loadNotesFromLocalStorage();
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || '';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
});

document.getElementById('toggle-theme').addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? '' : 'dark';
    document.body.setAttribute('data-theme', newTheme);

    // Save the selected theme to localStorage
    localStorage.setItem('theme', newTheme);

    // Update the icon based on the new theme
    updateThemeIcons(newTheme);
});

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        document.getElementById('sun-icon').style.opacity = '0';
        document.getElementById('moon-icon').style.opacity = '1';
    } else {
        document.getElementById('sun-icon').style.opacity = '1';
        document.getElementById('moon-icon').style.opacity = '0';
    }
}

// Load the saved theme when the page loads
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    loadNotesFromLocalStorage();
};
