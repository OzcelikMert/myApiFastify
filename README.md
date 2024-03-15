# myAdminPanelApi
Api for My Admin Panel

Things to do:
- lastAuthorId yi array olarak tut en son guncelleyen en sonuncu indexde olsun ayni id birkez daha eklenmesin

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

