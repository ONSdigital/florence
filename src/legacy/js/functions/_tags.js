/**
 * Add tags to articles
 * @param templateData
 */

 function tags(templateData) {
    var html = templates.tags()
    $('#tags').replaceWith(html);

    // Set up select2 plugin for Topics
    // Set multiple to true to get associated 'tag' style but set maximumSelectionLength to 1 for now with potential to remove in the future.
    $('#selectTopic').select2({
        placeholder: 'Select Topics',
        multiple: true,
        maximumSelectionLength: 1,
    });

    // Set up select2 plugin for Subtopics 
    $('#selectSubTopic').select2({
        placeholder: 'Select Subtopics',
        multiple: true,
    });

    // Prevents the dropdown appearing when you clear a tag as it reads that as also focusing the select. 
    $("select").on('select2:unselecting', function (e) { 
        $("select").on('select2:opening', function (e) {
          e.preventDefault();
          $("select").off('select2:opening');
        });
    });

    // Prepopulate widget based on existing entries on disk.
    getTopics(templateData.description.primaryTopic)
    getSubTopics(templateData.description.primaryTopic, templateData.description.secondaryTopics)
}

function getTopics(primaryTopic){
    $.ajax({
        url: "/topics/topics",
        dataType: 'json',
        crossDomain: true,
        success: function (result) {
            result.items.forEach(function(topic) {
                var newOption
                if(topic.id == primaryTopic){
                    newOption = new Option(topic.current.title, topic.id, false, true);
                } else {
                    newOption = new Option(topic.current.title, topic.id, false, false);
                }
                $('#selectTopic').append(newOption)
            })
        }
    });
}

function getSubTopics(primaryTopic = null, secondaryTopics = null){ 

    $('#selectSubTopic').empty();
    var id

    if(!primaryTopic){
        id = $("#selectTopic").val();
    } else {
        id = primaryTopic
    }

    $.ajax({
        url: "/topics/topics/" + id + "/subtopics",
        dataType: 'json',
        crossDomain: true,
        success: function (result) {
            result.items.forEach(function(subtopic) {
                newOption = new Option(subtopic.current.title , subtopic.id, false, false);
                $('#selectSubTopic').append(newOption)
            })
            if(secondaryTopics){
                $('#selectSubTopic').val(secondaryTopics);
            }
        }
    });
}