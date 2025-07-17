document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const classFilter = document.getElementById('classFilter');
  const cardsGrid = document.getElementById('cardsGrid');

  function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedClass = classFilter.value;

    document.querySelectorAll('.card').forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const cardClass = card.dataset.class;
      card.style.display = 
        (name.includes(searchTerm) && 
        (selectedClass === 'all' || cardClass === selectedClass) 
          ? 'block' : 'none')
    });
  }

  searchInput.addEventListener('input', filterCards);
  classFilter.addEventListener('change', filterCards);
});