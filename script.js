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
// INICIAR
// ==========================================

mostrarProdutos();