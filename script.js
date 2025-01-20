// Função para formatar a data para um formato válido como classe CSS
function formatarDataParaClasse(data) {
    return data.split('/').join('-'); // Substitui as barras por hífens
}

// Atualiza o valor com 10% de acréscimo
function atualizarValor() {
    const valor = document.getElementById('valor').value;
    const valorComAcrescimoElement = document.getElementById('valorComAcrescimo');

    if (valor !== '' && parseFloat(valor) > 0) {
        const valorNumerico = parseFloat(valor);
        const valorComAcrescimo = valorNumerico * 1.10;
        valorComAcrescimoElement.textContent = `${valorComAcrescimo.toFixed(2).replace('.', ',')}`;
    } else {
        valorComAcrescimoElement.textContent = '';
    }
}

// Seleciona o primeiro input
const input1 = document.getElementById('valor');

// Adiciona um ouvinte de evento para detectar quando a tecla Enter for pressionada
input1.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Impede o comportamento padrão de enviar um formulário (caso exista)
        event.preventDefault();
        // Foca no segundo input
        document.getElementById('formaPagamento').focus();
    }
});

// Verifica se Enter foi pressionado
function verificarEnter(event) {
    const valorInput = document.getElementById('valor');
    const formaPagamentoInput = document.getElementById('formaPagamento');

    if (event.key === 'Enter') {
        if (event.target === valorInput) {
            // Quando pressionar Enter no campo de valor, vai para o campo de forma de pagamento
            formaPagamentoInput.focus();
        } else if (event.target === formaPagamentoInput) {
            // Quando pressionar Enter no campo de forma de pagamento, faz o cálculo e registra os dados
            calcular();
            // Volta o foco para o campo de valor
            valorInput.focus();
        }
    }
}

