Vue.component('toodles-navbar', {
    computed:   {tags:  function() {
                            return(this.$store.getters.tags);
                        }},
    data:       function() {
                   return({priorities: {high: true, low: true, standard: true},
                           searchText: "",
                           states:     {complete: true, deleted: true, incomplete: true},
                           tag:        "",
                           useRegEx:   false});
                },
    methods:    {onAdd: function() {
                     console.log("Navbar add button clicked.");
                     this.$store.dispatch("newToDoItem");
                 },
                 onArchive: function() {
                     let self         = this;
                     let onConfirm    = function() {
                                            console.log("Triggering to do item archive process.");
                                            self.$store.dispatch("archiveNonIncompleteItems");
                                        };

                     console.log("Navbar archive option selected.");
                     this.$buefy.dialog.confirm({cancelText:  "Later",
                                                 confirmText: "Do It!",
                                                 message:     "Are you sure you want to archive all completed or deleted items?",
                                                 onConfirm:    onConfirm,
                                                 title:       "Confirm",
                                                 type:        "is-success"});
                 },
                 onFilterChange: function(value) {
                    let filter     = new ToDoFilter();
                    let priorities = [];
                    let states     = [];

                    console.log("Change made to the filter conditions.");
                    if(this.priorities.low) {
                        priorities.push(PRIORITY_LOW);
                    }
                    if(this.priorities.standard) {
                        priorities.push(PRIORITY_STANDARD);
                    }
                    if(this.priorities.high) {
                        priorities.push(PRIORITY_HIGH);
                    }
                    filter.priorities = priorities;

                    if(this.states.complete) {
                        states.push(TO_DO_STATE_COMPLETE);
                    }
                    if(this.states.deleted) {
                       states.push(TO_DO_STATE_DELETED);
                   }
                   if(this.states.incomplete) {
                       states.push(TO_DO_STATE_INCOMPLETE);
                   }
                   filter.states     = states;
                   filter.searchText = this.searchText;
                   filter.tags       = this.tag;
                   filter.useRegEx   = this.useRegEx;

                   this.$store.dispatch("updateFilterSettings", filter.toObject());
                 },
                 onReset: function() {
                    let self         = this;
                    let onConfirm    = function() {
                                           console.log("Triggering a reset of the application archive..");
                                           self.$store.dispatch("resetArchive");
                                       };

                    console.log("Navbar archive reset option selected.");
                    this.$buefy.dialog.confirm({cancelText:  "Cancel",
                                                confirmText: "Proceed",
                                                message:     "The requested action will delete all archived to do items. Are you sure this is what you want to do?",
                                                onConfirm:    onConfirm,
                                                title:       "Confirm",
                                                type:        "is-danger"});
                 },
                 onView: function() {
                     console.log("Navbar view archive option selected.");
                     this.$store.dispatch("viewArchiveViewer");
                 },
                 updateSearchText: function(value) {
                     console.log("Change made to the filter search text.");
                     this.$store.dispatch("updateFilterSettings", {searchText: value});
                }},
    props:      {list: Array},
    template:   '<b-navbar class="to-do-list">' +
                '  <template slot="brand">' +
                '    <b-navbar-item tag="router-link" :to="{path: \'/\'}">' +
                '      <a href="/" class="title is-4">Toodles</a>' +
                '    </b-navbar-item>' +
                '  </template>' +
                '  <template slot="start">' +
                '    <b-navbar-item>' +
                '      <b-button icon-left="plus" icon-pack="fas" type="is-primary" @click="onAdd">New</b-button>' +
                '    </b-navbar-item>' +
                '    <b-navbar-item>' +
                '      <b-dropdown aria-role="list">' +
                '        <b-button icon-left="archive" icon-pack="fas" class="button is-primary" slot="trigger">' +
                '          <span>Archive</span>' +
                '          <b-icon icon="menu-down"></b-icon>' +
                '        </b-button>' +
                '        <b-dropdown-item aria-role="listitem" @click="onArchive">Execute Now</b-dropdown-item>' +
                '        <b-dropdown-item aria-role="listitem" @click="onView">View</b-dropdown-item>' +
                '        <b-dropdown-item aria-role="listitem" @click="onReset">Reset</b-dropdown-item>' +
                '      </b-dropdown>' +
                '    </b-navbar-item>' +
                '  </template>' +
                '  <template slot="end">' +
                '    <b-navbar-item>' +
                '      <b-dropdown position="is-bottom-left" aria-role="menu" :focusable="false" trap-focus>' +
                '        <a class="navbar-item" role="button" slot="trigger">' +
                '          <span>Filter</span>' +
                '          <b-icon icon="menu-down"></b-icon>' +
                '        </a>' +
                '        <b-dropdown-item aria-role="menu-item" custom>' +
                '          <form action="">' +
                '            <div class="two-column-menu">' +
                '              <div>' +
                '                <p class="title is-6">Priorities</p>' +
                '                <b-field>' +
                '                  <b-checkbox v-model="priorities.low" @input="onFilterChange">Low</b-checkbox>' +
                '                </b-field>' +
                '                <b-field>' +
                '                  <b-checkbox v-model="priorities.standard" @input="onFilterChange">Standard</b-checkbox>' +
                '                </b-field>' +
                '                <b-field>' +
                '                  <b-checkbox v-model="priorities.high" @input="onFilterChange">High</b-checkbox>' +
                '                </b-field>' +
                '              </div>' +
                '              <div>' +
                '                <p class="title is-6">States</p>' +
                '                <b-field>' +
                '                  <b-checkbox v-model="states.complete" @input="onFilterChange">Complete</b-checkbox>' +
                '                </b-field>' +
                '                <b-field>' +
                '                  <b-checkbox v-model="states.deleted" @input="onFilterChange">Deleted</b-checkbox>' +
                '                </b-field>' +
                '                <b-field>' +
                '                  <b-checkbox v-model="states.incomplete" @input="onFilterChange">Incomplete</b-checkbox>' +
                '                </b-field>' +
                '              </div>' +
                '            </div>' +
                '            <hr>' +
                '            <p class="title is-6">Containing Text</p>' +
                '            <b-field>' +
                '              <b-input v-model="searchText" placeholder="Search text" @input="updateSearchText"></b-input>' +
                '            </b-field>' +
                '            <b-field>' +
                '              <b-checkbox v-model="useRegEx" @input="onFilterChange">Regular Expression</b-checkbox>' +
                '            </b-field>' +
                '            <hr>' +
                '            <p class="title is-6">Has Tag</p>' +
                '            <b-field>' +
                '              <b-select placeholder="Select a tag" expanded v-model="tag" @input="onFilterChange">' +
                '                <option value=""></option>' +
                '                <option v-for="tag in tags" :value="tag">{{tag}}</option>' +
                '              </b-select>' +
                '            </b-field>' +
                '          </form>' +
                '        </b-dropdown-item>' +
                '      </b-dropdown>' +
                '    </b-navbar-item>' +
                '  </template>' +
                '</b-navbar>'
 });
 