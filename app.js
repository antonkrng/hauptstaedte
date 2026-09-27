const europaButton = document.getElementById("europa");
const afrikaButton = document.getElementById("afrika");
const asienButton = document.getElementById("asien");
const nordamerikaButton = document.getElementById("nordamerika");
const suedamerikaButton = document.getElementById("suedamerika");
const ozeanienButton = document.getElementById("ozeanien");
const weltButton = document.getElementById("welt");
const kontinente = document.getElementById("kontinente");
const quiztypen = document.getElementById("quiztypen");
const hauptstadtQuizButton = document.getElementById("hauptstadt-quiz");
const laenderQuizButton = document.getElementById("laender-quiz");
const modusauswahl = document.getElementById("modusauswahl");
const modusNormalButton = document.getElementById("modus-normal");
const modusEndlosButton = document.getElementById("modus-endlos");
const quiz = document.getElementById("quiz");
const frage = document.getElementById("frage");
const antworten = document.getElementById("antworten");
const feedback = document.getElementById("feedback");
const antwortPruefen = document.getElementById("antwort-pruefen");
const weiterButton = document.getElementById("weiter");
const beendenButton = document.getElementById("beenden");
const punktestand = document.getElementById("punktestand");
const ergebnis = document.getElementById("ergebnis");
const ergebnisText = document.getElementById("ergebnis-text");
const nochmal = document.getElementById("nochmal");
const menue = document.getElementById("menue");
const home = document.getElementById("home");
const zurueckQuiztypenButton = document.getElementById("zurueck-quiztypen");
const zurueckModusauswahlButton = document.getElementById("zurueck-modusauswahl");
const kontinentAnzeige = document.getElementById("kontinent-anzeige");
const rekordeButton = document.getElementById("rekorde");
const rekorduebersicht = document.getElementById("rekorduebersicht");
const rekordeListe = document.getElementById("rekorde-liste");
const zurueckRekordeButton = document.getElementById("zurueck-rekorde");
const kartenContainer = document.getElementById("karten-container");
const karteButton = document.getElementById("karte");
const kartenQuelle = document.getElementById("karten-quelle");

const kontinentKarten = {
    "Europa": {
        datei: "maps/europe.svg",
        landKlasse: "c",
        eigeneKreise: true,
        kreisSchwelle: 100,
        quelleHtml: 'Europakarte: <a href="https://commons.wikimedia.org/wiki/File:Blank_map_of_Europe_(with_disputed_regions).svg" target="_blank" rel="noopener">Blank map of Europe (with disputed regions).svg</a>, Wikimedia Commons, lizenziert unter <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>. Angepasst (viewBox ergänzt).'
    },
    "Asien": {
        datei: "maps/asia.svg",
        landKlasse: "landxx",
        eigeneKreise: false,
        quelleHtml: ""
    },
    "Afrika": {
        datei: "maps/africa.svg",
        landKlasse: "land",
        eigeneKreise: true,
        kreisSchwelle: 130,
        quelleHtml: ""
    },
    "Nordamerika": {
        datei: "maps/north-america.svg",
        landKlasse: "land",
        eigeneKreise: true,
        kreisSchwelle: 300,
        quelleHtml: ""
    },
    "Südamerika": {
        datei: "maps/south-america.svg",
        landKlasse: "land",
        eigeneKreise: true,
        kreisSchwelle: 200,
        quelleHtml: ""
    },
    "Ozeanien": {
        datei: "maps/oceania.svg",
        landKlasse: "landxx",
        eigeneKreise: true,
        kreisSchwelle: 30,
        quelleHtml: 'Ozeanienkarte: <a href="https://commons.wikimedia.org/wiki/File:Oceania_blank.svg" target="_blank" rel="noopener">Oceania blank.svg</a>, Wikimedia Commons, von Tintazul, lizenziert unter <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>. Angepasst (viewBox zugeschnitten).'
    }
};

let ausgewaehlterKontinent;
let laender;
let ausgewaehlteLaender;
let zufaelligesLand;
let richtigeAntworten = 0;
let falscheAntworten = 0;
let offeneLaender;
let antwortFelder = [];
let quizModus;
let gewaehlterModus;
let istEndlosmodus = false;
let svgWurzel = null;
let geladenerKontinent = null;

const kontinentReihenfolge = ["Afrika", "Asien", "Europa", "Nordamerika", "Südamerika", "Ozeanien", "Welt"];

