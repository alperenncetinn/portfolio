# Kişisel Portföy Web Sitesi

Bu proje, koyu temalı ve neon vurgulara sahip modern bir kişisel portföy web sitesidir. Sitenin fütüristik ve teknoloji odaklı bir tasarımı vardır.

## Özellikler

- Duyarlı ve modern tasarım
- Koyu tema, neon mavisi ve mor vurgular
- Animasyonlu bölümler ve hover efektleri
- Mobil cihazlara uyumlu düzen
- İletişim formu

## Kurulum ve Kullanım

1. Bu repoyu bilgisayarınıza klonlayın:
   ```
   git clone https://github.com/kullaniciadi/websiteCV.git
   ```

2. İndirilen klasöre gidin:
   ```
   cd websiteCV
   ```

3. Web sitesini bir tarayıcıda açın:
   - Doğrudan `index.html` dosyasını tarayıcınızda açabilirsiniz
   - Veya bir yerel sunucu kullanabilirsiniz:
     ```
     npx serve
     ```

## Kişiselleştirme

### Profil Bilgileri

- `index.html` dosyasındaki metinleri kendi bilgilerinizle değiştirin
- Profil fotoğrafınızı `images/profile.jpg` olarak ekleyin
- Proje görselleri için `images/project1.jpg`, `images/project2.jpg` ve `images/project3.jpg` dosyalarını ekleyin

### Renk Şeması

Sitenin renk şemasını değiştirmek için `styles.css` dosyasındaki `:root` değişkenlerini düzenleyin:

```css
:root {
    --bg-primary: #0a0a16;
    --bg-secondary: #121225;
    --text-primary: #ffffff;
    --text-secondary: #b3b3cc;
    --accent-primary: #5e17eb;  /* Ana vurgu rengi */
    --accent-secondary: #00c2ff;  /* İkincil vurgu rengi */
    /* ... diğer değişkenler ... */
}
```

## Notlar

- Bu site yalnızca önyüz teknolojileri kullanır (HTML, CSS, JavaScript)
- İletişim formu backend işlevselliği içermez, gerçek bir kullanım için form verilerini işleyecek bir backend eklenmesi gerekir

## Gerekli Resimler

Site aşağıdaki görsellere ihtiyaç duyar:

- `images/profile.jpg` - Profil fotoğrafı (300x300px önerilen)
- `images/project1.jpg` - Proje 1 görseli 
- `images/project2.jpg` - Proje 2 görseli
- `images/project3.jpg` - Proje 3 görseli

## Lisans

MIT Lisansı 