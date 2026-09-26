/* =========================================================
   Tacho · pedido pelo WhatsApp (demonstração)
   ========================================================= */
(function () {
  'use strict';

  var T = window.TACHO;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var money = function (v) { return brl.format(v).replace(/ /g, ' '); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var itemById = function (id) { return T.itens.filter(function (i) { return i.id === id; })[0]; };
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  /* ---------- Horário (fuso de João Pessoa) ---------- */
  function agora() {
    var q = new URLSearchParams(location.search);
    if (q.get('dia') !== null && q.get('hora')) { // útil para testar: ?dia=1&hora=12:00
      var hm = q.get('hora').split(':');
      return { dia: +q.get('dia'), min: +hm[0] * 60 + +hm[1] };
    }
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Fortaleza', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { dia: dia, min: (+get('hour') % 24) * 60 + +get('minute') };
  }
  function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function fmtHora(s) { var p = s.split(':'); return p[1] === '00' ? (+p[0]) + 'h' : (+p[0]) + 'h' + p[1]; }

  function status() {
    var n = agora(), turnos = T.horarios[n.dia] || [];
    for (var i = 0; i < turnos.length; i++) {
      if (n.min >= toMin(turnos[i][0]) && n.min < toMin(turnos[i][1])) return { aberto: true, texto: 'Aberto agora · fecha às ' + fmtHora(turnos[i][1]) };
    }
    for (var j = 0; j < turnos.length; j++) if (n.min < toMin(turnos[j][0])) return { aberto: false, texto: 'Fechado agora · abre hoje às ' + fmtHora(turnos[j][0]) };
    for (var k = 1; k <= 7; k++) {
      var d = (n.dia + k) % 7, t = T.horarios[d] || [];
      if (t.length) return { aberto: false, texto: 'Fechado agora · abre ' + (k === 1 ? 'amanhã' : DIAS[d]) + ' às ' + fmtHora(t[0][0]) };
    }
    return { aberto: false, texto: 'Fechado' };
  }
  var st = status();
  $$('[data-status]').forEach(function (el) {
    el.classList.toggle('is-closed', !st.aberto);
    $('.txt', el).textContent = st.texto;
  });
  (function renderHorarios() {
    var ul = $('#hours'); if (!ul) return;
    var hoje = agora().dia, ordem = [2, 3, 4, 5, 6, 0, 1];
    ul.innerHTML = ordem.map(function (d) {
      var t = T.horarios[d];
      var txt = t.length ? t.map(function (x) { return fmtHora(x[0]) + ' às ' + fmtHora(x[1]); }).join(' e ') : 'Fechado';
      return '<li' + (d === hoje ? ' class="today"' : '') + '><span>' + DIAS[d].charAt(0).toUpperCase() + DIAS[d].slice(1) + '</span><span>' + txt + '</span></li>';
    }).join('');
  })();
  (function renderTaxas() {
    var ul = $('#fees'); if (!ul) return;
    ul.innerHTML = T.bairros.map(function (b) { return '<li><span>' + b[0] + '</span><span class="money">' + money(b[1]) + '</span></li>'; }).join('');
  })();

  /* ---------- Painéis com foco preso ---------- */
  var overlay = $('#overlay'), stack = [], lastFocus = [];
  function focusables(el) { return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea', el).filter(function (n) { return n.offsetParent !== null; }); }
  function open(el) {
    lastFocus.push(document.activeElement);
    stack.push(el);
    el.hidden = false; overlay.hidden = false;
    document.body.classList.add('no-scroll');
    void el.offsetWidth;
    overlay.classList.add('is-open'); el.classList.add('is-open');
    overlay.style.zIndex = el.classList.contains('wa-modal') ? 92 : 80;
    var f = focusables(el); if (f.length) f[0].focus();
  }
  function close() {
    var el = stack.pop(); if (!el) return;
    el.classList.remove('is-open');
    setTimeout(function () { if (stack.indexOf(el) < 0) el.hidden = true; }, 300);
    if (!stack.length) {
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { if (!stack.length) overlay.hidden = true; }, 260);
    } else overlay.style.zIndex = 80;
    var lf = lastFocus.pop(); if (lf && lf.focus) lf.focus();
  }
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    var top = stack[stack.length - 1]; if (!top) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      var f = focusables(top); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });

  var toastEl = $('#toast'), toastT;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200); }

  /* ---------- Pedido (estado) ---------- */
  function load() { try { return JSON.parse(localStorage.getItem('tacho-pedido')) || { linhas: [], modo: 'entrega', bairro: '' }; } catch (e) { return { linhas: [], modo: 'entrega', bairro: '' }; } }
  function save() { try { localStorage.setItem('tacho-pedido', JSON.stringify(pedido)); } catch (e) {} }
  var pedido = load();
  function subtotal() { return pedido.linhas.reduce(function (s, l) { return s + l.unit * l.qtd; }, 0); }
  function qtdTotal() { return pedido.linhas.reduce(function (s, l) { return s + l.qtd; }, 0); }
  function taxa() {
    if (pedido.modo !== 'entrega' || !pedido.bairro) return 0;
    var b = T.bairros.filter(function (x) { return x[0] === pedido.bairro; })[0];
    return b ? b[1] : 0;
  }

  /* ---------- Cardápio ---------- */
  var menuRoot = $('#menu');
  function dishCard(it) {
    var inCart = pedido.linhas.filter(function (l) { return l.id === it.id; }).reduce(function (s, l) { return s + l.qtd; }, 0);
    return '<button type="button" class="dish" data-dish="' + it.id + '" aria-label="' + esc(it.nome) + ', ' + money(it.preco) + '. Escolher">' +
      '<span class="dish-body">' +
        (it.selos.length ? '<span class="selos">' + it.selos.map(function (s) { return '<span class="selo' + (s === 'Vegetariano' ? ' veg' : '') + '">' + s + '</span>'; }).join('') + '</span>' : '') +
        '<h4>' + esc(it.nome) + '</h4><p>' + esc(it.desc) + '</p>' +
        '<span class="dish-foot"><span class="dish-price money">' + money(it.preco) + '</span>' + (inCart ? '<span class="in-cart">' + inCart + ' no pedido</span>' : '') + '</span>' +
      '</span>' +
      '<span class="dish-img"><img src="img/cardapio/' + it.img + '.jpg" alt="" width="132" height="132" loading="lazy"><span class="dish-add" aria-hidden="true">+</span></span>' +
    '</button>';
  }
  function renderMenu(filtro) {
    var f = (filtro || '').trim().toLowerCase();
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var html = '', total = 0;
    T.categorias.forEach(function (c) {
      var its = T.itens.filter(function (i) { return i.cat === c[0] && (!f || norm(i.nome + ' ' + i.desc).indexOf(norm(f)) > -1); });
      total += its.length;
      if (!its.length) return;
      html += '<section class="menu-cat" id="cat-' + c[0] + '" aria-labelledby="h-' + c[0] + '"><h3 id="h-' + c[0] + '">' + c[1] + '</h3><div class="menu-grid">' + its.map(dishCard).join('') + '</div></section>';
    });
    menuRoot.innerHTML = total ? html : '<p class="no-results">Nada encontrado para “' + esc(filtro) + '”. Tente “carne”, “tapioca” ou “suco”.</p>';
    spy();
  }
  $('#tabs').innerHTML = T.categorias.map(function (c, i) { return '<li><a href="#cat-' + c[0] + '"' + (i === 0 ? ' class="is-active"' : '') + '>' + c[1] + '</a></li>'; }).join('');
  var searchIn = $('#search');
  searchIn.addEventListener('input', function () { renderMenu(searchIn.value); });

  var spyObs;
  function spy() {
    if (!('IntersectionObserver' in window)) return;
    if (spyObs) spyObs.disconnect();
    spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        $$('#tabs a').forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id;
          a.classList.toggle('is-active', on);
          if (on) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    $$('.menu-cat').forEach(function (s) { spyObs.observe(s); });
  }
  menuRoot.addEventListener('click', function (e) { var b = e.target.closest('[data-dish]'); if (b) openDish(b.getAttribute('data-dish')); });

  /* ---------- Modal do prato ---------- */
  var dm = $('#dish-modal'), atual = null, qtd = 1;
  function openDish(id) {
    atual = itemById(id); qtd = 1;
    var gid = 0;
    $('#dm-content').innerHTML =
      '<img class="dm-img" src="img/cardapio/' + atual.img + '.jpg" alt="' + esc(atual.nome) + '" width="720" height="405">' +
      '<div class="dm-body"><h2 id="dm-title">' + esc(atual.nome) + '</h2><p>' + esc(atual.desc) + '</p><p class="dm-price money">' + money(atual.preco) + '</p>' +
      atual.grupos.map(function (g) {
        var i = gid++;
        var badge = g.tipo === 'um' && g.obrigatorio ? '<span class="req" data-req="' + i + '">Obrigatório</span>' : '<span class="req opt">Opcional</span>';
        return '<div class="opt-group"><fieldset data-g="' + i + '"><legend><span>' + esc(g.nome) + '</span>' + badge + '</legend>' +
          g.opcoes.map(function (o, j) {
            return '<label class="opt-row"><input type="' + (g.tipo === 'um' ? 'radio' : 'checkbox') + '" name="g' + i + '" value="' + j + '"><span>' + esc(o[0]) + '</span>' +
              (o[1] ? '<span class="opt-price money">+ ' + money(o[1]) + '</span>' : '') + '</label>';
          }).join('') + '</fieldset><p class="opt-error" hidden></p></div>';
      }).join('') +
      '<label class="obs" for="dm-obs">Alguma observação?</label><textarea id="dm-obs" maxlength="140" placeholder="Ex.: sem cebola, carne bem passada"></textarea></div>';
    updateDishPrice();
    open(dm);
  }
  function escolhas() {
    var out = [];
    atual.grupos.forEach(function (g, i) {
      $$('input[name="g' + i + '"]:checked', dm).forEach(function (inp) { var o = g.opcoes[+inp.value]; out.push({ grupo: g.nome, nome: o[0], preco: o[1] }); });
    });
    return out;
  }
  function unitPrice() { return atual.preco + escolhas().reduce(function (s, e) { return s + e.preco; }, 0); }
  function updateDishPrice() {
    $('#dm-qty').textContent = qtd;
    $('#dm-minus').disabled = qtd <= 1;
    $('#dm-total').textContent = money(unitPrice() * qtd);
    atual.grupos.forEach(function (g, i) {
      var badge = $('[data-req="' + i + '"]', dm);
      if (badge) { var ok = !!$('input[name="g' + i + '"]:checked', dm); badge.classList.toggle('ok', ok); badge.textContent = ok ? 'Escolhido' : 'Obrigatório'; }
    });
  }
  dm.addEventListener('change', function (e) {
    if (e.target.name) { var fs = e.target.closest('fieldset'); var er = fs.parentNode.querySelector('.opt-error'); if (er) er.hidden = true; }
    updateDishPrice();
  });
  $('#dm-minus').addEventListener('click', function () { if (qtd > 1) qtd--; updateDishPrice(); });
  $('#dm-plus').addEventListener('click', function () { if (qtd < 20) qtd++; updateDishPrice(); });
  $('#dm-add').addEventListener('click', function () {
    var falta = null;
    atual.grupos.forEach(function (g, i) {
      if (g.tipo === 'um' && g.obrigatorio && !$('input[name="g' + i + '"]:checked', dm)) {
        var fs = $('fieldset[data-g="' + i + '"]', dm), er = fs.parentNode.querySelector('.opt-error');
        er.textContent = 'Escolha uma opção de ' + g.nome.toLowerCase() + '.'; er.hidden = false;
        if (!falta) falta = fs;
      }
    });
    if (falta) { falta.scrollIntoView({ block: 'center', behavior: 'smooth' }); var r = $('input', falta); if (r) r.focus(); return; }
    var linha = { id: atual.id, nome: atual.nome, qtd: qtd, unit: unitPrice(), escolhas: escolhas(), obs: $('#dm-obs').value.trim() };
    var key = JSON.stringify([linha.id, linha.escolhas, linha.obs]);
    var igual = pedido.linhas.filter(function (l) { return JSON.stringify([l.id, l.escolhas, l.obs]) === key; })[0];
    if (igual) igual.qtd += qtd; else pedido.linhas.push(linha);
    save(); close(); refresh();
    toast(qtd + 'x ' + atual.nome + ' no pedido');
  });

  /* ---------- Sacola ---------- */
  var cart = $('#cart'), view = 'itens';
  function renderCart() {
    var body = $('#cart-body'), foot = $('#cart-foot');
    $('#cart-back').hidden = view === 'itens';
    $('#cart-title').textContent = view === 'itens' ? 'Seu pedido' : 'Entrega e pagamento';
    if (!pedido.linhas.length) {
      view = 'itens';
      body.innerHTML = '<div class="cart-empty"><strong>Seu pedido está vazio</strong>Escolha um prato no cardápio para começar.<br><button type="button" class="btn btn-outline" data-close>Ver cardápio</button></div>';
      foot.innerHTML = '';
      return;
    }
    var sub = subtotal(), tx = taxa(), total = sub + tx;
    var abaixo = pedido.modo === 'entrega' && sub < T.pedidoMinimo;
    var semBairro = pedido.modo === 'entrega' && !pedido.bairro;

    if (view === 'itens') {
      body.innerHTML = pedido.linhas.map(function (l, i) {
        var det = l.escolhas.map(function (e) { return '<li>' + esc(e.nome) + (e.preco ? ' (+' + money(e.preco) + ')' : '') + '</li>'; }).join('') + (l.obs ? '<li>Obs.: ' + esc(l.obs) + '</li>' : '');
        return '<div class="cart-item"><div><h3>' + esc(l.nome) + '</h3>' + (det ? '<ul>' + det + '</ul>' : '') + '</div><span class="ci-price money">' + money(l.unit * l.qtd) + '</span>' +
          '<div class="ci-actions"><div class="stepper" role="group" aria-label="Quantidade de ' + esc(l.nome) + '"><button type="button" data-q="-1" data-i="' + i + '" aria-label="Diminuir">−</button><span>' + l.qtd + '</span><button type="button" data-q="1" data-i="' + i + '" aria-label="Aumentar">+</button></div>' +
          '<button type="button" class="link-btn" data-rm="' + i + '">Remover</button></div></div>';
      }).join('') +
        '<div class="seg" role="group" aria-label="Como quer receber"><button type="button" data-modo="entrega" aria-pressed="' + (pedido.modo === 'entrega') + '">Entrega<small>40 a 60 min</small></button>' +
        '<button type="button" data-modo="retirada" aria-pressed="' + (pedido.modo === 'retirada') + '">Retirar no balcão<small>pronto em 25 min</small></button></div>' +
        (pedido.modo === 'entrega' ? '<div class="field"><label for="bairro">Bairro</label><select id="bairro"><option value="">Escolha o bairro</option>' +
          T.bairros.map(function (b) { return '<option value="' + b[0] + '"' + (pedido.bairro === b[0] ? ' selected' : '') + '>' + b[0] + ' · ' + money(b[1]) + '</option>'; }).join('') +
          '</select><span class="subtle" style="font-size:13px">Outro bairro? Chame no WhatsApp que a gente vê.</span></div>' : '<p class="notice" style="background:var(--folha-soft);color:var(--folha)">Retirada na Av. Exemplo, 000, Manaíra.</p>') +
        (!st.aberto ? '<p class="notice">' + esc(st.texto) + '. Você pode enviar o pedido agora e ele entra na fila para a abertura.</p>' : '');
      foot.innerHTML = summary(sub, tx, total) +
        (abaixo ? '<p class="notice bad" style="margin:0 0 12px">O pedido mínimo para entrega é ' + money(T.pedidoMinimo) + '. Faltam ' + money(T.pedidoMinimo - sub) + '.</p>' : '') +
        '<button type="button" class="btn btn-primary btn-block btn-lg" id="to-checkout"' + (abaixo || semBairro ? ' disabled' : '') + '>' + (semBairro && !abaixo ? 'Escolha o bairro para continuar' : 'Continuar') + '</button>';
    } else {
      var d = pedido.dados || {};
      body.innerHTML =
        '<form id="checkout-form" novalidate>' +
        field('nome', 'Seu nome', 'text', d.nome, 'given-name') +
        field('fone', 'WhatsApp', 'tel', d.fone, 'tel', '(83) 90000-0000') +
        (pedido.modo === 'entrega' ?
          '<div class="row-2">' + field('rua', 'Rua', 'text', d.rua, 'address-line1') + field('num', 'Número', 'text', d.num, 'off') + '</div>' +
          field('comp', 'Complemento (opcional)', 'text', d.comp, 'address-line2', 'Apto, bloco') +
          field('ref', 'Ponto de referência (opcional)', 'text', d.ref, 'off', 'Perto de…') +
          '<p class="subtle" style="font-size:13px;margin-top:8px">Bairro: <strong>' + esc(pedido.bairro) + '</strong></p>' : '') +
        '<div class="field"><span class="lbl" id="pay-lbl">Pagamento</span><div class="pay-options" role="radiogroup" aria-labelledby="pay-lbl">' +
          pay('pix', 'Pix', 'A chave vem na confirmação', d.pag) + pay('cartao', 'Cartão na entrega', 'Crédito ou débito, a maquininha vai junto', d.pag) + pay('dinheiro', 'Dinheiro', '', d.pag) +
        '</div><span class="field-error" id="pag-err"></span></div>' +
        '<div class="field" id="troco-field"' + (d.pag === 'dinheiro' ? '' : ' hidden') + '><label for="f-troco">Troco para quanto?</label><input id="f-troco" name="troco" inputmode="decimal" placeholder="Ex.: 100 (deixe vazio se não precisar)" value="' + esc(d.troco || '') + '"><span class="field-error"></span></div>' +
        '</form>';
      foot.innerHTML = summary(sub, tx, total) + '<button type="button" class="btn btn-primary btn-block btn-lg" id="review">Revisar e enviar pelo WhatsApp</button>';
      var fone = $('#f-fone');
      fone.addEventListener('input', function () {
        var v = fone.value.replace(/\D/g, '').slice(0, 11);
        fone.value = v.length > 2 ? '(' + v.slice(0, 2) + ') ' + (v.length > 7 ? v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.slice(2)) : v;
      });
    }
  }
  function field(name, label, type, val, ac, ph) {
    return '<div class="field"><label for="f-' + name + '">' + label + '</label><input id="f-' + name + '" name="' + name + '" type="' + type + '" autocomplete="' + ac + '"' + (ph ? ' placeholder="' + ph + '"' : '') + ' value="' + esc(val || '') + '"><span class="field-error"></span></div>';
  }
  function pay(v, t, s, cur) { return '<label class="pay"><input type="radio" name="pag" value="' + v + '"' + (cur === v ? ' checked' : '') + '><span>' + t + (s ? '<small>' + s + '</small>' : '') + '</span></label>'; }
  function summary(sub, tx, total) {
    return '<div class="sum"><div><span>Subtotal</span><span class="money">' + money(sub) + '</span></div>' +
      (pedido.modo === 'entrega' ? '<div><span>Entrega' + (pedido.bairro ? ' (' + esc(pedido.bairro) + ')' : '') + '</span><span class="money">' + (pedido.bairro ? money(tx) : 'escolha o bairro') + '</span></div>' : '<div><span>Retirada</span><span>grátis</span></div>') +
      '<div class="total"><span>Total</span><span class="money" id="cart-total">' + money(total) + '</span></div></div>';
  }

  cart.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]'), md = e.target.closest('[data-modo]');
    if (q) { var l = pedido.linhas[+q.getAttribute('data-i')]; l.qtd += +q.getAttribute('data-q'); if (l.qtd < 1) pedido.linhas.splice(+q.getAttribute('data-i'), 1); }
    else if (rm) pedido.linhas.splice(+rm.getAttribute('data-rm'), 1);
    else if (md) pedido.modo = md.getAttribute('data-modo');
    else if (e.target.id === 'to-checkout') { view = 'dados'; renderCart(); var f = $('#f-nome'); if (f) f.focus(); return; }
    else if (e.target.closest('#cart-back')) { saveDados(); view = 'itens'; renderCart(); return; }
    else if (e.target.id === 'review') { review(); return; }
    else return;
    save(); refresh();
  });
  cart.addEventListener('change', function (e) {
    if (e.target.id === 'bairro') { pedido.bairro = e.target.value; save(); refresh(); $('#bairro').focus(); }
    if (e.target.name === 'pag') { $('#troco-field').hidden = e.target.value !== 'dinheiro'; $('#pag-err').textContent = ''; }
  });

  function saveDados() {
    var f = $('#checkout-form'); if (!f) return;
    var fd = new FormData(f), d = {};
    fd.forEach(function (v, k) { d[k] = String(v).trim(); });
    pedido.dados = d; save();
  }
  function setErr(name, msg) {
    var inp = $('#f-' + name); if (!inp) return;
    var fld = inp.closest('.field'); fld.classList.toggle('has-error', !!msg);
    $('.field-error', fld).textContent = msg || '';
  }
  function review() {
    saveDados();
    var d = pedido.dados, erro = null, total = subtotal() + taxa();
    var req = { nome: 'Informe seu nome.', fone: 'Informe um WhatsApp com DDD.' };
    if (pedido.modo === 'entrega') { req.rua = 'Informe a rua.'; req.num = 'Informe o número.'; }
    Object.keys(req).forEach(function (k) {
      var bad = !d[k] || (k === 'fone' && d[k].replace(/\D/g, '').length < 10);
      setErr(k, bad ? req[k] : '');
      if (bad && !erro) erro = $('#f-' + k);
    });
    if (!d.pag) { $('#pag-err').textContent = 'Escolha a forma de pagamento.'; if (!erro) erro = $('input[name="pag"]'); }
    if (d.pag === 'dinheiro' && d.troco) {
      var tv = parseFloat(d.troco.replace(/\./g, '').replace(',', '.'));
      if (!(tv >= total)) { setErr('troco', 'O troco precisa ser para um valor maior que ' + money(total) + '.'); if (!erro) erro = $('#f-troco'); }
      else setErr('troco', '');
    }
    if (erro) { erro.focus(); return; }
    var msg = mensagem();
    // Mostra como o WhatsApp exibe: *texto* vira negrito
    $('#wa-text').innerHTML = esc(msg).replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
    $('#wa-send').href = 'https://wa.me/' + T.whatsapp + '?text=' + encodeURIComponent(msg);
    open($('#wa-modal'));
  }
  function mensagem() {
    var d = pedido.dados, sub = subtotal(), tx = taxa(), L = [];
    L.push('*Novo pedido · Tacho Cozinha Nordestina*', '');
    pedido.linhas.forEach(function (l) {
      L.push('*' + l.qtd + 'x ' + l.nome + '* · ' + money(l.unit * l.qtd));
      l.escolhas.forEach(function (e) { L.push('   - ' + e.nome + (e.preco ? ' (+' + money(e.preco) + ')' : '')); });
      if (l.obs) L.push('   - Obs.: ' + l.obs);
    });
    L.push('', 'Subtotal: ' + money(sub));
    L.push(pedido.modo === 'entrega' ? 'Entrega (' + pedido.bairro + '): ' + money(tx) : 'Retirada no balcão');
    L.push('*Total: ' + money(sub + tx) + '*', '');
    if (pedido.modo === 'entrega') {
      L.push('*Endereço*', d.rua + ', ' + d.num + (d.comp ? ' · ' + d.comp : ''), pedido.bairro + (d.ref ? ' · Ref.: ' + d.ref : ''), '');
    }
    var pg = { pix: 'Pix', cartao: 'Cartão na entrega', dinheiro: 'Dinheiro' }[d.pag];
    if (d.pag === 'dinheiro') pg += d.troco ? ', troco para ' + money(parseFloat(d.troco.replace(/\./g, '').replace(',', '.'))) : ', sem troco';
    L.push('*Pagamento:* ' + pg);
    L.push('*Nome:* ' + d.nome + ' · ' + d.fone);
    return L.join('\n');
  }

  function refresh() {
    var n = qtdTotal(), sub = subtotal();
    $$('[data-cart-count]').forEach(function (el) { el.textContent = n; });
    $$('[data-cart-total]').forEach(function (el) { el.textContent = money(sub); });
    var mb = $('#mobile-cart'); mb.hidden = n === 0; document.body.classList.toggle('has-cart', n > 0);
    renderCart();
    renderMenu(searchIn.value);
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', function () { view = 'itens'; renderCart(); open(cart); }); });

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  refresh();
})();
