PRIORITY_LOW                 = "Low";
PRIORITY_STANDARD            = "Standard";
PRIORITY_HIGH                = "High";
ALL_PRIORITIES               = [PRIORITY_LOW, PRIORITY_STANDARD, PRIORITY_HIGH];

TO_DO_STATE_PENDING          = "Pending";
TO_DO_STATE_INCOMPLETE       = "Incomplete";
TO_DO_STATE_COMPLETE         = "Complete";
TO_DO_STATE_CANCELLED        = "Cancelled";
TO_DO_STATE_DELETED          = "Deleted";
ALL_TO_DO_STATES             = [TO_DO_STATE_PENDING, TO_DO_STATE_INCOMPLETE, TO_DO_STATE_COMPLETE, TO_DO_STATE_CANCELLED, TO_DO_STATE_DELETED];

class ToDo extends ObjectWithId {
    constructor(name, description="", priority=PRIORITY_STANDARD) {
        super();
        this._archived    = undefined;
        this._description = description;
        this._name        = name;
        this.priority     = priority;
        this.state        = TO_DO_STATE_PENDING;
        this._tags        = [];
    }

    get archived() {
        return(this._archived);
    }

    set archived(timestamp) {
        this._archived = timestamp;
    } 

    get description() {
        return(this._description);
    }

    set description(content) {
        this._description = "" + content;
    }

    get dueDate() {
        return(this._dueDate);
    }

    set dueDate(setting) {
        if(setting && !(setting instanceof Date)) {
            throw("Invalid due date specified for to do item.");
        }
        this._dueDate = setting
    }

    get errors() {
        let list = [];

        if(this.name === "") {
            list.push("No name/title specified for to do item.");
        }

        return(list);
    }

    get name() {
        return(this._name);
    }

    set name(value) {
        this._name = "" + value;
    }

    get priority() {
        return(this._priority);
    }

    set priority(setting) {
        if(!ALL_PRIORITIES.includes(setting)) {
            throw("Unrecognised priority", "'" + setting + "' specified for to do item.");
        }
        this._priority = setting;
    }

    get state() {
        return(this._state);
    }

    set state(setting) {
        if(!ALL_TO_DO_STATES.includes(setting)) {
            throw("Unrecognised state", "'" + setting + "' specified for to do item.");
        }
        this._state = setting;
    }

    get tags() {
        return([].concat(this._tags));
    }

    set tags(tags) {
        if(tags instanceof Array) {
            this._tags = [].concat(tags);
        } else {
            this._tags = ("" + tags).split(",").map(entry => entry.trim()).filter(entry => entry.length > 0);
        }
    }

    archive() {
        this._archived = new Date();
    }

    hasTag(tag) {
        return(this._tags.includes(tag));
    }

    isValid() {
        return(this.errors.length === 0);
    }

    toObject() {
        return({archived:    (this.archived ? this.archived.toISOString() : null),
                description: this.description,
                id:          this.id,
                name:        this.name,
                priority:    this.priority,
                state:       this.state,
                tags:        this.tags.join(", ")});
    }

    static fromObject(object) {
        let item = new ToDo("");

        if(object.archived && object.archived.trim() !== "") {
            item.archived = new Date(object.archived);
        }
        item.description = object.description;
        item.id          = object.id;
        item.name        = object.name;
        item.priority    = object.priority;
        item.state       = object.state;
        item.tags        = object.tags;

        return(item);
    }
}
