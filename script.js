const form = document.getElementById('report-form');
const submitBtn = document.getElementById('submit-btn');
const reportContainer = document.getElementById('report-container');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const accountNumber = document.getElementById('account-number').value;
  const reportType = document.getElementById('report-type').value;
  fetch('/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountNumber, reportType }),
  })
    .then((response) => response.json())
    .then((data) => {
      reportContainer.innerHTML = '';
      reportContainer.innerHTML = `<h2>Report for Account ${accountNumber}</h2>`;
      if (reportType === 'transaction') {
        reportContainer.innerHTML += `<p>Transactions:</p><ul>${data.transactions.map((transaction) => `<li>${transaction.date} - ${transaction.amount}</li>`).join('')}</ul>`;
      } else if (reportType === 'balance') {
        reportContainer.innerHTML += `<p>Balance: ${data.balance}</p>`;
      }
    })
    .catch((error) => console.error(error));
});
