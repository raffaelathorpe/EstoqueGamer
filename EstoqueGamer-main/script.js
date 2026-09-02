// ==========================================
// PEGANDO ELEMENTOS DO HTML
// ==========================================

const formProduto =
    document.getElementById("formProduto");

const listaProdutos =
    document.getElementById("listaProdutos");

const busca =
    document.getElementById("busca");

const totalProdutos =
    document.getElementById("totalProdutos");

const totalItens =
    document.getElementById("totalItens");

const valorEstoque =
    document.getElementById("valorEstoque");

const btnCarregarAPI =
    document.getElementById("btnCarregarAPI");

const btnTodos =
    document.getElementById("btnTodos");

const btnGamers =
    document.getElementById("btnGamers");

const btnTecnologia =
    document.getElementById("btnTecnologia");

const textoFiltro =
    document.getElementById("textoFiltro");


// ==========================================
// PRODUTOS SALVOS NO NAVEGADOR
// ==========================================

let produtos =
    JSON.parse(
        localStorage.getItem("produtos")
    ) || [];


// ==========================================
// FILTRO ATUAL
// ==========================================

let filtroAtual = "todos";


// ==========================================
// PALAVRAS DE PRODUTOS GAMERS
// ==========================================

const palavrasGamers = [

    "gaming",
    "gamer",
    "game",
    "mouse",
    "keyboard",
    "headphone",
    "headset",
    "controller",
    "console",
    "playstation",
    "xbox",
    "nintendo",
    "joystick",
    "gamepad",
    "rgb"

];


// ==========================================
// PALAVRAS DE TECNOLOGIA
// ==========================================

const palavrasTecnologia = [

    "laptop",
    "smartphone",
    "phone",
    "tablet",
    "computer",
    "pc",
    "monitor",
    "camera",
    "watch",
    "mobile",
    "airpods",
    "earbuds",
    "charger",
    "adapter",
    "speaker",
    "printer",
    "keyboard",
    "mouse",
    "headphones"

];


// ==========================================
// VERIFICAR SE É GAMER
// ==========================================

function ehProdutoGamer(produto) {

    const texto = `

        ${produto.title || ""}

        ${produto.description || ""}

        ${produto.category || ""}

        ${produto.brand || ""}

        ${(produto.tags || []).join(" ")}

    `.toLowerCase();


    return palavrasGamers.some(
        function(palavra) {

            return texto.includes(palavra);

        }
    );

}


// ==========================================
// VERIFICAR SE É TECNOLOGIA
// ==========================================

function ehProdutoTecnologia(produto) {

    const texto = `

        ${produto.title || ""}

        ${produto.description || ""}

        ${produto.category || ""}

        ${produto.brand || ""}

        ${(produto.tags || []).join(" ")}

    `.toLowerCase();


    return palavrasTecnologia.some(
        function(palavra) {

            return texto.includes(palavra);

        }
    );

}


// ==========================================
// DESCOBRIR A CATEGORIA
// ==========================================

function definirCategoria(produto) {

    if (ehProdutoGamer(produto)) {

        return "Gamers";

    }


    if (ehProdutoTecnologia(produto)) {

        return "Tecnologia";

    }


    return "Outros";

}


// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function mostrarProdutos(
    lista = produtos
) {

    listaProdutos.innerHTML = "";


    if (lista.length === 0) {

        listaProdutos.innerHTML = `
            <p class="sem-produtos">
                Nenhum produto encontrado.
            </p>
        `;

        atualizarResumo();

        return;

    }


    lista.forEach(
        function(produto) {

            const card =
                document.createElement("div");


            card.classList.add(
                "produto"
            );


            // ==========================================
            // AVISO DE ESTOQUE
            // ==========================================

            let avisoEstoque = "";


            if (
                produto.quantidade <= 5
            ) {

                avisoEstoque = `
                    <p class="estoque-baixo">
                        ⚠️ Estoque baixo
                    </p>
                `;

            }


            // ==========================================
            // IMAGEM
            // ==========================================

            let imagem = "";


            if (produto.imagem) {

                imagem = `
                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                    >
                `;

            }


            // ==========================================
            // CARD
            // ==========================================

            card.innerHTML = `

                ${imagem}

                <span class="categoria">
                    ${produto.categoria}
                </span>

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    💰 Preço:
                    R$ ${Number(produto.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <p>
                    📦 Quantidade:
                    ${produto.quantidade}
                </p>

                ${avisoEstoque}

                <button
                    class="botao-excluir"
                    onclick="excluirProduto(${produto.id})"
                >
                    🗑️ Excluir
                </button>

            `;


            listaProdutos.appendChild(
                card
            );

        }
    );


    atualizarResumo();

}


