# EF CORE

---

Mesela elindeki proje, **bir restoranda sipariş alma** işine olsun.

Bu restoranda mutfaktan yemek almak için iki farklı yöntem var:

1. **Kendin mutfağa gidip sipariş vermek (ADO.NET Yaklaşımı)(SQL injection da deniyor)**
2. **Garsona sipariş verip, mutfağın yemeği getirmesini beklemek (EF Core Yaklaşımı)**

---

## **1. ADO.NET Yaklaşımı (`HomeController.cs`)**

ADO.NET, mutfağa **kendin gidip** yemeğini alman gibi.

Her seferinde siparişini elle söylemen (SQL sorgusu yazman), tabakları taşırken dikkat etmen (DataTable doldurman) ve sonunda yemeği masaya getirmen (JSON’a dönüştürmen) gerekir.

```csharp
private SqlConnection connection =
    new SqlConnection("Server=localhost,1433;Database=Database1;User Id=SA; Password=Alperen123@;Encrypt=False;");

[HttpGet("[action]")]
public IActionResult GetList()
{
    SqlDataAdapter adapter = new SqlDataAdapter("SELECT * FROM SimpleTable", connection);
    DataTable dataTable = new DataTable();
    dataTable.Clear();
    adapter.Fill(dataTable);

    var result = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
    return Ok(result);
}

```

- **Avantajı:** Her adımı sen yönetirsin, kontrol tamamen sende.
- **Dezavantajı:** Her seferinde mutfağa gidip uzun bir prosedür takip etmen gerekir. Küçük bir değişiklikte bile yeniden uğraşman lazım.

---

## **2. EF Core Yaklaşımı (`EFController.cs` ve İlgili Dosyalar)**

EF Core ise **garsona sipariş vermek** gibi.

Sen yalnızca “Bana tüm menüyü getir” dersin, gerisini garson (EF Core) halleder: Mutfağa gider, yemeği hazırlar, getirir. Hatta hangi tabağın hangi masaya ait olduğunu da bilir.

---

### **Model Sınıfı (`SimpleTable.cs`)**

Bu, restoran menüsündeki **yemek tarifleri** gibi.

Her özellik, tablodaki bir sütunu temsil eder.

```csharp
public class SimpleTable
{
    public int Id { get; set; }
    public string Name { get; set; }
}

```

---

### **Veritabanı Bağlamı (`DenemeContext.cs`)**

Bu, restoranın **sipariş defteri**.

Garson, hangi masaya hangi yemeklerin ait olduğunu buradan bilir.

```csharp
public class DenemeContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(
            "Server=localhost,1433;Database=Database1;User Id=SA; Password=Alperen123@;Encrypt=False;");
    }

    public DbSet<SimpleTable> SimpleTable { get; set; }
}

```

- `OnConfiguring`: Garsona “hangi mutfakla (SQL Server) çalışacağını ve adresini (connection string) bildiriyorsun.”
- `DbSet<SimpleTable>`: “Bu sayfa, **SimpleTable menüsüne** ait yemeklerin listesi” anlamına geliyor.

---

### **Controller (`EFController.cs`)**

Burada artık mutfağa gitmene gerek yok.

Sadece “Tüm SimpleTable kayıtlarını getir” diyorsun, EF Core gerisini hallediyor.

```csharp
public class EFController : Controller
{
   private DenemeContext context = new();

   [HttpGet("[action]")]
   public IActionResult GetList()
   {
      var result = context.SimpleTable.ToList();
      return Ok(result);
   }
}

```

---

### **Kısaca Fark**

| Özellik | ADO.NET | EF Core |
| --- | --- | --- |
| **Kontrol** | Tamamen sende | EF Core yönetir |
| **Kod Miktarı** | Fazla | Daha az |
| **Bakım Kolaylığı** | Zor | Kolay |
| **Hızlı Başlangıç** | Daha uzun sürer | Daha hızlı |

---

💡 **Analojiyi özetlersek:**

- **ADO.NET:** Mutfağa kendin gitmek → Daha çok iş, daha fazla kontrol
- **EF Core:** Garsona sipariş vermek → Daha az iş, daha fazla rahatlık

---

İstersen ben bu benzetmeye ek olarak sana **ADO.NET → EF Core dönüşüm adımlarını** da görsel gibi basit bir tablo ile gösterebilirim. Böylece “garson” sistemine geçiş çok net olur.

