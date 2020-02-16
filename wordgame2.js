//globals
let difficulty = 1;
let score = 0;
let time = 5000;
let extraTime = 0;
let timeStamp = time;
let timeElapsed = 0;
let completionTime;
let startTime;
let enteredWordsArr = [];
let users = [];
let league;
// labels & indicators
const word = document.querySelector(".word");
const timeDisplay = document.querySelectorAll(".time-left");
const userDisplay = document.querySelector(".display-user");
const scoreDisplay = document.querySelector(".score");
const message = document.querySelector("#message");
const timeMeter = document.querySelector(".time-meter");
// inputs
const uname = document.querySelector(".username-field");
const enteredWord = document.querySelector("#input-text");
// buttons
const submitUser = document.querySelector(".sumbit-user-btn");
const startButton = document.querySelector(".start-button");
const lbContinue = document.querySelector(".leaderboard-continue");
const lbReset = document.querySelector(".leaderboard-reset");
// overlays
const inputOverlay = document.querySelector(".user-input");
const leaderboardOverlay = document.querySelector(".leaderboard");
const options = document.querySelector(".options");
const menu = document.querySelector(".settings-menu");
// others
const tbody = document.querySelector("tbody");
const lbIcon = document.querySelector(".leaderboard-icon");
const stIcon = document.querySelector(".settings-icon");
const modes = document.querySelectorAll("[name='difficulty']");
const bubble = document.querySelector(".bubble");
const target = document.querySelector(".msg");
let MODE;

modes.forEach(mode => {
  mode.addEventListener("change", () => {
    // console.log("works" + mode.value);
    difficulty = parseInt(mode.value);
    getPlayersGroup();
    MODE = getDifficultMode();
    console.log(MODE);
  });
});

const getDifficultMode = () => {
  switch (difficulty) {
    case 1:
      return "Easy";
    case 3:
      return "Normal";
    case 5:
      return "Hard";
    case 9:
      return "Extreme";
    default:
      return "an error has occured.";
  }
};

const getPlayersGroup = () => {
  users = [];
  league = localStorage.getItem("USERS");
  if (league) {
    league = JSON.parse(league);
    console.log(difficulty);
    const item = league.find(e => e.difficulty == difficulty);
    if (item) {
      console.log("item found");
      console.log({ ...item });
      users = [...item.users];
      console.log(users);
    } else {
      console.log("league exist but diff mode doesn't exist");
      console.log(league);
    }
  } else {
    console.log("league doesn't exist hence user group doesn't exist either");
    users = [];
    league = [];
  }
};

window.addEventListener("DOMContentLoaded", () => {
  //load data from the localStorage
  getPlayersGroup();
});

//dynamically create bubbles when extra time is accquired.
const showExtraTimeBubble = () => {
  let formatET = extraTime / 1000;
  formatET = formatET.toFixed(2);
  const bbl = document.createElement("div");
  bbl.classList.add(
    "badge",
    "bubble",
    "badge-danger",
    "position-absolute",
    "bubble-up"
  );
  bbl.style.cssText = "top:-100%;right:20%;height:100%;width:50px;color:white;";
  bbl.innerHTML = "+" + formatET;
  timeDisplay[0].appendChild(bbl);
  target.insertBefore(bbl, timeDisplay[0]);
  setTimeout(() => {
    target.removeChild(bbl);
  }, 3000);
};

lbIcon.addEventListener("click", () => {
  leaderboardOverlay.classList.remove("d-none");
  users.forEach(u => console.log(u));
  generateLB(users);
  console.log("icon clicked " + [...users]);
  console.log(users);
});

stIcon.addEventListener("click", e => {
  e.target.style.transform += "rotate(90deg)";
  menu.classList.toggle("show");
});

uname.addEventListener("keyup", e => {
  if (e.target.value.match(/^[\w]{3,}/)) {
    submitUser.removeAttribute("disabled");
  } else {
    submitUser.setAttribute("disabled", "true");
  }
});

