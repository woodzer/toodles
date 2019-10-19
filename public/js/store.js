Vue.use(Vuex);

const store = new Vuex.Store({
  actions:   {archiveNonIncompleteItems: (context) => {
                  console.log("[STORE] archiveNonIncompleteItems() action invoked.");

                  if(!context.getters.isArchiveLoaded) {
                      context.commit("loadArchive");
                  }

                  let items = context.getters.nonIncompleteItems;

                  if(items.length > 0) {
                      context.commit("archiveItems", items);
                      context.dispatch("saveToDoItems");
                      context.dispatch("saveToDoArchive");
                  } else {
                      console.log("There are no items available to be archived.");
                  }
              },
              completeSelectedToDoItem: (context) => {
                  console.log("[STORE] completeSelectedToDoItem() action invoked.");
                  if(context.getters.selectedItem) {
                        context.commit("setSelectedItemState", TO_DO_STATE_COMPLETE);
                        context.dispatch("saveToDoItems");
                        context.commit("clearSelectedItem");
                  } else {
                      console.error("Attempt made to complete an item but no to do item was selected.");
                      context.dispatch("showError", "Unable to complete item as no item is currently selected.");
                  }
              },
              createToDoItem: (context, item) => {
                  console.log("[STORE] createToDoItem() action invoked.");
                  if(item.isValid()) {
                      item.state = TO_DO_STATE_INCOMPLETE;
                      context.commit("storeToDoItem", item);
                      context.commit("clearSelectedItem");
                      context.dispatch("saveToDoItems");
                  } else {
                      console.error("Unable to create a to do item as the item is invalid.");
                      context.dispatch("showError", item.errors[0]);
                  }
              },
              cycleError: (context) => {
                  console.log("[STORE] cycleError() action invoked.");
                  if(context.getters.errorQueueSize > 0) {
                      context.commit("popError");
                  }
                  setTimeout(() => {context.dispatch("cycleError")}, 5000);
              },
              deleteSelectedToDoItem: (context) => {
                console.log("[STORE] deleteSelectedToDoItem() action invoked.");
                if(context.getters.selectedItem) {
                      context.commit("setSelectedItemState", TO_DO_STATE_DELETED);
                      context.commit("clearSelectedItem");
                      context.dispatch("saveToDoItems");
                } else {
                    console.error("Attempt made to delete an item but no to do item was selected.");
                    context.dispatch("showError", "Unable to delete item as no item is currently selected.");
                }
              },
              hideArchiveViewer: (context) => {
                  console.log("[STORE] hideArchive() action invoked.");
                  context.commit("setArchiveViewerActive", false);
              },
              newToDoItem: (context) => {
                let item = new ToDo("");

                console.log("[STORE] createNewToDoItem() action invoked.");
                context.commit("setSelectedItem", item);
              },
              reactivateSelectedToDoItem: (context) => {
                console.log("[STORE] reactivateSelectedToDoItem() action invoked.");
                if(context.getters.selectedItem) {
                      context.commit("setSelectedItemState", TO_DO_STATE_INCOMPLETE);
                      context.commit("clearSelectedItem");
                } else {
                    console.error("Attempt made to reactivate an item but no to do item was selected.");
                    context.dispatch("showError", "Unable to reactivate item as no item is currently selected.");
                }
              },
              resetArchive: (context) => {
                  console.log("[STORE] resetArchive() action invoked.");
                  Lockr.set("to_do_archive", JSON.stringify([]));
                  context.commit("setArchive", []);
              },
              saveToDoArchive: (context) => {
                  console.log("[STORE] saveToDoArchive() action invoked.");
                  if(context.getters.isArchiveLoaded) {
                      let items = context.getters.archivedItems.map((entry) => entry.toObject());
                      Lockr.set("to_do_archive", items);
                  } else {
                      console.log("[STORE] Archive data not loaded, save will not be executed.");
                  }
              },
              saveToDoItems: (context) => {
                  let items = context.getters.toDoItems.map(entry => entry.toObject());

                  console.log("[STORE] saveToDoItems() action invoked.");
                  Lockr.set("to_do_items", JSON.stringify(items));
              },
              selectToDoItem: (context, item) => {
                  console.log("[STORE] selectToDoItem() action invoked.");
                  context.commit("setSelectedItem", item);
              },
              showError: (context, message) => {
                  console.log("[STORE] showError() action invoked.");
                  context.commit("pushError", message);
              },
              unarchiveItems: (context, itemIds) => {
                  console.log("[STORE] unarchiveItems() action invoked.");
                  if(!context.getters.isArchiveLoaded) {
                      context.commit("loadArchive");
                  }

                  let archive   = context.getters.archivedItems;
                  let recovered = archive.filter((entry) => itemIds.includes(entry.id));
                  
                  archive = archive.filter((entry) => !itemIds.includes(entry.id));
                  recovered.forEach((entry) => entry.archived = undefined);
                  recovered.forEach((entry) => {
                      entry.state = TO_DO_STATE_INCOMPLETE;
                      context.commit("storeToDoItem", entry);
                  });
                  context.commit("setArchive", archive);
                  context.dispatch("saveToDoItems");
                  context.dispatch("saveToDoArchive");
              },
              updateFilterSettings: (context, settings) => {
                  console.log("[STORE] updateFilter() action invoked.");
                  if(Object.keys(settings).includes("priorities")) {
                      context.commit("setFilterPriorities", settings.priorities);
                  }
                  if(Object.keys(settings).includes("states")) {
                      context.commit("setFilterStates", settings.states);
                  }
                  if(Object.keys(settings).includes("searchText")) {
                      context.commit("setFilterSearchText", settings.searchText);
                  }
                  if(Object.keys(settings).includes("tags")) {
                      context.commit("setFilterTags", settings.tags);
                  }
                  if(Object.keys(settings).includes("useRegEx")) {
                      context.commit("setFilterUseRegEx", settings.useRegEx);
                  }
                  filter = ToDoFilter.fromObject(context.getters.filterSettings);
                  console.log("FILTER AFTER UPDATE:\n", filter.toString());
              },
              updateSelectedToDoItem: (context, item) => {
                  console.log("[STORE] updateSelectedToDoItem() action invoked.");
                  if(context.getters.selectedItem) {
                      context.commit("updateSelectedItem", item);
                      context.commit("clearSelectedItem");
                  } else {
                      console.error("Attempt made to update an item but no to do item was selected.");
                      context.dispatch("showError", "Unable to update item as no item is currently selected.");
                  }
              },
              unselectToDoItem: (context) => {
                  console.log("[STORE] unselectToDoItem() action invoked.");
                  context.commit("clearSelectedItem");
              },
              viewArchiveViewer: (context) => {
                  console.log("[STORE] viewArchive() action invoked.");
                  context.commit("setArchiveViewerActive", true);
              }},
  getters:   {archivedItems: function(state) {
                  return(state.todos.archive)
              },
              archiveViewerActive: (state) => {
                  return(state.archive.visible);
              },
              errorMessage: (state) => {
                  return(state.error.queue.length > 0 ? state.error.queue[0] : undefined);
              },
              errorQueueSize: (state) => {
                  return(state.error.queue.length);
              },
              filterSettings: (state) => {
                  return(state.filter);
              },
              isArchiveLoaded: (state) => {
                  return(state.todos.archive ? true : false);
              },
              nonIncompleteItems: (state) => {
                  return(state.todos.list.filter((entry) => entry.state !== TO_DO_STATE_INCOMPLETE));
              },
              selectedItem: (state) => {
                  return(state.todos.selected);
              },
              tags: (state) => {
                  let list = [];

                  state.todos.list.forEach((entry) => {
                      entry.tags.forEach((tag) => {
                          if(!list.includes(tag)) {
                              list.push(tag);
                          }
                      });
                  });
                  list.sort();

                  return(list);
              },
              toDoItems: (state) => {
                  return([].concat(state.todos.list));
              }},
  state:     {archive: {visible: false},
              error:   {queue:   []},
              filter:  {priorities: [].concat(ALL_PRIORITIES),
                        searchText: "",
                        states:     [].concat(ALL_TO_DO_STATES),
                        tags:       [],
                        useRegEx:   false},
              todos:   {archive:  undefined,
                        list:     [],
                        selected: undefined}},
  mutations: {archiveItems: (state, items) => {
                  console.log("[STORE] Archiving", items ? items.length : 0, "to do items.");
                  if(items && items.length > 0) {
                      let archiveIds = items.map((entry) => entry.id);
                      let remaining  = state.todos.list.filter((entry) => !archiveIds.includes(entry.id));
                      let archive    = state.todos.archive;
                      
                      items.forEach((item) => item.archive());
                      archive = archive.concat(items.map((entry) => entry.toObject()));
                      if(archive.length > 1000) {
                          console.log("Archive would grow to", archive.length, "items, limiting it to 1000 items.");
                          archive = archive.slice(0, 1000);
                          items   = items.slice(0, 1000);
                      }
                      Lockr.set("to_do_archive", JSON.stringify(archive));
                      state.todos.archive = items;
                      state.todos.list    = remaining;
                  }
              },
              clearSelectedItem: (state) => {
                  console.log("[STORE] Clearing the selected to do item.");
                  state.todos.selected = undefined;
              },
              loadArchive: (state) => {
                let content = Lockr.get("to_do_archive", "[]");
                let items   = [];

                console.log("READ:", content);
                try {
                    let data = content;
                    
                    if(data instanceof String) {
                        JSON.parse(content);
                    }
                    data.forEach((object) => items.push(ToDo.fromObject(object)))
                } catch(error) {
                    console.error("An error occurred parsing the content of the application archive. Details:", error);
                }
                state.todos.archive = items;
              },
              popError: (state) => {
                  console.log("[STORE] popError() mutation called.");
                  if(state.error.queue.length > 1) {
                      console.log("[STORE] Popping error from the error message queue.");
                      state.error.queue = state.error.queue.slice(1);
                  } else {
                      state.error.queue = [];
                  }
              },
              pushError: (state, message) => {
                  console.log("[STORE] pushError() mutation called.");
                  console.error(message);
                  state.error.queue.push(message);
              },
              setArchive: (state, items) => {
                  let data = items.map((entry) => entry.toObject());

                  console.log("[STORE] Assigning the application archive from a specific set of items.");
                  state.todos.archive = items;
              },
              setArchiveViewerActive: (state, setting) => {
                  console.log("[STORE] Setting the archive view active flag to", (setting === true) + ".");
                  state.archive.visible = (setting === true);
              },
              setFilterPriorities: (state, settings) => {
                  console.log("[STORE] Assigning filter priorities of", "[" + settings.join(", ") + "].");
                  state.filter.priorities = settings;
              },
              setFilterStates: (state, settings) => {
                console.log("[STORE] Assigning filter states of", "[" + settings.join(", ") + "].");
                state.filter.states = settings;
              },
              setFilterSearchText: (state, text) => {
                console.log("[STORE] Assigning filter search text of", "'" + text + "'.");
                state.filter.searchText = text;
              },
              setFilterTags: (state, settings) => {
                console.log("[STORE] Assigning filter tags of", "[" + settings.join(", ") + "].");
                state.filter.tags = settings;
              },
              setFilterUseRegEx: (state, setting) => {
                console.log("[STORE] Assigning filter use regular expression to", (setting === true) + "'.");
                state.filter.useRegEx = (setting === true);
              },
              setSelectedItem: (state, item) => {
                  console.log("[STORE] Setting the selected to do item.");
                  state.todos.selected = item;
              },
              setSelectedItemState: (state, setting) => {
                  console.log("[STORE] Setting the state for the currently selected to do item.");
                  state.todos.selected.state = setting;
              },
              setToDoItemFilter: (state, filter) => {
                  console.log("[STORE]: Updating the to do item filter.");
                  state.todos.filter = filter;
              },
              setToDoItems: (state, items) => {
                  console.log("[STORE] Setting the list of to do items.");
                  state.todos.list = items;
              },
              storeToDoItem: (state, item) => {
                  console.log("[STORE] Adding a new to do item.");
                  state.todos.list.push(item);
              },
              updateSelectedItem: (state, item) => {
                  console.log("[STORE] Updating the details for the selected to do item.");
                  state.todos.selected.description = item.description;
                  state.todos.selected.name        = item.name;
                  state.todos.selected.priority    = item.priority;
                  state.todos.selected.tags        = item.tags;
              }}
});