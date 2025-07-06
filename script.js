const BACKEND_URL = 'https://radar-youtube-backend.onrender.com';

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const videoList = document.getElementById('video-list');
    const chartContainer = document.getElementById('chart-container');

    // Função para buscar vídeos e atualizar a interface
    async function fetchVideos(query) {
        if (!query) return;

        videoList.innerHTML = '<li>Carregando vídeos...</li>';
        chartContainer.innerHTML = ''; // Limpa o gráfico anterior

        try {
            const response = await fetch(`${BACKEND_URL}/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            const data = await response.json();

            videoList.innerHTML = '';
            if (data.videos && data.videos.length > 0) {
                data.videos.forEach(video => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <img src="${video.thumbnail}" alt="${video.title}" width="120">
                        <div>
                            <h3>${video.title}</h3>
                            <p>Canal: ${video.channel}</p>
                            <p>Views: ${video.views ? video.views.toLocaleString() : 'N/A'}</p>
                            <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">Assistir</a>
                        </div>
                    `;
                    videoList.appendChild(li);
                });
            } else {
                videoList.innerHTML = '<li>Nenhum vídeo encontrado.</li>';
            }

            // Atualiza o gráfico de tendências de views
            if (data.trends && data.trends.length > 0) {
                updateChart(data.trends);
            }

        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoList.innerHTML = `<li>Erro ao carregar vídeos: ${error.message}. Verifique o console.</li>`;
            chartContainer.innerHTML = 'Erro ao gerar gráfico.';
        }
    }

    // Função para atualizar o gráfico (exemplo simples com Chart.js ou outro)
    function updateChart(trends) {
        chartContainer.innerHTML = '<h3>Tendências de Views</h3><canvas id="viewChart"></canvas>';
        const ctx = document.getElementById('viewChart').getContext('2d');

        const labels = trends.map(t => t.title);
        const data = trends.map(t => t.views);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Views',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Adiciona evento de clique ao botão de busca
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            fetchVideos(searchInput.value);
        });
    }

    // Adiciona evento de tecla 'Enter' ao campo de busca
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fetchVideos(searchInput.value);
            }
        });
    }

    // Carrega vídeos em destaque (opcional, pode ser uma pesquisa inicial ou vazia)
    fetchVideos('Inteligência Artificial'); // Pesquisa inicial ao carregar a página
});