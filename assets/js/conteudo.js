document.addEventListener("DOMContentLoaded", function() {
    // Procura o ficheiro JSON
    fetch('conteudo.json')
        .then(response => response.json())
        .then(data => {
            renderizarHome(data);
            renderizarListas(data);
        })
        .catch(error => console.error('Erro ao carregar os conteúdos:', error));
});

function renderizarHome(conteudos) {
    const containerDestaque = document.getElementById('artigo-destaque');
    const containerGrid = document.getElementById('analises-grid');

    if (!containerDestaque || !containerGrid) return; // Só corre se estiver na Home

    // 1. O primeiro item do JSON (mais recente de todos) vai para o Destaque Principal
    const maisRecente = conteudos[0];
    if (maisRecente) {
        containerDestaque.innerHTML = `
            <header class="major">
                <span class="date">${maisRecente.data}</span>
                <h2><a href="${maisRecente.link}">${maisRecente.titulo}</a></h2>
                <p>${maisRecente.subtitulo || ''}</p>
            </header>
            <a href="${maisRecente.link}" class="image main"><img src="${maisRecente.imagem}" alt="" /></a>
            <ul class="actions special">
                <li><a href="${maisRecente.link}" class="button large">Ler Conteúdo Completo</a></li>
            </ul>
        `;
    }

    // 2. Filtra as 2 análises mais recentes e desenha a grelha
    const analises = conteudos.filter(item => item.tipo === 'analise').slice(0, 2);
    
    containerGrid.innerHTML = '';
    analises.forEach(analise => {
        containerGrid.innerHTML += `
            <article>
                <header>
                    <span class="date">${analise.data}</span>
                    <h2><a href="${analise.link}">${analise.titulo}</a></h2>
                </header>
                <a href="${analise.link}" class="image fit"><img src="${analise.imagem}" alt="" /></a>
                <p>${analise.descricao}</p>
                <ul class="actions special">
                    <li><a href="${analise.link}" class="button">Ler Análise</a></li>
                </ul>
            </article>
        `;
    });
}

function renderizarListas(conteudos) {
    const listaArtigos = document.getElementById('lista-artigos');
    const listaAnalises = document.getElementById('lista-analises');

    // Aba de Artigos usa o layout Compacto (Horizontal, mais acadêmico)
    if (listaArtigos) {
        const artigos = conteudos.filter(item => item.tipo === 'artigo');
        listaArtigos.innerHTML = gerarHTMLCompacto(artigos, "Ler Artigo");
    }

    // Aba de Análises usa o layout Grid (Cards lado a lado, mais visual)
    if (listaAnalises) {
        const analises = conteudos.filter(item => item.tipo === 'analise');
        listaAnalises.innerHTML = gerarHTMLGrid(analises, "Ler Análise");
    }
}

// ... (Pode manter a função gerarHTMLCompacto intacta aqui) ...

// NOVA FUNÇÃO: Gera os Cards estilo Vitrine para as Análises
function gerarHTMLGrid(itens, textoBotao) {
    let html = '';
    itens.forEach(item => {
        html += `
        <article>
            <header>
                <span class="date">${item.data}</span>
                <h2><a href="${item.link}">${item.titulo}</a></h2>
            </header>
            <a href="${item.link}" class="image fit"><img src="${item.imagem}" alt="${item.titulo}" /></a>
            <p>${item.descricao}</p>
            <ul class="actions special">
                <li><a href="${item.link}" class="button">${textoBotao}</a></li>
            </ul>
        </article>`;
    });
    return html;
}

// Função auxiliar que cria as linhas bonitas e alinhadas (1/3 imagem, 2/3 texto)
// FUNÇÃO ATUALIZADA: Imagem preenche toda a altura do bloco de texto
function gerarHTMLCompacto(itens, textoBotao) {
    let html = '';
    itens.forEach(item => {
        html += `
        <div class="row" style="margin-bottom: 3em; border-bottom: 1px solid #333; padding-bottom: 3em; align-items: stretch;">
            <div class="col-4 col-12-medium" style="display: flex;">
                <a href="${item.link}" class="image fit" style="margin: 0; width: 100%; height: 100%; display: block;">
                    <img src="${item.imagem}" alt="${item.titulo}" style="border-radius: 5px; width: 100%; height: 100%; object-fit: cover;" />
                </a>
            </div>
            <div class="col-8 col-12-medium" style="display: flex; flex-direction: column; justify-content: space-between;">
                <header style="background: transparent !important; padding: 0 !important; margin-bottom: 1em !important;">
                    <span class="date" style="display: block; margin-bottom: 0.5em; font-size: 0.8rem; color: #888;">${item.data}</span>
                    <h3 style="margin-bottom: 0.5em;"><a href="${item.link}">${item.titulo}</a></h3>
                </header>
                <p style="margin-bottom: 1.5em; font-size: 0.95rem; flex-grow: 1;">${item.descricao}</p>
                <ul class="actions" style="margin: 0;">
                    <li><a href="${item.link}" class="button small">${textoBotao}</a></li>
                </ul>
            </div>
        </div>`;
    });
    return html;
}