Bunu hazırlamamı ister misin?

# ***CRUD yani YAZMA işlemleri***

# EF CORE ile POST (CRUD)

Öncelikle normal **SQL Query ile** yapsaydık nasıl olurdu onu görelim:

Bu yol hatalara daha açıktır çünkü yazması biraz daha karmaşık olacaktır .. 

```csharp
[HttpPost("[action]")]
    public IActionResult Add(SimpleTable simpleTable)
    {
        SqlCommand command =
            new SqlCommand("insert into SimpleTable(Name) values(@parametre1)", connection);
        command.Parameters.AddWithValue("@parametre1", simpleTable.Name);
        connection.Open();
        command.ExecuteNonQuery(); 
        connection.Close();
        return Ok("Kayıt işlemi başarıyla tamamlandı");
    }
```

Şimdi **EFCore ile** yapalım 

```csharp
[HttpPost("[action]")]
	public IActionResult Add(SimpleTable simpleTable)
	{
	 context.SimpleTable.Add(simpleTable); //memory e yazdık 
	 context.SaveChanges(); // db ye yazdık 
	 
	 return Ok("Your post succeed")
```

# UPDATE işlemi (CRUD)

Öncelikle SQL injection ile yapalım 

```csharp
[HttpPost("[action]")]
    public IActionResult Update(SimpleTable simpleTable)
    {
        SqlCommand command = new SqlCommand("update SimpleTable set Name=@parametreName where Id=@parametreId", connection);
        command.Parameters.AddWithValue("@parametreName", simpleTable.Name);
        command.Parameters.AddWithValue("@parametreId", simpleTable.Id);
        connection.Open();
        command.ExecuteNonQuery();
        connection.Close();
        return Ok("your changes has been updated");
    }
```

şimdi Entity Framework yani EFCore ile yapalım

```csharp
 [HttpPost("[action]")]
   public IActionResult Update(SimpleTable simpleTable)
   {
      context.SimpleTable.Update(simpleTable);
      context.SaveChanges();
      return Ok();
   }
```

# DELETE işlemi EFCore ile

```csharp
[HttpDelete("[action]")]
   public IActionResult Delete(SimpleTable simpleTable)
   {
      context.SimpleTable.Remove(simpleTable);
      context.SaveChanges();
      return Ok();
   }
```

diğerleri gibi yapıyoruz yalnız bir ayrıntı var burada istek gönderirken sadece id kısmı doğru girildiğinde yeterli oluyor 

- mesela id ve name bizim tablomuzda
    - biz bu post isteğinin sadece id doğru girip name yanlış girersek yine silecektir
        - çünkü arka planda DELETE FROM SimpleTables WHERE ID=parametre yapıyor yani fark edileceği üzere name adında bir sorgu göndermiyor

## — REMOVE RANGE NEDİR?

```csharp
[HttpDelete("[action]")]
   public IActionResult RemoveRange(SimpleTable[] simpleTable)
   {
      context.SimpleTable.RemoveRange(simpleTable);
      context.SaveChanges();
      return Ok();
   }
```

burda dikkat edilmesi gereken yer array olarak alıyoruz **(SimpleTable[])**  bu sayede birden fazla itemi silebiliyoruz 

# ***OKUMA İŞLEMLERİ***

# ToList() ve AsQueryable()

```csharp
[HttpGet("[action]")]
    public IActionResult GetList()
    {
        // QueryAble
        IQueryable<SimpleTable> result = context.simpleTable.AsQuaryable();
        result = result.Where(s => s.Id == 1 && s.Name.Contains("Alperen") );
       
														//Contains : içerisinde Alperen içerenleri tarar
        
        //Enumarable
        IEnumerable<SimpleTabele> result1 = context.SimpleTable.ToList();
        result1.Where(p => p.Id == 1);
        
        //List
        List<SimpleTable> result2 = context.SimpleTable.ToList();
        result2.Where(p=>p.Id == 1);
        return Ok(result);

    }
```

**IQueryable<T> :** 

- AsQueryable ile kullanılır , sorgular SQL üzerinde yapılır
- Yüksek performanslıdır
- ToList gibi şeylerle sonradan uyfularız

**IEnumarable<T>:** 

