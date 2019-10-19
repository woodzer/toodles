Vue.component('to-do-item-modal', {
    computed:   {hasItem: function() {
                     return(this.item ? true : false);
                 },
                 isComplete: function() {
                     return(this.item && this.item.state === TO_DO_STATE_COMPLETE);
                 },
                 isDeleted: function() {
                     return(this.item && this.item.state === TO_DO_STATE_DELETED);
                 },
                 isIncomplete: function() {
                     return(this.item && this.item.state === TO_DO_STATE_INCOMPLETE);
                 },
                 isNew: function() {
                     return(this.item && this.item.state === TO_DO_STATE_PENDING);
                 },
                 isVisible: function() {
                     return(this.active && !this.finished);
                 }},
    data:       function() {
                   return({description: "",
                           finished:    false,
                           initialized: false,
                           priority:    "",
                           name:        "",
                           tags:        ""});
                },
    methods:    {onCancel: function() {
                     this.$store.dispatch("unselectToDoItem");
                     this.initialized  = false;
                 },
                 onComplete: function() {
                     console.log("Complete selected from to do item modal interface.");
                     this.$store.dispatch("completeSelectedToDoItem");
                     this.initialized = false;
                 },
                 onCreate: function() {
                     let item = new ToDo(this.name, this.description, this.priority);

                     console.log("Create selected from to do item modal interface.");
                     item.tags = this.tags;
                     this.$store.dispatch("createToDoItem", item);
                     this.initialized = false;
                 },
                 onDelete: function() {
                    console.log("Delete selected from to do item modal interface.");
                    this.$store.dispatch("deleteSelectedToDoItem");
                    this.initialized = false;
                 },
                 onReactivate: function() {
                    console.log("Reactivate selected from to do item modal interface.");
                    this.$store.dispatch("reactivateSelectedToDoItem");
                    this.initialized = false;
                 },
                 onUpdate: function() {
                    let item = new ToDo(this.name, this.description, this.priority);

                    console.log("Update selected from to do item modal interface.");
                    item.tags = this.tags;
                    this.$store.dispatch("updateSelectedToDoItem", item);
                    this.initialized = false;
                 }},
    updated:    function() {
                    if(this.item && !this.initialized) {
                        this.description = this.item.description;
                        this.priority    = this.item.priority;
                        this.name        = this.item.name;
                        this.tags        = this.item.tags.join(", ");
                        this.$nextTick(() => $("#to_do_item_name").select());
                        this.initialized  = true;
                    }
                },
    props:      {active: Boolean,
                 item:   Object},
    template:   '<b-modal class="to-do-item-modal" :active.sync="isVisible" :width="640" scroll="keep" :on-cancel="onCancel">' +
                '  <div class="card">' +
                '    <header class="card-header">' +
                '      <p class="card-header-title"><span v-if="isNew">To Do Item</span><span v-if="hasItem">{{item.name}}</span></p>' +
                '    </header>' +
                '    <div class="card-content">' +
                '      <b-field label="Title" expanded>' +
                '        <b-input id="to_do_item_name" v-model="name"></b-input>' +
                '      </b-field>' +
                '      <b-field label="Description" expanded>' +
                '        <b-input v-model="description" type="textarea"></b-input>' +
                '      </b-field>' +
                '      <b-field label="Priority" expanded>' +
                '        <b-select v-model="priority" expanded>' +
                '          <option v-for="entry in ALL_PRIORITIES" :value="entry">{{entry}}</option>' +
                '        </b-select>' +
                '      </b-field>' +
                '      <b-field label="Tags" expanded>' +
                '        <b-input v-model="tags"></b-input>' +
                '      </b-field>' +
                '    </div>' +
                '    <footer class="card-footer">' +
                '      <a href="#" class="card-footer-item" @click.prevent="onCreate" v-if="isNew">Create</a>' +
                '      <a href="#" class="card-footer-item" @click.prevent="onComplete" v-if="isIncomplete && !isNew">Complete</a>' +
                '      <a href="#" class="card-footer-item" @click.prevent="onReactivate" v-if="isDeleted">Undelete</a>' +
                '      <a href="#" class="card-footer-item" @click.prevent="onReactivate" v-if="isComplete">Reactivate</a>' +
                '      <a href="#" class="card-footer-item" @click.prevent="onUpdate" v-if="!isNew && isIncomplete">Update</a>' +
                '      <a href="#" class="card-footer-item" @click.prevent="onDelete" v-if="!isDeleted && !isNew">Delete</a>' +
                '    </footer>' +
                '  </div>' +
                '</b-modal>'
 });

//------------------------------------------------------------------------------

Vue.component('to-do-list-item', {
    computed:   {isComplete: function() {
                     return(this.item.state === TO_DO_STATE_COMPLETE);
                 },
                 isDeleted: function() {
                     return(this.item.state === TO_DO_STATE_DELETED);
                 }},
    data:       function() {
                   return({finished: false});
                },
    methods:    {onSelect: function(event) {
                    console.log("To do list item clicked on.");
                    this.$store.dispatch("selectToDoItem", this.item);
                 }},
    mounted:    function() {
                   if(this.item.status === TO_DO_STATE_COMPLETE)
                       this.finished = true;
                   },
    props:      {item: Object},
    template:   '<div class="to-do-list-item" @click.prevent="onSelect">' +
                '  <div class="to-do-list-item-title is-size-5" :class="{deleted: isDeleted, inactive: isComplete}">{{item.name}}</div>' +
                '</div>'
 });

//------------------------------------------------------------------------------

Vue.component('to-do-list', {
    computed:   {cancelledItems: function() {
                     let filter = ToDoFilter.fromObject(this.$store.getters.filterSettings);

                     filter.states = filter.states.filter((entry) => entry === TO_DO_STATE_CANCELLED);
                     return(this.list.filter((entry) => filter.apply(entry)));
                 },
                 completeItems: function() {
                    let filter = ToDoFilter.fromObject(this.$store.getters.filterSettings);

                    filter.states = filter.states.filter((entry) => entry === TO_DO_STATE_COMPLETE);
                    return(this.list.filter((entry) => filter.apply(entry)));
                 },
                 deletedItems: function() {
                    let filter = ToDoFilter.fromObject(this.$store.getters.filterSettings);

                    filter.states = filter.states.filter((entry) => entry === TO_DO_STATE_DELETED);
                    return(this.list.filter((entry) => filter.apply(entry)));
                 },
                 incompleteItems: function() {
                    let filter = ToDoFilter.fromObject(this.$store.getters.filterSettings);

                    console.log(filter.toString());
                    filter.states = filter.states.filter((entry) => entry === TO_DO_STATE_INCOMPLETE);
                    return(this.list.filter((entry) => filter.apply(entry)));
                 },
                 isDialogVisible: function() {
                     return(this.selected ? true : false);
                 },
                 selected: function() {
                     return(this.$store.getters.selectedItem);
                 }},
    data:       function() {
                   return({});
                },
    methods:    {},
    props:      {list: Array},
    template:   '<section class="to-do-list">' +
                '  <to-do-list-item v-for="item in incompleteItems" :item="item"></to-do-list-item>' +
                '  <to-do-list-item v-for="item in completeItems" :item="item"></to-do-list-item>' +
                '  <to-do-list-item v-for="item in deletedItems" :item="item"></to-do-list-item>' +
                '  <to-do-item-modal :active="isDialogVisible" :item="selected"></to-do-item-modal>' +
                '</section>'
 });
 