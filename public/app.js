const loanForm = document.getElementById('loan-form');
const loansTable = document.getElementById('loans-table');
const loansBody = document.getElementById('loans-body');
const messageBox = document.getElementById('message-box');

const showMessage = (text, type = 'info') => {
  messageBox.textContent = text;
  messageBox.className = type === 'error' ? 'error' : 'success';
  setTimeout(() => {
    messageBox.textContent = '';
    messageBox.className = '';
  }, 4000);
};

const formatCurrency = (value) => `R${Number(value).toFixed(2)}`;

// summary removed from landing page; projections live on manage.html

const loadLoans = async () => {
  const response = await fetch('/api/loans');
  const loans = await response.json();
  loansBody.innerHTML = '';

  loans.forEach((loan) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${loan.firstName} ${loan.lastName}</td>
      <td>${formatCurrency(loan.amountBorrowed)}</td>
      <td>${formatCurrency(loan.interestAmount)}</td>
      <td>${formatCurrency(loan.totalDue)}</td>
      <td>${formatCurrency(loan.paidAmount)}</td>
      <td>${formatCurrency(loan.profit)}</td>
      <td>${new Date(loan.dateOfTransaction).toLocaleDateString()}</td>
      <td>${new Date(loan.returnDate).toLocaleDateString()}</td>
      <td class="${loan.isPaid ? 'status-paid' : 'status-pending'}">${loan.isPaid ? 'Paid' : 'Pending'}</td>
      <td>
        <div class="payment-row">
          <input type="number" step="0.01" min="0.01" placeholder="Payment" data-loan-id="${loan.id}" />
          <button data-pay-id="${loan.id}">Pay</button>
        </div>
      </td>
    `;

    loansBody.appendChild(row);
  });
};

loanForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loanForm);
  const data = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    amountBorrowed: Number(formData.get('amountBorrowed')),
    returnDate: formData.get('returnDate')
  };

  if (!data.firstName || !data.lastName || !data.amountBorrowed || !data.returnDate) {
    showMessage('Please fill all fields correctly.', 'error');
    return;
  }

  const response = await fetch('/api/loans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    showMessage(error.error || 'Unable to create loan.', 'error');
    return;
  }

  loanForm.reset();
  await loadLoans();
  showMessage('Loan recorded successfully.');
});

loansTable.addEventListener('click', async (event) => {
  if (event.target.matches('button[data-pay-id]')) {
    const loanId = event.target.dataset.payId;
    const input = event.target.closest('.payment-row').querySelector('input');
    const amount = parseFloat(input.value);
    if (!amount || amount <= 0) {
      showMessage('Enter a valid payment amount.', 'error');
      return;
    }

    const response = await fetch(`/api/loans/${loanId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      const error = await response.json();
      showMessage(error.error || 'Payment failed.', 'error');
      return;
    }

    input.value = '';
    await loadLoans();
    showMessage('Payment recorded successfully.');
  }
});

loadLoans();
