# Tugas utama controller
- Terima ```req``` dan ```res```
- Ambil input dari request
- Panggil service
- Tentukan response HTTP

### Example:
```
const data = req.body;
const result = await noteService.create(data);
res.status(201).json(result);
```
### Yang BOLEH
```
- Mapping request → service
- Mapping service result → response
```
### Yang TIDAK BOLEH
```
- Query database
- Business rules kompleks
```
### Analogi:
```
“Customer service”
Menerima permintaan, meneruskan ke bagian dalam.
```