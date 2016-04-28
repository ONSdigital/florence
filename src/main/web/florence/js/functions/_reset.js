function resetPage() {
    // Prevent default behaviour of all form submits throught Florence
    $(document).on('submit', 'form', function(e) {
        e.preventDefault();
    });

    // Fix for modal form submits not being detected
    $(document).on('click', 'button', function() {
        var $closestForm = $(this).closest('form');
        $closestForm.submit(function(e) {
            e.preventDefault();
        });
    });

    // Stop anchors doing default behaviour
    // $(document).on('click', 'a', function(e) {
    //     e.preventDefault();
    //     console.log('Anchor click stopped on: ', e);
    // });

    // $(document).on('click', 'form', function(e) {
    //     e.preventDefault();
    //     console.log('Form clicked');
    // });

    // $(document).on('click', 'button', function (e) {
    //     e.preventDefault();
    //     console.log(e);
    // });

    // $(document).on('submit', '#cancel-form', function(e) {
    //     e.preventDefault();
    //     console.log(e);
    // });
}