function kontinentAuswaehlen(kontinent) {
    ausgewaehlterKontinent = kontinent;
    kontinentAnzeige.textContent = ausgewaehlterKontinent;
    richtigeAntworten = 0;
    kontinente.style.display = "none";
    quiztypen.style.display = "flex";
    karteButton.style.display = kontinentKarten[ausgewaehlterKontinent] ? "inline-block" : "none";
    ausgewaehlteLaender = laender.filter(land => land.kontinent === ausgewaehlterKontinent);
    offeneLaender = [...ausgewaehlteLaender];
    console.log(offeneLaender);
}

afrikaButton.addEventListener("click", function() {
    kontinentAuswaehlen("Afrika");
});

asienButton.addEventListener("click", function() {
    kontinentAuswaehlen("Asien");
});

europaButton.addEventListener("click", function() {
    kontinentAuswaehlen("Europa");
});

nordamerikaButton.addEventListener("click", function() {
    kontinentAuswaehlen("Nordamerika");
});

suedamerikaButton.addEventListener("click", function() {
    kontinentAuswaehlen("Südamerika");
});

ozeanienButton.addEventListener("click", function() {
    kontinentAuswaehlen("Ozeanien");
});

weltButton.addEventListener("click", function() {
    ausgewaehlterKontinent = "Welt";
    kontinentAnzeige.textContent = ausgewaehlterKontinent;
    richtigeAntworten = 0;
    kontinente.style.display = "none";
    quiztypen.style.display = "flex";
    karteButton.style.display = kontinentKarten[ausgewaehlterKontinent] ? "inline-block" : "none";
    ausgewaehlteLaender = [...laender];
    offeneLaender = [...ausgewaehlteLaender];
});

function erstelleAntwortfelder() {
    antworten.innerHTML = "";
    antwortFelder = [];

    const mehrereFelderNoetig = (quizModus === "hauptstadt" || quizModus === "karte") && Array.isArray(zufaelligesLand.hauptstadt);
    const anzahlFelder = mehrereFelderNoetig ? zufaelligesLand.hauptstadt.length : 1;

    for (let i = 0; i < anzahlFelder; i++) {
        const eingabefeld = document.createElement("input");
        eingabefeld.type = "text";
        antworten.appendChild(eingabefeld);
        antwortFelder.push(eingabefeld);
    }

    antwortFelder[0].focus();
}

function erstelleFrageText(land) {
    const mehrzahl = Array.isArray(land.hauptstadt);

    if (quizModus === "karte") {
        return mehrzahl
            ? "Welche Hauptstädte gehören zu dem markierten Land?"
            : "Welche Hauptstadt gehört zu dem markierten Land?";
    }

    if (quizModus === "hauptstadt") {
        return mehrzahl
            ? "Welche Hauptstädte gehören zu " + land.land + "?"
            : "Welche Hauptstadt gehört zu " + land.land + "?";
    }

    const hauptstaedte = mehrzahl ? land.hauptstadt.join(" / ") : land.hauptstadt;
    const bezeichnung = mehrzahl ? "die Hauptstädte" : "die Hauptstadt";
    return "Zu welchem Land gehört " + bezeichnung + " " + hauptstaedte + "?";
}

function erstelleRichtigeAntwortText(land) {
    if (quizModus === "hauptstadt" || quizModus === "karte") {
        return Array.isArray(land.hauptstadt) ? land.hauptstadt.join(" / ") : land.hauptstadt;
    }
    return land.land;
}

function setzeQuizAnsichtZurueck() {
    feedback.textContent = "";
    feedback.className = "";
    antwortPruefen.style.display = "inline-block";
    weiterButton.style.display = "none";
}

function aktualisierePunktestand() {
    if (istEndlosmodus) {
        punktestand.textContent = richtigeAntworten + " richtig, " + falscheAntworten + " falsch";
    } else {
        punktestand.textContent = richtigeAntworten + " / " + ausgewaehlteLaender.length;
    }
}

function zeigeModusauswahl(modus) {
    gewaehlterModus = modus;
    quiztypen.style.display = "none";
    modusauswahl.style.display = "flex";
}

function ladeKarte(kontinent) {
    return fetch(kontinentKarten[kontinent].datei)
        .then(response => response.text())
        .then(svgText => {
            kartenContainer.innerHTML = svgText;
            svgWurzel = kartenContainer.querySelector("svg");
            geladenerKontinent = kontinent;
        });
}

