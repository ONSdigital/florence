/**
 * Add tags to articles
 * @param templateData
 */

 async function tags(templateData) {
    var html = templates.tags()
    $('#tags').replaceWith(html);

    // Set up select2 plugin for Topics
    // Set multiple to true to get associated 'tag' style but set maximumSelectionLength to 1 for now with potential to remove in the future.
    $('#selectPrimaryTopic').select2({
        placeholder: 'Select Topics',
        multiple: true,
        maximumSelectionLength: 1,
    });

    // Set up select2 plugin for Subtopics 
    $('#selectSubtopic').select2({
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

    await getAllTopics();

    // If subtopics were selected prior select them by default.
    if(templateData.description.canonicalTopic){
        $('#selectPrimaryTopic').val(templateData.description.canonicalTopic);
        $('#selectPrimaryTopic').trigger('change');
    }

    // If subtopics were selected prior select them by default.
    if(templateData.description.secondaryTopics){
        $('#selectSubtopic').val(templateData.description.secondaryTopics);
        $('#selectSubtopic').trigger('change');
    }
}

function formatResponse(response){

    let result = []

    response.items.forEach((item, i) => {
        result.push ({
            "id" : item.current.id, 
            "title" : item.current.title
        })
    })

    return result
}

async function getTopics(){
    const result = await $.ajax({
        url: "/topics",
        dataType: 'json',
        crossDomain: true,
    });

    return result
}

async function getSubTopics(topicID){ 
    const result = await $.ajax({
        url: "/topics/" + topicID + "/subtopics",
        dataType: 'json',
        crossDomain: true,
    });

    return result
}

async function getAllTopics(){ 

    // Get primary topics and format into something more readable.
    let topicsAPIResult = await getTopics();
    const topics = formatResponse(topicsAPIResult);

    // Get subtopics and format into something more readable.
    let subtopics = []
    for (const i in topics) {
        const subtopicsAPIResult = await getSubTopics(topics[i].id)
        subtopics.push(formatResponse(subtopicsAPIResult))
        subtopics[i].forEach(function(subtopic){
            subtopic.title = topics[i].title + " - " + subtopic.title
        })
    }
    subtopics = subtopics.flat()

    // Create new option for primary topic select based on current primary topic.
    // Add to option group.
    topics.forEach(function (topic) {
        var newOption = new Option(topic.title, topic.id)
        $('#selectPrimaryTopicPrimaryTopics').append(newOption)
    })

    // Create new option select for primary topic based on current subtopic.
    // Add to option group.
    subtopics.forEach(function (subtopic) {
        var newOption = new Option(subtopic.title, subtopic.id)
        $('#selectPrimaryTopicSubtopics').append(newOption)
    })

    // Create new option for subtopics select based on current primary topic.
    // Add to option group.
    topics.forEach(function (topic) {
        newOption = new Option(topic.title , topic.id, false, false);
        $('#selectSubtopicsPrimaryTopics').append(newOption)
    })
    
    // Create new option for subtopics select based on current subtopic.
    // Add to option group.
    subtopics.forEach(function (subtopic) {
        newOption = new Option(subtopic.title , subtopic.id, false, false);
        $('#selectSubtopicsSubtopics').append(newOption)
    })
}

function validateAndSaveTags(data) {
    if ($("#selectPrimaryTopic").length === 0 && $("#selectSubtopic").length === 0) {
        return 
    }

    if ($("#selectPrimaryTopic").val() && $("#selectSubtopic").val()) {
        data.description.canonicalTopic = $("#selectPrimaryTopic").val()[0]
        data.description.secondaryTopics = $("#selectSubtopic").val()
    }
    else if ($("#selectPrimaryTopic").val() && !$("#selectSubtopic").val()) {
        sweetAlert("Cannot save this page", "A value is required for 'Subtopic' if a 'Topic' has been selected");
        return
    } 
}
