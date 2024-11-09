// A JavaScript web app to create a text highlighter based on a custom glossary with word lists loaded from external files

let scienceWords = [];
let tenHundredWords = [];
let wordLists = {};
let wordListsLoaded = false;

// Function to load JSON files
async function loadWordLists() {
  try {
    const tenHundredResponse = await fetch('tenHundredWords.json');
    if (!tenHundredResponse.ok) {
      throw new Error('Failed to load ten hundred word list');
    }
    const tenHundredData = await tenHundredResponse.json();
    tenHundredWords = tenHundredData.flatMap(entry => entry.map(w => w.toLowerCase()));
    console.log('Ten hundred words loaded:', tenHundredWords);

    // Load multiple science word lists
const wordListNamesResponse = await fetch('wordListIndex.json');
if (!wordListNamesResponse.ok) {
  throw new Error('Failed to load word list index');
}
const wordListNames = await wordListNamesResponse.json();
    for (const listName of wordListNames) {
      const response = await fetch(listName);
      if (response.ok) {
        const data = await response.json();
        wordLists[listName] = data.map(entry => entry.map(w => w.toLowerCase()));
        console.log(`${listName} loaded`);
      } else {
        console.warn(`Failed to load word list: ${listName}`);
      }
    }
    wordListsLoaded = true;
  } catch (error) {
    console.error('Error loading word lists:', error);
  }
}

// Function to check if a word is allowed
function isWordAllowed(word, selectedWordList) {
  const cleanedWord = word.replace(/-/g, ' ');
  const lowerWord = cleanedWord.toLowerCase().replace(/[^a-z0-9']/g, '');
  const strippedWord = lowerWord.endsWith("'s") ? lowerWord.slice(0, -2) : lowerWord;
  return selectedWordList.some(row => row.includes(strippedWord)) || tenHundredWords.includes(strippedWord);
}

// Function to highlight words not in the list
function highlightText(inputText, selectedWordList) {
  inputText = inputText.replace(/-/g, ' ');
  let words = inputText.split(/\s+/);
  let highlightedText = words.map(word => {
    if (!isWordAllowed(word, selectedWordList)) {
      return `<span style="text-decoration: underline; color: red;">${word}</span>`;
    }
    return word;
  }).join(" ");
  return highlightedText;
}

// Create HTML elements dynamically
function createInterface() {
  const container = document.createElement('div');
  container.style.fontFamily = 'Arial';
  container.style.padding = '20px';

  const title = document.createElement('h2');
  title.textContent = 'Science Explainer Text Editor';
  container.appendChild(title);

  const textarea = document.createElement('textarea');
  textarea.id = 'inputText';
  textarea.rows = 10;
  textarea.cols = 60;
  textarea.placeholder = 'Enter your text here...';
  textarea.addEventListener('input', updateHighlight); // Highlight as user types
  container.appendChild(textarea);

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

  const label = document.createElement('label');
  label.htmlFor = 'wordListSelect';
  label.textContent = 'Select a word list: ';
  container.appendChild(label);

  const wordListSelect = document.createElement('select');
  wordListSelect.id = 'wordListSelect';
  wordListSelect.addEventListener('change', updateHighlight);
  container.appendChild(wordListSelect);

  // Add options to the select element for each word list
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a word list';
  wordListSelect.appendChild(defaultOption);

  Object.keys(wordLists).forEach(listName => {
  const option = document.createElement('option');
  option.value = listName;
  option.textContent = listName;
  wordListSelect.appendChild(option);
});

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

  const cutoffInput = document.createElement('input');
  cutoffInput.type = 'number';
  cutoffInput.id = 'cutoff';
  cutoffInput.value = 248;
  cutoffInput.min = 1;
  cutoffInput.max = 248;
  cutoffInput.addEventListener('input', updateHighlight); // Update highlighting if cutoff changes
  container.appendChild(cutoffInput);

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

  const outputDiv = document.createElement('div');
  outputDiv.id = 'outputText';
  container.appendChild(outputDiv);

  container.appendChild(document.createElement('br'));

  const wordCountDiv = document.createElement('div');
  wordCountDiv.id = 'wordCount';
  container.appendChild(wordCountDiv);

  document.body.appendChild(container);
}

// Highlight function to update the display as user types
async function updateHighlight() {
  if (!wordListsLoaded) {
    await loadWordLists();
  }

  const selectedWordListName = document.getElementById("wordListSelect").value;
  if (!selectedWordListName || !wordLists[selectedWordListName]) {
    document.getElementById("outputText").innerHTML = '';
    document.getElementById("wordCount").innerHTML = '';
    return;
  }
  
  let inputText = document.getElementById("inputText").value;
  let cutoff = parseInt(document.getElementById("cutoff").value, 10);
  console.log('Cutoff value:', cutoff);
  let selectedWordList = wordLists[selectedWordListName].slice(0, cutoff);
  console.log('Selected word list:', selectedWordList);
  let outputText = highlightText(inputText, selectedWordList);
  document.getElementById("outputText").innerHTML = outputText;
  document.getElementById("wordCount").innerHTML = `Word count: ${inputText.split(/\s+/).filter(word => word.length > 0).length}`;
}

// Load word lists and create interface when the page loads
window.onload = () => {
  loadWordLists();
  createInterface();
};

// Note: This implementation assumes that the files `tenHundredWords.json` and multiple `scienceWords` files are accessible on the same server
// and contain arrays of words, including singular and plural forms where applicable. Make sure the JSON files are properly formatted.
