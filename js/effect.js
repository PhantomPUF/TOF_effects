
document.getElementById('backButton').addEventListener('click', () => {
    history.back();
});

const radios = document.querySelectorAll('input[type="radio"].lang');

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedValue = document.querySelector('input[name="lang"]:checked').value;
        loadlanguage(selectedValue);
    });
});

let data;

let effects = [];
let findedEffects = [];


class Effect {
  constructor(codeName, name, imgPath, localized_name, desc, localized_desc) {
    this.codeName = codeName;
    this.name = name;
    this.imgPath = imgPath;    
    this.localized_name = localized_name;
    this.desc = desc;
    this.localized_desc = localized_desc;    
  }

  createDiv() {
    const container = document.getElementById('container');

    const effectDiv =  document.createElement('div');
    effectDiv.className = 'effect';

    const img = document.createElement('img');
    img.className = "effect_icon";
    img.src = this.imgPath;
    effectDiv.appendChild(img);

    const localized_name = document.createElement('p');
    localized_name.className = "description";
    localized_name.innerHTML = this.localized_name;
    effectDiv.appendChild(localized_name);

    const codename = document.createElement('p');
    codename.className = "name";
    codename.innerHTML = this.codeName;
    effectDiv.appendChild(codename);

    const localized_desc = document.createElement('p');
    localized_desc.className = "details";
    localized_desc.innerHTML = this.localized_desc;;
    effectDiv.appendChild(localized_desc);

    container.appendChild(effectDiv);  
  }
}

function searchEffects(query) {
  const lowerQuery = query.toLowerCase();
  return effects.filter(effect => 
    effect.codeName.toLowerCase().includes(lowerQuery) ||
    effect.localized_name.toLowerCase().includes(lowerQuery) ||
    effect.localized_desc.toLowerCase().includes(lowerQuery)
  );
}

document.getElementById('searchInput').addEventListener('input', () => {
  const query = document.getElementById('searchInput').value;
  findedEffects = searchEffects(query);
  container.innerHTML = "";
  for (const effect of findedEffects) {
    effect.createDiv();
  }
})


async function loadData(filename) {
  showLoader();
  try {
      const response = await fetch(filename);
      data = await response.json();
      test();
      loadlanguage("en");
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
  }
  finally {
    hideLoader();
  }
}



function test() 
{
  const container = document.getElementById('container');
  data.forEach(item => {
    if (item.Rows) {
      Object.keys(item.Rows).forEach(key => {
      name = item.Rows[key].Name.Key;
      icon = getImgPath(item.Rows[key].Icon.AssetPathName.replace("/Game/Resources/",""));
      desc = item.Rows[key].Desc.Key;
      effect = new Effect(key, name, icon, "", desc, "");
      effects.push(effect);     
      
      effect.createDiv();

      });
    } 
    else {
      console.log("Нет свойства Rows");
    }
  });
}

function getImgPath(inputStr) {
  const lastDotIndex = inputStr.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${inputStr}.png`;
  }
  const filenameWithoutExt = inputStr.substring(0, lastDotIndex);
  const outputStr = `${filenameWithoutExt}.png`;
  return outputStr;
}


function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

async function loadlanguage(lang) {
  try {
      const response = await fetch(`Global/Game_${lang}.json`);
      languagejson = await response.json();
      buildIndex(languagejson);

      for (const effect of effects) {
        effect.localized_name = findValueByIndex(effect.name);
        effect.localized_desc = findValueByIndex(effect.desc);
      }

    container.innerHTML = "";
    const query = document.getElementById('searchInput').value;
    findedEffects = searchEffects(query);
    for (const effect of findedEffects) {
      effect.createDiv();
    }

  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
  }
}