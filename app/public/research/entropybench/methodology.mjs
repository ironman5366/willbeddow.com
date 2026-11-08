const $=id=>document.getElementById(id);
const names={simpleqa_verified:'SimpleQA Verified',browsecomp:'BrowseComp',browsecomp_long_context:'BrowseComp LC',frames:'FRAMES',deepsearchqa:'DeepSearchQA',widesearch:'WideSearch',sealqa:'SealQA',freshqa:'FreshQA',realtimeqa:'RealTimeQA',livenewsbench:'LiveNewsBench',aa_omniscience:'AA Omniscience',prediction_markets:'Prediction markets'};
const providers={exa_auto:'Exa',parallel_basic:'Parallel',tavily_basic:'Tavily',firecrawl:'Firecrawl'};
const fmt=x=>Number.isFinite(x)?x.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
const pct=x=>(x>0&&x<0.01?x.toPrecision(3):fmt(x))+'%';
const literal=x=>JSON.stringify(x), node=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n};
let aq,frame,payload,grid,selected,trace,benchmark='',provider=new URLSearchParams(location.hash.slice(1)).get('provider')||'exa_auto',rank=Math.min(10,Math.max(0,Number(new URLSearchParams(location.hash.slice(1)).get('rank')??1))),token=0,requestMode='search',selectionVersion=0,production={},arm=new URLSearchParams(location.hash.slice(1)).get('arm')==='extract'?'extract':'native';
const traceCache=new Map();
function python(el,text){
 el.replaceChildren();const re=/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:from|import|for|in|if|else|return|True|False|None|assert|def)\b|\b\d+(?:\.\d+)?\b)/g;let offset=0;
 for(const m of text.matchAll(re)){el.append(document.createTextNode(text.slice(offset,m.index)));const s=node('span',m[0]);s.className=m[0][0]==='#'?'comment':/^['"]/.test(m[0])?'str':/^\d/.test(m[0])?'num':'kw';el.append(s);offset=m.index+m[0].length;}el.append(document.createTextNode(text.slice(offset)));
}
async function hydrate(data){
 const prefixAt=(c,k)=>k?`Question: ${data.prompt_question}\n\nSearch results:\n`+c.results.slice(0,k).map(r=>r.text?`[${r.rank}] ${r.title}\n${r.text}\n\n`:`[${r.rank}] ${r.title}\n\n`).join('')+'Answer:':`Question: ${data.prompt_question}\n\nAnswer:`;
 async function fill(t,prefix){if(!t)return;t.prefix=prefix;t.request.prompt=prefix+t.suffix;const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t.request.prompt));const hash=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==t.prompt_sha256)throw Error('Prompt reconstruction did not match the scored prompt.');}
 await fill(data.baseline,prefixAt(null,0));
 for(const c of data.configurations)await Promise.all(c.traces.map((t,k)=>fill(t,prefixAt(c,k))));
 return data;
}
function configuration(){return trace?.configurations.find(c=>c.provider===provider&&c.arm===arm)}
function currentTrace(){return configuration()?.traces[rank]||null}
function measurement(id,t,fallback){
 $(id+'-bits').textContent=fmt(t?.bits??fallback)+' bits';
 const scale=Math.max(trace?.baseline?.bits||selected.baseline||1,...(configuration()?.s_at||[]));$(id+'-fill').style.width=`${Math.max(0,(t?.bits??fallback??0)/scale*100)}%`;const tokens=$(id+'-tokens');tokens.replaceChildren();
 if(!t){$(id+'-token-detail').textContent='Token trace not exported for this question.';return;}
 t.tokens.forEach((text,i)=>{const b=node('button',text);b.style.setProperty('--heat',`hsl(${140-Math.min(1,-t.logprobs[i]/Math.LN2/12)*110} 35% 58%)`);b.setAttribute('aria-pressed',String(i===token));b.title=`${pct(Math.exp(t.logprobs[i])*100)} · ${fmt(-t.logprobs[i]/Math.LN2)} bits`;b.onclick=()=>{token=i;render()};tokens.append(b)});
 const i=Math.min(token,t.tokens.length-1), d=$(id+'-token-detail');d.replaceChildren(node('span',`P(${literal(t.tokens[i])} | prompt + ${literal(t.tokens.slice(0,i).join(''))})`),node('br',''),node('strong',`${pct(Math.exp(t.logprobs[i])*100)} probability · ${fmt(-t.logprobs[i]/Math.LN2)} bits`));
}
function callCode(withSearch){
 const question=trace?.prompt_question||selected.question, t=withSearch?currentTrace():trace?.baseline;
 const lines=[`question = ${literal(question)}`,`answer = ${literal(selected.answer)}`,''];
 if(withSearch&&rank>0){lines.push(`results = rendered_results[:${rank}]`, 'prefix = (f"Question: {question}\\n\\nSearch results:\\n"', '    + "".join(r.block for r in results) + "Answer:")')}else lines.push('prefix = f"Question: {question}\\n\\nAnswer:"');
 lines.push('suffix = " " + answer.strip()', '', 'response = client.post(', `    ${literal(trace?.endpoint||'https://api.fireworks.ai/inference/v1/completions')},`, '    headers=auth_headers,', '    json={', '        "model": "accounts/fireworks/models/glm-5p3-flash",', '        "prompt": prefix + suffix,', '        "temperature": 0, "max_tokens": 1,', '        "logprobs": 1,', t?.request.echo?'        "echo": True,':'        "echo_last": len(suffix) + 8,', '        "context_length_exceeded_behavior": "error",', '    },', ').json()');
 return lines.join('\n');
}
function chart(c){
 $('trajectory').replaceChildren();if(!c)return;
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 900 150');svg.setAttribute('role','img');svg.setAttribute('aria-label','Answer surprisal by number of search results');
 const values=c.s_at,max=Math.max(...values,1)*1.12,min=Math.min(...values,0),x=i=>45+i*820/(values.length-1||1),y=v=>115-(v-min)/(max-min)*95;
 function shape(tag,attrs,text){const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;svg.append(e);return e}
 for(const v of [0,max/2,max]){shape('line',{x1:45,x2:865,y1:y(v),y2:y(v),stroke:'#edf0ec'});shape('text',{x:36,y:y(v)+3,'text-anchor':'end'},fmt(v))}
 shape('polyline',{points:values.map((v,i)=>`${x(i)},${y(v)}`).join(' '),fill:'none',stroke:'#286449','stroke-width':2});
 values.forEach((v,i)=>{shape('text',{x:x(i),y:140,'text-anchor':'middle'},String(i));const p=shape('circle',{cx:x(i),cy:y(v),r:i===rank?6:4,fill:i===rank?'#286449':'#fff',stroke:'#286449','stroke-width':2,tabindex:0,role:'button','aria-label':`${i} results, ${fmt(v)} bits`,class:'point'});p.onclick=()=>{rank=i;render()};p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();rank=i;render()}};});$('trajectory').append(svg);
}
function requests(){
 const t=requestMode==='baseline'?trace?.baseline:currentTrace();
 for(const b of document.querySelectorAll('[data-request]'))b.setAttribute('aria-pressed',String(b.dataset.request===requestMode));
 $('endpoint').textContent=trace?.endpoint||'';$('request').textContent=t?JSON.stringify(t.request,null,2):'Request trace not exported.';$('prompt').textContent=t?.request.prompt||'';
}
function pathCost(c,k){
 const saved=c?.provider_call?.cost;
 const retrieval=c?.provider==='firecrawl'&&Number.isFinite(saved?.billing?.creditsUsed)?saved.billing.creditsUsed*19/5000:saved?.estimated_usd;
 const model=c?.traces[k]?.cost?.estimated_usd;
 return {retrieval,total:Number.isFinite(retrieval)&&Number.isFinite(model)?retrieval+model:null};
}
function scoreProviders(){
 const configs=trace?.configurations.filter(c=>c.arm===arm)||[];
 $('provider-scoreboard').hidden=!configs.length;$('provider-leader').hidden=!configs.length;
 if(!configs.length)return;
 const dollar=x=>Number.isFinite(x)?'$'+x.toFixed(x<.01?6:4):'—';
 const entries=configs.map(c=>{
  const k=Math.min(rank,c.results.length),score=payload.scores[selected.id]?.[c.provider+'/'+arm]||{};
  const bits=score.m3_marginal_bits?.slice(0,k).reduce((a,b)=>a+b,0),tokens=score.m3_tokens?.slice(0,k).reduce((a,b)=>a+b,0);
  const gzip=score.gzip_prefix_bits?.[k],cost=pathCost(c,k).total;
  return {c,k,score,gain:c.s_at[0]-c.s_at[k],after:c.s_at[k],bitsPerToken:tokens?bits/tokens:null,novelty:gzip?bits/gzip:null,cost};
 }).sort((a,b)=>b.gain-a.gain);
 const best=entries[0],leaders=entries.filter(e=>Math.abs(e.gain-best.gain)<1e-8),winner=leaders.map(e=>providers[e.c.provider]).join(' + ');
 $('score-rank').textContent=`Up to ${rank} result${rank===1?'':'s'} · ${arm==='native'?'provider excerpts':'common text extraction'}`;
 $('score-winner').replaceChildren();
 const title=node('div','');title.append(node('span',rank?'MOST ANSWER BITS REMOVED':'QUESTION ONLY'),node('strong',rank?winner:'No search results selected'));
 const gain=node('div','');gain.className='winner-gain'+(best.gain<0?' negative-gain':'');gain.append(node('strong',`${best.gain>0?'+':''}${fmt(best.gain)} bits`),node('span',rank?(leaders.length>1?'Shared lead':`${fmt(best.gain-entries[1]?.gain)} bits ahead of second place`):'Baseline'));
 $('score-winner').append(title,gain);
 $('provider-leader').textContent=rank?`${winner} ${leaders.length>1?'share the lead':'leads'}${arm==='extract'?' with common text':''} · ${best.gain>0?'+':''}${fmt(best.gain)} answer bits removed · Score the providers ↓`:'Compare the providers ↓';
 const table=$('provider-scores');table.replaceChildren();const head=node('tr','');
 for(const label of ['Provider','Answer gain · bits ↑','After search · bits ↓','Result bits/token','Novelty','Retrieval + score','Cost/bit ↓'])head.append(node('th',label));table.append(head);
 for(const e of entries){
  const tr=node('tr',''),isBest=rank>0&&leaders.includes(e);if(isBest)tr.className='score-best';
  const name=node('td',''),button=node('button',providers[e.c.provider]);button.setAttribute('aria-pressed',String(provider===e.c.provider));button.onclick=()=>{provider=e.c.provider;render()};name.append(button,node('small',isBest?(leaders.length>1?'SHARED LEAD':'WINNER'):`${e.k} RESULT${e.k===1?'':'S'}`));const empty=e.c.results.slice(0,e.k).filter(r=>!r.text).length;if(arm==='extract'&&empty)name.append(node('small',`${empty} EMPTY`));tr.append(name);
  for(const [i,text]of [fmt(e.gain),fmt(e.after),fmt(e.bitsPerToken),fmt(e.novelty),dollar(e.cost),e.gain>0?dollar(e.cost===null?null:e.cost/e.gain):'—'].entries()){
   const td=node('td',text);if(i===0)td.className='score-gain'+(e.gain<0?' negative-gain':'');tr.append(td);
  }table.append(tr);
 }
 const extra=$('provider-extra-metrics');extra.replaceChildren();const columns=node('tr','');columns.append(node('th','Metric'));for(const e of entries)columns.append(node('th',providers[e.c.provider]));extra.append(columns);
 const measures=[['Empty result texts',e=>String(e.c.results.filter(r=>!r.text).length)],['Answer gain/token',e=>fmt(e.score.m1_bits/(e.score.m1_answer_tokens||1))],['Multiple-choice gain · bits',e=>fmt(e.score.m2_mc_ig)],['Result surprisal · total bits',e=>fmt(e.score.m3_total_bits)],['Compression · independent zlib bits',e=>fmt(e.score.m4_gzip_total)],['Compression · conditional zlib bits',e=>fmt(e.score.m4_marginal_total)],['Compression redundancy',e=>fmt(e.score.m4_redundancy)],['Answer contained',e=>e.score.m5_hit?'Yes':'No'],['Generated answer matches key',e=>e.score.m6_correct_with?'Yes':'No'],['Harm · gain below −1 bit',e=>e.score.m7_harm?'Yes':'No'],['Search latency · ms',e=>fmt(e.score.m9_latency_ms)],['Retrieved text · UTF-8 bytes',e=>fmt(e.score.m9_bytes)],['Generated answer',e=>e.score.m6_generated_with||'—']];
 for(const [label,value]of measures){const tr=node('tr','');tr.append(node('td',label));for(const e of entries)tr.append(node('td',value(e)));extra.append(tr)}
}
function renderCost(c){
 const usd=x=>Number.isFinite(x)?'$'+x.toFixed(x<0.1?6:4):'—';
 const search=c?.provider_call?.cost, model=c?.traces[rank]?.cost;
 const credits=search?.billing?.creditsUsed, rate=19/5000*1000;
 const isFirecrawl=provider==='firecrawl';$('credit-rate-label').hidden=!isFirecrawl;$('cost-panel').hidden=!c;
 const retrieval=pathCost(c,rank).retrieval;
 const call=c?.provider_call,body=call?.request.json||{},price=call?.price||{},count=c?.results.length||0;
 $('provider-pricing').hidden=!call;
 let settings='',calculation='';
 if(call){
  if(provider==='exa_auto'){
   settings=`type=${body.type} · numResults=${body.numResults} · ${Object.keys(body.contents||{}).filter(k=>body.contents[k]).join(' + ')}`;
   const base=(price.usd_per_1k_calls||0)/1000,extra=Math.max(0,call.requested_results-10),unit=(price.usd_per_1k_results_extra||0)/1000;
   calculation=`${usd(base)} search + ${extra} extra × ${usd(unit)} = ${usd(retrieval)}`;
  }else if(provider==='parallel_basic'){
   settings=`mode=${body.mode} · max_results=${body.advanced_settings?.max_results}`;
   const base=(price.usd_per_1k_calls||0)/1000,extra=Math.max(0,call.requested_results-10),unit=(price.usd_per_1k_results_extra||0)/1000;
   calculation=`≈ ${usd(base)} search + ${extra} extra × ${usd(unit)} = ${usd(retrieval)}`;
  }else if(provider==='tavily_basic'){
   settings=`search_depth=${body.search_depth} · max_results=${body.max_results} · chunks_per_source=${body.chunks_per_source} · raw_content=${body.include_raw_content}`;
   const n=search?.billing?.usage?.credits;
   calculation=Number.isFinite(n)?`${n} credit${n===1?'':'s'} × ${usd(price.usd_per_credit??price.usd_per_1k_calls/1000)} = ≈ ${usd(retrieval)}`:'Credit usage not recorded';
  }else if(provider==='firecrawl'){
   settings=`limit=${body.limit} · ${(body.sources||[]).join(', ')} · highlights=${body.highlights} · search only`;
   const searchCredits=search?.billing?.search_credits_estimated,scrape=search?.billing?.scrape_credits_reported;
   const parts=`${credits??'—'} reported search credits`;
   calculation=`${parts} × $${rate}/1k = ≈ ${usd(retrieval)}`;
  }
 }
 $('provider-settings').textContent=settings;$('provider-cost-equation').textContent=calculation;
 $('provider-unit-cost').textContent=Number.isFinite(retrieval)&&count?`${usd(retrieval)} ÷ ${count} returned = ${search?.cost_basis==='provider_reported_usd'?'':'≈ '}${usd(retrieval/count)} / result`:'';
 const glm=model?.estimated_usd,total=Number.isFinite(retrieval)&&Number.isFinite(glm)?retrieval+glm:null;
 const gain=c?c.s_at[0]-c.s_at[rank]:null;
 $('retrieval-cost-label').textContent=`Retrieval · ${c?.provider_call?.requested_results??c?.results.length??0} fetched`;
 $('retrieval-cost').textContent=(search?.cost_basis==='provider_reported_usd'?'':'≈ ')+usd(retrieval);
 $('glm-cost').textContent=Number.isFinite(glm)?'≈ '+usd(glm):'Not recorded';
 $('total-cost').textContent=Number.isFinite(total)?'≈ '+usd(total):'—';
 $('formula-cost').textContent=Number.isFinite(total)?'≈ '+usd(total):'—';$('formula-gain').textContent=fmt(gain)+' bits';
 $('cost-per-bit').textContent=gain>0&&Number.isFinite(total)?usd(total/gain)+' / bit':gain<=0?'No gain':'—';
 const usage=model?.billing?.usage,parts=[];
 if(isFirecrawl&&Number.isFinite(credits))parts.push(`${credits} reported credits × $${rate}/1k`);
 else if(search)parts.push(search.cost_basis==='provider_reported_usd'?'Retrieval: provider-reported charge':'Retrieval: saved list rate');
 if(usage)parts.push(`GLM: ${usage.prompt_tokens.toLocaleString()} input tokens · ${(usage.prompt_tokens_details?.cached_tokens||0).toLocaleString()} cached · ${usage.completion_tokens} output`);
 parts.push('Baseline reused');$('cost-basis').textContent=parts.join(' · ');
}
function render(){
 if(!selected)return;
 $('extraction-mode').value=$('score-extraction').value=arm;
 const c=configuration(),t=currentTrace(),b=c?.traces[0]||trace?.baseline;
 $('rank').max=c?Math.max(0,c.traces.length-1):10;if(c)rank=Math.min(rank,Number($('rank').max));$('rank').value=rank;$('rank').disabled=!c;$('rank-label').textContent=`${rank} / ${$('rank').max}`;
 $('search-empty').hidden=!!c;$('search-empty').textContent='No search run for this question.';$('searched-experiment').hidden=!c;$('trajectory-section').hidden=!c;
 measurement('baseline',b,selected.baseline);if(c)measurement('search',c.traces[rank],c.s_at[rank]);
 python($('baseline-code'),callCode(false));python($('search-code'),callCode(true));
 for(const button of $('providers').children){button.setAttribute('aria-pressed',String(button.dataset.provider===provider));button.disabled=!trace?.configurations.some(c=>c.provider===button.dataset.provider&&c.arm===arm)}
 const before=c?.s_at[0]??b?.bits,after=c?.s_at[rank];$('gain').replaceChildren();
 if(Number.isFinite(before)&&Number.isFinite(after)){
 const g=before-after, equation=node('div','');equation.className='gain-equation';
 for(const [i,label,value] of [[0,'Before search',before],[1,'After search',after],[2,'Bits removed',g]]){if(i){const op=node('span',i===1?'−':'=');op.className='operator';equation.append(op)}const term=node('div','');term.className='formula-term';term.append(node('span',label),node('strong',fmt(value)));equation.append(term)}
 const caption=node('div',`${fmt(2**g)}× the answer probability`);caption.className='probability-gain';$('gain').append(node('div','ANSWER SURPRISAL · BITS'),equation,caption);$('gain').firstChild.className='formula-label';
 }
 chart(c);renderCost(c);scoreProviders();
 const active=c?.traces[rank]||b;
 const table=node('table',''),head=node('tr','');for(const s of ['Token','log p · nats','P(token)','−log₂ p · bits'])head.append(node('th',s));table.append(head);
 if(active){active.tokens.forEach((tok,i)=>{const r=node('tr','');for(const v of [literal(tok),active.logprobs[i].toFixed(6),pct(Math.exp(active.logprobs[i])*100),fmt(-active.logprobs[i]/Math.LN2)])r.append(node('td',v));table.append(r)});}
 $('logprobs').replaceChildren(table);$('calculation').textContent=active?`−Σ log p(token) / ln(2) = ${fmt(active.bits)} bits`:'';
 python($('extraction-code'),'lp = response["choices"][0]["logprobs"]\nn_gen = int(response["usage"]["completion_tokens"])\ntoks = lp["tokens"][:-n_gen]\nlps = lp["token_logprobs"][:-n_gen]\n\n# n = standalone answer token count.\n# Its token IDs must match the prompt tail.\ni = len(toks) - n\ntl = [float(x) if x is not None else 0.0\n      for x in lps[i:]]\nbits = -sum(tl) / LN2');
 $('retrieval').hidden=!c;document.querySelector('.retrieval-connector').hidden=!c;
 const call=c?.provider_call;
 $('provider-caption').textContent=call?`${providers[provider]} · ${call.request.method} ${call.request.url} · ${call.requested_results} requested`:'';
 const source=call?.request_python;
 python($('provider-code'),source||'Provider request not recorded for this snapshot.');
 $('result-count').textContent=c?`${c.results.length} returned · ${rank} in prompt`:'';
 $('results').replaceChildren(...(c?.results||[]).map((r,i)=>{const d=node('article','');d.className='result'+(i<rank?' included':'');d.append(node('span',`RESULT ${i+1} · ${i<rank?'IN PROMPT':'NOT IN PROMPT'} · ${c.arm==='native'?'Provider text':'Common extractor'}`));const a=node('a',r.title||r.url);try{const u=new URL(r.url);if(['http:','https:'].includes(u.protocol)){a.href=u.href;a.target='_blank';a.rel='noreferrer'}}catch{}d.append(node('br',''),a,node('pre',r.text||'No extracted text.'));return d}));
 requests();
}
function updateViewURL(){history.replaceState(null,'',location.pathname+location.search+'#question='+encodeURIComponent(selected.id)+(arm==='extract'?'&arm=extract':'')+'&provider='+encodeURIComponent(provider)+'&rank='+rank)}
async function select(q){
 const version=++selectionVersion;selected=q;token=0;trace=null;$('picker').close();$('question').textContent=q.question;$('source').textContent=q.benchmarks.map(b=>names[b]||b).join(' · ');$('answer').textContent=q.answer;$('status').textContent='Loading measured token traces…';updateViewURL();
 render();
 try{if(!traceCache.has(q.id)){const r=await fetch(`data/traces/${encodeURIComponent(q.id)}.json`,{cache:'no-store'});if(r.ok)traceCache.set(q.id,await hydrate(await r.json()));else if(r.status===404)traceCache.set(q.id,null);else throw Error(`Could not load traces (${r.status})`)}
 if(version!==selectionVersion)return;trace=traceCache.get(q.id);
 if(trace&&!configuration()){const first=trace.configurations.find(c=>c.arm===arm);if(first)provider=first.provider;}
 $('metadata').textContent=JSON.stringify({id:q.id,aliases:q.aliases,members:q.members},null,2);
 python($('production-source'),Object.values(production).join('\n\n'));$('status').textContent='';render();
 }catch(e){if(version===selectionVersion)$('status').textContent=e.message;}
}
async function refresh(sample=false){
 const term=$('search').value.toLocaleLowerCase(),only=$('scored').checked;
 let filtered=frame.filter(aq.escape(d=>(!benchmark||d.benchmarks.includes(benchmark))&&(!only||d.scored)&&(!term||(d.question+' '+d.answer).toLocaleLowerCase().includes(term))));
 const total=filtered.numRows();if(sample)filtered=filtered.sample(Math.min(20,total));const rows=filtered.objects();await grid.setData(rows);
 $('table-status').textContent=`${rows.length.toLocaleString()}${sample?' sampled from '+total.toLocaleString():''} questions`;
 for(const b of $('benchmarks').children)b.setAttribute('aria-pressed',String(b.dataset.benchmark===benchmark));
}
async function openPicker(){
 $('picker').showModal();if(!grid){grid=new Tabulator('#grid',{height:400,layout:'fitColumns',pagination:true,paginationSize:20,index:'id',placeholder:'No matching questions',columns:[{title:'Benchmark',field:'benchmark',width:145,formatter:c=>names[c.getValue()]||c.getValue()},{title:'Question',field:'question',minWidth:250,widthGrow:4,formatter:'plaintext'},{title:'Baseline · bits',field:'baseline',width:125,sorter:'number',formatter:c=>fmt(c.getValue())},{title:'Search scores',field:'scored',width:115,formatter:c=>c.getValue()?'Available':'—'}]});grid.on('rowClick',(_,r)=>select(r.getData()));await new Promise(r=>grid.on('tableBuilt',r));await refresh();}else grid.redraw(true);
}
async function start(){
 aq=await import('https://cdn.jsdelivr.net/npm/arquero@8.0.3/+esm');const response=await fetch('data/corpus.json',{cache:'no-store'});if(!response.ok)throw Error('Could not load the corpus.');payload=await response.json();frame=aq.from(payload.questions);const src=await fetch('data/traces/source.json',{cache:'no-store'});if(src.ok)production=await src.json();
 for(const [key,title] of Object.entries(providers)){const b=node('button',title);b.dataset.provider=key;b.onclick=()=>{provider=key;updateViewURL();render()};$('providers').append(b)}
 const counts=new Map();for(const q of payload.questions)for(const b of q.benchmarks)counts.set(b,(counts.get(b)||0)+1);
 for(const [key,count] of [['',payload.questions.length],...counts]){const b=node('button',`${names[key]||'All'} ${count.toLocaleString()}`);b.dataset.benchmark=key;b.onclick=()=>{benchmark=key;refresh().catch(fail)};$('benchmarks').append(b)}
 window.addEventListener('hashchange',()=>{const params=new URLSearchParams(location.hash.slice(1)),id=params.get('question'),nextArm=params.get('arm')==='extract'?'extract':'native';const changed=arm!==nextArm;arm=nextArm;if(id&&id!==selected?.id){const q=payload.questions.find(q=>q.id===id);if(q)select(q)}else if(changed)render()});
 const initial=new URLSearchParams(location.hash.slice(1)).get('question');await select(payload.questions.find(q=>q.id===initial)||payload.questions.find(q=>q.id===payload.default_question)||payload.questions.find(q=>q.scored)||payload.questions[0]);
 $('browse').onclick=$('question').onclick=()=>openPicker().catch(fail);$('close-picker').onclick=()=>$('picker').close();
 $('shuffle').onclick=()=>{const candidates=frame.filter(aq.escape(d=>d.scored&&d.id!==selected.id));select(candidates.sample(1).objects()[0]||payload.questions[0])};
 for(const id of ['extraction-mode','score-extraction'])$(id).onchange=()=>{arm=$(id).value;updateViewURL();render()};
 $('rank').oninput=()=>{rank=Number($('rank').value);updateViewURL();render()};
 $('provider-leader').onclick=()=>$('provider-scoreboard').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 $('search').oninput=()=>refresh().catch(fail);$('scored').onchange=()=>refresh().catch(fail);$('sample').onclick=()=>refresh(true).catch(fail);$('all').onclick=()=>refresh().catch(fail);
 for(const b of document.querySelectorAll('[data-request]'))b.onclick=()=>{requestMode=b.dataset.request;requests()};
}
function fail(e){$('status').textContent=e.message;console.error(e)}
start().catch(fail);
