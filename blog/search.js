const search=document.querySelector('#search'),category=document.querySelector('#category'),cards=[...document.querySelectorAll('#articles .card')];
function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function filter(){let n=0;for(const card of cards){card.hidden=!(normalize(card.dataset.search).includes(normalize(search.value.trim()))&&(!category.value||card.dataset.category===category.value));if(!card.hidden)n++}document.querySelector('#count').textContent=`${n} ${n===1?'guia disponível':'guias disponíveis'}`;document.querySelector('#empty').hidden=n!==0}
search.addEventListener('input',filter);category.addEventListener('change',filter);filter();
