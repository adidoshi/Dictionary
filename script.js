// target elements
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = "f2288192-fc52-4318-897e-e5c1b6b1836c";
let notFound = document.querySelector('.notFound');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

// Button event -
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    //clear data-
    audioBox.innerHTML = "";
    notFound.innerText = "";
    defBox.innerText = "";

    // Get input data-
    let word = input.value;

    // Call API :get data
    if (word === '') {
        alert('Word is required');
        return;
    }
    getData(word);
})

// Fetch api -(https://dictionaryapi.com/api/v3)
async function getData(word) {
    loading.style.display = 'block';
    
    let url = `https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`

    const response = await fetch(url);
    const data = await response.json();

    // if empty
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerHTML = 'No result found';
        return;
    }

    // If result is suggestion
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = ' Did you mean';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add("suggested");
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        })
        return;
    }

    // Result found
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defBox.innerText = defination;

    // Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        renderSound(soundName);
    }
   // console.log(data);
}

function renderSound(soundName) {
    // https://media.merriam-webster.com/soundc11
    let subFolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);

}
