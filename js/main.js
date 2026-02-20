document.getElementById('backButton').addEventListener('click', () => {
    history.back();
});

function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

