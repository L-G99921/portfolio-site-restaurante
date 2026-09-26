# Tacho · Cozinha Nordestina

Site de um restaurante **fictício** em João Pessoa, feito como peça de portfólio. Mostra como um restaurante pode receber pedidos pelo próprio site, direto no WhatsApp, sem pagar comissão de aplicativo.

**Site no ar:** https://l-g99921.github.io/portfolio-site-restaurante/

## O que dá para testar
- **Status "aberto / fechado"** calculado pelo horário de João Pessoa ("fecha às 15h", "abre amanhã às 11h").
- **Cardápio em HTML** com busca, categorias fixas no topo e selos (mais pedido, serve 2, vegetariano).
- **Modal do prato** com escolhas obrigatórias (acompanhamento, tamanho, açúcar), adicionais pagos, observação e quantidade.
- **Pedido** com entrega ou retirada, taxa por bairro, pedido mínimo e aviso quando o restaurante está fechado.
- **Checkout** com nome, WhatsApp (com máscara), endereço, e pagamento em Pix, cartão na entrega ou dinheiro com troco validado.
- **Prévia da mensagem** exatamente como vai chegar no WhatsApp do restaurante, e o botão que abre o WhatsApp com ela pronta.
- Pedido salvo no navegador. Barra fixa "Ver pedido" no celular.

Para simular outro dia e horário: `index.html?dia=1&hora=12:00` (0 = domingo).

## Como rodar
```bash
node server.js
```
Abra http://localhost:5503.

## Estrutura
```
index.html        Página única
css/styles.css    Estilos e tokens
js/cardapio.js    Pratos, preços, opções, horários e taxas por bairro
js/app.js         Status, cardápio, modal, pedido e mensagem do WhatsApp
img/              Fotos do Unsplash
REFERENCIAS.md    Pesquisa e análise de design systems
PLANO.md          Plano de ação
```

Para adaptar a outro restaurante, basta editar `js/cardapio.js`: o número do WhatsApp, os horários, os bairros e o cardápio.

## Design
| Sistema | O que veio dele |
|---|---|
| Mailchimp | Calor de pequeno negócio: fundo creme, texto marrom, serifa com personalidade (Fraunces) + sans (DM Sans) |
| Square | Fluxo de pedido: botão sólido, valores alinhados, total sempre à vista, cantos de 6px |

## Observações
Restaurante, endereço, telefone e preços são fictícios. Fotos: [Unsplash](https://unsplash.com/).
