const STORAGE_KEY="controleGabaritos_v1";
const processos={solda:"Solda Ponto",projecao:"Solda Projeção",prensas:"Prensas"};
let gabaritos=lerDados(),processoAtual="solda",selecionado=null;
const $=id=>document.getElementById(id);
function lerDados(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(v)?v:[]}catch{return[]}}
function salvar(){localStorage.setItem(STORAGE_KEY,JSON.stringify(gabaritos))}
function safe(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function pagina(id){["paginaInicial","paginaConsulta","paginaAdmin"].forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}
function abrirProcesso(p){processoAtual=p;selecionado=null;$("tituloProcesso").textContent=processos[p];$("pesquisaCodigo").value="";pagina("paginaConsulta");renderLista();localizacao(null);$("pesquisaCodigo").focus()}
function listaFiltrada(){const termo=$("pesquisaCodigo").value.trim();return gabaritos.filter(g=>g.processo===processoAtual&&g.codigo.includes(termo)).sort((a,b)=>Number(a.codigo)-Number(b.codigo))}
function renderLista(){const lista=listaFiltrada();$("totalCategoria").textContent=gabaritos.filter(g=>g.processo===processoAtual).length+" gabaritos";$("quantidadeResultados").textContent=lista.length;$("textoResultados").textContent=$("pesquisaCodigo").value.trim()?"Resultados da pesquisa":"Lista em ordem numérica crescente";
if(!lista.length){$("listaGabaritos").innerHTML=`<div class="empty-list">${gabaritos.some(g=>g.processo===processoAtual)?"Nenhum gabarito corresponde à pesquisa.":"Nenhum gabarito cadastrado neste processo ainda."}</div>`;localizacao(null);return}
$("listaGabaritos").innerHTML=lista.map(g=>`<button class="gabarito-row ${g.id===selecionado?"selected":""}" data-id="${safe(g.id)}"><span><span class="row-code">${safe(g.codigo)}</span>${g.descricao?`<span class="row-description">${safe(g.descricao)}</span>`:""}</span><span class="row-location">${safe(g.fileira)}${safe(g.posicao)}</span></button>`).join("");
const exato=lista.find(g=>g.codigo===$("pesquisaCodigo").value.trim());if(exato){selecionado=exato.id;localizacao(exato);marcar()}else if(selecionado){const atual=lista.find(g=>g.id===selecionado);if(atual)localizacao(atual);else{selecionado=null;localizacao(null)}}else localizacao(null)}
function marcar(){document.querySelectorAll(".gabarito-row").forEach(x=>x.classList.toggle("selected",x.dataset.id===selecionado))}
function localizacao(g){if(!g){$("painelLocalizacao").innerHTML='<div class="placeholder"><span>⌖</span><h2>Localização do gabarito</h2><p>Pesquise ou selecione um código na lista para visualizar onde ele está armazenado.</p></div>';return}
$("painelLocalizacao").innerHTML=`<div class="location-result"><span class="label">GABARITO ENCONTRADO</span><h2>${safe(g.codigo)}</h2><span class="label">LOCALIZAÇÃO NA PRATELEIRA</span><div class="big-location">${safe(g.fileira)}${safe(g.posicao)}</div>${g.descricao?`<div class="detail"><span>DESCRIÇÃO</span><strong>${safe(g.descricao)}</strong></div>`:""}<div class="detail"><span>PROCESSO</span><strong>${processos[g.processo]}</strong></div>${g.observacoes?`<div class="detail"><span>OBSERVAÇÕES</span><strong>${safe(g.observacoes)}</strong></div>`:""}<span class="found">✓ Registro localizado</span></div>`}
function limparForm(){
    $("formGabarito").reset();
    $("registroId").value="";
    $("erroFormulario").textContent="";
    $("btnSalvar").textContent="Salvar gabarito";
}
function renderAdmin() {
    const termo = $("pesquisaAdmin").value.trim().toLowerCase();

    const arr = [...gabaritos]
        .filter(g => {
            const codigo = String(g.codigo).toLowerCase();
            const localizacao = `${g.fileira}${g.posicao}`.toLowerCase();
            const posicao = String(g.posicao).toLowerCase();
            const fileira = String(g.fileira).toLowerCase();

            return codigo.includes(termo) ||
                   localizacao.includes(termo) ||
                   posicao.includes(termo) ||
                   fileira.includes(termo);
        })
        .sort((a, b) => Number(a.codigo) - Number(b.codigo));

    $("totalAdmin").textContent = arr.length;

    $("tabelaAdmin").innerHTML = arr.length
        ? arr.map(g => `
            <tr>
                <td><strong>${safe(g.codigo)}</strong></td>
                <td>${processos[g.processo]}</td>
                <td><strong>${safe(g.fileira)}${safe(g.posicao)}</strong></td>
                <td>${safe(g.descricao || "—")}</td>
                <td>
                    <button class="table-action edit"
                        data-acao="editar"
                        data-id="${safe(g.id)}">Editar</button>
                    <button class="table-action delete"
                        data-acao="excluir"
                        data-id="${safe(g.id)}">Excluir</button>
                </td>
            </tr>
        `).join("")
        : '<tr><td colspan="5">Nenhum registro encontrado.</td></tr>';
}
document.querySelectorAll(".process-card").forEach(b=>b.addEventListener("click",()=>abrirProcesso(b.dataset.processo)));
$("btnVoltar").addEventListener("click",()=>pagina("paginaInicial"));$("logoInicio").addEventListener("click",e=>{e.preventDefault();pagina("paginaInicial")});
$("btnAdministrar").addEventListener("click",()=>{limparForm();renderAdmin();pagina("paginaAdmin")});
$("btnVoltarAdmin").addEventListener("click",()=>{pagina("paginaConsulta");renderLista()});
$("pesquisaCodigo").addEventListener("input",()=>{selecionado=null;renderLista()});
$("limparPesquisa").addEventListener("click",()=>{$("pesquisaCodigo").value="";selecionado=null;renderLista();$("pesquisaCodigo").focus()});
$("listaGabaritos").addEventListener("click",e=>{const row=e.target.closest(".gabarito-row");if(!row)return;const g=gabaritos.find(x=>x.id===row.dataset.id);if(g){selecionado=g.id;localizacao(g);marcar()}});
$("formGabarito").addEventListener("submit",e=>{e.preventDefault();$("erroFormulario").textContent="";const id=$("registroId").value,codigo=$("codigo").value.trim(),processo=$("processo").value,fileira=$("fileira").value,posicao=Number($("posicao").value),descricao=$("descricao").value.trim(),observacoes=$("observacoes").value.trim();
if(!/^\d+$/.test(codigo)){$("erroFormulario").textContent="Informe um código formado somente por números.";return}
if(!processo||!fileira||!Number.isInteger(posicao)||posicao<1){$("erroFormulario").textContent="Preencha processo, fileira e posição corretamente.";return}
const reg={id:id||(crypto.randomUUID?crypto.randomUUID():String(Date.now())),codigo,processo,fileira,posicao,descricao,observacoes};gabaritos=id?gabaritos.map(g=>g.id===id?reg:g):[...gabaritos,reg];salvar();limparForm();renderAdmin();if(!$("paginaConsulta").classList.contains("hidden"))renderLista()});
$("btnLimparForm").addEventListener("click",()=>setTimeout(()=>$("erroFormulario").textContent="",0));
$("tabelaAdmin").addEventListener("click",e=>{const b=e.target.closest("button[data-acao]");if(!b)return;const g=gabaritos.find(x=>x.id===b.dataset.id);if(!g)return;if(b.dataset.acao==="editar"){$("registroId").value=g.id;$("codigo").value=g.codigo;$("processo").value=g.processo;$("fileira").value=g.fileira;$("posicao").value=g.posicao;$("descricao").value=g.descricao||"";$("observacoes").value=g.observacoes||"";$("btnSalvar").textContent="Atualizar gabarito";$("formGabarito").scrollIntoView({behavior:"smooth"})}else if(confirm("Excluir o gabarito "+g.codigo+"?")){gabaritos=gabaritos.filter(x=>x.id!==g.id);salvar();renderAdmin()}});
pagina("paginaInicial");
$("pesquisaAdmin").addEventListener("input", renderAdmin);

$("limparPesquisaAdmin").addEventListener("click", () => {
    $("pesquisaAdmin").value = "";
    renderAdmin();
    $("pesquisaAdmin").focus();
});
