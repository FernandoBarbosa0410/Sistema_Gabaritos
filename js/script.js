document.addEventListener("DOMContentLoaded", () => {

    let totalReceitas = 0;
    let totalDespesas = 0;

    const saldo = document.getElementById("saldo");
    const receitas = document.getElementById("receitas");
    const despesas = document.getElementById("despesas");

    const btnReceita = document.querySelector(".acoes button:first-child");
    const btnDespesa = document.querySelector(".acoes button:last-child");

    // RECEITAS
    btnReceita.addEventListener("click", () => {

        const descricao = prompt("Descrição da receita:");

        if (!descricao) return;

        const valor = parseFloat(
            prompt("Valor da receita:")
        );

        if (isNaN(valor)) return;

        totalReceitas += valor;

        receitas.textContent =
            `R$ ${totalReceitas.toFixed(2)}`;

        saldo.textContent =
            `R$ ${(totalReceitas - totalDespesas).toFixed(2)}`;

        alert("Receita cadastrada com sucesso!");

    });

    // DESPESAS
    btnDespesa.addEventListener("click", () => {

        const descricao = prompt("Descrição da despesa:");

        if (!descricao) return;

        const valor = parseFloat(
            prompt("Valor da despesa:")
        );

        if (isNaN(valor)) return;

        totalDespesas += valor;

        despesas.textContent =
            `R$ ${totalDespesas.toFixed(2)}`;

        saldo.textContent =
            `R$ ${(totalReceitas - totalDespesas).toFixed(2)}`;

        alert("Despesa cadastrada com sucesso!");

    });

});