// ==========================================
// ADICIONAR PRODUTO MANUAL
// ==========================================

formProduto.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const nome =
            document
                .getElementById("nome")
                .value
                .trim();


        const categoria =
            document
                .getElementById("categoria")
                .value;


        const preco =
            Number(
                document
                    .getElementById("preco")
                    .value
            );


        const quantidade =
            Number(
                document
                    .getElementById("quantidade")
                    .value
            );


        const novoProduto = {

            id: Date.now(),

            nome: nome,

            categoria: categoria,

            preco: preco,

            quantidade: quantidade,

            imagem: ""

        };


        produtos.push(
            novoProduto
        );


        salvarProdutos();


        aplicarFiltro();


        formProduto.reset();

    }
);


// ==========================================
// SALVAR
// ==========================================

function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


// ==========================================
// EXCLUIR
// ==========================================

function excluirProduto(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este produto?"
        );


    if (!confirmar) {

        return;

    }


    produtos =
        produtos.filter(
            function(produto) {

                return produto.id !== id;

            }
        );


    salvarProdutos();


    aplicarFiltro();

}


// ==========================================
// RESUMO
// ==========================================

function atualizarResumo() {

    totalProdutos.textContent =
        produtos.length;


    const quantidadeTotal =
        produtos.reduce(
            function(total, produto) {

                return (
                    total +
                    Number(produto.quantidade)
                );

            },
            0
        );


    totalItens.textContent =
        quantidadeTotal;


    const valorTotal =
        produtos.reduce(
            function(total, produto) {

                return (
                    total +
                    (
                        Number(produto.preco) *
                        Number(produto.quantidade)
                    )
                );

            },
            0
        );


    valorEstoque.textContent =
        "R$ " +
        valorTotal
            .toFixed(2)
            .replace(".", ",");

}


// ==========================================
// CARREGAR API
// ==========================================

