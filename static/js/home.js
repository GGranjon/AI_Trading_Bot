const buttons = ["Wallet", "Market", "Bots"];

function renderButtons() {
  const container = document.getElementById('buttonContainer');
  container.innerHTML = ''; // Clear existing buttons
  buttons.forEach(buttonText => {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.id = "button_"+buttonText.toLowerCase()
    button.className = "header_buttons"
    container.appendChild(button);
  });
}

document.addEventListener('DOMContentLoaded', renderButtons);