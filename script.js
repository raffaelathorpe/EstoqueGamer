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


// ==========================================
// CARREGANDO PRODUTOS DO LOCALSTORAGE
// ==========================================

let produtos =
    JSON.parse(localStorage.getItem("produtos")) || [];


// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function mostrarProdutos(lista = produtos) {

    listaProdutos.innerHTML = "";


    if (lista.length === 0) {

        listaProdutos.innerHTML = `
            <p class="sem-produtos">
                Nenhum produto cadastrado.
            </p>
        `;

        atualizarResumo();

        return;
    }


    lista.forEach(function(produto) {

        const card =
            document.createElement("div");

        card.classList.add("produto");


        // ==========================================
        // AVISO DE ESTOQUE
        // ==========================================

        let avisoEstoque = "";


        if (produto.quantidade <= 5) {

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
                R$ ${produto.preco
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


        listaProdutos.appendChild(card);

    });


    atualizarResumo();
}


// ==========================================
// ADICIONAR PRODUTO MANUALMENTE
// ==========================================

formProduto.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const nome =
            document.getElementById("nome").value.trim();


        const categoria =
            document.getElementById("categoria").value;


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


        produtos.push(novoProduto);


        salvarProdutos();


        mostrarProdutos();


        formProduto.reset();

    }
);


// ==========================================
// SALVAR NO LOCALSTORAGE
// ==========================================

function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


// ==========================================
// EXCLUIR PRODUTO
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


    mostrarProdutos();

}


// ==========================================
// ATUALIZAR RESUMO
// ==========================================

function atualizarResumo() {

    totalProdutos.textContent =
        produtos.length;


    const quantidadeTotal =
        produtos.reduce(
            function(total, produto) {

                return total + produto.quantidade;

            },
            0
        );


    totalItens.textContent =
        quantidadeTotal;


    const valorTotal =
        produtos.reduce(
            function(total, produto) {

                return total +
                    (
                        produto.preco *
                        produto.quantidade
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
// CARREGAR PRODUTOS DA API
// ==========================================

async function carregarProdutosAPI() {

    try {

        // Muda o texto do botão
        btnCarregarAPI.textContent =
            "⏳ Carregando...";


        btnCarregarAPI.disabled = true;


        // ==========================================
        // CONSULTANDO A DUMMYJSON
        // ==========================================

        const resposta =
            await fetch(
                "https://dummyjson.com/products?limit=30"
            );


        // Verifica se a API respondeu corretamente
        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar a API."
            );

        }


        // Transforma a resposta em JSON
        const dados =
            await resposta.json();


        console.log(
            "Dados recebidos da API:",
            dados
        );


        // ==========================================
        // TRANSFORMANDO OS PRODUTOS
        // ==========================================

        const produtosAPI =
            dados.products.map(
                function(produtoAPI) {

                    return {

                        // Cria um ID diferente
                        // para evitar conflito
                        id:
                            100000 +
                            produtoAPI.id,

                        nome:
                            produtoAPI.title,

                        categoria:
                            produtoAPI.category,

                        preco:
                            produtoAPI.price,

                        quantidade:
                            produtoAPI.stock,

                        imagem:
                            produtoAPI.thumbnail,

                        origem:
                            "API"

                    };

                }
            );


        // ==========================================
        // EVITAR DUPLICADOS
        // ==========================================

        produtosAPI.forEach(
            function(produtoAPI) {

                const jaExiste =
                    produtos.some(
                        function(produto) {

                            return (
                                produto.id ===
                                produtoAPI.id
                            );

                        }
                    );


                if (!jaExiste) {

                    produtos.push(produtoAPI);

                }

            }
        );


        // ==========================================
        // SALVAR
        // ==========================================

        salvarProdutos();


        // ==========================================
        // MOSTRAR
        // ==========================================

        mostrarProdutos();


        alert(
            "Produtos carregados da API com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro:",
            erro
        );


        alert(
            "Não foi possível carregar os produtos da API."
        );


    } finally {

        btnCarregarAPI.textContent =
            "🌐 Carregar produtos da API";


        btnCarregarAPI.disabled = false;

    }

}


// ==========================================
// EVENTO DO BOTÃO DA API
// ==========================================

btnCarregarAPI.addEventListener(
    "click",
    carregarProdutosAPI
);


// ==========================================
// BUSCAR PRODUTO
// ==========================================

busca.addEventListener(
    "input",
    function() {

        const texto =
            busca.value
                .toLowerCase()
                .trim();


        const produtosFiltrados =
            produtos.filter(
                function(produto) {

                    return produto.nome
                        .toLowerCase()
                        .includes(texto);

                }
            );


        mostrarProdutos(
            produtosFiltrados
        );

    }
);


// ==========================================
// INICIAR SISTEMA
// ==========================================

mostrarProdutos();