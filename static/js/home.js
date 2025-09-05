const buttons = [["Wallet","/wallet"], ["Market","/markets"], ["Bots","/bots"]];

function renderButtons() {
  const container = document.getElementById('buttonContainer');
  container.innerHTML = ''; // Clear existing buttons
  buttons.forEach(buttonText => {
    const form = document.createElement('form');
    form.action = buttonText[1]
    form.method = "post"
    const button = document.createElement('button');
    button.type = "submit"
    form.appendChild(button)
    button.textContent = buttonText[0];
    button.id = "button_"+buttonText[0].toLowerCase()
    button.className = "header_buttons"
    container.appendChild(form);
  });
}

document.addEventListener('DOMContentLoaded', renderButtons);