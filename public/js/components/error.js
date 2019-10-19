Vue.component('error-banner', {
    computed:   {message: function() {
                     return(this.$store.getters.errorMessage);
                 },
                 isActive: function() {
                     return(this.$store.getters.errorMessage ? true : false);
                 },
                 total: function() {
                     return(this.$store.getters.errorQueueSize);
                 }},
    data:       function() {
                   return({});
                },
    methods:    {},
    props:      {},
    template:   '<section class="error-banner">' +
                '  <b-notification type="is-danger" :active.sync="isActive" :closable="false">' +
                '    <p class="has-text-weight-bold is-size-5">{{message}}</p>' +
                '    <p class="is-pulled-right is-size-7" v-if="total > 1">+{{total - 1}} other {{total == 2 ? \'error\' : \'errors\'}}.</p>' +
                '  </b-notification>' +
                '</section>'
 });
 