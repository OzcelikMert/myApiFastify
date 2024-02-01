# myAdminPanelApi
Api for My Admin Panel

Things to do:
- eger bir data url ile de cekilebiliyor ise getOnelerin hepsine url ile cektir parametrelerini ona gore ayarlattir schemalardan
- postlardaki url ve post termdeki urllere bak ayni urlden eklenince diger urli url-2 olarak guncelliyor mu
- sessiona duzen var sayfayi kapatinca falan bozulmasin gitmesin

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

