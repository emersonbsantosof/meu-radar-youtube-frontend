document.addEventListener('DOMContentLoaded', () => {
    console.log('Script JavaScript do Radar carregado!');

    const searchTermInput = document.getElementById('searchTermInput');
    const searchButton = document.getElementById('searchButton');
    const statusMessage = document.getElementById('statusMessage');
    const radarChartDiv = document.getElementById('radar-chart');
    const videoListDiv = document.getElementById('video-list');

    // --- ENDPOINT DO SEU BACKEND ---
    // IMPORTANTE: Enquanto o backend estiver rodando LOCALMENTE, use http://localhost:5000
    // Quando você hospedar o backend online, precisará mudar este URL para o URL público do seu backend.
    const BACKEND_URL = 'https://radar-youtube-backend.onrender.com';

    // Função para buscar vídeos do backend
    async function fetchVideos(searchTerm = '') {
        statusMessage.textContent = `Buscando vídeos sobre "${searchTerm || 'em alta'}"...`;
        radarChartDiv.innerHTML = '<p>Carregando dados do radar...</p>';
        videoListDiv.innerHTML = '<p>Carregando lista de vídeos...</p>';

        let url = `${BACKEND_URL}/trending_videos`; // Endpoint padrão para vídeos em alta

        if (searchTerm) {
            url = `${BACKEND_URL}/trending_videos?q=${encodeURIComponent(searchTerm)}`; // Adiciona termo de busca
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const videos = await response.json();
            
            statusMessage.textContent = `Busca por "${searchTerm || 'em alta'}" concluída. ${videos.length} vídeos encontrados.`;
            statusMessage.style.color = '#555'; // Volta a cor para o padrão

            displayVideos(videos); // Chama a função para exibir os vídeos
            drawRadarChart(videos); // Chama a função para desenhar o radar (ainda vamos implementar)

        } catch (error) {
            console.error('Erro ao buscar vídeos do backend:', error);
            statusMessage.textContent = `Erro ao buscar vídeos: ${error.message}. Verifique se o backend está rodando.`;
            statusMessage.style.color = 'red';
            radarChartDiv.innerHTML = '<p style="color: red;">Não foi possível carregar o gráfico do radar.</p>';
            videoListDiv.innerHTML = '<p style="color: red;">Não foi possível carregar a lista de vídeos.</p>';
        }
    }

    // Função para exibir os vídeos na lista
    function displayVideos(videos) {
        if (videos.length === 0) {
            videoListDiv.innerHTML = '<p>Nenhum vídeo encontrado para o termo de busca.</p>';
            return;
        }

        let html = '<h3>Vídeos Encontrados:</h3>';
        html += '<table class="video-table">';
        html += '<thead><tr><th>Miniatura</th><th>Título</th><th>Canal</th><th>Visualizações</th><th>Engajamento</th><th>Ação</th></tr></thead>';
        html += '<tbody>';

        videos.forEach(video => {
            html += `
                <tr>
                    <td><img src="${video.thumbnailUrl}" alt="${video.title}" class="video-thumbnail"></td>
                    <td>${video.title}</td>
                    <td>${video.channelName}</td>
                    <td>${video.viewCountFormatted}</td>
                    <td>${video.engagementScore}</td>
                    <td><a href="${video.videoUrl}" target="_blank" class="watch-button">Assistir</a></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        videoListDiv.innerHTML = html;
    }

    // Função para desenhar o gráfico do radar (placeholder por enquanto)
    function drawRadarChart(videos) {
        if (videos.length === 0) {
            radarChartDiv.innerHTML = '<p>Não há dados para desenhar o gráfico do radar.</p>';
            return;
        }
        radarChartDiv.innerHTML = '<p>O gráfico do radar será desenhado aqui com D3.js em breve!</p>';
        radarChartDiv.style.backgroundColor = '#dff0d8';
        radarChartDiv.style.color = '#3c763d';
        // Aqui virá o código D3.js real para desenhar o radar
    }


    // Event Listener para o botão de busca
    searchButton.addEventListener('click', () => {
        const searchTerm = searchTermInput.value.trim();
        fetchVideos(searchTerm); // Chama a função de busca
    });

    // Mensagem inicial e busca inicial de vídeos em alta ao carregar a página
    statusMessage.textContent = 'Carregando vídeos em alta...';
    fetchVideos(); // Busca vídeos em alta assim que a página carrega
});