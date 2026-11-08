This is a WIP rewrite of my personal website

## EntropyBench

The completed benchmark is mounted at `/research/entropybench`. Its static pages retain their
own styling. The main site navigation includes Research.

To refresh the snapshot from the EntropyBench checkout:

```sh
python3 scripts/import_entropybench.py --source ../EntropyBench/site/dist
```

The importer validates the complete question/provider/text matrix and measured traces. It copies
only the results view, question walkthrough and their data; it never reads API keys, request
ledgers or model caches. Snapshot provenance and plaintext hashes are recorded in
`app/public/research/entropybench/snapshot-manifest.json`.

JSON files in that generated directory contain gzip bytes. The Next.js `Content-Encoding` header
handles decompression for the browser. Do not serve those data files without the matching header.
No benchmark requests are made by the website. Importing a snapshot does not deploy it.
