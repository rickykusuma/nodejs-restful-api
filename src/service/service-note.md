# Tugas utama service folder
- Menyimpan aturan bisnis
- Menentukan apa yang boleh & tidak
- Orkestrasi database + logic

### Example:
```
if (noteExists) throw new Error("Duplicate");
return noteRepository.create(data);
```

### Karakteristik:
```
- Tidak tahu HTTP
- Bisa dipakai ulang (API, cron, job, queue)
- Mudah di-test
```

### Analogi:
```
“Otak aplikasi”
Semua keputusan ada di sini.
```