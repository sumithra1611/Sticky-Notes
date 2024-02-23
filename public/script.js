
function sync() {

  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  })
  .then(async (res) => {
    const data = await res.json();
    console.log(data);
  });
}

function display() {
  const popupContainer = document.createElement("div");
  popupContainer.innerHTML = `
    <div id ="popupContainer">
        <h1>New Note</h1>
        <textarea id ="note-text" placeholder="Enter your note..."></textarea>
        <div id ="btn-container">
            <button id="submitBtn" onclick ="createNote()">Create Note</button>
            <button id="closeBtn" onclick ="closePopup()">Close</button>
        </div>   
    </div>
    `;
  document.body.appendChild(popupContainer);
}

function closePopup() {
  const popupContainer = document.getElementById("popupContainer");
  if (popupContainer) {
    popupContainer.remove();
  }
}

function createNote() {
  const popupContainer = document.getElementById("popupContainer");
  const noteText = document.getElementById("note-text").value;
  if (noteText.trim() !== "") {
    const note = {
      id: new Date().getTime(),
      text: noteText,
    };
    const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    existingNotes.push(note);
    localStorage.setItem("notes", JSON.stringify(existingNotes));
    popupContainer.remove();
    add(note);
  }
}

function fill() {
  const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
  existingNotes.forEach((note) => {
    add(note);
  });
}

function add(note) {
  const div = document.createElement("div");
  div.classList.add("note");
  div.innerHTML = `
        <p>${note.text}</p>
        <div id ="btn-container">
            <button id="editBtn" onclick ="displayEdit(${note.id})">edit Note</button>
            <button id="deleteBtn" onclick ="deleteNote(${note.id})">delete</button>
        </div>
    `;
  div.id = note.id;
  document.querySelector("#container").append(div);
}

function deleteNote(id) {
  const array = JSON.parse(localStorage.getItem("notes")) || [];
  const newArray = array.filter((note) => note.id != id);
  localStorage.setItem("notes", JSON.stringify(newArray));
  document.getElementById(id).remove();
}

function displayEdit(id) {
  const popupContainer = document.createElement("div");
  const text = document.getElementById(id).querySelector("p").textContent;

  popupContainer.innerHTML = `
    <div id ="popupContainer">
        <h1>Edit Note</h1>
        <textarea id ="note-text" placeholder="Enter your note...">${text}</textarea>
        <div id ="btn-container">
            <button id="submitBtn" onclick ="saveNote(${id})">Save Note</button>
            <button id="closeBtn" onclick ="closePopup()">Close</button>
        </div>   
    </div>
    `;
  document.body.appendChild(popupContainer);
}

function saveNote(id) {
  const array = JSON.parse(localStorage.getItem("notes"));
  const newNote = document.getElementById("note-text").value;
  array.forEach((note, i) => {
    if (note.id == id) {
      array[i].text = newNote;
    }
  });
  localStorage.setItem("notes", JSON.stringify(array));
  document.getElementById(id).querySelector("p").textContent = newNote;
  closePopup();
}