// Recupera histórico do localStorage
function carregarHistorico() {
    const tabela = document.querySelector('#tabelaHistorico tbody');
    const historico = JSON.parse(localStorage.getItem('historico')) || [];

    // Ordena o histórico do mais recente para o mais antigo (agora, a ordem fica do mais recente para o mais antigo)
    historico.sort((a, b) => new Date(b.data) - new Date(a.data));

    tabela.innerHTML = '';
    const gruposPorDia = agruparPorDia(historico);

    Object.keys(gruposPorDia).forEach((dia) => {
        const diaFormatado = formatarDataParaClasse(dia); // Formata a data
        const linhaDia = document.createElement('tr');
        linhaDia.innerHTML = `<td colspan="5" style="text-align: center; font-weight: bold; background-color: #1b5e20;">
            <button onclick="toggleMinimize('${diaFormatado}')">[-]</button> ${dia}</td>`;
        tabela.appendChild(linhaDia);

        const cabecalhoDia = document.createElement('tr');
        cabecalhoDia.innerHTML = `
            <th>Valor Original <button class="copiar" onclick="copiarColunaPorDia('${diaFormatado}', 0)">Copiar</button></th>
            <th>Valor +10% <button class="copiar" onclick="copiarColunaPorDia('${diaFormatado}', 1)">Copiar</button></th>
            <th>Forma de Pagamento <button class="copiar" onclick="copiarColunaPorDia('${diaFormatado}', 2)">Copiar</button></th>
            <th>Hora <button class="copiar" onclick="copiarColunaPorDia('${diaFormatado}', 3)">Copiar</button></th>
            <th>Ações</th>
        `;
        tabela.appendChild(cabecalhoDia);

        gruposPorDia[dia].forEach((item, index) => {
            const linha = document.createElement('tr');
            linha.classList.add(`lancamento-${diaFormatado}`); // Adiciona a classe formatada
            linha.innerHTML = `
                <td>${item.valorOriginal.toFixed(2).replace('.', ',')}</td>
                <td>${item.valorComAcrescimo.toFixed(2).replace('.', ',')}</td>
                <td>${item.formaPagamento}</td>
                <td>${item.hora}</td>
                <td>
                    <button class="editar" onclick="editarItem(${index})">Editar</button>
                    <button class="excluir" onclick="excluirItem(${index})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    });
}

// Agrupa os itens do histórico por dia
function agruparPorDia(historico) {
    return historico.reduce((grupos, item) => {
        const dia = item.data;
        if (!grupos[dia]) {
            grupos[dia] = [];
        }
        grupos[dia].push(item);
        return grupos;
    }, {});
}


function copiarColunaPorDia(diaFormatado, colunaIndex) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    
    // Filtrar itens correspondentes ao dia
    const itensDoDia = historico.filter(item => {
        const dataFormatada = formatarDataParaClasse(item.data);
        return dataFormatada === diaFormatado;
    });

    if (itensDoDia.length === 0) {
        alert('Nenhum dado encontrado para copiar.');
        return;
    }

    // Extrair o conteúdo da coluna correspondente
    const conteudo = itensDoDia.map(item => {
        switch (colunaIndex) {
            case 0:
                return `${item.valorOriginal.toFixed(2).replace('.', ',')}`;
            case 1:
                return `${item.valorComAcrescimo.toFixed(2).replace('.', ',')}`;
            case 2:
                return item.formaPagamento;
            case 3:
                return item.hora;
            default:
                return '';
        }
    }).join('\n');

    // Copiar para a área de transferência
    navigator.clipboard.writeText(conteudo).then(() => {
        alert('Dados da coluna copiados para a área de transferência!');
    }).catch(err => {
        alert('Erro ao copiar: ' + err);
    });
}


/*
function copiarColunaPorDia(dia, colunaIndex) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    
    // Verifique se o historico foi carregado corretamente
    console.log('Histórico:', historico);

    // Filtrando os itens do dia especificado
    const itensDoDia = historico.filter(item => item.data === dia);

    // Verifique os itens filtrados
    console.log('Itens do dia:', itensDoDia);

    const conteudo = itensDoDia.map(item => {
        switch (colunaIndex) {
            case 0:
                return `${item.valorOriginal.toFixed(2).replace('.', ',')}`;
            case 1:
                return `${item.valorComAcrescimo.toFixed(2).replace('.', ',')}`;
            case 2:
                return item.formaPagamento;
            case 3:
                return item.hora;
            default:
                return '';
        }
    }).join('\n');

    console.log('Conteúdo para copiar:', conteudo);

    // Tente copiar o conteúdo
    navigator.clipboard.writeText(conteudo).then(() => {
        alert(`Dados da coluna copiados para a área de transferência!`);
    }).catch((err) => {
        alert('Erro ao copiar: ' + err);
    });
}
*/

// Salva histórico no localStorage
function salvarHistorico(item) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(item);
    localStorage.setItem('historico', JSON.stringify(historico));
}

// Exclui item do histórico
function excluirItem(index) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.splice(index, 1);
    localStorage.setItem('historico', JSON.stringify(historico));
    carregarHistorico();
}

// Edita item do histórico
function editarItem(index) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    const item = historico[index];

    document.getElementById('valor').value = item.valorOriginal;
    document.getElementById('formaPagamento').value = item.formaPagamento;
    atualizarValor();

    excluirItem(index); // Remove o item para que seja atualizado após edição
}

// Calcula e adiciona ao histórico
function calcular() {
    const valor = document.getElementById('valor').value;
    const formaPagamento = document.getElementById('formaPagamento').value.toUpperCase();

    if (valor === '' || isNaN(valor) || parseFloat(valor) <= 0) {
        alert('Por favor, insira um valor válido e maior que zero.');
        return;
    }

    const formasValidas = ['C', 'D', 'V', 'M', 'P'];
    if (!formasValidas.includes(formaPagamento)) {
        alert('Forma de pagamento inválida. Use C, D, V, M ou P.');
        return;
    }

    const valorNumerico = parseFloat(valor);
    const valorComAcrescimo = valorNumerico * 1.10;
    const dataAtual = new Date().toLocaleDateString();
    const horaAtual = new Date().toLocaleTimeString();

    const item = {
        valorOriginal: valorNumerico,
        valorComAcrescimo: valorComAcrescimo,
        formaPagamento: formaPagamento,
        data: dataAtual,
        hora: horaAtual
    };

    salvarHistorico(item);
    carregarHistorico();

    document.getElementById('valor').value = '';
    document.getElementById('formaPagamento').value = '';
    document.getElementById('valorComAcrescimo').textContent = '';
}

// Alterna a visibilidade dos lançamentos de um dia
function toggleMinimize(dia) {
    const diaFormatado = formatarDataParaClasse(dia); // Formata a data para o formato correto
    const lancamentos = document.querySelectorAll(`.lancamento-${diaFormatado}`);
    lancamentos.forEach(lancamento => {
        lancamento.style.display = lancamento.style.display === 'none' ? '' : 'none';
    });
}

// Inicializa o histórico ao carregar a página
window.onload = () => {
    carregarHistorico();
};
