
function makeCollectionView(collectionId,collections){
  $('#fl-collection-view-button-'+collectionId).click(function(){
      var view_collection =
        '<h1 class="collection-name"></h1>' +
        '<h2>In progress</h2>'+
        '<section class="fl-collection" id="in-progress-uris"></section>'+
        '<h2>Approved</h2>' +
        '<section class="fl-collection" id="approved-uris"></section>'

      $('.fl-view').html(view_collection);

      $.ajax({
        url:'/zebedee/collection/'+ collectionId,
        headers:{ "X-Florence-Token":accessToken() }
      }).done(
          function(collection){
            var inProgressUris,approvedUris;

            inProgressUris = collection.inProgressUris;
            approvedUris   = collection.approvedUris;

            $.each(inProgressUris,populateTable(i,uri,'#in-progress-uris'));
            $.each(approvedUris,populateTable(i,uri,'#approved-uris'));

      })
  })
}

function populateTable(i,uri,selector){
          $(selector).append(
            '<tr>'+
              '<td>'+uri+'/<td>'+
              '<td><select id="fl-select-destination-'+i+'"></select></td>'+
              '<td><button id="fl-move-'+i+'">move</button></td>'+
            '</tr>'
            )

          // populate the list with the ids of all the collections

          $('#fl-select-destination-'+i).append(
            collections.map(function(item){
              console.log(item)
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
        }
