
function makeCollectionView(collectionId,collections){
  $('#fl-collection-view-button-'+collectionId).click(function(){
      var view_collection =
        '<div id="view-collection"'+
        '<h1 class="collection-name"></h1>' +
        '<h2>In progress</h2>'+

        '<section class="fl-collection" id="in-progress-uris"></section>'+
        '<h2>complete</h2>' +
        '<section class="fl-collection" id="complete-uris"></section>'+
        '<h2>reviewed</h2>' +
        '<section class="fl-collection" id="reviewed-uris"></section>'+
        '<button id="approve-collection-button">Approve Collection </button>'+
        '</div>'

      $('.fl-view').html(view_collection);

      $.ajax({
        url:'/zebedee/collection/'+ collectionId,
        headers:{ "X-Florence-Token":accessToken() }
      }).done(
          function(collection){
            var tableRowSelector
            var inProgressUris,completeUris;

            inProgressUris = collection.inProgressUris;
            completeUris   = collection.completeUris;
            reviewedUris   = collection.reviewedUris;
            console.log(collection)

            tableRowSelector = "#in-progress-uris"
            $.each(inProgressUris,populateTable);

            tableRowSelector = "#complete-uris"
            $.each(completeUris,populateTable);

            tableRowSelector = "#reviewed-uris";
            $.each(reviewedUris,populateTable)

            if(collection.inProgressUris != 0 || collection.completeUris != 0){
              // You can't approve collections unless there is nothing left to be reviewed
              $('#approve-collection-button').hide()
            }
            else{
              $('#approve-collection-button').click(function(){
                console.log(collection.inProgressUris)
                console.log(collection.completeUris)
                approve(collection.id)
              })
            }


            function populateTable(i,uri){
              $('#in-progress-uris').append(
                '<tr>'+
                  '<td>'+uri+'/<td>'+
                  '<td><select id="fl-select-destination-'+i+'"></select></td>'+
                  '<td><button id="fl-move-'+i+'">move</button></td>'+
                  '<td><button id="fl-edit-'+i+'">edit this page </button></td>'+
                '</tr>'
                )

              // populate the list with the ids of all the collections

              $('#fl-select-destination-'+i).append(
                collections.map(function(item){
                  ////==console.log(item)
                  return '<option>' + item.id + '</option>'
                }).join()
                )

              $('#fl-move-'+i).click(function(){
                var destination = $('#fl-select-destination-'+i).val()
                var source = collection.id
                console.log(destination)
                console.log(collection)
                console.log(uri)
                transfer(collection.id,destination,uri)
              })

              $('#fl-edit-'+i).click(function(){
                $('.fl-view').html("")
                console.log(uri)
                  viewController('workspace',uri)
              })
            }
      })
  })
}

