const body = document.querySelector("body");

// Function to create decorative hearts
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "fas fa-heart";
    heart.style.left = (Math.random() * 100) + "vw";
    heart.style.animationDuration = (Math.random() * 3) + 2 + "s";
    body.appendChild(heart);
}

// Revert to original creation interval
setInterval(createHeart, 100);

// Revert to original maximum number of hearts
setInterval(function () {
    const heartArr = document.querySelectorAll(".fa-heart");
    if (heartArr.length > 200) {
        heartArr[0].remove();
    }
}, 100);

// Function to make an element resizable
function makeResizable(element) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    element.appendChild(resizeHandle);

    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        element.style.width = (startWidth + e.clientX - startX) + 'px';
        element.style.height = (startHeight + e.clientY - startY) + 'px';
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

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

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '&times;'; // Cross icon
    deleteButton.onclick = function() {
        deleteNote(noteCard);
    };
    noteCard.appendChild(deleteButton);

    // Append the new note to the grid
    const noteGrid = document.getElementById('note-grid');
    noteGrid.appendChild(noteCard);

    // Make the new note draggable and resizable
    makeDraggable(noteCard);
    makeResizable(noteCard);

    // Save all notes to local storage
    saveAllNotesToLocalStorage();

    // Clear input fields
    document.getElementById('note-text').value = '';
    document.getElementById('note-label').value = '';
}

// Function to delete a note
function deleteNote(noteCard) {
    noteCard.remove();
    saveAllNotesToLocalStorage(); // Update local storage
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

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '&times;'; // Cross icon
        deleteButton.onclick = function() {
            deleteNote(noteCard);
        };
        noteCard.appendChild(deleteButton);

        // Append note card to the grid
        noteGrid.appendChild(noteCard);
        makeDraggable(noteCard);
        makeResizable(noteCard);

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
        element.classList.add('dragging'); // Add dragging class
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
        element.classList.remove('dragging'); // Remove dragging class
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// Load notes from local storage and theme settings when the window loads
window.onload = function() {
    loadNotesFromLocalStorage();
    const savedTheme = localStorage.getItem('theme') || '';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
};

// Handle theme toggling
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
