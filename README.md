# Amazon Mini

Amazon Mini; ürünlerin listelenebildiği, ürün adına göre arama yapılabildiği, sipariş oluşturulabildiği ve geçmiş siparişlerin görüntülenebildiği küçük bir e-ticaret uygulamasıdır. Proje; React tabanlı bir frontend, ASP.NET Core Web API ve PostgreSQL veritabanından oluşur.

## Kullanılan Teknolojiler

- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- React
- xUnit
- SQLite, PostgreSQL

## 1. Uygulama nasıl çalıştırılır?

Uygulamayı çalıştırmanın en kolay yolu Docker Compose kullanmaktır. Bilgisayarda Docker ve Docker Compose kurulu olmalıdır.

Projenin kök dizininde aşağıdaki komut çalıştırılır:

```bash
docker compose up --build
```

Servisler hazır olduğunda uygulamaya şu adreslerden erişilebilir:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5033/api](http://localhost:5033/api)
- PostgreSQL: `localhost:5432`

Compose; önce PostgreSQL servisini başlatır ve veritabanının sağlıklı duruma gelmesini bekler. Ardından backend başlatılır. Backend açılış sırasında bekleyen Entity Framework Core migration'larını otomatik olarak uygular ve başlangıç ürünlerini veritabanına ekler. Son olarak Vite geliştirme sunucusu üzerinden frontend çalışır.

Çalışan servisleri durdurmak için:

```bash
docker compose down
```

Backend testlerini çalıştırmak için:

```bash
dotnet test --project Backend/Tests/AmazonMini.Tests.csproj
```

## 2. Problemi hangi parçalara ayırdınız?

Problemi aşağıdaki temel parçalara ayırdım:

1. **Ürün yönetimi:** Ürünlerin listelenmesi, ürün detayının getirilmesi ve isme göre aranması.
2. **Sipariş yönetimi:** Müşteri ve ürün bilgilerinin doğrulanması, sipariş oluşturulması ve geçmiş siparişlerin görüntülenmesi.
3. **Stok yönetimi:** İstenen miktarın doğrulanması, yeterli stok kontrolü ve başarılı siparişten sonra stok miktarının azaltılması.
4. **Veri erişimi:** Entity Framework Core ile PostgreSQL üzerinde ürün, sipariş ve sipariş kalemi verilerinin saklanması.
5. **Cache yönetimi:** Sık yapılan okuma işlemlerinde veritabanı erişiminin azaltılması ve veri değiştiğinde ilgili cache kayıtlarının temizlenmesi.
6. **Kullanıcı arayüzü:** Ürün listeleme, arama, sipariş oluşturma ve sipariş geçmişi ekranlarının hazırlanması.
7. **Test ve çalıştırma altyapısı:** Temel sipariş/stok kurallarının test edilmesi ve tüm servislerin Docker Compose ile birlikte ayağa kaldırılması.

## 3. Database modelini neden bu şekilde oluşturdunuz?

Veritabanı modeli `Products`, `Orders` ve `OrderItems` olmak üzere üç temel tablodan oluşur.

### Products

Ürün bilgilerini ve güncel stok durumunu tutar:

- `Id`: Primary key ve benzersiz stok kodu
- `Name`: Ürün adı
- `Price`: Güncel ürün fiyatı
- `Quantity`: Mevcut stok miktarı

Fiyat için `decimal`, stok miktarı için `int` kullanılır. Domain kontrolleri fiyatın ve stok miktarının negatif olmasını engeller.

### Orders

Siparişin genel bilgilerini tutar:

- `Id`: GUID biçiminde primary key
- `CustomerName`: Siparişi veren müşterinin adı
- `CreatedAt`: Siparişin UTC oluşturulma zamanı

Ürün bilgileri doğrudan `Orders` tablosunda saklanmaz; çünkü bir siparişte birden fazla ürün bulunabilir.

### OrderItems

`Orders` ile `Products` arasındaki ilişkiyi ve sipariş satırına ait bilgileri tutar:

- `OrderId`: Siparişe bağlanan foreign key
- `ProductId`: Ürüne bağlanan foreign key
- `Quantity`: Sipariş edilen ürün miktarı
- `PriceDuringOrder`: Ürünün sipariş anındaki fiyatı

Bir sipariş birden fazla ürün içerebilir, aynı ürün de farklı siparişlerde yer alabilir. Bu çoktan çoğa ilişkiyi ek bilgilerle birlikte temsil etmek için `OrderItem` ara modeli kullanıldı. `OrderId` ve `ProductId` alanlarının birlikte birleşik anahtar olması, aynı ürünün aynı sipariş içinde birden fazla ayrı satır olarak kaydedilmesini engeller.

`PriceDuringOrder` alanı özellikle `OrderItem` üzerinde saklanır. Böylece ürünün güncel fiyatı daha sonra değişse bile geçmiş siparişin toplamı ve sipariş verildiği andaki fiyat bilgisi değişmez. Sipariş toplamı ayrıca veritabanında saklanmaz; sipariş kalemlerindeki `Quantity * PriceDuringOrder` değerlerinin toplamından hesaplanır.

## 4. Kod organizasyonunu neden bu şekilde tercih ettiniz?

Backend kodunu sorumluluklarına göre ayırdım:

- `Controllers`, HTTP isteklerini karşılar, uygun yanıt kodlarını döndürür ve cache yönetimini yapar.
- `Services`, sipariş oluşturma gibi iş kurallarını ve uygulama akışını içerir.
- `Models`, temel domain nesnelerini ve bu nesnelerin kendi doğrulama kurallarını içerir.
- `Models/DTOs`, API'nin aldığı ve döndürdüğü veri yapılarını domain modellerinden ayırır.
- `Database`, Entity Framework Core context'ini ve tablo ilişkilerini tanımlar.
- `Migrations`, veritabanı şemasının sürümlü biçimde oluşturulmasını sağlar.
- `Backend/Tests`, üretim kodundan ayrı bir test projesi olarak tutulur.

## 5. Sipariş ve stok işlemlerinde veri bütünlüğünü nasıl sağladınız?

Sipariş oluşturulmadan önce müşteri adının boş olmaması, siparişte en az bir ürün bulunması ve her ürün miktarının sıfırdan büyük olması kontrol edilir. Ayrıca ürünün varlığı ve istenen miktarın mevcut stoktan fazla olmaması doğrulanır.

Stok azaltma işlemi `Product.DecrementStock` metodu üzerinden yapılır. Bu metot negatif veya sıfır miktarı ve mevcut stoktan fazla azaltmayı kabul etmez. Benzer doğrulamalar `Order` ve `OrderItem` modellerinin oluşturulması sırasında da uygulanır.

Sipariş, sipariş kalemleri ve güncellenmiş ürün stokları aynı `AppDbContext` içinde takip edilir ve tek bir `SaveChangesAsync` çağrısıyla veritabanına yazılır. Entity Framework Core, ilişkisel veritabanında tek bir `SaveChanges` çağrısındaki değişiklikleri transaction içinde uygular. Böylece kayıt sırasında hata oluşursa siparişin bir kısmının yazılıp stok değişikliğinin yarım kalması önlenir.

Bu uygulama temel veri bütünlüğünü sağlasa da yüksek eşzamanlılık altında aynı stoğa aynı anda gelen siparişler için optimistic concurrency token veya daha katı transaction seviyesi uygulanmamıştır.

## 6. Cache'i nerede ve neden kullandınız?

Backend üzerinde process içi `IMemoryCache` kullandım. Cache aşağıdaki okuma endpoint'lerinde devreye girer:

- Tüm ürünlerin listelenmesi
- Tek bir ürünün getirilmesi
- Tüm siparişlerin listelenmesi
- Tek bir siparişin getirilmesi

Amaç, sık tekrarlanan ve her istekte değişmeyen okuma işlemlerinde PostgreSQL'e yapılan sorgu sayısını azaltmaktır. Ürün cache kayıtları için 30 saniyelik sliding ve 5 dakikalık absolute expiration; sipariş cache kayıtları için 1 dakikalık sliding ve 10 dakikalık absolute expiration kullanılır.

Ürün araması kullanıcı sorgusuna göre çok sayıda farklı anahtar oluşturabileceği için cache'lenmez ve doğrudan veritabanında çalıştırılır.

## 7. Stok değiştiğinde cache'i nasıl yönettiniz?

Başarılı bir sipariş stok miktarını değiştirdiği için sipariş oluşturulduktan sonra aşağıdaki cache kayıtları silinir:

- Tüm siparişlerin tutulduğu `orders:all`
- Tüm ürünlerin tutulduğu `products:all`
- Siparişteki her ürün için `product:{productId}`

Bu yöntem cache-aside yaklaşımına uygundur. Kayıtlar doğrudan güncellenmek yerine geçersiz kılınır; bir sonraki okuma isteğinde güncel veri veritabanından alınır ve cache yeniden oluşturulur. Cache temizliği yalnızca sipariş başarıyla kaydedildikten sonra yapılır.

## 8. Süre nedeniyle tamamlamadığınız veya sadeleştirdiğiniz noktalar nelerdir?

Süre kısıtı nedeniyle test kapsamını sade tuttum. Tüm controller, endpoint, cache ve frontend davranışlarını kapsayan geniş bir test paketi yerine case'de istenin iki temel iş senaryosuna odaklandım:

- Miktar sıfır olduğunda veya stok yetersiz olduğunda siparişin reddedilmesi
- Başarılı siparişten sonra ürün stok miktarının azalması

Bu testler `OrderService` üzerinde SQLite in-memory veritabanıyla çalışır.

## 9. Hangi AI araçlarını kullandınız?

- Projeyi ve yaklaşımı tartışmak için **Claude Sonnet 5** kullandım.
- Kodlama desteği için **OpenCode üzerinde DeepSeek Flash V4** kullandım.
- Testlerin hazırlanması için **OpenAI Codex** kullandım.

AI araçlarını karar verici olarak değil; fikir alışverişi, kod üretimini hızlandırma ve alternatif yaklaşımları değerlendirme amacıyla kullandım.

## 10. AI tarafından üretilen kodları nasıl kontrol ettiniz?

AI tarafından üretilen kodları doğrudan kabul etmek yerine mevcut proje yapısı ve iş gereksinimleriyle karşılaştırarak inceledim. Kontrol sırasında özellikle şu adımları uyguladım:

- Üretilen kodu ve bağımlılıkları manuel olarak gözden geçirdim.
- Backend ve frontend projelerini derleyerek derleme hatalarını kontrol ettim.
- Sipariş ve stok iş kurallarını xUnit testleriyle doğruladım.
- Docker Compose yapılandırmasını doğruladım ve servisler arasındaki port, bağlantı adresi ve başlangıç sırasını kontrol ettim.
- Hata durumlarını, cache temizliğini ve veritabanına yazılan verileri kaynak kod üzerinden tekrar değerlendirdim.

## 11. Çalışmaya yaklaşık ne kadar zaman ayırdınız?

Analiz, geliştirme, test ve Docker yapılandırması dahil olmak üzere projeye yaklaşık **24 saat** ayırdım.
