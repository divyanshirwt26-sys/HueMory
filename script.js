// ==============================// HOME SCREEN // ==============================
const homeScreen = document.getElementById("homeScreen");
const moodScreen = document.getElementById("moodScreen");
const diaryScreen = document.getElementById("diaryScreen");
const followupScreen = document.getElementById("followupScreen");
const previewScreen = document.getElementById("previewScreen");
const memoriesScreen = document.getElementById("memoriesScreen");
// The Memory currently being created
let currentMemory = null;
let editingMemoryId = null;
let currentPhotoData = null;

const startReflectionButton =
    document.getElementById("startReflection");

const myMemoriesButton =
    document.getElementById("myMemories");

// Open Mood Selection
startReflectionButton.addEventListener("click", function () {
    resetReflection();
    homeScreen.classList.add("hidden");
    moodScreen.classList.remove("hidden");});

myMemoriesButton.addEventListener("click", function () {

    if (!db) {alert("The database is still loading. Please try again."); return;}
    homeScreen.classList.add("hidden");
    memoriesScreen.classList.remove("hidden");
    loadMemories();});

// ==============================// MOOD SELECTION // ==============================

const moodButtons =
    document.querySelectorAll(".mood-option");

const continueMoodButton =
    document.getElementById("continueMood");

const moodMessage =
    document.getElementById("moodMessage");

const backHomeButton =
    document.getElementById("backHome");

// Store selected moods
let selectedMoods = [];

// Select or deselect moods
moodButtons.forEach(function (button) {button.addEventListener("click", function () {const mood = button.dataset.mood;

// If mood is already selected, remove it
if (selectedMoods.includes(mood)) {selectedMoods =
    selectedMoods.filter(function (item) {return item !== mood;}); button.classList.remove("selected");}

// Otherwise add it
else {selectedMoods.push(mood); button.classList.add("selected");}

// Remove validation message
moodMessage.textContent = ""; console.log("Selected moods:", selectedMoods);});});

// Continue after selecting mood
continueMoodButton.addEventListener("click", function () {

// User must select at least one mood
    if (selectedMoods.length === 0) { moodMessage.textContent = "Please select at least one mood."; return;}

// Move to Diary Screen
    moodScreen.classList.add("hidden");
    diaryScreen.classList.remove("hidden");});