- Sorgular memory üzerinde yapılır
- Interface olduğundan veriyi saklayamaz sadece dolaşır
- .ToList ile çağrılır
- listede sadece ileri gidebilir

**List<T> :** 

- Sorgular yine memory üzerinde yapılıyordu lakin bellek maliyeti yüksek
- IEnumarablenin somut bir iterasyonudur
- .Add , .Remove , .Insert gibi metdlarla collection işlemleri yapılabilir
- .ToList olarak çağrılır
- Listede index mantığı ile gidebilir

**NOT**: Where sorgusu yaparken ve (&&) , veya(||) kullanabiliriz .

**NOT2**: Eğer belirtmeyip direkt var ile sağlarsak biz sisteme diyoruzki kendin belirle o da memoryde olup olmamasına göre kendisi karar veriyor performans ve hata yönetimi açısından biraz sıkıntılı olabilir .

```csharp
var result = context.SimpleList.ToList();
// Enumarable olarak döner çünkü memorye alır ToList

var result = context.SimpleList.AsQueryable();
// Queryable olarak döner çünkü hala sorgu halinde AsQueryAble 
```

# FIRST OR DEFAULT , SINGLE OR DEFAULT , SELECT

## `FirstOrDefault`

- Koleksiyondaki **ilk elemanı** getirir.
- Hiç eleman yoksa → `default` döner (`null` ya da tipin default değeri).

```csharp
//her ikiside aynı işi yapacaktır
var result = context.SimpleTable.ToList().Where(p=> p.Id==2).FirstOrDefault();
var result = context.SimpleTable.FirstOrDefault(p=> p.Id==2);
```

İlk id no 2 olanı getirir yoksa null döner 

## `SingleOrDefault`

- Koleksiyondaki **tam 1 tane** eleman varsa onu getirir.
- Hiç yoksa → `default` döner.
- Eğer **1’den fazla** bulursa → **hata fırlatır (InvalidOperationException)**.

```csharp
//her ikiside aynı işi yapacaktır 
var result = context.SimpleTable.ToList().Where(p=> p.Id==2).SingleOrDefault();
var result = context.SimpleTable.SingleOrDefault(p=> p.Id==2);
```

Id=2 olanı getirir eğer birden fazla varsa hata döner , yoksa null döner 

Mesala Nameleri dönsün istiyorsam o zaman şunu yapmam gerekiyor :

```csharp
var result= context.SimpleTable.ToList()
																	.Where(p=> p.Id==2)
																			.Select(p=> p.Name)
																					.FirstOrDefault();

```

yada

```csharp
var result = context.SimpleTable.SingleOrDefault(p=> p.Id==2).Name;
```

asıl yapmamız gereken ikinci işlemdir çünkü daha basittir zorlaştırmadan böyle yapabiliriz ama mantığınıda bilmemiz gerekiyor.

### İLK VE SON KAYITLARI ALMAK :

İlk olarak ilk 5 kaydı sırasız olarak almak istersek Take kullanmamız gerekiyor 

```csharp
var result = context.SimpleTable.ToList()
																	.Where(p=>p.Name.Contains("a")
																		.Take(5);
```

İlk 5 kaydı Id ye göre sıralayalım(OrderBy) arından ilk 5 sırayı alalım Take(5)

```csharp
var result = context.SimpleTAble.ToList()
																	.Where(p=> p.Name.Contains("a))
																		.OrderBy(p=>p.Id)
																			.Take(5);
```

Id ye göre sıralarız sonra descending ile başaşağı yaparız (OrderByDescending)sani sonuncu artık başa geçmiş olur bizde sondan 5 sırayı almış oluyorum

```csharp
var result = context.SimpleTable.ToList()
																	.Where(p=>p.Namr.Contains("a")
																		.OrderByDescending(p=>p.Id)
																			.Take(5)
```

Mesela fiyatı en yüksek olanı çekmek istersek Max kullanırız.

```csharp
var MaxPriceProducts = context.Products.Max(p=> p.Price); 
```

- aynı durumun tersini Min sorgusu kullanarak yapabiliriz

# Data Transfer Object (DTO)

Sql deki viewlere karşılık geliyor yani , içerisinde veritabanında olmayan ama bana istediğim şekilde veri döndürebilen yapıdır . 

