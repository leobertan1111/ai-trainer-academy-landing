# Checkout Cakto — configuração final

## 1. Trocar as artes do checkout

No editor do checkout principal da **AI Trainer Academy**, remova as quatro artes antigas e mantenha apenas estas duas, nesta ordem:

1. `assets/checkout/checkout-transformacao.png`
2. `assets/checkout/checkout-entrega-radar.png`

As duas imagens têm 4800 × 1920 px. Foram desenhadas como faixas curtas, com áreas de segurança separadas, para diminuir a rolagem antes do formulário e continuar legíveis no celular.

## 2. Adicionar o Radar anual como Order Bump

No painel da Cakto:

1. Abra **Produtos**.
2. Edite o produto principal **AI Trainer Academy**.
3. Entre na aba **Order Bump**.
4. Clique em **Adicionar**.
5. Escolha o produto do **Radar de Oportunidades — 12 meses**.
6. Selecione a oferta de **R$ 147 à vista** (oferta `i6orfmv`).
7. Use a imagem `assets/checkout/order-bump-radar-12m.png`.
8. Preencha os textos abaixo e salve o Order Bump.
9. No final da página, clique também em **Salvar Produto**.

### Texto recomendado

**Título**

> Não pare de encontrar oportunidades no 31º dia

**Descrição**

> Leve mais 11 meses do Radar de Oportunidades por apenas R$ 147 à vista — menos de R$ 13 por mês, em pagamento único e sem renovação automática.

**Chamada da caixa de seleção**

> SIM, QUERO 12 MESES DE RADAR POR MAIS R$ 147

## 3. Evitar oferta duplicada

O Radar anual não deve aparecer como Order Bump e, depois, ser oferecido novamente para a mesma pessoa no pós-compra. Depois de ativar o Order Bump, abra **Upsell/Downsell** do produto principal e troque o redirecionamento pós-compra para:

`https://aitraineracademy.online/obrigado/`

As páginas antigas de upsell e downsell podem permanecer publicadas, mas não devem ser o redirecionamento automático do checkout principal enquanto o mesmo Radar anual estiver no Order Bump.

## 4. Teste antes de divulgar

Abra o checkout principal em uma janela anônima e confirme:

- as duas novas faixas aparecem antes do formulário;
- o Order Bump de R$ 147 aparece acima do botão de pagamento;
- desmarcado, o total permanece apenas o do curso e a taxa exibida pela Cakto;
- marcado, o total aumenta exatamente R$ 147;
- a compra sem o Order Bump mantém os 30 dias de Radar incluídos;
- depois do pagamento, o comprador segue para a página de obrigado, sem receber a mesma oferta outra vez.