const resetGlobals = () => {
  time = 5000;
  score = 0;
  extraTime = 0;
  enteredWord.value = "";
  completionTime = 0;
  startTime = 0;
  timeStamp = time;
  getTime();
  renderTimeMeter(time, timeStamp);
  scoreDisplay.innerHTML = 0;
  message.innerHTML = "press start to play!";
  enteredWordsArr = [];
  uname.value = "";
  const trs = document.querySelectorAll("tbody tr");
  if (trs && trs.length) {
    trs.forEach(tr => {
      tbody.removeChild(tr);
    });
  }
};

lbContinue.addEventListener("click", () => {
  leaderboardOverlay.classList.add("d-none");
  resetGlobals();
});

lbReset.addEventListener("click", () => {});

startButton.addEventListener("click", () => {
  inputOverlay.classList.remove("d-none");
});

const renderTimeMeter = (availableTime, totaltime) => {
  let d = (availableTime / totaltime) * 100;
  d = Math.floor(d);
  if (d <= 40) timeMeter.style.backgroundColor = "firebrick";
  else timeMeter.style.backgroundColor = "seagreen";
  timeMeter.style.width = d + "%";
};

submitUser.addEventListener("click", () => {
  inputOverlay.classList.add("d-none");
  userDisplay.innerHTML = uname.value;
  startButton.setAttribute("disabled", "true");
  let countdown = 3;
  const timeout = setInterval(() => {
    message.innerHTML = "<h1> - " + countdown + " - </h1>";
    countdown -= 1;
    if (countdown === 0) {
      message.innerHTML = "Good Luck!";
      clearInterval(timeout);
      enteredWord.setAttribute("autofocus", "true");
    }
  }, 1000);
  setTimeout(() => {
    init();
  }, 3000);
  // init();
});

const wordArr = [
  "can",
  "lan",
  "wan",
  "earth",
  "apple",
  "cloud",
  "disks",
  "floppy",
  "create",
  "prevail",
  "satisfy",
  "computer",
  "command",
  "cache",
  "generation",
  "technology",
  "information",
  "delligence",
  "intelligence",
  "virtualization",
  "microprocessing",
  "distribution",
  "rom",
  "confetti",
  "pompeii",
  "cryogonal",
  "haphazardly",
  "extraterrestrials",
  "chlorophyll",
  "ffjisdofjsodifdwdndsaodjaoidsdasiojdasoijd",
  "abcdefghijklmnopqrstuvwxyz",
  "abcdefghjklmnopqrtuvwxyz",
  "javascript",
  "specializations",
  "generalizations",
  "creativity",
  "cannonical",
  "visualization",
  "motherboard",
  "auxillary"
];

const praises = [
  "Good!",
  "Spot On!",
  "Cool!",
  "Noice!",
  "You are genius",
  "Whoa :O",
  "Oh my Gawd!"
];

const grabWord = () => {
  startTime = timeElapsed;
  const limits = wordArr
    .filter(word => word.length >= difficulty && word.length <= difficulty + 2)
    .sort((a, b) => a.length - b.length);
  // console.log(limits);

  let getWord;
  do {
    getWord = limits[Math.floor(Math.random() * limits.length)];
  } while (getWord === undefined);
  word.innerHTML = getWord;
};

const updateScore = () => {
  const delta =
    difficulty *
    word.innerHTML.length *
    (1 / (completionTime - startTime)) *
    900;
  score += delta;
  console.log(delta);
  scoreDisplay.innerHTML = score.toFixed(2);
};

const updateTime = () => {
  const duration = completionTime - startTime;
  extraTime =
    (timeElapsed * 1000) / (time + word.innerHTML.length + 0.1 * timeElapsed) +
    (time + 0.5 * word.innerHTML.length) / (0.8 * duration);

  time += extraTime;
  showExtraTimeBubble();
  timeDisplay.forEach(disply => (disply.innerHTML = (time / 1000).toFixed(2)));
  return time;
};

const getTime = () => {
  if (time < 3000) {
    timeDisplay[0].classList.replace("text-success", "text-danger");
  } else {
    timeDisplay[0].classList.replace("text-danger", "text-success");
  }
  timeDisplay.forEach(disply => (disply.innerHTML = (time / 1000).toFixed(2)));
};