Yani data manipulasyonu yapıyoruz .

bir örnek üzerinden gidelim Dto objemizi oluşturalım ve Product içindekileri almak için inherit edelim

```csharp
public class ProductDto : Product
{
} 
```

mesela db de ProductName olmasın ve biz bunu eklemek isteyelim 

```csharp
public class ProductDto : Product
{
	public sting CategoryName {get:set:}
} 
```

### Şimdide Bu Sorguyu joinleyelim

Controller içinde yapacağız bunu

```csharp
var result= from product in context.Products
```

- db de olan Products içeriğini producta çekeriz (in den sonra yazılanlar burada kaynağı ifade ediyor)

```csharp
var result = from product in context.Products 
						 join category in context.Categories
```

- db de olan Categories içeriğini category’e çekeriz

```csharp
var result = from product in context.Products
						 join category in context.Categories 
						 on product.CategoryId equals category.Id
```

- `on ... equals ...` kısmı, iki kaynağı **anahtar eşitliğine** göre birleştirir (iç birleştirme / inner join).

```csharp
var result = from product in context.Products
             join category in context.Categories on product.CategoryId equals category.Id
             select new ProductDto
             {
                 Id = product.Id,
                 CategoryId = product.CategoryId,
                 CategoryName = category.Name,
                 Name = product.Name,
                 Price = product.Price
             };
```

- İki tablodan gelen verileri bir araya getirip, sadece ihtiyaç duyulan alanları `ProductDto` adındaki **DTO (Data Transfer Object)** tipine dönüştürüyor.

## Find metodu

```csharp
var result = context.Products.Find(4)
```

Burada Find , Products içerisindeki primary keyleri tarar ( genellikle id olur bu keyler db tarafı ayarlar) ve bu keye ait olan itemi getirir .

# **Code First**

Entity Framework dünyasında “Code First” dediğimiz kavram aslında **veritabanını koddan üretmek** anlamına gelir.

- Sen sadece **C# sınıflarını** (class) yazarsın, EF bu sınıflara bakarak veritabanı şemasını **kendisi oluşturur**.

![Ekran Resmi 2025-08-25 15.36.31.png](EF%20CORE%2024fc050d76138054b1eded13e4b3362b/Ekran_Resmi_2025-08-25_15.36.31.png)

Code first kullanmak için Tools ve Design paketinide kurmam gerekiyor..

1- Önce entity class yazalım 

```csharp
public class Student
{
		public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}
```

2- Sonra context oluşturalım 

```csharp

public DenemeContext : DbContext
{
		//override OnConfiguration yazarsan oto oluşturur bi alltakini
		protected override void OnConfiguring(DbContextOptionBuilder optionsBuilder)
		{
			optionsBuilder.useSqlServer("//buraya conntection string yazacağız ama db kısmına oluşturacağımız db nin ismini yazacağız farklı olarak");
		}
		
		public DbSet<Student> Students {get: set:}
}
```

buraya kadar her şey çok iyi şimdi migrate etmemiz gerekiyor yani db ye biz değişikliği yaptık sende değiştir diyoruz 

3- MIGRATE VE UPDATE

```bash
add-migration InitialCreate
update-database
```

Daha detaylı anlatımı : 

### - MIGRATION (GÖÇ)

- Migration = **Kod tarafındaki model değişikliklerini veritabanına yansıtmak için kullanılan “adım”**.
    - Sen C#’ta entity sınıflarını (`Product`, `Category` vs.) değiştirirsin → mesela yeni bir property ekledin (`Stock` gibi).
        - Ama veritabanı bu değişikliği **kendiliğinden bilmez**.
            - İşte `migration` komutu çalıştırarak **bu değişiklikleri bir dosyaya kaydedersin**. Bu dosyada EF Core, SQL olarak hangi tabloya ne eklenmesi gerektiğini tutar.
- 👉 Örn:
    
    ```csharp
    dotnet ef migrations add AddStockToProduct	
    ```
    
    Bu komut sana bir `Migrations` klasörü altında şu tip bir C# dosyası üretir:
    
    ```csharp
    public partial class AddStockToProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "Products",
                nullable: false,
                defaultValue: 0);
        }
    
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Products");
        }
    }
    ```
    
    - `Up()` → Bu migration **uygulandığında** yapılacak işlemler (örn. sütun ekle).
    - `Down()` → Bu migration **geri alındığında** yapılacak işlemler (örn. sütun sil).

