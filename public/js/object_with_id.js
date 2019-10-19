class IdGenerator {
    static generate(hashData) {
        return(IdGenerator.digestText([hashData, IdGenerator.randomText(), moment().format()].join(" ")));
    }

    static digestText(text) {
        let id = sha256(text);
        return(id);
    }

    static randomText() {
        return(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }
}

class ObjectWithId {
    constructor(hashData) {
        this._id = IdGenerator.generate(hashData);
    }

    get id() {
        return(this._id);
    }

    set id(setting) {
        this._id = setting;
    }
}