const MatchWord = (wordTomatchAgainst, typedword) => {
  if (wordTomatchAgainst === typedword) return true;
  return false;
};

const getPraise = arr => {
  message.innerHTML = arr[Math.floor(Math.random() * arr.length)];
};

//dynamically generate tr elements for leaderboard
const generateLB = users => {
  users.forEach((u, pos) => {
    let title;
    if (pos === 0) title = "gold";
    if (pos === 1) title = "silver";
    if (pos === 2) title = "bronze";
    const tr = document.createElement("tr");
    if (u.name === uname.value) {
      tr.classList.add("bg-danger");
    }
    for (const i in u) {
      const td = document.createElement("td");
      if (title && i === "rank") {
        const img = document.createElement("img");
        img.setAttribute("src", `./images/${title}-medal.png`);
        img.setAttribute("height", "40");
        img.setAttribute("width", "40");
        td.appendChild(img);
      } else {
        td.innerHTML = u[i];
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  });
};

const init = () => {
  message.innerHTML = "Good Luck!";
  enteredWord.removeAttribute("disabled");
  enteredWord.setAttribute("autofocus", "true");
  options.setAttribute("disabled", "true");
  options.style.display = "none";
  grabWord();
  let t = setInterval(() => {
    if (time <= 0) {
      const mode = [...modes].find(mode => mode.checked);
      difficulty = parseInt(mode.value);
      options.style.display = "block";
      timeMeter.style.width = 0 + "%";
      let utility = 0;
      getTime();
      startButton.removeAttribute("disabled");
      clearInterval(t);
      enteredWord.setAttribute("disabled", "true");
      message.innerHTML = "Game Over :(";
      leaderboardOverlay.classList.remove("d-none");
      //time utilization
      enteredWordsArr.forEach(ewr => {
        utility += ewr.duration;
      });
      const utilization = (utility / timeElapsed) * 100;
      timeElapsed = 0;
      const wordCount = enteredWordsArr.length;

      const user = {
        rank: "-",
        name: uname.value,
        score: score.toFixed(2),
        utilization: utilization.toFixed(2) + "%",
        words: wordCount
      };
      if (league.length && users.length) {
        const prevUser = users.findIndex(usr => usr.name === uname.value);
        if (prevUser === -1) users.push(user);
        else {
          +users[prevUser].score < +user.score ? users.push(user) : null;
        }
        users = users
          .sort((u1, u2) => parseFloat(u2.score) - parseFloat(u1.score))
          .map((user, i) => {
            user.rank = i + 1;
            return user;
          });
        const index = league.findIndex(lg => lg.difficulty === difficulty);
        if (index !== -1) {
          league[index].users = users;
        } else {
          league.push({ difficulty, users });
        }
        localStorage.setItem("USERS", JSON.stringify(league));
        generateLB(users);
      } else {
        users.push(user);
        league.push({ difficulty, users });
        localStorage.setItem("USERS", JSON.stringify(league));
        generateLB(users);
      }
    } else {
      timeElapsed += 1;
      time -= 4;
      getTime();
    }
  }, 1);
  let rtm = setInterval(() => {
    renderTimeMeter(time, timeStamp);
    if (time <= 0) {
      clearInterval(rtm);
    }
  }, 100);
};

const getLongestWord = arr => arr.sort((a, b) => b.length - a.length);

enteredWord.addEventListener("keydown", e => {
  if (e.target.value && e.keyCode === 13) {
    if (MatchWord(word.innerHTML, e.target.value)) {
      completionTime = timeElapsed;
      if (difficulty <= getLongestWord(wordArr)[0].length) {
        difficulty += 0.2;
      }
      let eword = {
        id: "#" + (10 + Math.random() * 89).toFixed(7).split(".")[0],
        word: word.innerHTML,
        duration: completionTime - startTime
      };
      enteredWordsArr.push(eword);
      enteredWord.value = "";
      getPraise(praises);
      updateScore();
      timeStamp = updateTime();
      grabWord();
    }
  }
});