### - Update (Database Update)

- Migration dosyasını oluşturmak yetmez, bunu veritabanına **uygulaman** gerekir.
    
    ```csharp
    dotnet ef database update
    ```
    
    - EF Core, sırayla migration dosyalarındaki `Up()` metodlarını çalıştırır.
    - Böylece veritabanı tabloları **kodundaki entity’lerle senkronize** olur.

## Data Annotations ile Propertylere özellik ekleme

Entity sınıfındaki propertylere attiribute yani öznitelikler ekleyebiliriz . EFCore da buna göre db de oluşturur.

```bash
public class Product
{
    [Key] // Primary key olduğunu belirtir
    public int Id { get; set; }

    [Required] // Boş geçilemez (NOT NULL)
    [MaxLength(100)] // Maksimum 100 karakter
    public string Name { get; set; }

    [Column(TypeName = "decimal(18,2)")] // SQL tarafında tip ve precision ayarlama
    public decimal Price { get; set; }

    [Range(0, 1000)] // 0 ile 1000 arası olmalı (Validation için)
    public int Stock { get; set; }

    [ForeignKey("Category")] // İlişkiyi belirtme
    public int CategoryId { get; set; }

    public Category Category { get; set; } // Navigation property
}

```

### 1. **Anahtar & Kimlik**

- `[Key]` → Primary key olduğunu belirtir.
- `[DatabaseGenerated(DatabaseGeneratedOption.Identity)]` → Otomatik artan (Identity) yapar.

### 2. **Zorunluluk & Uzunluk**

- `[Required]` → Boş olamaz (`NOT NULL`).
- `[MaxLength(50)]` veya `[StringLength(50)]` → Maksimum uzunluğu sınırlar.
- `[MinLength(3)]` → Minimum uzunluk belirler.

### 3. **Veri Tipi & Format**

- `[Column(TypeName = "decimal(18,2)")]` → SQL’de tipini ayarlamak için.
- `[DataType(DataType.Date)]` → UI/Validation için (örn. sadece tarih).

### 4. **Range & Regex**

- `[Range(0, 9999)]` → Sayı aralığını sınırlar.
- `[RegularExpression(@"^[A-Z]\d{3}$")]` → Regex kontrolü.

### 5. **İlişkiler**

- `[ForeignKey("Category")]` → Navigation property için foreign key belirtir.
- `[InverseProperty("Products")]` → İki taraflı ilişkilerde yön belirtir.

---

## OnModelCreating ile Propertylere özellik ekleme

Data Annotations sadece belirli özellikler sunuyor; ama Fluent API (yani `OnModelCreating`) ile **çok daha esnek ve güçlü ayarlar** yapabiliyoruz.

- DbContext içerisinde override ederiz . Yapıların nasıl ayarlanacağını kodla fluent tarzda yazarız.
    
    ```csharp
    public class AppDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Burada property ayarları yapılır
        }
    }
    
    ```
    
    Bir örnek yapalım ;
    
    - Öncelikle Entity oluşturalım
        
        ```csharp
        public class Product
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public decimal Price { get; set; }
            public int Stock { get; set; }
            public int CategoryId { get; set; }
            public Category Category { get; set; }
        }
        ```
        
    - Şimdi DbContext içerisindeki override ettiğimiz OnModelCreating kısmını fluent tarzda yönetip property özelliklerini ayarlayalım
        
        ```csharp
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Product tablosu için ayarlar
            modelBuilder.Entity<Product>(entity =>
            {
                // Primary key
                entity.HasKey(p => p.Id);
        
                // Name alanı zorunlu ve max 100 karakter
                entity.Property(p => p.Name)
                      .IsRequired()
                      .HasMaxLength(100);
        
                // Price alanı decimal(18,2)
                entity.Property(p => p.Price)
                      .HasColumnType("decimal(18,2)");
        
                // Stock default değer 0
                entity.Property(p => p.Stock)
                      .HasDefaultValue(0);
        
                // Category ilişkisi (FK)
                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId);
            });
        }
        
        ```
        

### Sık Kullanılan Fluent Api Metodları

