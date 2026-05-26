document.addEventListener("DOMContentLoaded", function() {
    fetch('conteudo.json')
        .then(response => response.json())
        .then(data => {
            // 1. MÁGICA DA ORDENAÇÃO: Força a ordem do mais recente para o mais antigo usando a data_iso
            data.sort((a, b) => new Date(b.data_iso) - new Date(a.data_iso));

            renderizarHome(data);
            renderizarListasPaginadas(data);
        })
        .catch(error => console.error('Erro ao carregar os conteúdos:', error));
});

function renderizarHome(conteudos) {
    const containerDestaque = document.getElementById('artigo-destaque');
    const containerGrid = document.getElementById('analises-grid');

    if (!containerDestaque || !containerGrid) return; 

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

// 2. MÁGICA DA PAGINAÇÃO (CARREGAR MAIS)
function renderizarListasPaginadas(conteudos) {
    const listaArtigos = document.getElementById('lista-artigos');
    const listaAnalises = document.getElementById('lista-analises');
    
    // Configuração de quantos itens aparecem por vez
    const itensPorPagina = 5; 

    if (listaArtigos) {
        const artigos = conteudos.filter(item => item.tipo === 'artigo');
        configurarPaginacao(artigos, listaArtigos, gerarHTMLCompacto, "Ler Artigo", itensPorPagina);
    }

    if (listaAnalises) {
        const analises = conteudos.filter(item => item.tipo === 'analise');
        configurarPaginacao(analises, listaAnalises, gerarHTMLGrid, "Ler Análise", itensPorPagina);
    }
}

function configurarPaginacao(itens, container, funcaoGeradora, textoBotao, limite) {
    let paginaAtual = 1;

    // Função interna que desenha a quantidade certa na tela
    function atualizarTela() {
        const totalVisivel = paginaAtual * limite;
        const itensParaMostrar = itens.slice(0, totalVisivel);
        
        container.innerHTML = funcaoGeradora(itensParaMostrar, textoBotao);

        // Se ainda houver itens escondidos, cria o botão "Carregar Mais"
        if (totalVisivel < itens.length) {
            const btnContainer = document.createElement('div');
            btnContainer.style.textAlign = 'center';
            btnContainer.style.marginTop = '3em';
            btnContainer.style.width = '100%';
            
            btnContainer.innerHTML = `<button class="button primary">Carregar Mais</button>`;
            
            btnContainer.querySelector('button').addEventListener('click', () => {
                paginaAtual++;
                atualizarTela();
            });
            
            container.appendChild(btnContainer);
        }
    }

    // Inicia a tela na primeira página
    atualizarTela();
}

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