Vue.component('archive-viewer', {
    computed:   {actionable: function() {
                     return(this.checkedRows.length > 0);
                 },
                 active: function() {
                     return(this.$store.getters.archiveViewerActive);
                 },
                 items: function() {
                     if(!this.$store.getters.isArchiveLoaded) {
                         this.$store.commit("loadArchive");
                     }

                     let list = this.$store.getters.archivedItems;

                     list = list.map((entry) => {
                         return({archived: entry.archived ? entry.archived.toLocaleString() : "?",
                                 id:       entry.id,
                                 title:    entry.name});
                     });

                     return(list);
                 }},
    data:       function() {
                   return({checkedRows: [],
                           columns:     [{field: "title", label: "Title"},
                                         {centered: true, field: "archived", label: "Archive Date", width: 200}],
                           loaded:      false});
                },
    methods:    {getItems: function() {
                     let list = this.$store.getters.archivedItems;

                     console.log("ARCHIVED ITEMS (" + list.length + "):", list);
                     list = list.map((entry) => {
                         return({archived: entry.archived ? entry.archived.toLocaleString() : "?",
                                 id:       entry.id,
                                 title:    entry.name});
                     });

                     return(list);
                 },
                 onCancel: function() {
                     console.log("Cancel of archive view interface requested.");
                     this.$store.dispatch("hideArchiveViewer");
                 },
                 onCheck: function(selected, row) {
                     console.log("Check event received:", selected);
                 },
                 onClick: function() {
                     console.log("Restoring selected archive items.");
                     if(this.checkedRows.length > 0) {
                         let itemIds = this.checkedRows.map((entry) => entry.id);

                        console.log("Restoring", this.checkedRows.length, "selected archive items.");
                        this.$store.dispatch("unarchiveItems", itemIds);
                        this.loaded = false;
                        this.items  = this.getItems();
                     } else {
                         console.log("There are no items selected, nothing will be restored.");
                     }
                 },
                 onClose: function() {
                     console.log("Closing the archive view interface.");
                     this.$store.dispatch("hideArchiveViewer");
                 }},
    updated:    function() {
                    console.log("Archive viewer component updated.");
                    if(!this.loaded) {
                        this.loaded = true;
                        this.items = this.getItems();
                    }
                },
    props:      {},
    template:   '<b-modal :active.sync="active" can-cancel full-screen :on-cancel="onCancel">' +
                '  <div class="container">' +
                '    <h1 class="title">Archived Items</h1>' +
                '    <b-field grouped group-multiline>' +
                '      <b-button class="button field is-primary" :disabled="!actionable" @click.prevent="onClick">Restore Selected Items</b-button>' +
                '      <b-button class="button field is-danger" @click="onClose">Close Archive</b-button>' +
                '    </b-field>' +
                '    <b-table :data.sync="items" :columns="columns" checkable checkbox-position="left" :checked-rows.sync="checkedRows" @check="onCheck">' +
                '    </b-table>' +
                '  </div>' +
                '</b-modal>'
 });
 