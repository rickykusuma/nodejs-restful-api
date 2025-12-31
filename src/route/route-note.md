# Tugas utama route folder

- Mendaftarkan endpoint HTTP
- Mapping URL → controller
- Tidak berisi logika bisnis

Example:
```
router.post("/notes", noteController.create);
router.get("/notes/:id", noteController.findById);
```

Analogi:
```
“Papan penunjuk jalan”
Request masuk diarahkan ke handler yang tepat.
```