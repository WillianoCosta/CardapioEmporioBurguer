let cart = [];
let selectedTable = null;
let paymentMethod = null;

function selectTable(tableNumber) {
  selectedTable = tableNumber;
  document.getElementById("table-title").textContent = `Mesa ${tableNumber}`;
  document.getElementById("confirmation-msg").textContent = "Faça o pedido!";
  const buttons = document.querySelectorAll(".table-btn");
  buttons.forEach(button => button.style.display = "none");
}

function addToCart(item, price) {
  const existingItem = cart.find(cartItem => cartItem.name === item);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: item, price, quantity: 1 });
  }
  updateCart();

  // Exibe a mensagem animada de produto adicionado
  const notification = document.getElementById("notification");
  notification.textContent = `${item} adicionado ao carrinho!`;
  notification.classList.remove("hidden");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hidden");
  }, 2000);
}


function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} - R$${(item.price * item.quantity).toFixed(2)}
      <div class="adjust-buttons">
        <button class="adjust-btn plus-btn" onclick="adjustQuantity(${index}, 1)">+</button>
        <button class="adjust-btn minus-btn" onclick="adjustQuantity(${index}, -1)">-</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItems.appendChild(li);
  });

  const totalElement = document.getElementById("cart-total");
  if (!totalElement) {
    const totalDiv = document.createElement("div");
    totalDiv.id = "cart-total";
    totalDiv.textContent = `Total: R$${total.toFixed(2)}`;
    document.getElementById("cart").appendChild(totalDiv);
  } else {
    totalElement.textContent = `Total: R$${total.toFixed(2)}`;
  }
}

function adjustQuantity(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Remove o item se a quantidade for 0
  }
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1); // Remove o item do carrinho
  updateCart();
}

function selectPayment(method) {
  paymentMethod = method;
  const paymentInfo = document.getElementById("payment-info");
  paymentInfo.innerHTML = "";
  if (method === "dinheiro") {
    paymentInfo.innerHTML = `<label>Troco pra quanto?</label><input id="cash-input" type="number" placeholder="Ex: 100">`;
  } else if (method === "cartão") {
    paymentInfo.textContent = "Leve a maquininha à mesa do cliente ou peça-o para comparecer ao balcão para efetuar o pagamento!";
  } else if (method === "pix") {
    paymentInfo.textContent = "Passe a chave pix 5584996239839 para o cliente efetuar o pagamento e envie o comprovante para confirmação!";
  }
}

function sendOrder() {
  const cashInput = document.getElementById("cash-input");
  let trocoInfo = "";
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (paymentMethod === "dinheiro" && cashInput) {
    const cash = parseFloat(cashInput.value);
    const troco = cash - total;
    trocoInfo = `Valor a pagar: R$${cash}, Troco: R$${troco.toFixed(2)}`;
  }

  const message = `
Mesa: ${selectedTable}
Pedido: ${cart.map(item => `${item.name} x${item.quantity}`).join(", ")}
Forma de pagamento: ${paymentMethod}
Total: R$${total.toFixed(2)}
${trocoInfo}
  `;

  // Abre o WhatsApp com a mensagem
  window.open(`https://wa.me/5584996239839?text=${encodeURIComponent(message)}`);

  // Limpa o carrinho
  cart = [];
  updateCart(); // Atualiza a interface do carrinho

  // Mostra uma mensagem de confirmação ao usuário
  document.getElementById("confirmation-msg").textContent = "Pedido enviado com sucesso! O carrinho foi limpo. Atualize a página para realizar um novo pedido!";
}

document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    const target = link.getAttribute('data-category');

    // Remove a classe 'active' de todas as categorias
    document.querySelectorAll('.category').forEach(category => {
      category.classList.remove('active');
    });

    // Adiciona a classe 'active' à categoria selecionada
    const categoryToShow = document.getElementById(target);
    if (categoryToShow) {
      categoryToShow.classList.add('active');
    }
  });
});