// Return to Home Screen
backHomeButton.addEventListener("click", function () {
    moodScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");});

// ==============================// DIARY ENTRY // ==============================

const diaryEntry =
    document.getElementById("diaryEntry");

const memoryPhoto =
    document.getElementById("memoryPhoto");

const photoMessage =
    document.getElementById("photoMessage");

const continueDiaryButton =
    document.getElementById("continueDiary");

const diaryMessage =
    document.getElementById("diaryMessage");

const backMoodButton =
    document.getElementById("backMood");

// ==============================// PHOTO READING // ==============================

function readSelectedPhoto() {
    const photo = memoryPhoto.files[0];
// No photo selected
    if (!photo) { currentPhotoData = null; return;}
    const reader = new FileReader();
    reader.onload = function (event) {currentPhotoData = event.target.result;}; reader.readAsDataURL(photo);}
memoryPhoto.addEventListener("change", function () {
    readSelectedPhoto();});

// Continue from Diary
continueDiaryButton.addEventListener("click", function () {
    const diaryText = diaryEntry.value.trim();

// Diary entry is required
    if (diaryText === "") { diaryMessage.textContent = "Please write something about your day before continuing."; return;}
    diaryMessage.textContent = "";

// ------------------------------// PHOTO VALIDATION // ------------------------------

const photo = memoryPhoto.files[0];
photoMessage.textContent = "";
if (photo) {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"];

// Check file type
    if (!allowedTypes.includes(photo.type)) {
    photoMessage.textContent = "Please choose a JPG, PNG or WEBP image.";return;}

// Maximum file size = 5 MB
    const maximumSize = 5 * 1024 * 1024;
    if (photo.size > maximumSize) {
    photoMessage.textContent = "Please choose an image smaller than 5 MB."; return;}}

// Use the first selected mood for the follow-up question
    const mainMood = selectedMoods[0];
    followupQuestion.textContent = moodQuestions[mainMood];

// Move to Follow-Up Screen
    diaryScreen.classList.add("hidden"); followupScreen.classList.remove("hidden");});

// Return to Mood Selection
backMoodButton.addEventListener("click", function () {
    diaryScreen.classList.add("hidden");
    moodScreen.classList.remove("hidden");});

// ==============================// FOLLOW-UP QUESTIONS // ==============================

const followupQuestion =
    document.getElementById("followupQuestion");

const followupAnswer =
    document.getElementById("followupAnswer");

const followupMessage =
    document.getElementById("followupMessage");

const continueFollowupButton =
    document.getElementById("continueFollowup");

const backDiaryButton =
    document.getElementById("backDiary");

// Questions for each mood
const moodQuestions = {
    Happy: "What made today special?",
    Calm: "What was your favourite moment?",
    Okay: "Did anything interesting happen today?",
    Tired: "What kept you busy today?",
    Difficult: "What made today difficult?"};

// Continue from Follow-Up
continueFollowupButton.addEventListener("click", function () {
    const answer = followupAnswer.value.trim();

// Follow-up answer is required
    if (answer === "") {followupMessage.textContent = "Please answer the question before continuing."; return;}
    followupMessage.textContent = "";

// First selected mood is used as the main mood
    const mainMood = selectedMoods[0];

// ------------------------------// AVATAR RESPONSE // ------------------------------

    avatarResponse.textContent = moodResponses[mainMood];

// ------------------------------// DATE // ------------------------------
    const today = new Date();
    previewDate.textContent = today.toLocaleDateString();

// ------------------------------// MOODS // ------------------------------

    previewMoods.innerHTML = "";
    selectedMoods.forEach(function (mood) {
        const moodLabel = document.createElement("span");
        moodLabel.textContent = mood;
        moodLabel.classList.add("preview-mood");
        previewMoods.appendChild(moodLabel);});

// ------------------------------// DIARY // ------------------------------

    previewDiary.textContent = diaryEntry.value.trim();

// ------------------------------// FOLLOW-UP // ------------------------------

    previewQuestion.textContent = followupQuestion.textContent;
    previewAnswer.textContent = answer;

// ------------------------------// OPTIONAL PHOTO // ------------------------------

if (currentPhotoData) {
    previewPhoto.src = currentPhotoData;
    previewPhotoContainer.classList.remove("hidden");}
else {previewPhotoContainer.classList.add("hidden");}

// Create the Memory object
currentMemory = {
    date: editingMemoryId !== null && currentMemory
        ? currentMemory.date
        : new Date().toISOString(),
    moods: [...selectedMoods],
    diary: diaryEntry.value.trim(),
    followupQuestion: followupQuestion.textContent, 
    followupAnswer: answer,
    photo: currentPhotoData};
console.log("Current Memory:", currentMemory);

// ------------------------------// OPEN PREVIEW// ------------------------------

    followupScreen.classList.add("hidden");
    previewScreen.classList.remove("hidden");});

// Return to Diary Screen
backDiaryButton.addEventListener("click", function () {
    followupScreen.classList.add("hidden");
    diaryScreen.classList.remove("hidden");});

// ==============================// MEMORY PREVIEW // ==============================

const avatarResponse =
    document.getElementById("avatarResponse");

const previewDate =
    document.getElementById("previewDate");

const previewMoods =
    document.getElementById("previewMoods");

const previewDiary =
    document.getElementById("previewDiary");

const previewQuestion =
    document.getElementById("previewQuestion");

const previewAnswer =
    document.getElementById("previewAnswer");

const previewPhotoContainer =
    document.getElementById("previewPhotoContainer");

const previewPhoto =
    document.getElementById("previewPhoto");

const editMemoryButton =
    document.getElementById("editMemory");

const saveMemoryButton =
    document.getElementById("saveMemory");

const backFollowupButton =
    document.getElementById("backFollowup");

// Avatar responses for each main mood
const moodResponses = {
    Happy:
        "It sounds like there were some lovely moments today. Keep this memory close!",
    Calm:
        "It sounds like today gave you some peaceful moments to remember.",
    Okay:
        "Everyday moments can still become meaningful memories.",
    Tired:
        "You made it through a busy day. Now this moment is part of your story.",
    Difficult:
        "Thank you for taking the time to reflect on your day."};

// Return to Follow-Up
backFollowupButton.addEventListener("click", function () {
    previewScreen.classList.add("hidden");
    followupScreen.classList.remove("hidden");});

// Edit the Memory
editMemoryButton.addEventListener("click", function () {

// If editing an existing saved Memory
    if (editingMemoryId !== null) {selectedMoods = [...currentMemory.moods];

// Restore diary
    diaryEntry.value = currentMemory.diary;

// Restore follow-up answer
    followupAnswer.value = currentMemory.followupAnswer;

// Restore mood button appearance
    moodButtons.forEach(function (button) {
            const mood = button.dataset.mood;
            if (selectedMoods.includes(mood)) { button.classList.add("selected");}
            else { button.classList.remove("selected");}});}
    previewScreen.classList.add("hidden");
    diaryScreen.classList.remove("hidden");});

// Saving will be implemented with IndexedDB next
saveMemoryButton.addEventListener("click", function () {
    if (currentMemory === null) {alert("There is no Memory to save."); return;}
    if (!db) {alert("The database is still loading. Please try again."); return;}
    saveMemoryToDatabase(currentMemory);});

// ==============================// INDEXEDDB // ==============================

let db;

// Open HueMory database
const databaseRequest =
    indexedDB.open("HueMoryDB", 1);

// Create database structure
databaseRequest.onupgradeneeded = function (event) {
    db = event.target.result;

    // Create Memories store
    if (!db.objectStoreNames.contains("memories")) {

        db.createObjectStore("memories", {keyPath: "id", autoIncrement: true});}};

// Database opened successfully
databaseRequest.onsuccess = function (event) {
    db = event.target.result; console.log("HueMory database opened successfully.");};

// Database error
databaseRequest.onerror = function () {
    console.error( "There was a problem opening the HueMory database.");};

// Save a Memory to IndexedDB
function saveMemoryToDatabase(memory) {
    const transaction = db.transaction(["memories"], "readwrite");
    const memoryStore = transaction.objectStore("memories");

    let request;
// ------------------------------// UPDATE EXISTING MEMORY // ------------------------------

    if (editingMemoryId !== null) {memory.id = editingMemoryId; request = memoryStore.put(memory);}

// ------------------------------// CREATE NEW MEMORY // ------------------------------

    else {request = memoryStore.add(memory);}

    request.onsuccess = function () {console.log("Memory saved successfully!");
    alert(editingMemoryId !== null
    ? "Your Memory has been updated! 💜"
    : "Your Memory has been saved! 💜");

// Reset editing state
    editingMemoryId = null;
    currentMemory = null;

// Open Memory Collection
    previewScreen.classList.add("hidden");
    memoriesScreen.classList.remove("hidden");
    loadMemories();};
    request.onerror = function () {console.error("Memory could not be saved.");};}

// ==============================// MEMORY COLLECTION // ==============================

const memoriesList =
    document.getElementById("memoriesList");
const emptyMemories =
    document.getElementById("emptyMemories");
const backFromMemoriesButton =
    document.getElementById("backFromMemories");
const newReflectionButton =
    document.getElementById("newReflection");

// ==============================// LOAD MEMORIES // ==============================

function loadMemories() {
// Clear old cards first
    memoriesList.innerHTML = "";
    const transaction =
        db.transaction(["memories"],"readonly");
    const memoryStore =
        transaction.objectStore("memories");
    const request =
        memoryStore.getAll();

    request.onsuccess = function () {
        const memories = request.result;

// No Memories saved
        if (memories.length === 0) { emptyMemories.classList.remove("hidden"); return;}

// Memories exist
        emptyMemories.classList.add("hidden");

// Newest Memories first
        memories.reverse();

// Create one card for every Memory
    memories.forEach(function (memory) { createMemoryCard(memory);});};
    request.onerror = function () {
        console.error("Could not load Memories.");};}

// ==============================// CREATE MEMORY CARD // ==============================

function createMemoryCard(memory) {
// Main card
    const card =
    document.createElement("article");
    card.classList.add("memory-card");

// Date
    const date =
    document.createElement("p");
    date.classList.add("memory-card-date");
    date.textContent =
        new Date(memory.date).toLocaleDateString();

// Mood container
    const moodsContainer =
        document.createElement("div");
    moodsContainer.classList.add("memory-card-moods");

// Create label for every selected mood
    memory.moods.forEach(function (mood) {
    const moodLabel =
        document.createElement("span");
        moodLabel.classList.add("memory-card-mood");
        moodLabel.textContent = mood;
        moodsContainer.appendChild(moodLabel);});

// Diary
    const diary =
    document.createElement("p");
    diary.classList.add("memory-card-diary");
    diary.textContent = memory.diary;

// Follow-up question
    const question =
        document.createElement("strong");
    question.textContent =
        memory.followupQuestion;

// Follow-up answer
    const answer =
        document.createElement("p");
    answer.textContent =
        memory.followupAnswer;

// ------------------------------// MEMORY CARD BUTTONS // ------------------------------

    const actions =
        document.createElement("div");
    actions.classList.add("memory-card-actions");

// View button
    const viewButton =
        document.createElement("button");
    viewButton.textContent =
        "View Memory";
    viewButton.classList.add("view-memory-button");
    viewButton.addEventListener("click",
function () { openSavedMemory(memory);});

// Delete button
    const deleteButton =
    document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add("delete-memory-button");

    deleteButton.addEventListener("click",
function () { deleteMemory(memory.id);});

    actions.appendChild(viewButton);
    actions.appendChild(deleteButton);


// Add everything to card
    card.appendChild(date);
    card.appendChild(moodsContainer);
    card.appendChild(diary);
    card.appendChild(question);
    card.appendChild(answer);
    card.appendChild(actions);


// Add card to Memory Collection
    memoriesList.appendChild(card);}


// ==============================// MEMORY COLLECTION NAVIGATION // ==============================

// Return to Home
backFromMemoriesButton.addEventListener("click",
function () {
memoriesScreen.classList.add("hidden");
homeScreen.classList.remove("hidden");});

// Start a fresh Reflection
newReflectionButton.addEventListener("click",
function () {
    resetReflection();
    memoriesScreen.classList.add("hidden");
    moodScreen.classList.remove("hidden");});

// ==============================// VIEW SAVED MEMORY // ==============================

function openSavedMemory(memory) {
// Store the selected Memory
    currentMemory = memory;
    editingMemoryId = memory.id;
    currentPhotoData = memory.photo || null;
// Date
    previewDate.textContent = new Date(memory.date).toLocaleDateString();

// Moods
    previewMoods.innerHTML = ""; memory.moods.forEach(function (mood) {
        const moodLabel =
        document.createElement("span");
        moodLabel.textContent = mood;
        moodLabel.classList.add("preview-mood");
        previewMoods.appendChild(moodLabel);});


// Diary
    previewDiary.textContent = memory.diary;

// Follow-up
    previewQuestion.textContent = memory.followupQuestion;
    previewAnswer.textContent = memory.followupAnswer;

// Avatar response
    const mainMood = memory.moods[0];
    avatarResponse.textContent = moodResponses[mainMood];

// Display saved photo if the Memory has one
if (memory.photo) {
    previewPhoto.src = memory.photo;
    previewPhotoContainer.classList.remove("hidden");}
else { previewPhotoContainer.classList.add("hidden");}

// Open Preview
    memoriesScreen.classList.add("hidden");
    previewScreen.classList.remove("hidden");}

// ==============================// DELETE MEMORY // ==============================

function deleteMemory(memoryId) {
    const confirmed = confirm( "Are you sure you want to delete this Memory?");
    if (!confirmed) { return;}
    const transaction =
        db.transaction(["memories"],"readwrite");

    const memoryStore =
        transaction.objectStore("memories");

    const request =
        memoryStore.delete(memoryId);

    request.onsuccess = function () {
        console.log("Memory deleted successfully.");

// Reload collection
loadMemories();};
    request.onerror = function () {
        console.error("Memory could not be deleted.");};}

// ==============================// RESET REFLECTION // ==============================

function resetReflection() {

// Clear stored reflection state
    selectedMoods = [];
    currentMemory = null;
    editingMemoryId = null;
    currentPhotoData = null;

// Clear selected mood buttons
    moodButtons.forEach(function (button) {button.classList.remove("selected");});

// Clear diary entry
    diaryEntry.value = "";

// Clear selected photo
    memoryPhoto.value = "";

// Clear follow-up answer
    followupAnswer.value = "";

// Clear validation messages
    moodMessage.textContent = "";
    diaryMessage.textContent = "";
    followupMessage.textContent = "";
    photoMessage.textContent = "";

// Hide previous photo preview
    previewPhotoContainer.classList.add("hidden");}

// ==============================// HOME NAVIGATION // ==============================

const homeButtons =
    document.querySelectorAll(".home-button");


homeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        moodScreen.classList.add("hidden");
        diaryScreen.classList.add("hidden");
        followupScreen.classList.add("hidden");
        previewScreen.classList.add("hidden");
        memoriesScreen.classList.add("hidden");

        homeScreen.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});