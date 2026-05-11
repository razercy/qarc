async function loadEvents(){
  try{
    const res = await fetch('./events/events.json');
    if(!res.ok){
      // try relative path for when served from events folder
      const res2 = await fetch('../events/events.json');
      if(!res2.ok) throw new Error('Events data not found');
      return render(await res2.json());
    }
    const data = await res.json();
    render(data);
  }catch(e){
    console.error('Failed to load events',e);
    const el = document.getElementById('events-list');
    if(el) el.innerHTML = '<p class="muted">No events available yet.</p>';
  }
}

function render(data){
  const list = document.getElementById('events-list');
  if(!list) return;
  list.innerHTML = '';
  (data.events||[]).forEach(ev=>{
    const card = document.createElement('article');
    card.className = 'event-card';
    const imgSrc = ev.images && ev.images.length? ev.images[0] : '../assets/images/event-placeholder.jpg';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(ev.title)}">
      <h3>${escapeHtml(ev.title)}</h3>
      <p class="muted">${escapeHtml(ev.date||'')}</p>
      <p>${escapeHtml(ev.description||'')}</p>
    `;
    list.appendChild(card);
  })
}

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]);
}

// Auto-run when loaded
if(typeof window !== 'undefined'){
  window.addEventListener('DOMContentLoaded', loadEvents);
}
