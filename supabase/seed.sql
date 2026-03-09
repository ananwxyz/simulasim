INSERT INTO "public"."questions" ("question_text", "media_url", "media_type", "options") VALUES
(
    'Apa arti rambu lalu lintas berbentuk lingkaran merah dengan tanda minus putih di tengahnya?',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Indonesia_Road_Sign_1a.png/240px-Indonesia_Road_Sign_1a.png',
    'image',
    '[
        {"id": "A", "text": "Dilarang Parkir", "isCorrect": false},
        {"id": "B", "text": "Dilarang Masuk bagi semua kendaraan", "isCorrect": true},
        {"id": "C", "text": "Batas Kecepatan Maksimum", "isCorrect": false},
        {"id": "D", "text": "Jalan Buntu", "isCorrect": false}
    ]'
),
(
    'Perhatikan video ilustrasi berikut. Marka jalan membujur berupa garis utuh (tidak putus-putus) memiliki fungsi utama sebagai...',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'video',
    '[
        {"id": "A", "text": "Batas pembagian jalur yang boleh dilintasi saat akan mendahului", "isCorrect": false},
        {"id": "B", "text": "Jalur khusus pesepeda dan pejalan kaki", "isCorrect": false},
        {"id": "C", "text": "Batas tepi jalan bebas hambatan", "isCorrect": false},
        {"id": "D", "text": "Larangan tegas bagi kendaraan untuk melintasi garis tersebut", "isCorrect": true}
    ]'
),
(
    'Jika Anda berkendara di dekat fasilitas sekolah dan melihat rambu peringatan anak sekolah dengan batas kecepatan 30 km/jam, apa yang harus Anda lakukan?',
    NULL,
    NULL,
    '[
        {"id": "A", "text": "Berkendara secepatnya agar lalu lintas tidak macet", "isCorrect": false},
        {"id": "B", "text": "Hanya mengurangi batas kecepatan saat jam masuk/pulang sekolah", "isCorrect": false},
        {"id": "C", "text": "Mengurangi kecepatan maksimal menjadi 30 km/jam demi keselamatan anak-anak", "isCorrect": true},
        {"id": "D", "text": "Membunyikan klakson terus-menerus agar anak-anak menyingkir", "isCorrect": false}
    ]'
),
(
    'Tindakan apa yang sangat DILARANG dan membahayakan saat sedang berkendara di jalan tol?',
    NULL,
    NULL,
    '[
        {"id": "A", "text": "Berpindah ke lajur paling kanan saat akan mendahului kendaraan lain", "isCorrect": false},
        {"id": "B", "text": "Melakukan putar balik arah atau memotong area median jalan tol", "isCorrect": true},
        {"id": "C", "text": "Menggunakan bahu jalan pada saat keadaan darurat (seperti ban pecah)", "isCorrect": false},
        {"id": "D", "text": "Menyalakan lampu hazard bersamaan saat mobil mogok", "isCorrect": false}
    ]'
),
(
    'Menurut undang-undang dan peraturan pelengkap safety riding, penggunaan helm standar nasional (SNI) sangat diwajibkan karena...',
    NULL,
    NULL,
    '[
        {"id": "A", "text": "Melindungi bagian vital kepala dari benturan fatal saat terjadi kecelakaan", "isCorrect": true},
        {"id": "B", "text": "Mencegah embusan angin yang membuat rambut berantakan", "isCorrect": false},
        {"id": "C", "text": "Satu-satunya syarat untuk menghindari alat tilang elektronik (ETLE)", "isCorrect": false},
        {"id": "D", "text": "Membuat visibilitas pengendara lain terhalang", "isCorrect": false}
    ]'
);
