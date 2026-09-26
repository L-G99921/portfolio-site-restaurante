# Plano de ação: restaurante regional com pedido pelo WhatsApp

Base: [REFERENCIAS.md](REFERENCIAS.md). Design system: **Mailchimp** (marca) + **Square** (fluxo de pedido).

---

## 1. Marca (fictícia)

| Item | Proposta |
|---|---|
| Nome | **Tacho** · Cozinha Nordestina |
| Por quê | O tacho de cobre é onde se apura doce de leite, rapadura e goiabada no sertão. É um nome curto, regional e fácil de lembrar |
| Onde | Bairro de Manaíra, João Pessoa (PB) |
| O que serve | Comida nordestina de casa, com porções individuais e para dividir |
| Funcionamento | Almoço e jantar, de terça a domingo |

## 2. O que o dono de restaurante vai ver funcionando
1. **Cardápio em HTML** com foto, descrição, preço e selos (mais pedido, vegetariano, serve 2).
2. **Adicionais e observações** por prato: ponto da carne, "sem cebola", "+ queijo coalho", acompanhamentos.
3. **Status "Aberto agora / Fecha às 22h / Abre amanhã às 11h"**, calculado pelo horário real.
4. **Carrinho** com quantidade, subtotal, **pedido mínimo** e **taxa por bairro**.
5. **Entrega ou retirada**, e pagamento em **Pix**, cartão na entrega ou dinheiro com **"troco para quanto?"**.
6. Botão final que **abre o WhatsApp com o pedido formatado**: itens, adicionais, endereço, pagamento e total.
7. Argumento de venda na página: pedido direto, sem comissão de aplicativo.
8. **Crédito do autor** no rodapé e no aviso de demonstração, com o WhatsApp (83) 98116-5331 e o e-mail lgos99921@gmail.com.

## 3. Direção visual
- **Fundo** creme quente ("Parsnip" do Mailchimp).
- **Texto** marrom-escuro em vez de preto.
- **Cores:**
  - **Amarelo-sol** para destaques;
  - **urucum/terracota** para botões de ação;
  - **verde da folha de bananeira** para "aberto" e sucesso.
- **Tipografia:** uma serifa com personalidade nos títulos e nomes dos pratos, e uma sans legível nos preços e botões.
- **Fotos** de comida bem iluminadas (Unsplash), conferidas uma a uma, sem clichês de banco de imagem.
- **Carrinho** no padrão Square: botão sólido, números alinhados, total sempre à vista.
- **No celular**, uma barra fixa embaixo com "Ver pedido · 3 itens · R$ 87,00".

## 4. Página única, com cardápio no centro
Hero (nome, status aberto/fechado, "Pedir agora") → cardápio com abas por categoria → a casa (história curta, fotos do salão) → horários e endereço → como funciona o pedido → rodapé. O carrinho é uma gaveta lateral no desktop e uma tela cheia no celular.

**Categorias do cardápio:** Pratos da casa · Para dividir · Cuscuz e tapioca · Acompanhamentos · Sobremesas · Bebidas.

## 5. Etapas
1. Fotos: buscar, conferir e baixar.
2. Dados do cardápio (cerca de 20 itens) e taxas por bairro de João Pessoa.
3. Layout, cardápio e modal do prato com adicionais.
4. Carrinho, checkout e montagem da mensagem do WhatsApp.
5. Testes automáticos de ponta a ponta + celular em 390px.
6. Revisão de texto anti-"cara de IA".
7. Localhost → GitHub Pages (`portfolio-site-restaurante`).
