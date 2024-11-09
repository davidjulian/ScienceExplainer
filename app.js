// A JavaScript web app to create a text highlighter based on a custom glossary with word lists loaded from external files

let scienceWords = [];
let tenHundredWords = [];
let wordListsLoaded = false;

// Function to load JSON files
async function loadWordLists(selectedFile) {
  try {
    const scienceResponse = await fetch(selectedFile);
    const tenHundredResponse = await fetch('tenHundredWords.json');
    
    if (!scienceResponse.ok || !tenHundredResponse.ok) {
      throw new Error('Failed to load word lists');
    }
    
    const scienceData = await scienceResponse.json();
    scienceWords = scienceData.map(entry => entry.map(w => w.toLowerCase()));
    console.log('Science words loaded:', scienceWords);
    const tenHundredData = await tenHundredResponse.json();
    tenHundredWords = tenHundredData.flatMap(entry => entry.map(w => w.toLowerCase()));
    console.log('Ten hundred words loaded:', tenHundredWords);
    wordListsLoaded = true;
  } catch (error) {
    console.error('Error loading word lists:', error);
  }
}

// Function to check if a word is allowed
function isWordAllowed(word, scienceSubset) {
  const cleanedWord = word.replace(/-/g, ' ');
  const lowerWord = cleanedWord.toLowerCase().replace(/[^a-z0-9']/g, '');
  const strippedWord = lowerWord.endsWith("'s") ? lowerWord.slice(0, -2) : lowerWord;
  return scienceSubset.some(row => row.includes(strippedWord)) || tenHundredWords.includes(strippedWord);
}

// Function to highlight words not in the list
function highlightText(inputText, scienceSubset) {
  inputText = inputText.replace(/-/g, ' ');
  let words = inputText.split(/\s+/);
  let highlightedText = words.map(word => {
    if (!isWordAllowed(word, scienceSubset)) {
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

  const fileLabel = document.createElement('label');
  fileLabel.htmlFor = 'scienceFile';
  fileLabel.textContent = 'Select science word list: ';
  container.appendChild(fileLabel);

  const fileSelect = document.createElement('select');
  fileSelect.id = 'scienceFile';
  ['scienceWords.json', 'scienceWords2.json', 'scienceWords3.json'].forEach(fileName => {
    const option = document.createElement('option');
    option.value = fileName;
    option.textContent = fileName;
    fileSelect.appendChild(option);
  });
  fileSelect.addEventListener('change', () => {
    wordListsLoaded = false;
    updateHighlight();
  });
  container.appendChild(fileSelect);

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createElement('br'));

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
  label.htmlFor = 'cutoff';
  label.textContent = 'Cutoff number for science list: ';
  container.appendChild(label);

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
    const selectedFile = document.getElementById('scienceFile').value;
    await loadWordLists(selectedFile);
  }
  
  let inputText = document.getElementById("inputText").value;
  let cutoff = parseInt(document.getElementById("cutoff").value, 10);
  console.log('Cutoff value:', cutoff);
  let scienceSubset = scienceWords.slice(0, cutoff);
  console.log('Science subset:', scienceSubset);
  let outputText = highlightText(inputText, scienceSubset);
  document.getElementById("outputText").innerHTML = outputText;
  document.getElementById("wordCount").innerHTML = `Word count: ${inputText.split(/\s+/).filter(word => word.length > 0).length}`;
}

// Load word lists and create interface when the page loads
window.onload = () => {
  loadWordLists('scienceWords.json');
  createInterface();
};

// Note: This implementation allows the user to select between multiple science word lists using a dropdown menu.
