let globalUsers = [];
let globalUsersFiltered = [];

async function start() {
  await fetchUsers();
  configBusca();
  render();
}

async function fetchUsers() {
  const resource = await fetch('http://localhost:3100/users');
  const json = await resource.json();

  globalUsers = json.map(({ name, picture, dob, gender }) => {
    return {
      userName: `${name.first} ${name.last}`, 
      userPicture: picture.large, 
      userAge: dob.age, 
      userGender: gender, 
    }; 
  });
  globalUsers.sort((a, b) => a.userName.localeCompare(b.userName));
  globalUsersFiltered = [...globalUsers];
}

function render() {
  showUsers();
  showStats();
}

function showUsers() {
  const divUsers = document.querySelector('#users');
  divUsers.innerHTML = `
  <ul>
    ${globalUsersFiltered.map(({ userName, userPicture, userAge }) => {
      return `
          <li>
            <div class='flex-row'>
              <img class='avatar' src='${userPicture}' alt='${userName}' />
              <span>${userName}, ${userAge} anos</span>
            </div>
          </li>
      `;
    }).join('')}
  </ul>
  `;

  const spanCountFoundUsers = document.querySelector('#countFoundUsers');
  spanCountFoundUsers.textContent = globalUsersFiltered.length;
}

function showStats() {
  sumAndAvgAges();
  countMF();
}

function sumAndAvgAges() {
  const totalAges = globalUsersFiltered.reduce((acc, cur) => {
    return acc + cur.userAge;
  }, 0);

  const averageAge = totalAges / globalUsersFiltered.length;

  const spanSumAge = document.querySelector('#sumAge');
  spanSumAge.textContent = totalAges;
  const spanAvgAge = document.querySelector('#avgAge');
  spanAvgAge.textContent = averageAge;
}

function countMF() {
  const maleUsers = globalUsersFiltered.filter(user => {
    return user.userGender === 'male'
  })
  const spanCountM = document.querySelector('#countM');
  spanCountM.textContent = maleUsers.length;

  const femaleUsers = globalUsersFiltered.filter(user => { 
    return user.userGender === 'female'
  })
  const spanCountF = document.querySelector('#countF');
  spanCountF.textContent = femaleUsers.length;
}

function configBusca() {
  const buttonBusca = document.querySelector('#buttonBusca');
  buttonBusca.addEventListener('click', handleButtonClick);
  const inputBusca = document.querySelector('#inputBusca');
  inputBusca.addEventListener('keyup', handleFilterKeyUp);
}

function handleButtonClick() {
  const inputBusca = document.querySelector('#inputBusca');
  const buscaValue = inputBusca.value.toLowerCase().trim();
  globalUsersFiltered = globalUsers.filter((item) => {
    return item.userName.toLowerCase().includes(buscaValue);
  });
  render();
}

function handleFilterKeyUp({ key }) {
  // const { key } = event; 
  if (key != 'Enter') {
    return;
  }
  handleButtonClick();
}

start(); 
