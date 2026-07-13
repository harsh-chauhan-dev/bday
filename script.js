  // Confetti generator
  const emojis = ['🎉','🎂','😂','🥳','🎈','✨','🍰','💀','🔥'];
  const container = document.getElementById('confetti-container');

  function dropConfetti(count){
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'confetti';
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.left = Math.random()*100 + 'vw';
      const duration = 3 + Math.random()*3;
      el.style.animationDuration = duration + 's';
      el.style.animationDelay = (Math.random()*2) + 's';
      container.appendChild(el);
      setTimeout(()=> el.remove(), (duration+2)*1000);
    }
  }
  dropConfetti(35);
  setInterval(()=> dropConfetti(6), 2500);

  // Countdown to next July 14
  function updateCountdown(){
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 6, 14, 0, 0, 0); // July is month 6
    if(now > target){
      target = new Date(year+1, 6, 14, 0, 0, 0);
    }
    const diff = target - now;

    const mainEl = document.getElementById('countdownMain');
    const textEl = document.getElementById('countdownText');

    if(diff <= 0){
      mainEl.textContent = "IT'S TODAY 🎂🎉";
      textEl.textContent = "Go bother him NOW.";
      return;
    }

    const days = Math.floor(diff/(1000*60*60*24));
    const hours = Math.floor((diff/(1000*60*60))%24);
    const mins = Math.floor((diff/(1000*60))%60);
    const secs = Math.floor((diff/1000)%60);

    if(days === 0){
      mainEl.textContent = `${hours}h ${mins}m ${secs}s`;
      textEl.textContent = "left till the menace turns a year older 🔥";
    } else {
      mainEl.textContent = `${days}d ${hours}h ${mins}m`;
      textEl.textContent = "left to plan how bad the roast will be";
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Roast generator
  const roasts = [
    "21 and still can't parallel park. Legend behavior. 🚗💥",
    "Aged like fine milk — went bad but nobody told him. 🥛",
    "Still owes half the group money from that one trip. 💸",
    "Certified overthinker, professional procrastinator. 🧠",
    "His WiFi password is more consistent than his sleep schedule. 📶",
    "21 years old, 5 years of maturity. Steady growth. 📈",
    "Plot twist: he's the reason the group chat is never boring. 😂",
    "Officially old enough to know better, still chooses chaos. 🎭"
  ];

  function roast(){
    const output = document.getElementById('roastOutput');
    const pick = roasts[Math.floor(Math.random()*roasts.length)];
    output.textContent = "🎯 " + pick;
    dropConfetti(15);
  }
