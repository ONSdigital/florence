function viewCollections() {

  var select_collections = '<section class="fl-panel fl-panel--collections fl-panel--collections__not-selected">' +
    '<h1>Select a collection</h1>' +
    '<div class="fl-collections-holder"></div>' +
    '<button class="fl-button fl-button--big fl-button--center fl-create-collection-button">Create a collection</button>' +
    '<button id="test"> test </button>'+
    '</section>';

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    headers:{ "X-Florence-Token":accessToken() },
    success: function (data) {
      populateCollectionTable(data);
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

  function populateCollectionTable(data) {
      var page = $('.fl-collections-holder')
      var collection_table =
        '<table class="fl-collections-table">' +
          '<tbody>' +
            '<tr>' +
              '<th>Collection name</th>' +
              '<th>Publish time and date</th>' +
              '<th>Manage collection</th>'+
            '</tr>';

      $(page).html(collection_table);

      $.each(data, function(i, collection) {

        var date = new Date(collection.publishDate);
        $('tbody',page).append(
            '<tr class="fl-collections-table-row" data-id="' + collection.id + '">' +
              '<td class= "collection-name">' + collection.name + '</td>' +
              '<td>' + $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + date.getMinutes() + '</td>' +
              '<td><button class="view-collection-button" id="fl-collection-view-button-' + collection.id +'"> View Collection</button></td>'+
            '</tr>'
          )

        makeCollectionView(collection.id,data);

      });

      page.append(
          '</tbody>' +
        '</table>')


      $('.fl-collections-table-row').click(function() {

        console.log('Collection row clicked for id: ' + $(this).attr('data-id'));
        var collectionId = $(this).attr('data-id');

        if(collectionId) {

          $('.fl-panel--collections').removeClass('fl-panel--collections__not-selected');
          $('.fl-panel--collection-details').show();
          $('.fl-create-collection-button').hide();

          $(this).addClass('fl-panel--collections__selected');

          viewCollectionDetails(collectionId);
        }
      });
    }


  var selected_collection =
    '<section class="fl-panel fl-panel--collection-details">' +
    '<div class="fl-panel--collection-details-container"></div>' +
    '<button class="fl-button fl-work-on-collection-button">Work on this collection</button>' +
    '<button class="fl-button fl-button--secondary fl-finish-collection-button">Finish this collection/button>' +
    '<button class="fl-button fl-button--cancel">Cancel</button>' +
    '</section>';

	var create_collection =
	'<section class="fl-panel fl-panel--create-collection">' +
	'<h1>Create a collection</h1>' +
	'<input type="text" class="fl-collection-name-input">' +
	'<select class="fl-collection-team-access">' +
		'<option value="1">Labour Market Statistics Team</option>' +
	'</select>' +
	'<select class="fl-collection-publish-day">' +
		'<option value="1">1</option>' +
		'<option value="2">2</option>' +
		'<option value="3">3</option>' +
		'<option value="4">4</option>' +
		'<option value="5">5</option>' +
		'<option value="6">6</option>' +
		'<option value="7">7</option>' +
		'<option value="8">8</option>' +
		'<option value="9">9</option>' +
		'<option value="10">10</option>' +
		'<option value="11">11</option>' +
		'<option value="12">12</option>' +
		'<option value="13">13</option>' +
		'<option value="14">14</option>' +
		'<option value="15">15</option>' +
		'<option value="16">16</option>' +
		'<option value="17">17</option>' +
		'<option value="18">18</option>' +
		'<option value="19">19</option>' +
		'<option value="20">20</option>' +
		'<option value="21">21</option>' +
		'<option value="22">22</option>' +
		'<option value="23">23</option>' +
		'<option value="24">24</option>' +
		'<option value="25">25</option>' +
		'<option value="26">26</option>' +
		'<option value="27">27</option>' +
		'<option value="28">28</option>' +
		'<option value="29">29</option>' +
		'<option value="30">30</option>' +
		'<option value="31">31</option>' +
	'</select>' +
	'<select class="fl-collection-publish-month">' +
		'<option value="1">January</option>' +
		'<option value="2">February</option>' +
		'<option value="3">March</option>' +
		'<option value="4">April</option>' +
		'<option value="5">May</option>' +
		'<option value="6">June</option>' +
		'<option value="7">July</option>' +
		'<option value="8">August</option>' +
		'<option value="9">September</option>' +
		'<option value="10">October</option>' +
		'<option value="11">November</option>' +
		'<option value="12">December</option>' +
	'</select>' +
	'<select class="fl-collection-publish-year">' +
		'<option value="1" selected>2015</option>' +
	'</select>' +
	'<select class="fl-collection-publish-time">' +
		'<option value="0930" selected>09:30</option>' +
	'</select>' +
	'<button class="fl-button fl-create-collection--submit-button">Create collection</button>' +
	'<button class="fl-button fl-button--cancel">Cancel</button>' +
	'</section>';


	//build view
	$('.fl-view').html(select_collections + selected_collection);

	//click handlers

	$('.fl-create-collection-button').click(function() {
		$('.fl-view').html(create_collection);

		$('.fl-create-collection--submit-button').click(createCollection);
		$('.fl-button--cancel').click(function() {
			//perhaps need to rethink this if we do decide to animate panel transitions within this view
			viewController('collections');
		});
	});
}

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
      }).done(function(collection){
                var inProgressUris,approvedUris

                inProgressUris = collection.inProgressUris;
                approvedUris   = collection.approvedUris;
                $.each(inProgressUris,function(i,uri){
                  $('#in-progress-uris').append(
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
                })


                console.log('foo')
                console.log(collection)
      })

    })
}

