/* Tacho · Cozinha Nordestina (fictício)
   Grupos de opção:
     tipo 'um'    = escolhe uma (radio)  · obrigatorio: true/false
     tipo 'varios'= escolhe várias (checkbox) · max opcional */
window.TACHO = {
  whatsapp: '5583900000000', // número fictício do restaurante
  pedidoMinimo: 40,
  horarios: {
    // 0 = domingo ... 6 = sábado. Cada turno: [abre, fecha] em "HH:MM"
    0: [['11:00', '16:00']],
    1: [],
    2: [['11:00', '15:00'], ['18:00', '22:30']],
    3: [['11:00', '15:00'], ['18:00', '22:30']],
    4: [['11:00', '15:00'], ['18:00', '22:30']],
    5: [['11:00', '15:00'], ['18:00', '23:00']],
    6: [['11:00', '23:00']]
  },
  bairros: [
    ['Manaíra', 5], ['Tambaú', 6], ['Aeroclube', 6], ['Jardim Oceania', 7], ['Bessa', 7],
    ['Cabo Branco', 7], ['Miramar', 7], ['Brisamar', 7], ['Torre', 8], ['Altiplano', 9],
    ['Bancários', 10], ['Centro', 10], ['Jaguaribe', 10], ['Mangabeira', 12]
  ],
  categorias: [
    ['pratos', 'Pratos da casa'],
    ['dividir', 'Para dividir'],
    ['caldos', 'Caldos e tapiocas'],
    ['sobremesas', 'Sobremesas'],
    ['bebidas', 'Bebidas']
  ],
  itens: [
    {
      id: 'carne-de-sol', cat: 'pratos', nome: 'Carne de sol com macaxeira', preco: 69.9, img: 'carne-de-sol',
      desc: 'Carne de sol curada aqui mesmo por três dias, grelhada na chapa com manteiga de garrafa. Vem com vinagrete e farofa.',
      selos: ['Mais pedido'],
      grupos: [
        { nome: 'Acompanhamento', tipo: 'um', obrigatorio: true, opcoes: [['Macaxeira frita', 0], ['Macaxeira cozida na manteiga', 0], ['Arroz e feijão verde', 0]] },
        { nome: 'Adicionais', tipo: 'varios', opcoes: [['Queijo coalho na brasa', 9], ['Ovo frito', 3], ['Manteiga de garrafa extra', 4]] }
      ]
    },
    {
      id: 'baiao', cat: 'pratos', nome: 'Baião de dois com carne de sol', preco: 58.9, img: 'baiao',
      desc: 'Arroz, feijão verde, queijo coalho e nata cozidos juntos na panela de barro, com carne de sol desfiada por cima.',
      selos: [],
      grupos: [{ nome: 'Adicionais', tipo: 'varios', opcoes: [['Queijo coalho na brasa', 9], ['Ovo frito', 3], ['Linguiça de bode', 12]] }]
    },
    {
      id: 'galinha', cat: 'pratos', nome: 'Galinha caipira guisada', preco: 62.9, img: 'galinha',
      desc: 'Galinha de capoeira cozida devagar no molho de tomate e coentro. Vem com arroz branco e pirão feito com o caldo.',
      selos: ['Domingo'],
      grupos: []
    },
    {
      id: 'peixe', cat: 'pratos', nome: 'Peixe do dia com arroz de coco', preco: 74.9, img: 'peixe',
      desc: 'Posta do peixe que chegou de manhã do mercado de Tambaú, grelhada, com arroz de coco e salada de folhas.',
      selos: [],
      grupos: [{ nome: 'Adicionais', tipo: 'varios', opcoes: [['Camarão alho e óleo por cima', 18], ['Pirão de peixe', 8]] }]
    },
    {
      id: 'costela', cat: 'pratos', nome: 'Costela no bafo', preco: 79.9, img: 'costela',
      desc: 'Costela bovina assada por oito horas, desmanchando. Acompanha feijão verde, arroz e vinagrete.',
      selos: ['Serve 2'],
      grupos: [{ nome: 'Adicionais', tipo: 'varios', opcoes: [['Macaxeira cozida', 8], ['Farofa de ovo', 6]] }]
    },
    {
      id: 'frango-brasa', cat: 'pratos', nome: 'Frango na brasa', preco: 49.9, img: 'frango-brasa',
      desc: 'Meio frango temperado na véspera e assado na brasa. Vem com arroz, feijão verde e legumes na manteiga.',
      selos: [],
      grupos: [{ nome: 'Molho', tipo: 'um', obrigatorio: false, opcoes: [['Vinagrete', 0], ['Molho da casa (pimenta de cheiro)', 0], ['Sem molho', 0]] }]
    },
    {
      id: 'tabua', cat: 'dividir', nome: 'Tábua sertaneja', preco: 139.9, img: 'tabua',
      desc: 'Carne de sol, linguiça de bode, queijo coalho na brasa, macaxeira frita, feijão verde e vinagrete.',
      selos: ['Serve 3', 'Mais pedido'],
      grupos: []
    },
    {
      id: 'espetinhos', cat: 'dividir', nome: 'Espetinhos de carne e queijo coalho', preco: 54.9, img: 'espetinhos',
      desc: 'Seis espetinhos (quatro de alcatra e dois de queijo coalho com melaço) e farofa.',
      selos: ['Serve 2'],
      grupos: [{ nome: 'Molho', tipo: 'um', obrigatorio: true, opcoes: [['Vinagrete', 0], ['Molho da casa', 0], ['Sem molho', 0]] }]
    },
    {
      id: 'passarinho', cat: 'dividir', nome: 'Frango a passarinho', preco: 44.9, img: 'passarinho',
      desc: 'Frango em pedaços, frito com alho e cheiro-verde. Porção com cerca de 600 g.',
      selos: [],
      grupos: []
    },
    {
      id: 'macaxeira', cat: 'dividir', nome: 'Macaxeira frita', preco: 29.9, img: 'macaxeira',
      desc: 'Palitos de macaxeira cozida e depois frita, sequinha por fora. Vem com manteiga de garrafa para molhar.',
      selos: ['Vegetariano'],
      grupos: []
    },
    {
      id: 'jerimum', cat: 'caldos', nome: 'Caldo de jerimum com charque', preco: 22.9, img: 'jerimum',
      desc: 'Creme de jerimum com charque desfiado e queijo coalho em cubos. Tigela de 400 ml.',
      selos: [],
      grupos: [{ nome: 'Adicionais', tipo: 'varios', opcoes: [['Torradas', 4]] }]
    },
    {
      id: 'tapioca', cat: 'caldos', nome: 'Tapioca de carne de sol', preco: 27.9, img: 'tapioca',
      desc: 'Goma fresca recheada com carne de sol desfiada, queijo coalho e nata.',
      selos: [],
      grupos: [{ nome: 'Adicionais', tipo: 'varios', opcoes: [['Ovo', 3], ['Requeijão', 4], ['Coco ralado', 2]] }]
    },
    {
      id: 'mousse', cat: 'sobremesas', nome: 'Mousse de maracujá', preco: 16.9, img: 'mousse',
      desc: 'Com calda da própria fruta e pedaços de morango.',
      selos: [],
      grupos: []
    },
    {
      id: 'sorvete', cat: 'sobremesas', nome: 'Sorvete de tapioca com rapadura', preco: 19.9, img: 'sorvete',
      desc: 'Duas bolas de sorvete de tapioca feito na casa, calda quente de rapadura e castanha de caju.',
      selos: [],
      grupos: []
    },
    {
      id: 'petit-gateau', cat: 'sobremesas', nome: 'Petit gâteau de doce de leite', preco: 24.9, img: 'petit-gateau',
      desc: 'Bolinho quente com recheio de doce de leite apurado no tacho. Vai com sorvete de creme.',
      selos: [],
      grupos: []
    },
    {
      id: 'suco-caja', cat: 'bebidas', nome: 'Suco de cajá', preco: 11.9, img: 'suco-caja',
      desc: 'Feito com a polpa da fruta, na hora.',
      selos: [],
      grupos: [
        { nome: 'Tamanho', tipo: 'um', obrigatorio: true, opcoes: [['300 ml', 0], ['500 ml', 4]] },
        { nome: 'Açúcar', tipo: 'um', obrigatorio: true, opcoes: [['Com açúcar', 0], ['Sem açúcar', 0], ['Com adoçante', 0]] }
      ]
    },
    {
      id: 'suco-acerola', cat: 'bebidas', nome: 'Suco de acerola', preco: 11.9, img: 'suco-acerola',
      desc: 'Feito com a polpa da fruta, na hora.',
      selos: [],
      grupos: [
        { nome: 'Tamanho', tipo: 'um', obrigatorio: true, opcoes: [['300 ml', 0], ['500 ml', 4]] },
        { nome: 'Açúcar', tipo: 'um', obrigatorio: true, opcoes: [['Com açúcar', 0], ['Sem açúcar', 0], ['Com adoçante', 0]] }
      ]
    },
    {
      id: 'suco-manga', cat: 'bebidas', nome: 'Suco de manga', preco: 11.9, img: 'suco-manga',
      desc: 'Manga espada batida com gelo.',
      selos: [],
      grupos: [
        { nome: 'Tamanho', tipo: 'um', obrigatorio: true, opcoes: [['300 ml', 0], ['500 ml', 4]] },
        { nome: 'Açúcar', tipo: 'um', obrigatorio: true, opcoes: [['Com açúcar', 0], ['Sem açúcar', 0], ['Com adoçante', 0]] }
      ]
    },
    {
      id: 'limonada', cat: 'bebidas', nome: 'Limonada com hortelã', preco: 9.9, img: 'limonada',
      desc: 'Limão, hortelã e gelo. Pode pedir com leite condensado, vira limonada suíça.',
      selos: [],
      grupos: [{ nome: 'Tipo', tipo: 'um', obrigatorio: true, opcoes: [['Tradicional', 0], ['Suíça (com leite condensado)', 3]] }]
    }
  ]
};
