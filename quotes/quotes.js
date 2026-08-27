/* MagicMirror² - Quotes Module
 * Redesigned by Răzvan Cristea for iPad 3 & HD display
 
 * https://github.com/razvanh255
 * Creative Commons BY-NC-SA 4.0, Romania.
 
 * Original MagicMirror² MIT Licensed.
 */
Module.register("quotes", {

	defaults: {
		updateInterval: 20000,
		category: "random",
		className: "medium",
		fadeSpeed: config.animationSpeed,
		quotes: {
			selected: [
				"\"Fii tu insuți, toți ceilalți sunt deja luați.\"~ Oscar Wilde ~",
				"\"Două lucruri sunt infinite: universul și prostia umană dar nu sunt sigur de univers.\"~ Albert Einstein ~",
				"\"Nimeni nu te poate face să te simți inferior fără acordul tău.\"~ Eleanor Roosevelt ~",
				"\"Dacă spui adevărul, nu trebuie să îți amintești ce ai mințit.\"~ Mark Twain ~",
				"\"Fără muzică, viața ar fi o greșeală.\"~ Friedrich Nietzsche ~",
				"\"Este mai bine să fii urât pentru ceea ce ești, decât să fii iubit pentru ceea ce nu ești.\"~ Andre Gide ~",
				"\"Este mai bine să taci riscând să fi considerat prost, decât să vorbești și să înlături orice îndoială.\"~ Maurice Switzer ~",
				"\"Prostul crede că este înțelept, dar omul înțelept știe că este un prost.\"~ William Shakespeare ~",
				"\"Nu am eșuat. Am găsit doar 10.000 de moduri care nu funcționează.\"~ Thomas A. Edison ~",
				"\"Îmi plac fanteziile, trezește celulele creierului. Imaginația este un ingredient necesar în viață.\"~ Theodor Seuss Geisel ~",
				"\"Dragostea este condiția în care fericirea altei persoane este esențială pentru propria ta fericire.\"~ Robert A. Heinlein ~",
				"\"Tot ce vă puteți imagina este real.\"~ Pablo Picasso ~",
				"\"Un lucru bun despre muzică, când te lovește, nu simți nicio durere.\"~ Bob Marley ~",
			],
			romanian: [
				"\"Egalitatea nu există decât în matematică.\"~ Mihai Eminescu ~",
				"\"Există o categorie specială de surzi: aceia care nu vor să audă decât ce spun ei.\"~ Tudor Mușatescu ~",
				"\"O furnică nu poate răsturna un munte, dar îl poate muta din loc încet, bucăţică cu bucăţică.\"~ Marin Preda ~",
				"\"Oameni sunt păsări cu aripile crescute înlăuntru.\"~ Nichita Stănescu ~",
				"\"Mă uit la toate lucrurile de două ori: o dată ca să fiu vesel și o dată ca să fiu trist.\"~ Ion Minulescu ~",
				"\"Adevărul învinge, indiferent de soarta celor care l-au servit.\"~ Ghe. I. Brătianu ~",
				"\"Civilizația este o bătălie neîncetată iar înfrangerea e posibilă, la fel ca și victoria.\"~ Spiru Haret ~",
				"\"Soarta este scuza celor slabi și opera celor tari.\"~ Nicolae Titulescu ~",
				"\"Pentru mine, limba română e distanţa dintre inimă şi umbra ei, care se numeşte suflet.\"~ Fănuș Neagu ~",
				"\"Teoriile nu-s decât mostre fără de valoare. Numai fapta contează.\"~ Constantin Brîncuși ~",
				"\"Un popor care nu își cunoaște istoria este ca un copil care nu își cunoaște părinții.\"~ Nicolae Iorga ~",
				"\"Nu locuim într-o ţară, locuim într-o limbă. Patria asta înseamnă şi nimic altceva.\"~ Emil Cioran ~",
				"\"Una din marile mulțumiri ale vieții e să te știi om bun.\"~ Ioan Slavici ~",
				"\"Unii sunt naivi tocmai prin faptul că iau toate lucrurile în serios.\"~ Lucian Blaga ~",
				"\"Omul nu este propriul lui prezent. El este propriul său viitor.\"~ Constantin Noica ~",
				"\"A pricepe este mai important decât a ști.\"~ Alexandru Ioan Cuza ~",
				"\"Rămâne ca fiecare să aibă amintirile pe care le merită.\"~ Octavian Paler ~",
				"\"Viitorul este suma paşilor pe care îi faci, inclusiv a celor mici, ignoraţi sau luaţi în râs.\"~ Henri Coandă ~",
				"\"Dacă n-ai văzut încă o femeie care iubește, atunci n-ai văzut niciodată o femeie frumoasă.\"~ Camil Petrescu ~",
				"\"Tragediile, ca şi bucuriile cele mai mari, omul le trăieşte întotdeauna singur.\"~ Liviu Rebreanu ~",
				"\"Eșecul este locul de unde te ridici pentru a merge mai departe.\"~ Gabriel Liiceanu ~",
				"\"Nimic nu poate fi mai îngrozitor pe lume decât să ți se cenzureze vorba, ideea, opinia, viața.\"~ Petre Cristea ~",
			],
			Tyson: [
				"\"Nu știu de nici un moment în istoria umană, unde ignoranța era mai bună decât cunoașterea.\"~ Neil deGrasse Tyson ~",
				"\"Natura științei sunt descoperirile, iar cele mai bune sunt cele pe care nu le aștepți.\"~ Neil deGrasse Tyson ~",
				"\"Oamenii care nu pun întrebări rămân neîncrezători de-a lungul vieții.\"~ Neil deGrasse Tyson ~",
				"\"Oamenii creativi sunt motivați de cea mai mare problemă care este prezentată înaintea lor.\"~ Neil deGrasse Tyson ~",
				"\"Universul nu are nicio obligație să aibă sens pentru oricine.\"~ Neil deGrasse Tyson ~",
				"\"Trăim pe Pământ, gândește-te la ce ai putea face astăzi sau mâine și profită la maxim.\"~ Neil deGrasse Tyson ~",
				"\"În cele din urmă, cercetarea științifică se aplică la ceva. Doar nu știm la momentul respectiv.\"~ Neil deGrasse Tyson ~",
				"\"Trăim într-o societate în care, în aproape toate cazurile, munca cinstită este răsplătită.\"~ Neil deGrasse Tyson ~",
				"\"Nu sunt suficienți toți oameni din lume care au o perspectivă cosmică. Dar ei pot schimba viața.\"~ Neil deGrasse Tyson ~",
				"\"De secole, magii au profitat intuitiv de funcționările interioare ale creierului nostru.\"~ Neil deGrasse Tyson ~",
				"\"Ne definim pe noi înșine ca inteligenți. Este ciudat, pentru că ne creăm propria definiție.\"~ Neil deGrasse Tyson ~",
			],
			love: [
				"\"Bărbații vor să fie prima iubire a femeii - femeilor le place să fie ultima iubire romantică a bărbatului.\"~ Oscar Wilde ~",
				"\"La final, iubirea pe care o primiți este egală cu dragostea pe care o faceți.\"~ Paul McCartney ~",
				"\"Pierdem timpul căutând iubirea perfectă, în loc să o creăm.\"~ Tom Robbins ~",
				"\"Iubirea adevărată vine liniștit, fără afișe sau lumini colorate. Dacă auzi clopoței, căuta-te la urechi.\"~ Erich Segal ~",
			],
			motivational: [
				"\"Nu ești niciodată prea bătrân pentru a-ți stabili un alt obiectiv sau pentru a visa un nou vis.\"~ C. S. Lewis ~",
				"\"Oamenii care te influențează sunt oamenii care cred în tine.\"~ Henry Drummond ~",
				"\"Nu ar trebui să renunțăm și nu ar trebui să permitem ca o problemă să ne învingă.\"~ Abdul Kalam ~",
				"\"Fă-ți munca cu toată inima și vei reuși - există atât de puțină concurență.\"~ Elbert Hubbard ~",
				"\"Nu aștepta să lovești până când fierul este fierbinte, ci fă-l fierbinte lovindu-l.\"~ William Butler Yeats ~",
				"\"Îmi place argumentul, dezbaterea. Nu mă aștept ca cineva să fie de acord cu mine.\"~ Margaret Thatcher ~",
			],
			positive: [
				"\"Eșecul te îmbunătățește. De asemenea, este important să accepți că vei face greșeli.\"~ Alain Ducasse ~",
				"\"Avem de ales și uneori pare greu, dar cea mai bună metodă de a te vindeca este să-ți păstrezi optimismul.\"~ Petra Nemcova ~",
				"\"Spune și fă ceva pozitiv care să ajute situația; nu este nevoie să te plângi.\"~ Robert A. Cook ~",
			],
			success: [
				"\"Drumul spre succes este întotdeauna în construcție.\"~ Lily Tomlin ~",
				"\"Nimic nu este la fel de seducător ca asigurarea succesului.\"~ Gertrude Himmelfarb ~",
				"\"Când te afli într-o situație dificilă sau periculoasă, cineva care te face să râzi ușurează tensiunea.\"~ Edmund Hillary ~",
				"\"Succesul este să-ți trăiești viața astfel încât să simți multă plăcere și foarte puțină durere.\"~ Tony Robbins ~",
				"\"Succesul nu este finalul, eșecul nu este fatal: este curajul de a continua, asta contează.\"~ Winston Churchill ~",
				"\"Succesul este să găsești satisfacție în a oferi puțin mai mult decât ai lua.\"~ Christopher Reeve ~",
			],
			other: [
				"\"Singurătatea este un semn că ai nevoie disperată de tine.\"~ Rupi Kaur ~",
				"\"S-ar putea ca oamenii să nu îți spună ce simt despre tine, dar îți arată întotdeauna.\"~ Keri Hilson ~",
				"\"Uneori tot ce ai nevoie este de câteva secunde de curaj nebun.\"~ Benjamin Mee ~",
				"\"Este mult mai ușor să fii supărat pe cineva decât să-i spui că ești rănit.\"~ Tom Gates ~",
				"\"Respectă-te suficient pentru a te îndepărta de orice nu te mai servește sau nu te face fericit.\"~ Robert Tew ~",
				"\"Nu devii mai bun încercând să fii bun, ci găsind bunătatea care este deja în tine.\"~ Eckhart Tolle ~",
				"\"Timpul rezolvă cele mai multe lucruri. Și ce timpul nu poate rezolva, trebuie să rezolvi singur.\"~ Haruki Murakami ~",
				"\"Nicio vinovăție nu poate schimba trecutul și nici o îngrijorare nu poate schimba viitorul.\"~ Umar Ibn Al-Khattaab ~",
				"\"Fii suficient de încrezător în acțiunile tale pentru a nu fi nevoie să te explici. Credee și acționează.\"~ Bernard Roth ~",
				"\"Nu ești o picătură în ocean. Ești întregul ocean într-o picătură.\"~ Jalal ad-Din Muhammad Balkhi ~",
				"\"Oriunde ai fi și orice ai face, fii îndrăgostit.\"~ Jalal ad-Din Muhammad Balkhi ~",
				"\"Oamenii vor uita ce ai spus, ce ai făcut, dar nu vor uita niciodată cum i-ai făcut să se simtă.\"~ Maya Angelou ~",
				"\"Dacă toată lumea și-ar vedea de propria treabă, lumea ar merge cu mult mai bine.\"~ Lewis Carroll ~",
			],
         }
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.lastQuoteIndex = -1;
        var self = this;
        setInterval(function () {
            self.updateDom(self.config.fadeSpeed);
        }, this.config.updateInterval);
    },

    randomIndex: function (quotes) {
        if (quotes.length === 1) return 0;
        var quoteIndex;
        do {
            quoteIndex = Math.floor(Math.random() * quotes.length);
        } while (quoteIndex === this.lastQuoteIndex);
        this.lastQuoteIndex = quoteIndex;
        return quoteIndex;
    },

    quoteArray: function () {
        var categories = Object.keys(this.config.quotes);
        return this.config.category === "random" ?
            this.config.quotes[categories[Math.floor(Math.random() * categories.length)]] :
            this.config.quotes[this.config.category];
    },

    randomQuote: function () {
        var quotes = this.quoteArray();
        var quoteText = quotes[this.randomIndex(quotes)].split("~ ");
        return { text: quoteText[0], author: quoteText[1] || "Autor necunoscut" };
    },

    getDom: function () {
        var quoteObj = this.randomQuote();
        var wrapper = document.createElement("div");
        wrapper.className = this.config.className;
        wrapper.style.textAlign = "center";
        wrapper.style.margin = "0 auto";
        wrapper.style.maxWidth = "100%";

        var quoteText = document.createElement("span");
        quoteText.className = this.config.className;
        quoteText.textContent = quoteObj.text;
        wrapper.appendChild(quoteText);

        var quoteAuthor = document.createElement("span");
        quoteAuthor.className = this.config.className + " author";
        quoteAuthor.innerHTML = "<br>~ " + (quoteObj.author || "");
        wrapper.appendChild(quoteAuthor);

        return wrapper;
    }
});
