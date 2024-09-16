const body = document.querySelector("body");

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "fas fa-heart";
    heart.style.left = (Math.random() * 100)+"vw";
    heart.style.animationDuration = (Math.random()*3)+2+"s"
    body.appendChild(heart);
}
setInterval(createHeart,100);
setInterval(function name(params) {
    var heartArr = document.querySelectorAll(".fa-heart")
    if (heartArr.length > 200) {
       heartArr[0].remove()
    }
    //console.log(heartArr);
},100)


//add method to take input and store it push it on the database

function createNoteBox() {
    const noteContainer = document.getElementById('note-container');
    const noteBox = document.createElement('div');
    noteBox.classList.add('note-box');
    
    // Header for dragging
    const noteHeader = document.createElement('div');
    noteHeader.classList.add('note-header');
    noteHeader.innerText = 'Drag Me';

    // Textarea for content
    const noteContent = document.createElement('textarea');
    noteContent.classList.add('note-content');
    noteContent.placeholder = 'Write your note here...';

    // Append header and content to the note box
    noteBox.appendChild(noteHeader);
    noteBox.appendChild(noteContent);
    noteContainer.appendChild(noteBox);

    // Enable dragging
    makeDraggable(noteBox);
}

function makeDraggable(element) {
    let offsetX, offsetY;

    element.querySelector('.note-header').addEventListener('mousedown', function (e) {
        // Get the current mouse position
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

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

    // Optional label for notes
    if (noteLabelText.trim() !== '') {
        const noteLabel = document.createElement('div');
        noteLabel.className = 'note-label';
        // Append an emoji to the label text
        noteLabel.innerText = `${noteLabelText} 🎀`; // You can change the emoji here
        noteCard.appendChild(noteLabel);
    }

    // Note content
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.innerText = noteText;
    noteCard.appendChild(noteContent);

    //Create save button

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save Note';
    saveButton.onclick = function(){
        saveNoteAsImage(noteCard);
    };
    noteCard.appendChild(saveButton)

    // Append the new note to the grid
    const noteGrid = document.getElementById('note-grid');
    noteGrid.appendChild(noteCard);

    // Clear input fields
    document.getElementById('note-text').value = '';
    document.getElementById('note-label').value = '';
}

// Function to save note as image
function saveNoteAsImage(noteElement) {
    html2canvas(noteElement).then(canvas => {
        // Create an <a> element to trigger the download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'note.png'; // You can customize the file name
        link.click();
    });
}

// Function to login?
