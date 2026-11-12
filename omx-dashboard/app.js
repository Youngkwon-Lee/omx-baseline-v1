'use strict';
const $ = (s, root = document) => root.querySelector(s);
const all = (s, root = document) => [...root.querySelectorAll(s)];
const KEY = 'omx-review-records-v1';
let records = [];
let storageOK = true;
try { const data = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(data)) records = data.filter(valid); } catch { storageOK = false; }
let selection = '';
const streams = {top: null, wrist: null};
const files = {top: null, wrist: null};
const urls = {top: null, wrist: null};
const deviceMessage = $('#camera-message');
function valid(r) { return r && typeof r.dataset === 'string' && r.dataset.trim().length > 0 && r.dataset.length <= 100 && Number.isSafeInteger(r.episode) && r.episode >= 0 && ['성공','실패','확인 필요'].includes(r.result) && typeof r.memo === 'string' && r.memo.length <= 1000 && typeof r.updated === 'string' && Number.isFinite(Date.parse(r.updated)); }
function persist() { try { localStorage.setItem(KEY, JSON.stringify(records)); storageOK = true; return true; } catch { storageOK = false; return false; } }
function key(r) { return JSON.stringify([r.dataset, r.episode]); }
function cell(row, value) { const td = document.createElement('td'); td.textContent = value; row.append(td); return td; }
function draw() {
  const body = $('#records-body'); body.replaceChildren();
  for (const r of [...records].sort((a,b) => b.updated.localeCompare(a.updated))) {
    const tr = document.createElement('tr'); cell(tr,r.dataset); cell(tr,String(r.episode));
    const span = document.createElement('span'); span.className = 'result' + (r.result === '실패' ? ' fail' : ''); span.textContent = r.result;
    const td = document.createElement('td'); td.append(span); tr.append(td); cell(tr,r.memo || '—'); cell(tr,new Date(r.updated).toLocaleString('ko-KR'));
    const actions = document.createElement('td'), edit = document.createElement('button'), del = document.createElement('button');
    edit.className = del.className = 'ghost'; edit.textContent = '열기'; del.textContent = '삭제';
    edit.onclick = () => { $('#dataset').value=r.dataset; $('#episode').value=r.episode; $('#memo').value=r.memo; selectResult(r.result); updateCurrent(); $('#review').scrollIntoView({behavior:'smooth'}); };
    del.onclick = () => { if (!confirm('이 검토 기록을 삭제할까요? 원본 영상은 삭제되지 않습니다.')) return; const old=records; records=records.filter(x=>key(x)!==key(r)); if(!persist()){records=old; alert('저장 공간에 접근할 수 없습니다.');} draw(); };
    actions.append(edit,del); tr.append(actions); body.append(tr);
  }
  $('#empty').hidden = records.length > 0; $('#review-summary').innerHTML = `${records.length} <em>건</em>`;
}
function updateCurrent(){ const d=$('#dataset').value.trim(), n=$('#episode').value; $('#current-summary').textContent = d && n!=='' ? `${n}번` : '선택 전'; }
function selectResult(v){ selection=v; all('.outcomes button').forEach(b=>{b.classList.toggle('selected',b.dataset.result===v); b.setAttribute('aria-pressed',String(b.dataset.result===v));}); }
all('.outcomes button').forEach(b=>b.onclick=()=>selectResult(b.dataset.result));
$('#dataset').addEventListener('input',updateCurrent); $('#episode').addEventListener('input',updateCurrent);
$('#save').onclick=()=>{const dataset=$('#dataset').value.trim(), raw=$('#episode').value, episode=Number(raw), memo=$('#memo').value.trim(), result=selection, msg=$('#save-message'); if(!dataset||raw===''||!Number.isSafeInteger(episode)||episode<0||!result){msg.textContent='데이터셋, 0 이상의 에피소드 번호와 결과를 입력해 주세요.';return;} const record={dataset,episode,result,memo,updated:new Date().toISOString()}; const old=records; records=[...records.filter(r=>key(r)!==key(record)),record]; if(!persist()){records=old;msg.textContent='브라우저 저장에 실패했습니다. 저장 공간과 설정을 확인해 주세요.';return;} msg.textContent='검토 결과를 이 브라우저에 저장했습니다.';draw();};
for(const view of ['top','wrist']) { $(`#${view}-file`).onchange=e=>{const f=e.target.files[0]; if(!f)return; if(urls[view]) URL.revokeObjectURL(urls[view]); files[view]=f; urls[view]=URL.createObjectURL(f); const video=$(`#${view}-video`);video.src=urls[view]; $(`#${view}-name`).textContent=f.name; video.onerror=()=>{$('#save-message').textContent='영상 재생에 실패했습니다. 브라우저가 영상 코덱을 지원하는지 확인하세요.';}; }; }
$('#sync-play').onclick=async()=>{const vs=['top','wrist'].map(v=>$(`#${v}-video`)).filter(v=>v.src); if(vs.length!==2){$('#save-message').textContent='두 영상을 먼저 선택해 주세요.';return;} const t=vs[0].currentTime; if(Number.isFinite(vs[1].duration))vs[1].currentTime=Math.min(t,vs[1].duration); try{await Promise.all(vs.map(v=>v.play()));}catch{$('#save-message').textContent='재생하지 못했습니다. 영상 형식과 브라우저 지원 여부를 확인하세요.';} };
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify({format:'omx-review-v1',exported_at:new Date().toISOString(),records},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='omx-review-records.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#import-label').onclick=()=>$('#import-file').click();
$('#import-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2_000_000) throw Error('파일이 너무 큽니다.');const data=JSON.parse(await f.text());if(data.format!=='omx-review-v1'||!Array.isArray(data.records)||!data.records.every(valid))throw Error('지원하는 검토 기록 파일이 아닙니다.');const seen=new Set(records.map(key));let added=0,skipped=0;const next=[...records];for(const r of data.records){if(seen.has(key(r))){skipped++;continue;}seen.add(key(r));next.push(r);added++;}const old=records;records=next;if(!persist()){records=old;throw Error('브라우저 저장에 실패했습니다.');}draw();alert(`${added}건 가져옴, 기존 항목 ${skipped}건 유지`);}catch(err){alert(`가져오기 실패: ${err.message}`);}finally{e.target.value='';}};
function stop(which){const card=$(`[data-camera="${which}"]`); if(streams[which]) streams[which].getTracks().forEach(t=>t.stop()); streams[which]=null; $('video',card).srcObject=null;$('.camera-preview',card).classList.remove('live');$('.state',card).textContent='연결 전';$('.connect',card).textContent='연결';$('.camera-meta',card).textContent='선택된 장치 없음';$('#camera-summary').textContent=Object.values(streams).some(Boolean)?`${Object.values(streams).filter(Boolean).length}대 연결`:'연결 전';}
$('#stop-cameras').onclick=()=>{stop('top');stop('wrist');deviceMessage.textContent='카메라를 모두 껐습니다.';};
async function populate(){if(!navigator.mediaDevices?.enumerateDevices)throw Error('카메라를 사용할 수 없습니다. localhost 또는 HTTPS에서 열어 주세요.');const devices=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput');for(const card of all('.cam-card')){const select=$('select',card),old=select.value;select.replaceChildren(new Option('카메라를 선택하세요',''));devices.forEach((d,i)=>select.add(new Option(d.label||`카메라 ${i+1} (권한 승인 후 이름 표시)`,d.deviceId)));if(devices.some(d=>d.deviceId===old))select.value=old;}return devices;}
$('#detect').onclick=async()=>{try{if(!navigator.mediaDevices?.getUserMedia)throw Error('카메라를 사용할 수 없습니다. localhost 또는 HTTPS에서 열어 주세요.');const probe=await navigator.mediaDevices.getUserMedia({video:true,audio:false});probe.getTracks().forEach(t=>t.stop());const devices=await populate();deviceMessage.textContent=devices.length?`${devices.length}개 장치를 찾았습니다. 상단과 손목 카메라를 각각 선택하세요.`:'카메라를 찾지 못했습니다. 연결 상태와 브라우저 권한을 확인하세요.';}catch(e){deviceMessage.textContent=`카메라 확인 실패: ${e.message}. 브라우저 권한과 연결 상태를 확인하세요.`;}};
for(const which of ['top','wrist']) {const card=$(`[data-camera="${which}"]`);$('.connect',card).onclick=async()=>{if(streams[which]){stop(which);return;}const id=$('select',card).value,other=which==='top'?'wrist':'top';if(!id){deviceMessage.textContent='먼저 카메라 찾기를 누르고 장치를 선택해 주세요.';return;}if(streams[other] && $('select',$(`[data-camera="${other}"]`)).value===id){deviceMessage.textContent='같은 장치가 이미 다른 화면에 연결되어 있습니다.';return;}try{const stream=await navigator.mediaDevices.getUserMedia({video:{deviceId:{exact:id},width:{ideal:320},height:{ideal:240},frameRate:{ideal:30}},audio:false});streams[which]=stream;const video=$('video',card);video.srcObject=stream;await video.play();$('.camera-preview',card).classList.add('live');$('.state',card).textContent='연결됨';$('.connect',card).textContent='끄기';const info=stream.getVideoTracks()[0].getSettings();$('.camera-meta',card).textContent=`${info.width||'?'} × ${info.height||'?'} · 장치 보고 ${info.frameRate ? Math.round(info.frameRate)+' fps' : 'fps 미확인'}`;$('#camera-summary').textContent=`${Object.values(streams).filter(Boolean).length}대 연결`;deviceMessage.textContent='영상이 움직이는지 확인하세요. 표시 FPS는 장치 보고값이며 실제 처리 속도나 JPEG 오류를 검증하지 않습니다.';stream.getVideoTracks()[0].addEventListener('ended',()=>{stop(which);deviceMessage.textContent='카메라 연결이 종료되었습니다.';},{once:true});await populate();}catch(e){stop(which);deviceMessage.textContent=`카메라 연결 실패: ${e.message}. 다른 프로그램의 사용 여부와 브라우저 권한을 확인하세요.`;}}; }
window.addEventListener('pagehide',()=>{for(const v of ['top','wrist'])if(streams[v])streams[v].getTracks().forEach(t=>t.stop());});
draw(); if(!storageOK) $('#save-message').textContent='저장된 기록을 읽지 못했습니다. 브라우저 저장 설정을 확인해 주세요.';
