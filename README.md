# myAdminPanelApi
Api for My Admin Panel

Things to do:

+ image yukleniyormu diye kontrol et (basePath degisti belki hataya sebep oluyordur)
+ configdeki timer icin her modelin timerini timers klasorunun icinde olustur
+ imagelerde statla imagenin bilgilerini cektikten sonra dbye kaydet. her resim icin stat bilgilerini tekrar tekrar cekme
+ projedeki import pathlerini tsconfigde tanimla ve tanimli haliyle cek
+ midlewarede ilk select sorgularindan sonra gelen degeri bir degiskene aktar ve diger middlewarelarde o degiskenden cek
+ settinge dynamic pathler icin bir model ve route yap (sadece super admin ekleyip guncelleyebilsin)
+ statusu pending olan postlari kontrol et tarihi gelenleri statuslarini active olarak guncelle (bunu timer veya farkli bir yol ile yap otomatik guncelleme yapsin)
+ page type olarak super admin disindaki kullanicilar sadece default page typi ekleyebilsin
+ componentlerde componentin ana elementId sini sadece super admin guncellemeli yetki kontrolu yap
+ static contenti kaldir
+ elementId olanlari key olarak guncelle
+ postlarda yetkili kullanicilar diye biryer olsun oradan eklenen kullanicilar post ona ait olmasa bile postu gorup guncelleyebilsinler
+ sifre degistimi degismedimi diye sessionu kotnorl et
+ component element, social media ve baska bu tip arraylar varsa bunlarin izinlerini kontorl et super admin harici ekleyemesin ama guncelleyebilsin
+ zoddan enumlari kontrol ederken enum degerler string donuyor 
+ service disindaki get one lerin hepsini get with Id falan yap
+ permissions lar icin minRoleId yap ve kontrol et (ornek min rol id yetiyormu yetiyorsada permisison id si varmi gibi)
+ sessiona duzen var sayfayi kapatinca falan bozulmasin gitmesin
+ tum dosyalarinda export defaultlari export olarak duzenle ve artik constlar gibi degerleri buyuk harflerle baslatarak cekme zorunlulugu yap (opsiyonel)
+ postlardaki url ve post termdeki urllere bak ayni urlden eklenince diger urli url-2 olarak guncelliyor mu
+ Yup'u Zod'a cevir
+ Express.js'i Fastify'a cevir
+ route nun sonunda One varsa ve id cekiyorsa update get delete vs. route'a :_id paramtersi ekle
+ route dan manyleri sil
+ route daki linkleri duzgun yap updatede update olsun deletede delete olsun gibi
+ routedaki linkleri artik fonksyiondan cekme const degerden cek
+ post ve termlerdeki typeid paramdan kaldir query yada body olarak gonder
+ schemalari ayarladigin routelera gore tekrar duzenle (parametrelere dikkat et)
+ get lerde id leri paramtereden cekecceksen eger controller ve middlewarede zodda ayarladigin degisiklilkleri guncelle
+ sessionu kullandigin yerleri tekrar duzenle user ekledin sessiona datadan degil userdan cek verileri
+ permission kontrolunu routlara gonderdigin fonskyonun icine atadigin parametreler ile yap ve permisison middlewareyi ona gore tekrar ayarla
+ schema ile kontrol ederken enum degerleride kontrol et enum disinda deger gelmemesi lazim
+ schemalar ile kontrol yaptiktan sonra schemalarda berlitilen datalar disinda bir data geliyormu kontrol et eger geliyorsa temizle
+ blogerlar sadece kendi yazdiklarini duzenleyebilsin (editorlerde yetki varsa hepsini guncelleyebilsinler)
+ resimlseri kimin eklediginin datasini tut ve sadece kendi resimlerini silsinler (editor hepsini duzenleyebilsin)
+ export defualttan fonskiyonlari ayikla const olarak olustur sonra export defaulta ekle
+ subsriber da email ve id ile farkli routelar ata
+ eger bir data url ile de cekilebiliyor ise getOnelerin hepsine url ile cektir parametrelerini ona gore ayarlattir schemalardan
+ tum interfacelerdeki Document ekini sil onun yerine I kullan basinda

