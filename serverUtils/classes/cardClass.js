class CardSet {
    constructor(name, black, white, official) {
        this.name = name,
        this.black = black;
        this.white = white;
        //this.selected = false;
        this.official = true;
    }
}


class Card {
    constructor(text, pack) {
        this.text = text;
        this.pack = pack;
    }
}