- `HasKey(x => x.Id)` → Primary key.
- `Property(x => x.Name)` → Bir property üzerinde işlem başlatır.
    - `.IsRequired()` → NOT NULL.
    - `.HasMaxLength(100)` → String uzunluğu.
    - `.HasColumnType("decimal(18,2)")` → SQL veri tipi.
    - `.HasDefaultValue(0)` → Varsayılan değer.
- `HasOne(...).WithMany(...).HasForeignKey(...)` → İlişki tanımı.
- `ToTable("Products")` → Tablo adını belirler.

---

# IEntityConfiguration<T> ile Configuration Yapma

Projede entity sayısı arttıkça **OnModelCreating şişer**. Bunun için EF Core bize **IEntityTypeConfiguration<T>**arayüzünü sunuyor.

## 🔹 IEntityTypeConfiguration<T> Nedir?

- Bir entity’nin konfigürasyonunu ayrı bir **class** içine taşımana izin verir.
- `OnModelCreating` içinde uzun uzun yazmak yerine, her entity için **Configuration class** yaparsın.
- Bu, **Clean Code** ve **Separation of Concerns** (ayrı sorumluluk) sağlar.
    
    ```csharp
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
    
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            // Tablo adı
            builder.ToTable("Products");
    
            // Primary Key
            builder.HasKey(p => p.Id);
    
            // Name property
            builder.Property(p => p.Name)
                   .IsRequired()
                   .HasMaxLength(100);
    
            // Price property
            builder.Property(p => p.Price)
                   .HasColumnType("decimal(18,2)");
    
            // Stock default 0
            builder.Property(p => p.Stock)
                   .HasDefaultValue(0);
    
            // İlişki
            builder.HasOne(p => p.Category)
                   .WithMany(c => c.Products)
                   .HasForeignKey(p => p.CategoryId);
        }
    }
    ```
    

Buraya kadar yaparsak ve migration - update yaparsak bizim conf hiçbir işe yaramayacak çünkü biz aradaki bağlantımıza yani DBContext imize haber vermedik şimdi onu yapalım 

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration class’ı uygula
        modelBuilder.ApplyConfiguration(new ProductConfiguration());

        // Eğer bütün configuration class’larını otomatik bulsun istersen:
        // modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}

```

---

# Tablolar Arasında İlişki Kurma

- Üç tarz ilişkimiz vardır foregin keyler ile kurulabilecek bunlar,
    - **Birebir ilişki (one to one) :** Bir tabloda bulunan bir kaydın, diğer tabloda **sadece bir** karşılığı vardır. Yani “her A’nın yalnızca bir B’si vardır” ilişkisi.
        - mesela
            - **Kullanıcı** tablosu
            - **KullanıcıProfili** tablosu
                
                Her kullanıcının **tek bir profili** olabilir, her profil sadece **tek bir kullanıcıya** aittir.
                
    - **Bire çok ilişki ( one to many) :**Bir tabloda bulunan bir kaydın, diğer tabloda **birden çok** karşılığı olabilir. Yani “her A’nın birçok B’si vardır, ama her B yalnızca bir A’ya bağlıdır.”
        - mesela
            - **Kategori** tablosu
            - **Ürün** tablosu
                
                Bir kategoride **birden fazla ürün** olabilir, ama her ürün **tek bir kategoriye** aittir.
                
    - Çoktan çoğa (many to many): Bir tabloda bulunan bir kaydın, diğer tabloda **birden fazla** karşılığı olabilir ve tersi de doğrudur.
        - mesela
            - **Öğrenciler** tablosu
            - **Dersler** tablosu
                
                Bir öğrenci birden fazla derse girebilir, bir ders de birden fazla öğrenciye ait olabilir.
                

```csharp
public class Product
{
		public int ProductId {get:set:}
		public string Name {get:set:}
		public decimal Price {get:set:}
		public int CategoryId {get:set:} //foregin key 
		public Category Category{get:set:} //navigation property
}
```

Navigation property ilgili foregin keyin altında olmalıdır

```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Total { get; set; }

    // Navigation Property - 1 kategori, çok ürün
    public ICollection<Product> Products { get; set; } //bu opsiyonel yazmasanda kuruyor bağlantıyı 
}