function entkoppleEigenstaendigeGebiete() {
    ausgewaehlteLaender.forEach(land => {
        const element = svgWurzel.querySelector("#" + land.code);
        if (element && element.classList.contains("d")) {
            element.classList.add("eigenstaendig");
        }
    });
}

function zeigeMarkierungspunkt(pfad, box) {
    const punkt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    punkt.setAttribute("cx", box.x + box.width / 2);
    punkt.setAttribute("cy", box.y + box.height / 2);
    punkt.setAttribute("r", 5);
    punkt.classList.add("markierungspunkt");
    pfad.parentNode.appendChild(punkt);
}

function markiereLand(code) {
    const element = svgWurzel.querySelector("#" + code);
    if (!element) return;

    const konfiguration = kontinentKarten[geladenerKontinent];
    const pfade = element.tagName === "g" ? Array.from(element.querySelectorAll("path")) : [element];

    pfade.forEach(pfad => pfad.classList.add("markiert"));

    if (konfiguration.eigeneKreise) {
        const boxen = pfade.map(pfad => pfad.getBBox());
        const groessteFlaeche = Math.max(...boxen.map(box => box.width * box.height));

        if (groessteFlaeche < konfiguration.kreisSchwelle) {
            const minX = Math.min(...boxen.map(box => box.x));
            const minY = Math.min(...boxen.map(box => box.y));
            const maxX = Math.max(...boxen.map(box => box.x + box.width));
            const maxY = Math.max(...boxen.map(box => box.y + box.height));
            zeigeMarkierungspunkt(pfade[0], { x: minX, y: minY, width: maxX - minX, height: maxY - minY });
        }
    }

    if (!konfiguration.eigeneKreise) {
        const kreis = element.querySelector(".circlexx");
        if (kreis) kreis.classList.add("markiert");
    }
}

function entferneMarkierung() {
    svgWurzel.querySelectorAll(".markiert").forEach(element => element.classList.remove("markiert"));
    svgWurzel.querySelectorAll(".markierungspunkt").forEach(element => element.remove());
}

async function starteQuiz(modus, endlos) {
    quizModus = modus;
    istEndlosmodus = endlos;
    richtigeAntworten = 0;
    falscheAntworten = 0;
    setzeQuizAnsichtZurueck();
    beendenButton.style.display = endlos ? "inline-block" : "none";

    if (modus === "karte") {
        if (!kontinentKarten[ausgewaehlterKontinent]) {
            alert("Für " + ausgewaehlterKontinent + " gibt es noch keine Karte.");
            quiztypen.style.display = "flex";
            return;
        }
        kartenContainer.style.display = "block";

        const quelleText = kontinentKarten[ausgewaehlterKontinent].quelleHtml;
        if (quelleText) {
            kartenQuelle.innerHTML = "<p>" + quelleText + "</p>";
            kartenQuelle.style.display = "block";
        } else {
            kartenQuelle.style.display = "none";
        }

        if (geladenerKontinent !== ausgewaehlterKontinent) {
            await ladeKarte(ausgewaehlterKontinent);
        }
        entkoppleEigenstaendigeGebiete();
    } else {
        kartenContainer.style.display = "none";
        kartenQuelle.style.display = "none";
    }

    quiz.style.display = "block";

    zufaelligesLand = offeneLaender.splice(Math.floor(Math.random() * offeneLaender.length), 1)[0];
    frage.textContent = erstelleFrageText(zufaelligesLand);
    if (modus === "karte") {
        entferneMarkierung();
        markiereLand(zufaelligesLand.code);
    }
    aktualisierePunktestand();
    erstelleAntwortfelder();
}

hauptstadtQuizButton.addEventListener("click", function() {
    zeigeModusauswahl("hauptstadt");
});

laenderQuizButton.addEventListener("click", function() {
    zeigeModusauswahl("land");
});

karteButton.addEventListener("click", function() {
    zeigeModusauswahl("karte");
});

modusNormalButton.addEventListener("click", function() {
    modusauswahl.style.display = "none";
    starteQuiz(gewaehlterModus, false);
});

modusEndlosButton.addEventListener("click", function() {
    modusauswahl.style.display = "none";
    starteQuiz(gewaehlterModus, true);
});

zurueckQuiztypenButton.addEventListener("click", function() {
    quiztypen.style.display = "none";
    kontinente.style.display = "flex";
    kartenQuelle.style.display = "none";
});

