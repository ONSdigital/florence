var isUpdatingModal = {
    modal: function() {
        return (
            "<div class='florence-disable'>" + 
            "<p>Saving update</p>" +
            "<div class='loader loader--large'></div>" +
            "</div>"
        )
    },
    add: function() {
        console.log('Disable Florence');
        if ($('.florence-disable').length) {
            console.warn("Attempt to add Florence's disabled modal but it already exists");
            return;
        }
        $('#main').append(this.modal);
    },
    remove: function() {
        console.log('Enable Florence');
        var $disabledModal = $('.florence-disable')
        if ($disabledModal.length === 0) {
            console.warn("Attempt to remove Florence's disabled modal before it's in the DOM");
            return;
        }
        $disabledModal.remove();
    }
}