```

---

# Connection Başka Yöntemler

**1- `OnConfiguration`u** öğrenmiştik ; bu yöntem hızlıdır ve kolaydır , ancak connection string doğrudan kodda durduğu için profesyonel projelerde çok tercih edilmez.

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseSqlServer("Server=localhost;Database=MyDb;Trusted_Connection=True;");
}

```

**2-`DbContextOptions` + `Program.cs` + `appsettings.json` Kullanımı ;**Connection string’i kod içinde yazmak yerine **appsettings.json** dosyasında tutmak çok daha güvenli ve düzenlidir. Bu sayede hem kodumuz temiz olur hem connection stringimiz merkezi bir yerde durur.

Şimdi adım adım yapalım ; 

- A)  **appsettings.json’a bağlantı bilgisini koyarız**

📄 **appsettings.json**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=MyAppDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
  },
  "Logging": { "LogLevel": { "Default": "Information", "Microsoft": "Warning" } },
  "AllowedHosts": "*"
}
```

- **Windows Local SQL** (Windows auth) kullanıyorsan alternatif:
    
    ```json
    "DefaultConnection": "Server=localhost;Database=MyAppDb;Trusted_Connection=True;TrustServerCertificate=True;"
    ```
    
- **Docker/Azure SQL Edge** için genelde `User Id/Password` kullanılır ve `,1433` portu gerekir.
- Yeni .NET sürümlerinde çoğu ortamda **Encrypt** default açık olduğundan `TrustServerCertificate=True` işini kolaylaştırır (geliştirme ortamı için uygundur).

-B ) DbContext Kısmı 

Veritabanı tablolarınızı temsil edecek `DbContext` sınıfı

```csharp
public class AppDbContext : DbContext
{
    // DI(dependecy injection) ile dışarıdan options gelir biz program.cs den yollicaz
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
```

-C) Program.cs kısmı

Burada 

```csharp
...
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
...
builder.Services.AddDbContext<DenemeContext>(options =>
{
		options.UseSqlServer(connectionString);
});
```

---

# Scaffold ile Tersine Mühendislik

Normalde biz EF Core’da **Code First** yaklaşımıyla önce C# tarafında class’larımızı (entity’ler) yazarız, sonra migration ile veritabanını oluştururuz.

Ama bazı durumlarda:

- Veritabanı **zaten vardır** (ör. şirketin halihazırda kullandığı SQL Server DB’si).
- Biz sadece o veritabanına bağlanıp C# tarafına model class’larını **otomatik çıkarmak** isteriz.

İşte bu durumda **Scaffold-DbContext** komutu kullanılır. Bu işleme **Database First (Reverse Engineering)** denir.

- Biz alttaki komutu yazarak bunu otomatikleştiriyoruz ve kendisi bizim için models ve contexi oluşturuyor
    
    ```bash
    dotnet ef dbcontext scaffold "Server=localhost;Database=MyDb;User Id=sa;Password=MyPassword123;" Microsoft.EntityFrameworkCore.SqlServer
    ```
    
    - eğer hepsini değilde bazı tabloları almak istersek
    
    ```bash
    dotnet ef dbcontext scaffold "Server=localhost;Database=MyDb;User Id=sa;Password=123;" Microsoft.EntityFrameworkCore.SqlServer -o Models -t Products -t Categories
    ```
    

---

# TÜM DBLERE BAĞLANTI PAKETLERİ

| Veritabanı Sistemi | Örnek Yapılandırma | NuGet Paketi |
| --- | --- | --- |
| **SQL Server / Azure SQL** | `.UseSqlServer(connectionString)` | Microsoft.EntityFrameworkCore.SqlServer |
| **Azure Cosmos DB** | `.UseCosmos(connectionString, databaseName)` | Microsoft.EntityFrameworkCore.Cosmos |
| **SQLite** | `.UseSqlite(connectionString)` | Microsoft.EntityFrameworkCore.Sqlite |
| **EF Core bellek içi veritabanı** | `.UseInMemoryDatabase(databaseName)` | Microsoft.EntityFrameworkCore.InMemory |
| **PostgreSQL*** | `.UseNpgsql(connectionString)` | Npgsql.EntityFrameworkCore.PostgreSQL |
| **MySQL / MariaDB*** | `.UseMySql(connectionString)` | Pomelo.EntityFrameworkCore.MySql |
| **Oracle*** | `.UseOracle(connectionString)` | Oracle.EntityFrameworkCore |