zurueckModusauswahlButton.addEventListener("click", function() {
    modusauswahl.style.display = "none";
    quiztypen.style.display = "flex";
    kartenQuelle.style.display = "none";
});

function normalisiere(text) {
    return text.trim().toLowerCase();
}

function sammleAkzeptierteAntworten(land) {
    const hauptstaedte = Array.isArray(land.hauptstadt) ? land.hauptstadt : [land.hauptstadt];
    const alternativen = land.alternativeAntworten || [];

    // Jede Hauptstadt bekommt ihre eigene Gruppe akzeptierter Schreibweisen
    return hauptstaedte.map(hauptstadt => [
        normalisiere(hauptstadt),
        ...alternativen.map(normalisiere)
    ]);
}

function sammleAkzeptierteLaendernamen(land) {
    const namen = [normalisiere(land.land)];
    if (land.alternative) {
        namen.push(normalisiere(land.alternative));
    }
    return namen;
}

function pruefeAntwort() {
    let richtig;

    if (quizModus === "hauptstadt" || quizModus === "karte") {
        const eingaben = antwortFelder.map(feld => normalisiere(feld.value));
        let offeneGruppen = sammleAkzeptierteAntworten(zufaelligesLand);

        richtig = eingaben.every(eingabe => {
            const treffer = offeneGruppen.findIndex(gruppe => gruppe.includes(eingabe));
            if (treffer === -1) return false;
            offeneGruppen.splice(treffer, 1); // diese Hauptstadt gilt als "verbraucht"
            return true;
        });
    } else {
        const eingabe = normalisiere(antwortFelder[0].value);
        richtig = sammleAkzeptierteLaendernamen(zufaelligesLand).includes(eingabe);
    }

    if (richtig) {
        richtigeAntworten++;
        feedback.textContent = "Richtig!";
        feedback.className = "richtig";
    } else {
        falscheAntworten++;
        feedback.textContent = "Falsch! Richtig wäre: " + erstelleRichtigeAntwortText(zufaelligesLand);
        feedback.className = "falsch";
    }

    antwortFelder.forEach(feld => feld.disabled = true);
    antwortPruefen.style.display = "none";
    weiterButton.style.display = "inline-block";

    aktualisierePunktestand();
}

function ladeRekorde() {
    const daten = localStorage.getItem("hauptstaedteQuizRekorde");
    return daten ? JSON.parse(daten) : {};
}

function speichereRekorde(rekorde) {
    localStorage.setItem("hauptstaedteQuizRekorde", JSON.stringify(rekorde));
}

function pruefeUndSpeichereRekord() {
    const rekorde = ladeRekorde();
    if (!rekorde[ausgewaehlterKontinent]) rekorde[ausgewaehlterKontinent] = {};
    if (!rekorde[ausgewaehlterKontinent][quizModus]) rekorde[ausgewaehlterKontinent][quizModus] = {};

    const modusSchluessel = istEndlosmodus ? "endlos" : "normal";
    const bisherigerRekord = rekorde[ausgewaehlterKontinent][quizModus][modusSchluessel];

    let neuerRekord = false;

    if (richtigeAntworten > 0 && (!bisherigerRekord || richtigeAntworten > bisherigerRekord.richtig)) {
        rekorde[ausgewaehlterKontinent][quizModus][modusSchluessel] = istEndlosmodus
            ? { richtig: richtigeAntworten, falsch: falscheAntworten }
            : { richtig: richtigeAntworten, gesamt: ausgewaehlteLaender.length };
        speichereRekorde(rekorde);
        neuerRekord = true;
    }

    return neuerRekord;
}

function erstelleRekordHTML() {
    const rekorde = ladeRekorde();
    let html = "";

    kontinentReihenfolge.forEach(kontinent => {
        const kontinentRekorde = rekorde[kontinent];
        if (!kontinentRekorde) return;

        html += "<h3>" + kontinent + "</h3><ul>";

        ["hauptstadt", "land", "karte"].forEach(modus => {
            ["normal", "endlos"].forEach(endlosSchluessel => {
                const eintrag = kontinentRekorde[modus] && kontinentRekorde[modus][endlosSchluessel];
                if (!eintrag) return;

                const modusName = modus === "hauptstadt" ? "Hauptstadt-Quiz" : modus === "land" ? "Länder-Quiz" : "Karte";
                const artName = endlosSchluessel === "normal" ? "Normal" : "Endlos";
                const wert = endlosSchluessel === "normal"
                    ? eintrag.richtig + " / " + eintrag.gesamt
                    : eintrag.richtig + " richtig, " + eintrag.falsch + " falsch";

                html += "<li>" + modusName + " (" + artName + "): " + wert + "</li>";
            });
        });

        html += "</ul>";
    });

    return html === "" ? "<p>Noch keine Rekorde vorhanden.</p>" : html;
}

