document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const resetButton = document.getElementById('resetButton');
  const mainElement = document.querySelector('main');

  // services-list id를 가진 스크립트에서 데이터 읽어오기
  const servicesScript = document.getElementById('services-list');
  const data = JSON.parse(servicesScript.textContent);

  // 서비스를 카테고리별로 분류하는 함수
  function categorizeServices(services) {
    return {
      korea: services.filter((service) => service.category === 'korea'),
      global: services.filter((service) => service.category === 'global'),
    };
  }

  // HTML 카드 생성 함수
  function createServiceCard(service) {
    return `
                <a href="${service.url}" class="link-card" target="_blank" rel="noopener noreferrer">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                </a>
            `;
  }

  // 섹션 생성 함수
  function createSection(title, services) {
    return `
                <section class="category">
                    <h2>${title}</h2>
                    <div class="links">
                        ${services.map((service) => createServiceCard(service)).join('')}
                    </div>
                </section>
            `;
  }

  // 검색 기능
  function filterCards(searchTerm) {
    const cards = document.querySelectorAll('.link-card');
    searchTerm = searchTerm.toLowerCase();

    cards.forEach((card) => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // URL에서 검색어를 가져오는 함수
  function getSearchTermFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }

  // 검색어를 URL에 업데이트하는 함수
  function updateUrlWithSearchTerm(term) {
    const url = new URL(window.location);
    if (term) {
      url.searchParams.set('q', term);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url);
  }

  // 초기화 함수
  function resetSearch() {
    searchInput.value = '';
    updateUrlWithSearchTerm('');
    const cards = document.querySelectorAll('.link-card');
    cards.forEach((card) => {
      card.style.display = 'block';
    });
  }

  // 초기화 함수
  function initialize() {
    const { korea, global } = categorizeServices(data.itemListElement);

    mainElement.innerHTML = `
                ${createSection('Korean Services', korea)}
                ${createSection('Global Services', global)}
            `;

    // 검색 기능 초기화
    const initialSearchTerm = getSearchTermFromUrl();
    if (initialSearchTerm) {
      searchInput.value = initialSearchTerm;
      filterCards(initialSearchTerm);
    }

    searchInput.addEventListener('input', function () {
      const searchTerm = this.value;
      filterCards(searchTerm);
      updateUrlWithSearchTerm(searchTerm);
    });

    // 초기화 버튼 이벤트 리스너 추가
    resetButton.addEventListener('click', resetSearch);

    window.addEventListener('popstate', function () {
      const searchTerm = getSearchTermFromUrl();
      searchInput.value = searchTerm;
      filterCards(searchTerm);
    });
  }

  initialize();
});