async function carregarProdutosAPI() {

    try {

        btnCarregarAPI.textContent =
            "⏳ Carregando...";


        btnCarregarAPI.disabled =
            true;


        // ==========================================
        // REQUISIÇÃO
        // ==========================================

        const resposta =
            await fetch(
                "https://dummyjson.com/products?limit=0"
            );


        if (!resposta.ok) {

            throw new Error(
                "A API não respondeu corretamente."
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "Produtos recebidos:",
            dados.products
        );


        // ==========================================
        // FILTRAR SOMENTE GAMERS
        // OU TECNOLOGIA
        // ==========================================

        const produtosInteressantes =
            dados.products.filter(
                function(produto) {

                    return (
                        ehProdutoGamer(produto) ||
                        ehProdutoTecnologia(produto)
                    );

                }
            );


        console.log(
            "Produtos gamers/tecnologia:",
            produtosInteressantes
        );


        // ==========================================
        // ADICIONAR AO ESTOQUE
        // ==========================================

        produtosInteressantes.forEach(
            function(produtoAPI) {

                const jaExiste =
                    produtos.some(
                        function(produto) {

                            return (
                                produto.apiId ===
                                produtoAPI.id
                            );

                        }
                    );


                if (jaExiste) {

                    return;

                }


                produtos.push({

                    id:
                        1000000 +
                        produtoAPI.id,

                    apiId:
                        produtoAPI.id,

                    nome:
                        produtoAPI.title,

                    categoria:
                        definirCategoria(
                            produtoAPI
                        ),

                    preco:
                        Number(
                            produtoAPI.price
                        ),

                    quantidade:
                        Number(
                            produtoAPI.stock
                        ),

                    imagem:
                        produtoAPI.thumbnail

                });

            }
        );


        // ==========================================
        // SALVAR
        // ==========================================

        salvarProdutos();


        // ==========================================
        // MOSTRAR
        // ==========================================

        aplicarFiltro();


        alert(
            `${produtosInteressantes.length} produtos gamers/tecnológicos encontrados!`
        );


    } catch (erro) {

        console.error(
            "Erro ao consultar API:",
            erro
        );


        alert(
            "Não foi possível consultar a API. Verifique sua conexão com a internet."
        );


    } finally {

        btnCarregarAPI.textContent =
            "🌐 Carregar produtos";


        btnCarregarAPI.disabled =
            false;

    }

}


// ==========================================
// APLICAR FILTRO
// ==========================================

function aplicarFiltro() {

    let lista =
        [...produtos];


    // ==========================================
    // FILTRO GAMERS
    // ==========================================

    if (
        filtroAtual === "gamers"
    ) {

        lista =
            lista.filter(
                function(produto) {

                    return (
                        produto.categoria ===
                        "Gamers"
                    );

                }
            );

        textoFiltro.textContent =
            "Produtos gamers";

    }


    // ==========================================
    // FILTRO TECNOLOGIA
    // ==========================================

    else if (
        filtroAtual === "tecnologia"
    ) {

        lista =
            lista.filter(
                function(produto) {

                    return (
                        produto.categoria ===
                        "Tecnologia"
                    );

                }
            );

        textoFiltro.textContent =
            "Produtos de tecnologia";

    }


    // ==========================================
    // TODOS
    // ==========================================

    else {

        textoFiltro.textContent =
            "Todos os produtos";

    }


    // ==========================================
    // BUSCA
    // ==========================================

    const texto =
        busca.value
            .toLowerCase()
            .trim();


    if (texto !== "") {

        lista =
            lista.filter(
                function(produto) {

                    return produto.nome
                        .toLowerCase()
                        .includes(texto);

                }
            );

    }


    mostrarProdutos(lista);

}


// ==========================================
// BOTÕES DE FILTRO
// ==========================================

btnTodos.addEventListener(
    "click",
    function() {

        filtroAtual =
            "todos";


        btnTodos.classList.add(
            "ativo"
        );

        btnGamers.classList.remove(
            "ativo"
        );

        btnTecnologia.classList.remove(
            "ativo"
        );


        aplicarFiltro();

    }
);


btnGamers.addEventListener(
    "click",
    function() {

        filtroAtual =
            "gamers";


        btnGamers.classList.add(
            "ativo"
        );

        btnTodos.classList.remove(
            "ativo"
        );

        btnTecnologia.classList.remove(
            "ativo"
        );


        aplicarFiltro();

    }
);


btnTecnologia.addEventListener(
    "click",
    function() {

        filtroAtual =
            "tecnologia";


        btnTecnologia.classList.add(
            "ativo"
        );

        btnTodos.classList.remove(
            "ativo"
        );

        btnGamers.classList.remove(
            "ativo"
        );


        aplicarFiltro();

    }
);


// ==========================================
// BUSCA
// ==========================================

busca.addEventListener(
    "input",
    function() {

        aplicarFiltro();

    }
);


// ==========================================
// BOTÃO DA API
// ==========================================

btnCarregarAPI.addEventListener(
    "click",
    carregarProdutosAPI
);

// ==========================================
// GEOLOCALIZAÇÃO - VERSÃO MELHORADA
// ==========================================

const btnLocalizacao =
    document.getElementById("btnLocalizacao");

const resultadoLocalizacao =
    document.getElementById("resultadoLocalizacao");

const linkGoogleMaps =
    document.getElementById("linkGoogleMaps");

// Variáveis para armazenar a localização
let latitudeAtual = null;
let longitudeAtual = null;
let precisaoAtual = null;

btnLocalizacao.addEventListener(
    "click",
    function() {

        // ==========================================
        // VERIFICA SE O NAVEGADOR SUPORTA
        // ==========================================

        if (!navigator.geolocation) {

            resultadoLocalizacao.innerHTML = `
                <p class="erro">
                    ❌ Seu navegador não suporta geolocalização.
                </p>
            `;

            return;

        }


        // ==========================================
        // ESTADO DE CARREGAMENTO
        // ==========================================

        resultadoLocalizacao.innerHTML = `
            <p class="carregando">
                ⏳ Obtendo sua localização...
                <br>
                <small>Por favor, aguarde...</small>
            </p>
        `;

        btnLocalizacao.disabled = true;
        btnLocalizacao.textContent = "⏳ Obtendo...";

        linkGoogleMaps.style.display = "none";


        // ==========================================
        // OBTENDO A LOCALIZAÇÃO
        // ==========================================

        navigator.geolocation.getCurrentPosition(

            // ==========================================
            // SUCESSO
            // ==========================================

            function(posicao) {

                latitudeAtual =
                    posicao.coords.latitude;

                longitudeAtual =
                    posicao.coords.longitude;

                precisaoAtual =
                    posicao.coords.accuracy;


                // ==========================================
                // MOSTRA NO ECRÃ
                // ==========================================

                resultadoLocalizacao.innerHTML = `
                    <p class="sucesso">✅ Localização obtida com sucesso!</p>
                    <p><strong>Latitude:</strong> ${latitudeAtual}</p>
                    <p><strong>Longitude:</strong> ${longitudeAtual}</p>
                    <p><strong>Precisão:</strong> ${Math.round(precisaoAtual)} metros</p>
                    <p><strong>Altitude:</strong> ${posicao.coords.altitude || 'Não disponível'}</p>
                    <p><strong>Velocidade:</strong> ${posicao.coords.speed || 'Não disponível'}</p>
                `;

                // ==========================================
                // EXIBE BOTÃO DO MAPS
                // ==========================================

                linkGoogleMaps.style.display = "inline-block";

                linkGoogleMaps.href = 
                    `https://www.google.com/maps?q=${latitudeAtual},${longitudeAtual}`;

                // ==========================================
                // SALVA NO LOCALSTORAGE
                // ==========================================

                const localizacao = {
                    latitude: latitudeAtual,
                    longitude: longitudeAtual,
                    precisao: precisaoAtual,
                    data: new Date().toISOString()
                };

                localStorage.setItem(
                    "localizacao_estoque",
                    JSON.stringify(localizacao)
                );

                console.log(
                    "📍 Localização salva:",
                    localizacao
                );

            },

            // ==========================================
            // ERRO
            // ==========================================

            function(erro) {

                console.error(
                    "Erro de geolocalização:",
                    erro
                );

                let mensagem = "";

                if (erro.code === 1) {

                    mensagem = `
                        ❌ Permissão de localização negada.
                        <br>
                        <small>
                            Por favor, permita o acesso à localização nas configurações do seu navegador.
                        </small>
                    `;

                }

                else if (erro.code === 2) {

                    mensagem = `
                        ❌ Não foi possível determinar sua localização.
                        <br>
                        <small>
                            Verifique se o GPS está ativo e tente novamente.
                        </small>
                    `;

                }

                else if (erro.code === 3) {

                    mensagem = `
                        ❌ O tempo para obter a localização terminou.
                        <br>
                        <small>
                            Tente novamente ou verifique sua conexão.
                        </small>
                    `;

                }

                else {

                    mensagem = `
                        ❌ Erro ao obter localização.
                        <br>
                        <small>
                            Código do erro: ${erro.code}
                        </small>
                    `;

                }

                resultadoLocalizacao.innerHTML = 
                    `<p class="erro">${mensagem}</p>`;

            },

            // ==========================================
            // OPÇÕES
            // ==========================================

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    }
);

// ==========================================
// FINALIZAR O BOTÃO
// ==========================================

// Restaura o botão após a operação
btnLocalizacao.addEventListener(
    "click",
    function() {

        // Define um timeout para restaurar o botão
        // mesmo que a geolocalização demore
        setTimeout(function() {

            btnLocalizacao.disabled = false;
            btnLocalizacao.textContent = "📍 Obter minha localização";

        }, 16000);

    }
);

// ==========================================
// CARREGA LOCALIZAÇÃO SALVA
// ==========================================

(function carregarLocalizacaoSalva() {

    const salva =
        localStorage.getItem("localizacao_estoque");

    if (salva) {

        try {

            const dados =
                JSON.parse(salva);

            const dataFormatada =
                new Date(dados.data)
                    .toLocaleString("pt-BR");

            resultadoLocalizacao.innerHTML = `
                <p class="sucesso">📍 Última localização salva:</p>
                <p><strong>Latitude:</strong> ${dados.latitude}</p>
                <p><strong>Longitude:</strong> ${dados.longitude}</p>
                <p><strong>Precisão:</strong> ${Math.round(dados.precisao)} metros</p>
                <p><small>Salvo em: ${dataFormatada}</small></p>
            `;

            linkGoogleMaps.style.display = "inline-block";
            linkGoogleMaps.href = 
                `https://www.google.com/maps?q=${dados.latitude},${dados.longitude}`;

        } catch (erro) {

            console.error(
                "Erro ao carregar localização salva:",
                erro
            );

        }

    }

})();

// ==========================================
// ATUALIZA O SERVICE WORKER
// ==========================================

// Adicione ao final do seu script ou no evento de carregamento
if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function(registro) {

                console.log(
                    "✅ Service Worker registrado com sucesso!",
                    registro
                );

                // Verifica se há atualizações
                registro.update();

            })
            .catch(function(erro) {

                console.error(
                    "❌ Erro ao registrar Service Worker:",
                    erro
                );

            });

    });

}


// ==========================================
// INICIAR
// ==========================================

mostrarProdutos();

// ==========================================
// SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function(registro) {

                console.log(
                    "Service Worker registrado com sucesso!",
                    registro
                );

            })
            .catch(function(erro) {

                console.error(
                    "Erro ao registrar Service Worker:",
                    erro
                );

            });

    });

}