function naechsteFrage() {
    setzeQuizAnsichtZurueck();

    if (istEndlosmodus && offeneLaender.length === 0) {
        offeneLaender = [...ausgewaehlteLaender];
    }

    if (offeneLaender.length > 0) {
        zufaelligesLand = offeneLaender.splice(Math.floor(Math.random() * offeneLaender.length), 1)[0];
        frage.textContent = erstelleFrageText(zufaelligesLand);
        if (quizModus === "karte") {
            entferneMarkierung();
            markiereLand(zufaelligesLand.code);
        }
        erstelleAntwortfelder();
    } else {
        quiz.style.display = "none";
        const neuerRekord = pruefeUndSpeichereRekord();
        ergebnisText.innerHTML = richtigeAntworten + "/" + ausgewaehlteLaender.length + "<br>Runde beendet."
            + (neuerRekord ? "<br>Neuer Rekord." : "");
        ergebnis.style.display = "block";
    }
}

antwortPruefen.addEventListener("click", pruefeAntwort);
weiterButton.addEventListener("click", naechsteFrage);

beendenButton.addEventListener("click", function() {
    quiz.style.display = "none";
    const neuerRekord = pruefeUndSpeichereRekord();
    ergebnisText.innerHTML = richtigeAntworten + " richtig, " + falscheAntworten + " falsch<br>Runde beendet."
        + (neuerRekord ? "<br>Neuer Rekord." : "");
    ergebnis.style.display = "block";
});

document.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") return;
    if (quiz.style.display !== "block") return;

    if (weiterButton.style.display === "none") {
        pruefeAntwort();
    } else {
        naechsteFrage();
    }
});

fetch("countries.json")
    .then(response => response.json())
    .then(daten => {
        laender = daten;
        console.log(laender);
    });

menue.addEventListener("click", function() {
    ergebnis.style.display = "none";
    quiztypen.style.display = "flex";
    offeneLaender = [...ausgewaehlteLaender];
    richtigeAntworten = 0;
    falscheAntworten = 0;
    aktualisierePunktestand();
    kartenQuelle.style.display = "none";
});

nochmal.addEventListener("click", function() {
    ergebnis.style.display = "none";
    quiz.style.display = "block";
    setzeQuizAnsichtZurueck();

    richtigeAntworten = 0;
    falscheAntworten = 0;
    offeneLaender = [...ausgewaehlteLaender];

    zufaelligesLand = offeneLaender.splice(Math.floor(Math.random() * offeneLaender.length), 1)[0];

    frage.textContent = erstelleFrageText(zufaelligesLand);
    if (quizModus === "karte") {
        entferneMarkierung();
        markiereLand(zufaelligesLand.code);
    }
    erstelleAntwortfelder();
    aktualisierePunktestand();
});

rekordeButton.addEventListener("click", function() {
    kontinente.style.display = "none";
    quiztypen.style.display = "none";
    modusauswahl.style.display = "none";
    quiz.style.display = "none";
    ergebnis.style.display = "none";
    rekorduebersicht.style.display = "flex";
    rekordeListe.innerHTML = erstelleRekordHTML();
    kartenQuelle.style.display = "none";
});

zurueckRekordeButton.addEventListener("click", function() {
    rekorduebersicht.style.display = "none";
    kontinente.style.display = "flex";
});

home.addEventListener("click", function() {
    ergebnis.style.display = "none";
    quiz.style.display = "none";
    quiztypen.style.display = "none";
    modusauswahl.style.display = "none";
    rekorduebersicht.style.display = "none";
    kartenQuelle.style.display = "none";
    kontinente.style.display = "flex";
});


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");

    let bereitsNeuGeladen = false;
    navigator.serviceWorker.addEventListener("controllerchange", function() {
        if (bereitsNeuGeladen) return;
        bereitsNeuGeladen = true;
        window.location.reload();
    });
}