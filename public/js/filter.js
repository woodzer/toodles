class ToDoFilter {
    constructor() {
        this._priorities = [].concat(ALL_PRIORITIES);
        this._searchText = "";
        this._states     = [].concat(ALL_TO_DO_STATES);
        this._tags       = [];
        this._useRegEx   = false;
    }

    get priorities() {
        return([].concat(this._priorities));
    }

    set priorities(settings) {
        if(settings instanceof String) {
            settings = settings.split(",").map((entry) => entry.trim());
        }

        this._priorities = settings.filter((entry) => ALL_PRIORITIES.includes(entry));
    }

    get searchText() {
        return(this._searchText);
    }

    set searchText(text) {
        this._searchText = ("" + text).trim();
    }

    get states() {
        return([].concat(this._states));
    }

    set states(settings) {
        if(settings instanceof String) {
            settings = settings.split(",").map((entry) => entry.trim());
        }
        //console.log("ASSIGNING STATES:", settings.join(", "));

        this._states = settings.filter((entry) => ALL_TO_DO_STATES.includes(entry));
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

    get useRegEx() {
        return(this._useRegEx);
    }

    set useRegEx(setting) {
        this._useRegEx = (setting === true);
    }

    apply(toDoItem) {
        let applies = true;

        console.log("Applying filter to item", "'" + toDoItem.name + "' (id:", toDoItem.id + ").");
        applies = this.priorities.includes(toDoItem.priority);

        if(applies) {
            console.log("Checking if [" + this.states.join(", ") + "] includes", toDoItem.state + ".");
            applies = this.states.includes(toDoItem.state);
        }

        if(applies && this.tags.length > 0) {
            console.log("Checking if [" + toDoItem.tags.join(", ") + "] includes any of [" + this.tags.join(", ") + "].");
            applies = (toDoItem.tags.findIndex((entry) => this.tags.includes(entry)) !== -1);
        }

        if(applies && this.searchText.trim() !== "") {
            if(this.useRegEx) {
                let pattern = new RegExp(this._searchText);

                console.log("Checking if the to do item name or description matches the pattern", "'" + this.searchText + "'.");
                applies = (toDoItem.name.match(pattern) ||
                           toDoItem.description.match(pattern));
            } else {
                console.log("Checking if the to do item name or description contains", "'" + this.searchText + "'.");
                applies = (toDoItem.name.includes(this.searchText) ||
                           toDoItem.description.includes(this.searchText));
            }
        }

        return(applies)
    }

    clone() {
        let filter = new ToDoFilter();

        filter.priorities = this.priorities;
        filter.searchText = this.searchText;
        filter.states     = this.states;
        filter.tags       = this.tags;
        filter.useRegEx   = this.useRegEx;
        console.log("Clone:\n", this.toString(), "to\n", filter.toString());

        return(filter);
    }

    toObject() {
        return({priorities: this.priorities,
                searchText: this.searchText,
                states:     this.states,
                tags:       this.tags,
                useRegEx:   this.useRegEx});
    }

    toString() {
        let text = "To Do Item Filter";

        if(this.priorities.length > 0) {
            text += "\n  Priorities: " + this.priorities.join(", ");
        }

        if(this.states.length > 0) {
            text += "\n  States: " + this.states.join(", ");
        }

        if(this.tags.length > 0) {
            text += "\n  Tags: " + this.tags.join(", ");
        }

        text += "\n  Search Text:" + "'" + this.searchText + "'";
        text += "\n  Use Regular Expression: " + this.useRegEx;

        return(text);
    }

    static fromObject(object) {
        let filter = new ToDoFilter();

        filter.priorities = (object.priorities ? object.priorities : ALL_PRIORITIES);
        filter.searchText = (object.searchText ? object.searchText : "");
        filter.states     = (object.states ? object.states : ALL_TO_DO_STATES);
        filter.tags       = (object.tags ? object.tags : []);
        filter.useRegEx   = (object.useRegEx === true);

        return(filter);
    }
}
