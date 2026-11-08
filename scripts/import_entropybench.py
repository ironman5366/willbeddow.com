"""Import the reviewed static EntropyBench snapshot without inference or deployment."""
import argparse
from collections import Counter
import gzip
import hashlib
import json
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]
BASE = '/research/entropybench/'
ASSETS = ('results.html','results.css','results.mjs','results-model.mjs',
          'methodology.html','methodology.css','methodology.mjs')


def import_snapshot(source):
    results=json.loads((source/'data/results.json').read_text())
    corpus=json.loads((source/'data/corpus.json').read_text())
    ids={q['id'] for q in results['questions']}
    assert ids=={q['id'] for q in corpus['questions']}
    assert len(results['rows'])==results['expected_rows']==len(ids)*8
    assert len({(r['id'],r['provider'],r['arm']) for r in results['rows']})==len(ids)*8
    assert all(len(corpus['scores'][qid])==8 for qid in ids)
    destination=ROOT/'app/public/research/entropybench'
    destination.parent.mkdir(parents=True,exist_ok=True)
    manifest={'run':results['run'],'questions':len(ids),'evaluations':len(results['rows']),
        'source_counts':dict(Counter(q['source'] for q in results['questions'])),
        'data_encoding':'gzip','files':{}}
    with tempfile.TemporaryDirectory(prefix='.entropybench-',dir=destination.parent) as temporary:
        staging=Path(temporary)/'site';staging.mkdir()
        for name in ASSETS:
            content=(source/name).read_text()
            if name.endswith('.html'):
                content=content.replace('<head>',f'<head><base href="{BASE}">',1)
                content=content.replace('href="results.html"',f'href="{BASE[:-1]}"')
            (staging/name).write_text(content)
        files=[source/'data/results.json',source/'data/corpus.json',source/'data/traces/source.json',
               *[source/'data/traces'/(qid+'.json') for qid in sorted(ids)]]
        for path in files:
            relative=path.relative_to(source)
            raw=path.read_bytes()
            if relative.parts[1]=='traces' and path.name!='source.json':
                trace=json.loads(raw)
                assert trace['baseline'] is not None and len(trace['configurations'])==8
                assert all(t is not None for c in trace['configurations'] for t in c['traces'])
            packed=gzip.compress(raw,compresslevel=9,mtime=0)
            target=staging/relative;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(packed)
            manifest['files'][str(relative)]={'sha256':hashlib.sha256(raw).hexdigest(),
                'bytes':len(raw),'gzip_bytes':len(packed)}
        (staging/'snapshot-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        previous=Path(temporary)/'previous'
        if destination.exists():destination.rename(previous)
        try:staging.rename(destination)
        except Exception:
            if previous.exists():previous.rename(destination)
            raise
    return manifest


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source',type=Path,required=True,help='EntropyBench site/dist directory')
    a=p.parse_args();manifest=import_snapshot(a.source.resolve())
    print(json.dumps({'questions':manifest['questions'],'evaluations':manifest['evaluations'],
        'gzip_megabytes':round(sum(f['gzip_bytes'] for f in manifest['files'].values())/1e6,1)},indent=2))
